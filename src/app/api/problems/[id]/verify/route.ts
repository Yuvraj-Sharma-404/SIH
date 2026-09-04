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
      action, // VERIFY, REJECT, REQUEST_INFORMATION, ASSIGN, OVERRIDE_PRIORITY, CONVERT_CHALLENGE
      status, // fallback if action not explicitly passed
      assignedDepartment,
      assignedOfficer,
      rejectionReason,
      requestNote,
      newPriorityScore,
      overrideReason,
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

    const determinedAction = action || (status === "REJECTED" ? "REJECT" : createChallenge ? "CONVERT_CHALLENGE" : "VERIFY");
    let finalStatus = problem.status;
    const updateData: Record<string, any> = {};

    if (determinedAction === "VERIFY") {
      finalStatus = "VERIFIED";
      updateData.status = "VERIFIED";
      if (assignedDepartment) updateData.departmentName = assignedDepartment;
      if (assignedOfficer) updateData.assignedOfficer = assignedOfficer;
    } else if (determinedAction === "REJECT") {
      finalStatus = "REJECTED";
      updateData.status = "REJECTED";
      updateData.rejectionReason = rejectionReason || "Does not meet civic jurisdiction criteria.";
    } else if (determinedAction === "REQUEST_INFORMATION") {
      finalStatus = "PENDING_VERIFICATION";
      updateData.status = "PENDING_VERIFICATION";
      updateData.requestNote = requestNote || "Please submit clearer photo evidence and street landmark.";
    } else if (determinedAction === "ASSIGN") {
      finalStatus = "ASSIGNED";
      updateData.status = "ASSIGNED";
      if (assignedDepartment) updateData.departmentName = assignedDepartment;
      if (assignedOfficer) updateData.assignedOfficer = assignedOfficer;
    } else if (determinedAction === "OVERRIDE_PRIORITY") {
      if (typeof newPriorityScore === "number") {
        updateData.priorityScore = Math.min(100, Math.max(0, newPriorityScore));
        // Create priority assessment record with human override
        await prisma.priorityAssessment.create({
          data: {
            problemId: id,
            totalScore: updateData.priorityScore,
            populationImpact: 0.9,
            severityFactor: 0.9,
            urgencyFactor: 0.9,
            recurrenceFactor: 0.8,
            safetyFactor: 0.9,
            explanation: `Official Override: ${overrideReason || "Adjusted based on field assessment"}`,
            humanOverride: true,
            overrideReason: overrideReason || "Nodal officer on-ground hazard re-evaluation",
          },
        });
      }
    }

    // Optionally publish a Societal Challenge
    let challenge = null;
    if (createChallenge || determinedAction === "CONVERT_CHALLENGE") {
      finalStatus = "SOLUTION_REQUIRED";
      updateData.status = "SOLUTION_REQUIRED";
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
    }

    // Update problem in database
    const updated = await prisma.problem.update({
      where: { id },
      data: updateData,
    });

    // Audit log (TRD Section 19)
    await prisma.auditLog.create({
      data: {
        entityType: "PROBLEM",
        entityId: id,
        action: `OFFICIAL_${determinedAction}`,
        performedBy: assignedOfficer || "Authorized Nodal Officer",
        details:
          determinedAction === "REJECT"
            ? `Rejected: ${rejectionReason}`
            : determinedAction === "OVERRIDE_PRIORITY"
            ? `Priority overridden to ${newPriorityScore}: ${overrideReason}`
            : determinedAction === "REQUEST_INFORMATION"
            ? `Info requested: ${requestNote}`
            : challenge
            ? `Challenge created: ${challenge.id}`
            : `Status changed to ${finalStatus}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Problem action ${determinedAction} completed successfully`,
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
