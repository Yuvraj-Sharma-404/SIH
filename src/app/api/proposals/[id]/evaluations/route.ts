import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { proposalId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: evaluations });
  } catch (error) {
    console.error("Failed to fetch evaluations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch evaluations" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = params.id;
    const body = await req.json();
    const {
      reviewerName = "Authorized Technical Committee",
      feasibilityScore = 8.5,
      scalabilityScore = 8.0,
      innovationScore = 8.5,
      technicalViability = 9.0,
      costScore = 8.0,
      impactScore = 9.0,
      comments = "Proposal thoroughly reviewed and aligned with civic engineering requirements.",
      decision = "ACCEPT", // ACCEPT, REJECT, REQUEST_REVISION
    } = body;

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { challenge: true, team: true },
    });

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Calculate composite overall score (out of 10) per TRD Section 11
    const overallScore = Number(
      (
        (Number(feasibilityScore) * 0.25 +
          Number(technicalViability) * 0.25 +
          Number(innovationScore) * 0.15 +
          Number(impactScore) * 0.15 +
          Number(scalabilityScore) * 0.1 +
          Number(costScore) * 0.1)
      ).toFixed(1)
    );

    // 1. Create evaluation record
    const evaluation = await prisma.evaluation.create({
      data: {
        proposalId,
        reviewerName,
        feasibilityScore: Number(feasibilityScore),
        scalabilityScore: Number(scalabilityScore),
        innovationScore: Number(innovationScore),
        technicalViability: Number(technicalViability),
        overallScore,
        comments,
      },
    });

    let implementation = null;

    if (decision === "ACCEPT") {
      // 2. Mark proposal as ACCEPTED
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: "ACCEPTED" },
      });

      // 3. Mark challenge as AWARDED
      await prisma.challenge.update({
        where: { id: proposal.challengeId },
        data: { status: "AWARDED" },
      });

      // 4. Mark problem as APPROVED / IMPLEMENTATION
      await prisma.problem.update({
        where: { id: proposal.challenge.problemId },
        data: { status: "IMPLEMENTATION" },
      });

      // 5. Create or find Implementation record (TRD Section 13)
      implementation = await prisma.implementation.upsert({
        where: { proposalId },
        update: { status: "IN_PROGRESS" },
        create: {
          proposalId,
          challengeId: proposal.challengeId,
          title: `Implementation: ${proposal.title}`,
          status: "IN_PROGRESS",
          progressPercentage: 15,
        },
      });

      // 6. Create initial implementation milestones if not existing
      const existingMilestones = await prisma.milestone.findMany({
        where: { implementationId: implementation.id },
      });

      if (existingMilestones.length === 0) {
        await prisma.milestone.createMany({
          data: [
            {
              implementationId: implementation.id,
              title: "Milestone 1: Design Verification & Prototype Blueprint",
              description: "Finalize engineering schematics and safety compliance testing.",
              orderIndex: 1,
              status: "COMPLETED",
              completedAt: new Date(),
              proofEvidenceUrl:
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            },
            {
              implementationId: implementation.id,
              title: "Milestone 2: Hardware / Solution Assembly & Bench Testing",
              description: "Assemble sensor units/materials and conduct load and accuracy calibration.",
              orderIndex: 2,
              status: "IN_PROGRESS",
            },
            {
              implementationId: implementation.id,
              title: "Milestone 3: Field Deployment & Nodal Inspection",
              description: "Deploy solution on-site, test with district authority, and record community impact.",
              orderIndex: 3,
              status: "PENDING",
            },
          ],
        });
      }

      // Audit Log
      await prisma.auditLog.create({
        data: {
          entityType: "PROPOSAL",
          entityId: proposalId,
          action: "PROPOSAL_APPROVED_IMPLEMENTATION_STARTED",
          performedBy: reviewerName,
          details: `Proposal approved with score ${overallScore}/10. Team: ${proposal.team.name}`,
        },
      });
    } else if (decision === "REJECT") {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: "REJECTED" },
      });

      await prisma.auditLog.create({
        data: {
          entityType: "PROPOSAL",
          entityId: proposalId,
          action: "PROPOSAL_REJECTED",
          performedBy: reviewerName,
          details: `Proposal rejected: ${comments}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Proposal evaluation recorded. Decision: ${decision}`,
      evaluation,
      overallScore,
      implementation,
    });
  } catch (error) {
    console.error("Failed to evaluate proposal:", error);
    return NextResponse.json(
      { success: false, error: "Proposal evaluation failed" },
      { status: 500 }
    );
  }
}
