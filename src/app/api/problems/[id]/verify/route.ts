import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      status = "VERIFIED", // VERIFIED, REJECTED, SOLUTION_REQUIRED
      assignedDepartment,
      assignedOfficer,
      createChallenge = false,
      challengeTitle,
      challengeDescription,
      requiredExpertise,
      budgetEstimate,
    } = body;

    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Problem not found" },
        { status: 404 }
      );
    }

    // Update problem
    const updated = await prisma.problem.update({
      where: { id },
      data: {
        status,
        departmentName: assignedDepartment || problem.departmentName,
        assignedOfficer: assignedOfficer || problem.assignedOfficer,
      },
    });

    // Optionally publish a Societal Challenge
    let challenge = null;
    if (createChallenge) {
      challenge = await prisma.challenge.create({
        data: {
          problemId: id,
          title: challengeTitle || `Societal Challenge: ${problem.title}`,
          description: challengeDescription || problem.description,
          category: problem.category,
          department: assignedDepartment || problem.departmentName || "Public Works Department",
          requiredExpertise: requiredExpertise || "Multi-disciplinary Engineering",
          budgetEstimate: budgetEstimate || "₹2,50,000",
          status: "OPEN",
          createdBy: assignedOfficer || "Government Officer",
        },
      });

      await prisma.problem.update({
        where: { id },
        data: { status: "SOLUTION_REQUIRED" },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        entityType: "PROBLEM",
        entityId: id,
        action: `PROBLEM_${status}`,
        performedBy: assignedOfficer || "Government Official",
        details: createChallenge ? `Challenge created: ${challenge?.id}` : `Status changed to ${status}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Problem marked as ${status}`,
      data: updated,
      challenge,
    });
  } catch (error) {
    console.error("Failed to verify problem:", error);
    return NextResponse.json(
      { success: false, error: "Verification process failed" },
      { status: 500 }
    );
  }
}
