import { prisma } from "./db";
import { structureProblemWithAI } from "./ai/structuring";
import { detectDuplicates } from "./ai/deduplication";
import { calculatePriority } from "./ai/priority";
import { classifyGrievance } from "@/services/gemini.service";

export interface AttachmentInput {
  type: string; // IMAGE, VIDEO, DOCUMENT, AUDIO
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  hasGpsData?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  locationName?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  gpsSource?: string | null;
  gpsAccuracy?: number | null;
  capturedAt?: string | Date | null;
}

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
  attachments?: AttachmentInput[];
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

  // 2. Create initial problem record with validated/explicit values
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
      aiStatus: "PENDING",
    },
  });

  // Attach evidence if provided
  if (input.attachments && input.attachments.length > 0) {
    await prisma.evidence.createMany({
      data: input.attachments.map((att) => ({
        problemId: problem.id,
        type: att.type || "IMAGE",
        fileUrl: att.fileUrl,
        fileName: att.fileName || "attachment",
        fileSize: att.fileSize || null,
        mimeType: att.mimeType || null,
        hasGpsData: att.hasGpsData ?? false,
        latitude: att.latitude ?? null,
        longitude: att.longitude ?? null,
        altitude: att.altitude ?? null,
        locationName: att.locationName ?? null,
        city: att.city ?? null,
        district: att.district ?? null,
        state: att.state ?? null,
        country: att.country ?? null,
        gpsSource: att.gpsSource ?? (att.hasGpsData ? "EXIF" : null),
        gpsAccuracy: att.gpsAccuracy ?? null,
        capturedAt: att.capturedAt ? new Date(att.capturedAt) : null,
      })),
    });
  } else if (input.evidenceUrl) {
    await prisma.evidence.create({
      data: {
        problemId: problem.id,
        type: input.evidenceType || "IMAGE",
        fileUrl: input.evidenceUrl,
        fileName: `evidence_${Date.now()}.jpg`,
      },
    });
  }

  // 3. Gemini AI Grievance Classification
  let geminiClassification;
  try {
    const locationHint =
      input.address ||
      (input.district ? `${input.district}, ${input.state || ""}` : null);
    geminiClassification = await classifyGrievance(
      input.title,
      input.description,
      locationHint
    );
  } catch (err) {
    console.error("[Pipeline] Gemini classification failed:", err);
  }

  const effectiveCategory =
    geminiClassification?.category || "Roads & Infrastructure";

  // 4. Duplicate Detection
  const duplicateResult = await detectDuplicates(
    problem.id,
    input.title,
    input.description,
    effectiveCategory,
    input.latitude,
    input.longitude
  );

  // Map AI Priority to numerical scores for downstream scoring
  let numericPriority = 50;
  let severityScore = 0.5;
  let urgencyScore = 0.5;

  if (geminiClassification) {
    if (geminiClassification.priority === "CRITICAL") {
      numericPriority = 92;
      severityScore = 0.95;
      urgencyScore = 0.95;
    } else if (geminiClassification.priority === "HIGH") {
      numericPriority = 78;
      severityScore = 0.8;
      urgencyScore = 0.75;
    } else if (geminiClassification.priority === "MEDIUM") {
      numericPriority = 55;
      severityScore = 0.55;
      urgencyScore = 0.5;
    } else {
      numericPriority = 35;
      severityScore = 0.35;
      urgencyScore = 0.3;
    }
  }

  // 5. Multi-factor Priority Assessment
  const priorityResult = await calculatePriority(
    problem.id,
    severityScore,
    urgencyScore,
    effectiveCategory,
    input.description
  );

  // Store AIAnalysis record
  if (geminiClassification) {
    await prisma.aIAnalysis.create({
      data: {
        problemId: problem.id,
        provider: "GEMINI",
        summary: geminiClassification.summary,
        extractedCategory: geminiClassification.category,
        severityScore,
        urgencyScore,
        recommendedDepartment: geminiClassification.department,
        requiredExpertise: geminiClassification.subcategory,
        confidence: geminiClassification.confidence,
        rawOutput: geminiClassification.rawOutput,
      },
    });
  }

  // 6. Finalize problem record with Gemini AI classification and verification status
  const updatedProblem = await prisma.problem.update({
    where: { id: problem.id },
    data: {
      category: effectiveCategory,
      problemType: geminiClassification?.subcategory || "Civic Grievance",
      severity: severityScore,
      urgency: urgencyScore,
      priorityScore: priorityResult.totalScore || numericPriority,
      departmentName:
        geminiClassification?.department || "Municipal Corporation",
      status: "PENDING_VERIFICATION",

      // Gemini AI classification fields
      aiCategory: geminiClassification?.category,
      aiSubcategory: geminiClassification?.subcategory,
      aiDepartment: geminiClassification?.department,
      aiPriority: geminiClassification?.priority,
      aiSummary: geminiClassification?.summary,
      aiUrgencyReason: geminiClassification?.urgencyReason,
      aiLocation: geminiClassification?.location,
      aiConfidence: geminiClassification?.confidence,
      aiStatus: geminiClassification ? "COMPLETED" : "FAILED",
      aiReviewStatus: geminiClassification?.reviewStatus || "NEEDS_REVIEW",
      aiProcessedAt: new Date(),
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
