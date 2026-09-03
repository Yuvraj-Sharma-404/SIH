import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const primaryId = params.id;
    const body = await req.json();
    const { duplicateProblemId, officerName } = body;

    if (!duplicateProblemId) {
      return NextResponse.json(
        { success: false, error: "duplicateProblemId is required" },
        { status: 400 }
      );
    }

    // 1. Move evidence from duplicate problem to primary problem
    await prisma.evidence.updateMany({
      where: { problemId: duplicateProblemId },
      data: { problemId: primaryId },
    });

    // 2. Mark duplicate problem as merged
    await prisma.problem.update({
      where: { id: duplicateProblemId },
      data: {
        status: "CLOSED",
        description: `[MERGED INTO ${primaryId}]`,
      },
    });

    // 3. Update duplicate match status
    await prisma.duplicateMatch.updateMany({
      where: {
        OR: [
          { sourceProblemId: duplicateProblemId, matchedProblemId: primaryId },
          { sourceProblemId: primaryId, matchedProblemId: duplicateProblemId },
        ],
      },
      data: { status: "MERGED" },
    });

    // 4. Recalculate priority on primary problem to factor in the higher recurrence count
    const primaryProblem = await prisma.problem.findUnique({
      where: { id: primaryId },
      include: { evidence: true },
    });

    if (primaryProblem) {
      const newScore = Math.min(99.0, primaryProblem.priorityScore + 4.5);
      await prisma.problem.update({
        where: { id: primaryId },
        data: { priorityScore: newScore },
      });
    }

    // 5. Audit log
    await prisma.auditLog.create({
      data: {
        entityType: "PROBLEM",
        entityId: primaryId,
        action: "DUPLICATES_MERGED",
        performedBy: officerName || "Government Official",
        details: `Merged duplicate report ${duplicateProblemId} into primary ${primaryId}. Consolidated evidence count: ${primaryProblem?.evidence.length || 0}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully merged duplicate into ${primaryId}`,
    });
  } catch (error) {
    console.error("Failed to merge duplicate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to merge duplicate problem" },
      { status: 500 }
    );
  }
}
