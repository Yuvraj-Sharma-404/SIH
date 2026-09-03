import { prisma } from "./db";
import { structureProblemWithAI } from "./ai/structuring";
import { detectDuplicates } from "./ai/deduplication";
import { calculatePriority } from "./ai/priority";

export interface PipelineInput {
  title: string;
  description: string;
  reporterName?: string;
  reporterPhone?: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  evidenceType?: string; // IMAGE, AUDIO, VIDEO, DOCUMENT
  evidenceUrl?: string;
}

export async function processIngestionPipeline(input: PipelineInput) {
  // 1. Generate unique public ID e.g. "PS-2026-8492"
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const publicProblemId = `PS-2026-${randomSuffix}`;

  // 2. Create initial problem record
  const problem = await prisma.problem.create({
    data: {
      publicProblemId,
      title: input.title,
      description: input.description,
      reporterName: input.reporterName || "Anonymous Citizen",
      reporterPhone: input.reporterPhone || "9876543210",
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address || "Wardha District, Maharashtra",
      district: "Wardha",
      state: "Maharashtra",
      status: "SUBMITTED",
    },
  });

  // Attach evidence if provided
  if (input.evidenceUrl) {
    await prisma.evidence.create({
      data: {
        problemId: problem.id,
        type: input.evidenceType || "IMAGE",
        fileUrl: input.evidenceUrl,
        fileName: `evidence_${Date.now()}.jpg`,
      },
    });
  }

  // 3. AI Structuring (Categorization, Department, Severity, Required Expertise)
  const aiResult = await structureProblemWithAI(input.title, input.description);

  await prisma.aIAnalysis.create({
    data: {
      problemId: problem.id,
      summary: aiResult.summary,
      extractedCategory: aiResult.category,
      severityScore: aiResult.severity,
      urgencyScore: aiResult.urgency,
      recommendedDepartment: aiResult.recommendedDepartment,
      requiredExpertise: aiResult.requiredExpertise.join(", "),
      confidence: aiResult.confidence,
    },
  });

  // 4. Duplicate Detection
  const duplicateResult = await detectDuplicates(
    problem.id,
    input.title,
    input.description,
    aiResult.category,
    input.latitude,
    input.longitude
  );

  // 5. Multi-factor Priority Assessment
  const priorityResult = await calculatePriority(
    problem.id,
    aiResult.severity,
    aiResult.urgency,
    aiResult.category,
    input.description
  );

  // 6. Finalize problem state transition to PENDING_VERIFICATION
  const updatedProblem = await prisma.problem.update({
    where: { id: problem.id },
    data: {
      category: aiResult.category,
      problemType: aiResult.problemType,
      severity: aiResult.severity,
      urgency: aiResult.urgency,
      priorityScore: priorityResult.totalScore,
      departmentName: aiResult.recommendedDepartment,
      status: "PENDING_VERIFICATION",
    },
    include: {
      evidence: true,
      aiAnalyses: true,
      priorityAssessments: true,
      duplicateMatches: {
        include: { matchedProblem: true },
      },
    },
  });

  return {
    problem: updatedProblem,
    duplicateResult,
    priorityResult,
  };
}
