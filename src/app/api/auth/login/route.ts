import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { getDashboardForRole } from "@/lib/auth/permissions";
import { attachSessionCookie } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role, isQuickLogin } = body;

    let user = null;

    // 1. Quick test login (useful for evaluation / quick testing between roles)
    if (isQuickLogin && role) {
      user = await prisma.user.findFirst({
        where: { role },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `${role.toLowerCase()}@gov.in`,
            name:
              role === "GOVERNMENT_OFFICIAL"
                ? "Er. A. K. Sharma (PWD)"
                : role === "UNIVERSITY_MEMBER"
                ? "Dr. Sandeep Kulkarni (GCE)"
                : role === "INDUSTRY_PARTNER"
                ? "Neha Singhania (CSR Lead)"
                : "Ramesh Pawar",
            role,
            status: role === "GOVERNMENT_OFFICIAL" ? "VERIFICATION_PENDING" : "VERIFIED",
            department: role === "GOVERNMENT_OFFICIAL" ? "Public Works Department (PWD)" : null,
            organization:
              role === "UNIVERSITY_MEMBER"
                ? "Government College of Engineering"
                : role === "INDUSTRY_PARTNER"
                ? "Tata Sustainability Initiative"
                : null,
          },
        });
      }
    } else if (email) {
      // 2. Standard credentials login
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "No account found with this email address. Please sign up." },
          { status: 404 }
        );
      }

      // If password is set on the account, verify it
      if (user.passwordHash && password) {
        const isValid = verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: "Invalid password. Please verify your credentials." },
            { status: 401 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Email and password or quick-login role required." },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User authentication failed." },
        { status: 401 }
      );
    }

    // Check account verification status
    if (user.status === "PENDING_OTP") {
      return NextResponse.json({
        success: false,
        requireOtp: true,
        message: "Email verification pending. Please complete OTP verification.",
        email: user.email,
      });
    }

    // Official status check
    const isGovPending = user.role === "GOVERNMENT_OFFICIAL" && user.status === "VERIFICATION_PENDING";
    const redirectUrl = isGovPending
      ? "/auth/pending-verification"
      : getDashboardForRole(user.role);

    const response = NextResponse.json({
      success: true,
      message: `Signed in successfully as ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        organization: user.organization,
      },
      redirectUrl,
    });

    // Attach signed session cookie
    attachSessionCookie(response, {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      department: user.department,
      organization: user.organization,
      createdAt: Date.now(),
    });

    return response;
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Authentication failed." },
      { status: 500 }
    );
  }
}
