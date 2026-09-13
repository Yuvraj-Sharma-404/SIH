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

  // Safety Hazard calculation & signal tracking
  const highSafetyTerms = ["collapse", "death", "danger", "poison", "arsenic", "accident", "children"];
  const modSafetyTerms = ["crack", "leak", "electric"];
  
  const matchedHighSafety = highSafetyTerms.filter((term) => text.includes(term));
  const matchedModSafety = modSafetyTerms.filter((term) => text.includes(term));
  
  let safetyFactor = 0.4;
  let safetySignal = "Baseline safety risk (0.40)";
  if (matchedHighSafety.length > 0) {
    safetyFactor = 0.95;
    safetySignal = `Critical public safety hazard (0.95) [Matched terms: ${matchedHighSafety.join(", ")}]`;
  } else if (matchedModSafety.length > 0) {
    safetyFactor = 0.75;
    safetySignal = `Moderate safety risk (0.75) [Matched terms: ${matchedModSafety.join(", ")}]`;
  }

  // Population impact estimation & signal tracking
  let populationImpact = 0.5;
  let popSignal = `Standard local scope (0.50) [Category: ${category}]`;
  const popTerms = ["highway", "main bridge", "district", "city", "market", "school", "hospital"].filter((t) => text.includes(t));

  if (category === "Water & Sanitation" || category === "Public Health") {
    populationImpact = 0.85;
    popSignal = `Widespread community impact (0.85) [Category: ${category}${popTerms.length ? `, Terms: ${popTerms.join(", ")}` : ""}]`;
  } else if (category === "Infrastructure") {
    if (popTerms.length > 0) {
      populationImpact = 0.9;
      popSignal = `High transit/infrastructure impact (0.90) [Matched terms: ${popTerms.join(", ")}]`;
    } else {
      populationImpact = 0.6;
      popSignal = `Local infrastructure impact (0.60)`;
    }
  }

  // Recurrence factor: Count how many duplicates or nearby reports have surfaced
  const duplicateCount = await prisma.duplicateMatch.count({
    where: {
      OR: [{ sourceProblemId: problemId }, { matchedProblemId: problemId }],
    },
  });

  const recurrenceFactor = Math.min(1.0, 0.3 + duplicateCount * 0.25);
  const recurrenceSignal = duplicateCount > 0
    ? `Corroborated by ${duplicateCount} related duplicate reports (Factor: ${recurrenceFactor.toFixed(2)})`
    : `First reported instance (Factor: ${recurrenceFactor.toFixed(2)})`;

  // Multi-factor weighted formula (Scale 0 to 100)
  // Weights: 25% Population, 25% Severity, 20% Urgency, 15% Recurrence, 15% Safety
  const weightedSum =
    0.25 * populationImpact +
    0.25 * severity +
    0.20 * urgency +
    0.15 * recurrenceFactor +
    0.15 * safetyFactor;

  const totalScore = Math.min(99.0, Math.max(10.0, Number((weightedSum * 100).toFixed(1))));

  const explanation = `Score ${totalScore}/100. Signals — Safety: ${safetySignal}; Impact: ${popSignal}; Recurrence: ${recurrenceSignal}; Severity: ${(severity * 100).toFixed(0)}%; Urgency: ${(urgency * 100).toFixed(0)}%.`;

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
