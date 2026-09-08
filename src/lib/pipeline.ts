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
  district?: string | null;
  state?: string | null;
  evidenceType?: string; // IMAGE, AUDIO, VIDEO, DOCUMENT
  evidenceUrl?: string;
  idempotencyKey?: string | null;
}

export async function processIngestionPipeline(input: PipelineInput) {
  // 0. Submission Idempotency & Rapid Double-Submit Guard
  if (input.idempotencyKey) {
    const existingByIdempotency = await prisma.problem.findFirst({
      where: { publicProblemId: input.idempotencyKey },
      include: {
        evidence: true,
        aiAnalyses: true,
        priorityAssessments: true,
        duplicateMatches: { include: { matchedProblem: true } },
      },
    });

    if (existingByIdempotency) {
      return {
        problem: existingByIdempotency,
        duplicateResult: { isDuplicateFound: false, matches: [] },
        priorityResult: {
          totalScore: existingByIdempotency.priorityScore,
          populationImpact: 0.5,
          severityFactor: existingByIdempotency.severity,
          urgencyFactor: existingByIdempotency.urgency,
          recurrenceFactor: 0.3,
          safetyFactor: 0.4,
          explanation: "Idempotent duplicate submit prevented.",
        },
        isIdempotentResponse: true,
      };
    }
  }

  // Double-submit debounce guard: check for identical submission within last 15 seconds
  const recentDuplicateSubmission = await prisma.problem.findFirst({
    where: {
      title: input.title,
      description: input.description,
      createdAt: {
        gte: new Date(Date.now() - 15000),
      },
    },
    include: {
      evidence: true,
      aiAnalyses: true,
      priorityAssessments: true,
      duplicateMatches: { include: { matchedProblem: true } },
    },
  });

  if (recentDuplicateSubmission) {
    return {
      problem: recentDuplicateSubmission,
      duplicateResult: { isDuplicateFound: false, matches: [] },
      priorityResult: {
        totalScore: recentDuplicateSubmission.priorityScore,
        populationImpact: 0.5,
        severityFactor: recentDuplicateSubmission.severity,
        urgencyFactor: recentDuplicateSubmission.urgency,
        recurrenceFactor: 0.3,
        safetyFactor: 0.4,
        explanation: "Rapid double-submit prevented.",
      },
      isIdempotentResponse: true,
    };
  }

  // 1. Generate unique public ID e.g. "PS-2026-8492" (or use idempotencyKey if provided)
  const publicProblemId =
    input.idempotencyKey || `PS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // 2. Create initial problem record with validated/explicit values (no fake demo defaults)
  const problem = await prisma.problem.create({
    data: {
      publicProblemId,
      title: input.title,
      description: input.description,
      reporterName: input.reporterName?.trim() || "Anonymous Citizen",
      reporterPhone: input.reporterPhone?.trim() || "Unverified / Not Provided",
      latitude: input.latitude,
      longitude: input.longitude,
      address:
        input.address?.trim() ||
        (input.latitude != null && input.longitude != null
          ? `Lat: ${input.latitude.toFixed(4)}, Lng: ${input.longitude.toFixed(4)}`
          : "Location Unspecified"),
      district: input.district?.trim() || "Unspecified District",
      state: input.state?.trim() || "Unspecified State",
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
