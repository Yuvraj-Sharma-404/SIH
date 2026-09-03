import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const milestoneId = params.id;
    const body = await req.json();
    const { status, proofEvidenceUrl, completedAt } = body;

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: status || "COMPLETED",
        proofEvidenceUrl,
        completedAt: completedAt ? new Date(completedAt) : new Date(),
      },
      include: { implementation: true },
    });

    // Check all milestones for implementation
    const allMilestones = await prisma.milestone.findMany({
      where: { implementationId: updatedMilestone.implementationId },
    });

    const completedCount = allMilestones.filter((m) => m.status === "COMPLETED").length;
    const progress = Math.round((completedCount / allMilestones.length) * 100);

    const isAllDone = completedCount === allMilestones.length;

    await prisma.implementation.update({
      where: { id: updatedMilestone.implementationId },
      data: {
        progressPercentage: progress,
        status: isAllDone ? "COMPLETED" : "IN_PROGRESS",
        completedAt: isAllDone ? new Date() : null,
      },
    });

    // If all milestones completed, update problem status to RESOLVED
    if (isAllDone) {
      const challenge = await prisma.challenge.findUnique({
        where: { id: updatedMilestone.implementation.challengeId },
      });
      if (challenge) {
        await prisma.problem.update({
          where: { id: challenge.problemId },
          data: { status: "RESOLVED" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Milestone updated successfully",
      progress,
      data: updatedMilestone,
    });
  } catch (error) {
    console.error("Failed to update milestone:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}
