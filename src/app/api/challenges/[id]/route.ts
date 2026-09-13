import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        problem: {
          include: { evidence: true, priorityAssessments: true },
        },
        proposals: {
          include: {
            team: true,
            evaluations: true,
            implementation: {
              include: { milestones: true, impactRecords: true },
            },
          },
        },
        sponsorships: true,
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: challenge });
  } catch (error) {
    console.error("Failed to fetch challenge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve challenge details" },
      { status: 500 }
    );
  }
}
