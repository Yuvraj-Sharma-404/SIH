import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to resend verification code." },
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

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: newOtp,
        verificationExpiresAt: expiresAt,
      },
    });

    // Send real verification email via SMTP or Resend
    await sendOtpEmail(user.email, newOtp, user.name);

    return NextResponse.json({
      success: true,
      message: `A fresh OTP has been sent to ${user.email}.`,
    });
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to resend code." },
      { status: 500 }
    );
  }
}
