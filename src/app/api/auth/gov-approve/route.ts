import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attachSessionCookie, getSessionFromCookies } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let email = body.email;

    if (!email) {
      const session = await getSessionFromCookies();
      if (session?.email) {
        email = session.email;
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Officer email is required for approval simulation." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Official user record not found." },
        { status: 404 }
      );
    }

    // Grant administrative clearance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: "VERIFIED",
      },
    });

    // Update role status to ACTIVE
    const userRole = await prisma.userRole.findFirst({
      where: { userId: user.id, role: "GOVERNMENT_OFFICIAL" },
    });

    if (userRole) {
      await prisma.userRole.update({
        where: { id: userRole.id },
        data: { status: "ACTIVE" },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: `Administrative clearance granted to ${updatedUser.name}. Portal access unlocked.`,
      redirectUrl: "/gov/dashboard",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });

    // Update active session cookie
    attachSessionCookie(response, {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      status: updatedUser.status,
      department: updatedUser.department,
      organization: updatedUser.organization,
      createdAt: Date.now(),
    });

    return response;
  } catch (error: any) {
    console.error("Gov approval error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to approve clearance." },
      { status: 500 }
    );
  }
}
