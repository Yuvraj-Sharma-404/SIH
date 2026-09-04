import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role = "CITIZEN", email } = body;

    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      user = await prisma.user.findFirst({ where: { role } });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email || `${role.toLowerCase()}@gov.in`,
          name:
            role === "GOVERNMENT_OFFICIAL"
              ? "Er. A. K. Sharma (PWD)"
              : role === "UNIVERSITY_MEMBER"
              ? "Dr. Sandeep Kulkarni (GCE)"
              : role === "INDUSTRY_PARTNER"
              ? "Neha Singhania (CSR Lead)"
              : "Ramesh Pawar",
          role,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Authenticated as ${role}`,
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user,
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
