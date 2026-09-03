import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for PS43 Platform...");

  // Clean existing records
  await prisma.feedback.deleteMany();
  await prisma.impactRecord.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.implementation.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.team.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.duplicateMatch.deleteMany();
  await prisma.priorityAssessment.deleteMany();
  await prisma.aIAnalysis.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Stakeholder Users
  const citizen = await prisma.user.create({
    data: {
      email: "citizen.ramesh@gov.in",
      name: "Ramesh Pawar",
      phone: "9823012345",
      role: "CITIZEN",
    },
  });

  const officer = await prisma.user.create({
    data: {
      email: "officer.sharma@gov.in",
      name: "Er. A. K. Sharma",
      phone: "9811098765",
      role: "GOVERNMENT_OFFICIAL",
      organization: "Public Works Department, Maharashtra",
      designation: "Executive Engineer (Dist. Wardha)",
    },
  });

  const uniLead = await prisma.user.create({
    data: {
      email: "dr.kulkarni@engg.edu",
      name: "Dr. Sandeep Kulkarni",
      phone: "9422055678",
      role: "UNIVERSITY_MEMBER",
      organization: "Govt College of Engineering, Amravati",
      designation: "Head of Civil & Sensor Lab",
    },
  });

  const industryLead = await prisma.user.create({
    data: {
      email: "csr@tatasteel.com",
      name: "Neha Singhania",
      phone: "9733099881",
      role: "INDUSTRY_PARTNER",
      organization: "Tata Steel CSR Foundation",
      designation: "Director of Social Innovation",
    },
  });

  // 2. Create Realistic Problems
  // Problem A: The flagship Bridge issue (Used for the live Golden Demo)
  const problemBridge = await prisma.problem.create({
    data: {
      publicProblemId: "PS-2026-1042",
      citizenId: citizen.id,
      reporterName: "Ramesh Pawar",
      reporterPhone: "9823012345",
      title: "Severe Pier Cracks & Railing Collapse on Dham River Bridge",
      description:
        "The Dham River connecting bridge between Wardha and Sevagram has developed visible structural vertical cracks on Pier #3. Heavy rains caused severe scour erosion at the foundation. Commuter buses and school vans cross daily under high vibration.",
      category: "Infrastructure",
      problemType: "Structural Bridge Hazard",
      status: "SOLUTION_REQUIRED",
      severity: 0.88,
      urgency: 0.85,
      priorityScore: 89.5,
      departmentName: "Public Works Department (PWD)",
      assignedOfficer: "Er. A. K. Sharma",
      latitude: 20.7453,
      longitude: 78.6022,
      address: "Old Dham River Bridge, Sevagram Road, Wardha",
      district: "Wardha",
      state: "Maharashtra",
    },
  });

  await prisma.evidence.create({
    data: {
      problemId: problemBridge.id,
      type: "IMAGE",
      fileUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80",
      fileName: "bridge_pier_crack.jpg",
    },
  });

  await prisma.aIAnalysis.create({
    data: {
      problemId: problemBridge.id,
      provider: "GEMINI_CIVIC_V1",
      summary:
        "Critical structural distress reported on Pier #3 of Dham River Bridge with foundation scour erosion affecting multi-village transit.",
      extractedCategory: "Infrastructure",
      severityScore: 0.88,
      urgencyScore: 0.85,
      recommendedDepartment: "Public Works Department (PWD)",
      requiredExpertise: "Civil Engineering, Structural Health Monitoring, IoT Accelerometers, NDT Acoustic Testing",
      confidence: 0.94,
    },
  });

  await prisma.priorityAssessment.create({
    data: {
      problemId: problemBridge.id,
      totalScore: 89.5,
      populationImpact: 0.92,
      severityFactor: 0.88,
      urgencyFactor: 0.85,
      recurrenceFactor: 0.75,
      safetyFactor: 0.95,
      explanation: "Score 89.5/100. Key drivers: High public safety hazard detected; Critical lifeline connecting ~18,000 residents; High scour failure risk.",
    },
  });

  // Problem B: Water Contamination issue
  const problemWater = await prisma.problem.create({
    data: {
      publicProblemId: "PS-2026-2189",
      reporterName: "Gram Panchayat Secretary",
      reporterPhone: "9822188442",
      title: "Arsenic & High Turbidity in Borewell Drinking Water Pipeline",
      description:
        "Public tap drinking water in Ward 4 has high yellow turbidity and foul odor after monsoon runoff. Over 24 schoolchildren hospitalized with acute diarrhea last week.",
      category: "Water & Sanitation",
      problemType: "Water Quality & Health Risk",
      status: "PENDING_VERIFICATION",
      severity: 0.92,
      urgency: 0.95,
      priorityScore: 94.0,
      departmentName: "Jal Jeevan Mission / Water Supply Board",
      latitude: 20.7389,
      longitude: 78.5954,
      address: "Zilla Parishad School Ward 4, Wardha",
      district: "Wardha",
      state: "Maharashtra",
    },
  });

  await prisma.evidence.create({
    data: {
      problemId: problemWater.id,
      type: "IMAGE",
      fileUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      fileName: "turbid_water_sample.jpg",
    },
  });

  await prisma.aIAnalysis.create({
    data: {
      problemId: problemWater.id,
      provider: "GEMINI_CIVIC_V1",
      summary:
        "Severe water contamination causing acute health hazards for primary school children. Immediate water filtration testing and alternate supply required.",
      extractedCategory: "Water & Sanitation",
      severityScore: 0.92,
      urgencyScore: 0.95,
      recommendedDepartment: "Jal Jeevan Mission / Water Supply Board",
      requiredExpertise: "Chemical Water Testing, Solar UV Filtration, IoT Water Quality Sensors, Microbiology",
      confidence: 0.96,
    },
  });

  // 3. Create an Active Societal Challenge from Problem A
  const challenge = await prisma.challenge.create({
    data: {
      problemId: problemBridge.id,
      title: "IoT-Based Continuous Structural Health & Vibration Telemetry for Scour-Vulnerable Rural Bridges",
      description:
        "Develop an affordable, solar-powered IoT sensor network with multi-axis accelerometers and ultrasonic scour sensors to detect micro-cracks and bridge displacement in real time, alerting PWD engineers before catastrophic failure.",
      category: "Infrastructure",
      department: "Public Works Department (PWD)",
      requiredExpertise: "Civil Engineering, Embedded IoT Sensors, LoRaWAN / GSM Telemetry, Structural Vibration Analysis",
      budgetEstimate: "₹3,50,000",
      status: "OPEN",
      createdBy: "Er. A. K. Sharma",
    },
  });

  // 4. University Team & Proposal
  const team = await prisma.team.create({
    data: {
      name: "SensorGrid Dynamics Lab",
      institution: "Government College of Engineering, Amravati",
      leadName: "Dr. Sandeep Kulkarni",
      leadEmail: "dr.kulkarni@engg.edu",
      leadPhone: "9422055678",
      skills: "Civil Engineering, Embedded C, ESP32 Sensor Nodes, LoRaWAN, Cloud Dashboards",
    },
  });

  const proposal = await prisma.proposal.create({
    data: {
      challengeId: challenge.id,
      teamId: team.id,
      title: "Solar LoRaWAN Scour & Structural Vibration Mesh Network with SMS Hazard Trigger",
      description:
        "We propose deploying 4 solar-powered ruggedized vibration telemetry pods with tri-axial MEMS accelerometers mounted at Pier #3, Pier #4, and bridge deck, transmitting strain and frequency shifts via LoRaWAN to a local PWD dashboard.",
      technicalApproach:
        "1. Piezoelectric vibration sensing (100Hz sampling)\n2. Ultrasonic water-level & scour depth sensor below Pier 3\n3. Edge threshold trigger with immediate buzzer & PWD siren\n4. Cloud sync via 4G GSM gateway",
      estimatedCost: "₹1,85,000",
      expectedImpact: "Protects ~18,000 daily commuters; prevents bridge closure; early warning saves ₹40L in emergency repairs.",
      status: "ACCEPTED",
    },
  });

  await prisma.evaluation.create({
    data: {
      proposalId: proposal.id,
      reviewerName: "Er. A. K. Sharma (PWD)",
      feasibilityScore: 9.5,
      scalabilityScore: 9.0,
      innovationScore: 9.2,
      technicalViability: 9.6,
      overallScore: 9.3,
      comments:
        "Highly practical and cost-effective approach. Solar LoRaWAN avoids high power wiring costs over the river span. Approved for field prototype deployment.",
    },
  });

  // 5. Active Implementation & Milestones
  const implementation = await prisma.implementation.create({
    data: {
      proposalId: proposal.id,
      challengeId: challenge.id,
      title: "Dham Bridge Telemetry Pod Installation & Calibration",
      status: "IN_PROGRESS",
      progressPercentage: 65,
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        implementationId: implementation.id,
        title: "Milestone 1: Sensor Hardware Fabrication & Lab Calibration",
        description: "Fabricate 4 IP67-rated waterproof sensor pods and calibrate accelerometer frequency response.",
        orderIndex: 1,
        status: "COMPLETED",
        proofEvidenceUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        completedAt: new Date(),
      },
      {
        implementationId: implementation.id,
        title: "Milestone 2: Bridge Pier Installation & Solar Gateway Mounting",
        description: "Mount physical sensor clamps on Pier #3 and setup 15W solar panel on Sevagram approach pillar.",
        orderIndex: 2,
        status: "COMPLETED",
        proofEvidenceUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
        completedAt: new Date(),
      },
      {
        implementationId: implementation.id,
        title: "Milestone 3: Live Telemetry Integration & Siren Trigger Test",
        description: "Stream continuous vibration FFT spectra to PWD dashboard and simulate scour trigger alert.",
        orderIndex: 3,
        status: "IN_PROGRESS",
      },
    ],
  });

  // 6. Impact Record
  await prisma.impactRecord.create({
    data: {
      implementationId: implementation.id,
      problemTitle: "Dham River Bridge Structural Health",
      peopleImpacted: 18500,
      metricsSummary: "18,500 daily commuters secured; 2 critical crack propagation alerts successfully caught before monsoon crest.",
      verifiedBy: "District Collector Office, Wardha",
      beforeAfterProofUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80",
    },
  });

  console.log("✅ Seed completed successfully with realistic Indian civic challenges!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
