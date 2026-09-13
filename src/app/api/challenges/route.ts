import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const challenges = await prisma.challenge.findMany({
      where,
      include: {
        problem: {
          include: { evidence: true },
        },
        proposals: {
          include: {
            team: true,
            evaluations: true,
            implementation: {
              include: { milestones: true },
            },
          },
        },
        sponsorships: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: challenges.length,
      data: challenges,
    });
  } catch (error) {
    console.error("Failed to fetch challenges:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve challenges" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      problemId,
      title,
      description,
      category,
      department,
      requiredExpertise,
      budgetEstimate,
      createdBy,
    } = body;

    const challenge = await prisma.challenge.create({
      data: {
        problemId,
        title,
        description,
        category,
        department,
        requiredExpertise,
        budgetEstimate: budgetEstimate || "₹2,00,000",
        createdBy: createdBy || "Official",
        status: "OPEN",
      },
    });

    await prisma.problem.update({
      where: { id: problemId },
      data: { status: "SOLUTION_REQUIRED" },
    });

    return NextResponse.json({
      success: true,
      message: "Challenge published to University & Industry Portal",
      data: challenge,
    });
  } catch (error) {
    console.error("Failed to create challenge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}
