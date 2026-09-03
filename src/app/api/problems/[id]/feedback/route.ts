import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { rating = 5, comments, isResolvedConfirmed = true } = body;

    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Problem not found" },
        { status: 404 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        problemId: id,
        rating: Number(rating),
        comments,
        isResolvedConfirmed: Boolean(isResolvedConfirmed),
      },
    });

    if (isResolvedConfirmed) {
      await prisma.problem.update({
        where: { id },
        data: { status: "CLOSED" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Citizen feedback registered successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Failed to register feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
