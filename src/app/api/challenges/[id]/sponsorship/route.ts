import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sponsorships = await prisma.sponsorship.findMany({
      where: { challengeId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: sponsorships });
  } catch (error) {
    console.error("Failed to fetch sponsorships:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sponsorships" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const body = await req.json();
    const {
      organizationName,
      contactEmail,
      contactPhone,
      pledgeType = "CSR_GRANT", // CSR_GRANT, MENTORSHIP, HARDWARE_ACCESS, CO_IMPLEMENTATION
      amountOrDetails,
    } = body;

    if (!organizationName || !contactEmail || !amountOrDetails) {
      return NextResponse.json(
        { success: false, error: "Organization name, email, and pledge details are required" },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    const sponsorship = await prisma.sponsorship.create({
      data: {
        challengeId,
        organizationName,
        contactEmail,
        contactPhone,
        pledgeType,
        amountOrDetails,
        status: "COMMITTED",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        entityType: "CHALLENGE",
        entityId: challengeId,
        action: "INDUSTRY_PLEDGE_COMMITTED",
        performedBy: organizationName,
        details: `Committed ${pledgeType}: ${amountOrDetails}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "CSR Sponsorship & Industry Pledge registered successfully",
      data: sponsorship,
    });
  } catch (error) {
    console.error("Failed to register sponsorship:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register sponsorship" },
      { status: 500 }
    );
  }
}
