import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [problemCount, userCount, challengeCount, latestProblem] = await Promise.all([
      prisma.problem.count(),
      prisma.user.count(),
      prisma.challenge.count(),
      prisma.problem.findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

    const lastUpdatedDate = latestProblem?.createdAt
      ? new Date(latestProblem.createdAt)
      : new Date();

    const formattedDate = [
      String(lastUpdatedDate.getDate()).padStart(2, "0"),
      String(lastUpdatedDate.getMonth() + 1).padStart(2, "0"),
      lastUpdatedDate.getFullYear(),
    ].join("-");

    return NextResponse.json({
      success: true,
      version: "1.0.0",
      lastUpdated: formattedDate,
      totalGrievances: problemCount,
      totalUsers: userCount,
      totalChallenges: challengeCount,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      {
        success: false,
        version: "1.0.0",
        lastUpdated: "08-09-2026",
        totalGrievances: 4,
        totalUsers: 4,
        totalChallenges: 1,
      },
      { status: 200 }
    );
  }
}
