import { prisma } from "../db";

export interface PriorityCalculationResult {
  totalScore: number; // 0 to 100
  populationImpact: number; // 0 to 1
  severityFactor: number; // 0 to 1
  urgencyFactor: number; // 0 to 1
  recurrenceFactor: number; // 0 to 1
  safetyFactor: number; // 0 to 1
  explanation: string;
}

export async function calculatePriority(
  problemId: string,
  severity: number,
  urgency: number,
  category: string,
  description: string
): Promise<PriorityCalculationResult> {
  const text = description.toLowerCase();

  // Safety Hazard calculation
  let safetyFactor = 0.4;
  if (
    text.includes("collapse") ||
    text.includes("death") ||
    text.includes("danger") ||
    text.includes("poison") ||
    text.includes("arsenic") ||
    text.includes("accident") ||
    text.includes("children")
  ) {
    safetyFactor = 0.95;
  } else if (text.includes("crack") || text.includes("leak") || text.includes("electric")) {
    safetyFactor = 0.75;
  }

  // Population impact estimation
  let populationImpact = 0.5;
  if (category === "Water & Sanitation" || category === "Public Health") {
    populationImpact = 0.85; // Entire wards/communities affected
  } else if (category === "Infrastructure") {
    populationImpact = text.includes("highway") || text.includes("main bridge") ? 0.9 : 0.6;
  }

  // Recurrence factor: Count how many duplicates or nearby reports have surfaced
  const duplicateCount = await prisma.duplicateMatch.count({
    where: {
      OR: [{ sourceProblemId: problemId }, { matchedProblemId: problemId }],
    },
  });

  const recurrenceFactor = Math.min(1.0, 0.3 + duplicateCount * 0.25);

  // Multi-factor weighted formula (Scale 0 to 100)
  // Weights: 25% Population, 25% Severity, 20% Urgency, 15% Recurrence, 15% Safety
  const weightedSum =
    0.25 * populationImpact +
    0.25 * severity +
    0.20 * urgency +
    0.15 * recurrenceFactor +
    0.15 * safetyFactor;

  const totalScore = Math.min(99.0, Math.max(10.0, Number((weightedSum * 100).toFixed(1))));

  // Generate clear audit explanation
  const reasons: string[] = [];
  if (safetyFactor >= 0.8) reasons.push("High public safety hazard detected");
  if (populationImpact >= 0.8) reasons.push("Affects substantial community population");
  if (recurrenceFactor >= 0.6) reasons.push(`Corroborated by ${duplicateCount} related citizen reports`);
  if (urgency >= 0.75) reasons.push("Urgent departmental intervention needed");
  if (reasons.length === 0) reasons.push("Standard routine societal grievance");

  const explanation = `Score ${totalScore}/100. Key drivers: ${reasons.join("; ")}.`;

  // Persist assessment in DB
  await prisma.priorityAssessment.create({
    data: {
      problemId,
      totalScore,
      populationImpact,
      severityFactor: severity,
      urgencyFactor: urgency,
      recurrenceFactor,
      safetyFactor,
      explanation,
      humanOverride: false,
    },
  });

  return {
    totalScore,
    populationImpact,
    severityFactor: severity,
    urgencyFactor: urgency,
    recurrenceFactor,
    safetyFactor,
    explanation,
  };
}
