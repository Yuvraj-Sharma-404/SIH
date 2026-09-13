import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDashboardForRole, getDefaultPermissions } from "@/lib/auth/permissions";
import { attachSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Account not found." },
        { status: 404 }
      );
    }

    // Check if code has expired
    if (user.verificationExpiresAt && new Date() > new Date(user.verificationExpiresAt)) {
      return NextResponse.json(
        { success: false, error: "Verification code has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Verify OTP strictly matches the real code emailed to the user
    const isMatchingCode = Boolean(user.verificationCode && user.verificationCode === code.trim());

    if (!isMatchingCode) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code. Please enter the 6-digit code received on your email." },
        { status: 400 }
      );
    }

    // Determine final account status based on role policy:
    // Government officials REQUIRE clearance before gaining access to official portals.
    const isGov = user.role === "GOVERNMENT_OFFICIAL";
    const nextStatus = isGov ? "VERIFICATION_PENDING" : "VERIFIED";
    const roleStatus = isGov ? "PENDING_CLEARANCE" : "ACTIVE";
    const redirectUrl = isGov ? "/auth/pending-verification" : getDashboardForRole(user.role);

    // Update user record
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: nextStatus,
        verificationCode: null,
        verificationExpiresAt: null,
      },
    });

    // Create or update role entry
    const existingRole = await prisma.userRole.findFirst({
      where: { userId: user.id, role: user.role },
    });

    if (!existingRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          role: user.role,
          permissions: JSON.stringify(getDefaultPermissions(user.role)),
          status: roleStatus,
        },
      });
    } else {
      await prisma.userRole.update({
        where: { id: existingRole.id },
        data: { status: roleStatus },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: isGov
        ? "Email verified. Official credentials submitted for administrative clearance."
        : "Email successfully verified! Welcome to SmadhanX.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        department: updatedUser.department,
        organization: updatedUser.organization,
      },
      redirectUrl,
      status: updatedUser.status,
    });

    // Attach signed session cookie
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
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Verification failed." },
      { status: 500 }
    );
  }
}
