import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processIngestionPipeline } from "@/lib/pipeline";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const district = searchParams.get("district");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (district) where.district = district;

    const problems = await prisma.problem.findMany({
      where,
      include: {
        evidence: true,
        aiAnalyses: true,
        priorityAssessments: true,
        duplicateMatches: {
          include: { matchedProblem: true },
        },
        challenges: true,
      },
      orderBy: { priorityScore: "desc" },
    });

    return NextResponse.json({ success: true, count: problems.length, data: problems });
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve problems" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      reporterName,
      reporterPhone,
      latitude,
      longitude,
      address,
      district,
      state,
      evidenceType,
      evidenceUrl,
      idempotencyKey,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const result = await processIngestionPipeline({
      title,
      description,
      reporterName,
      reporterPhone,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      address,
      district,
      state,
      evidenceType,
      evidenceUrl,
      idempotencyKey,
    });

    return NextResponse.json({
      success: true,
      message: "Problem ingested, AI structured, and prioritized successfully",
      data: result.problem,
      duplicatesFound: result.duplicateResult.isDuplicateFound,
      duplicateMatches: result.duplicateResult.matches,
      priorityAssessment: result.priorityResult,
    });
  } catch (error) {
    console.error("Failed to ingest problem:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process problem submission" },
      { status: 500 }
    );
  }
}
