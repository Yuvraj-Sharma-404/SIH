import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "CITIZEN";

    const user = await prisma.user.findFirst({
      where: { role },
    });

    return NextResponse.json({
      success: true,
      data: user || {
        id: "default-citizen-id",
        name: "Ramesh Pawar",
        role: "CITIZEN",
        email: "citizen.ramesh@gov.in",
      },
    });
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
