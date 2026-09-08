import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canTransition } from "@/lib/statusMachine";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const problem = await prisma.problem.findFirst({
      where: {
        OR: [{ id }, { publicProblemId: id }],
      },
      include: {
        evidence: true,
        aiAnalyses: true,
        priorityAssessments: true,
        duplicateMatches: {
          include: { matchedProblem: true },
        },
        challenges: {
          include: {
            proposals: {
              include: {
                team: true,
                implementation: {
                  include: {
                    milestones: true,
                    impactRecords: true,
                  },
                },
              },
            },
          },
        },
        feedback: true,
      },
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Problem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: problem });
  } catch (error) {
    console.error("Failed to retrieve problem:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    if (body.status) {
      const current = await prisma.problem.findUnique({
        where: { id },
        select: { status: true },
      });
      if (current && !canTransition(current.status, body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Illegal status transition from '${current.status}' to '${body.status}'`,
          },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update problem:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update problem" },
      { status: 500 }
    );
  }
}
