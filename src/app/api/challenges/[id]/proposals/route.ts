import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposals = await prisma.proposal.findMany({
      where: { challengeId: params.id },
      include: {
        team: true,
        evaluations: true,
        implementation: {
          include: { milestones: true, impactRecords: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    console.error("Failed to fetch proposals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve proposals" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const body = await req.json();
    const {
      teamName,
      institution,
      leadName,
      leadEmail,
      leadPhone,
      skills,
      title,
      description,
      technicalApproach,
      estimatedCost,
      expectedImpact,
    } = body;

    // 1. Create or link team
    const team = await prisma.team.create({
      data: {
        name: teamName || "Innovation Research Cell",
        institution: institution || "Engineering University",
        leadName: leadName || "Student Lead",
        leadEmail: leadEmail || "lead@college.edu",
        leadPhone: leadPhone || "9876543210",
        skills: skills || "IoT, Embedded Systems, AI",
      },
    });

    // 2. Create proposal
    const proposal = await prisma.proposal.create({
      data: {
        challengeId,
        teamId: team.id,
        title,
        description,
        technicalApproach,
        estimatedCost: estimatedCost || "₹1,50,000",
        expectedImpact: expectedImpact || "Addresses community safety and saves maintenance overhead.",
        status: "SUBMITTED",
      },
      include: { team: true },
    });

    // 3. Update challenge status to IN_REVIEW
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { status: "IN_REVIEW" },
    });

    return NextResponse.json({
      success: true,
      message: "University proposal submitted successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("Failed to submit proposal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit proposal" },
      { status: 500 }
    );
  }
}
