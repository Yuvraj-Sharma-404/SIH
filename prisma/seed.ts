import { PrismaClient } from "../src/generated/prisma";
import { JHARKHAND_SECTORS } from "../src/lib/data/jharkhand-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for SmadhanX Platform with Jharkhand State GIS Civic Data...");

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

  // 1. Create Core Stakeholder Users (Jharkhand State Ecosystem)
  const citizen = await prisma.user.create({
    data: {
      email: "citizen.rameshwar@jharkhand.gov.in",
      name: "Rameshwar Munda",
      phone: "9835012345",
      role: "CITIZEN",
      designation: "Resident Citizen",
      organization: "Harmu Nagar Resident Welfare Association, Ranchi",
      profileData: JSON.stringify({ state: "Jharkhand", district: "Ranchi" }),
    },
  });

  const officer = await prisma.user.create({
    data: {
      email: "officer.sinha@jharkhand.gov.in",
      name: "Er. Prabhat Kumar Sinha",
      phone: "9431109876",
      role: "GOVERNMENT_OFFICIAL",
      organization: "Jharkhand Urban Infrastructure Development Company (JUIDCO)",
      department: "Urban Development & Housing Department, Govt of Jharkhand",
      designation: "Superintending Engineer (Ranchi Division)",
      profileData: JSON.stringify({ state: "Jharkhand", district: "Ranchi", zone: "Central Capital Division" }),
    },
  });

  const uniLead1 = await prisma.user.create({
    data: {
      email: "dr.agrawal@bitmesra.ac.in",
      name: "Dr. Anupam Agrawal",
      phone: "9430155678",
      role: "UNIVERSITY_MEMBER",
      organization: "Birla Institute of Technology (BIT) Mesra, Ranchi",
      department: "Civil & Environmental Engineering / Sensor Lab",
      designation: "Professor & Principal Investigator",
      profileData: JSON.stringify({ state: "Jharkhand", district: "Ranchi" }),
    },
  });

  const uniLead2 = await prisma.user.create({
    data: {
      email: "dr.pathak@iitism.ac.in",
      name: "Dr. K. K. Pathak",
      phone: "9470123890",
      role: "UNIVERSITY_MEMBER",
      organization: "Indian Institute of Technology (IIT - ISM) Dhanbad",
      department: "Mining & Environmental Geospatial Telemetry Lab",
      designation: "Head of Environmental Systems",
      profileData: JSON.stringify({ state: "Jharkhand", district: "Dhanbad" }),
    },
  });

  const industryLead = await prisma.user.create({
    data: {
      email: "csr@tatasteel.com",
      name: "Neha Singhania",
      phone: "9733099881",
      role: "INDUSTRY_PARTNER",
      organization: "Tata Steel Foundation",
      department: "Corporate Social Responsibility & Environmental Innovation",
      designation: "Director of Sustainable Civic Innovation (Jamshedpur)",
      profileData: JSON.stringify({ state: "Jharkhand", district: "East Singhbhum" }),
    },
  });

  // 2. Create Realistic Problems Across Jharkhand Districts
  const createdProblems: any[] = [];

  for (const sec of JHARKHAND_SECTORS) {
    const problem = await prisma.problem.create({
      data: {
        publicProblemId: sec.publicProblemId,
        citizenId: citizen.id,
        reporterName: citizen.name,
        reporterPhone: citizen.phone,
        title: sec.name,
        description: sec.description,
        category: sec.primaryCategory.includes("Water")
          ? "Water & Sanitation"
          : sec.primaryCategory.includes("Infrastructure")
          ? "Infrastructure"
          : sec.primaryCategory.includes("Environment")
          ? "Environment"
          : sec.primaryCategory.includes("Health")
          ? "Public Health"
          : "Agriculture",
        problemType: sec.problemType,
        status: sec.status,
        severity: sec.severity,
        urgency: sec.urgency,
        priorityScore: sec.priorityScore,
        departmentName: sec.departmentName,
        assignedOfficer: sec.assignedOfficer,
        latitude: sec.coordinates[0],
        longitude: sec.coordinates[1],
        address: sec.address,
        district: sec.district,
        state: "Jharkhand",
      },
    });

    createdProblems.push(problem);

    // Evidence
    await prisma.evidence.create({
      data: {
        problemId: problem.id,
        type: "IMAGE",
        fileUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80",
        fileName: `${sec.publicProblemId.toLowerCase()}_inspection.jpg`,
      },
    });

    // AI Analysis record
    await prisma.aIAnalysis.create({
      data: {
        problemId: problem.id,
        provider: "GEMINI_CIVIC_V1",
        summary: `AI GIS Ingestion: Critical civic density hotspot detected in ${sec.district}, Jharkhand. ${sec.recentIssue}`,
        extractedCategory: sec.primaryCategory,
        severityScore: sec.severity,
        urgencyScore: sec.urgency,
        recommendedDepartment: sec.departmentName,
        requiredExpertise: "Geospatial GIS Telemetry, Edge IoT Sensors, Structural Mechanics, Environmental Quality Analysis",
        confidence: 0.95,
      },
    });

    // Priority Assessment record
    await prisma.priorityAssessment.create({
      data: {
        problemId: problem.id,
        totalScore: sec.priorityScore,
        populationImpact: sec.severity,
        severityFactor: sec.severity,
        urgencyFactor: sec.urgency,
        recurrenceFactor: 0.85,
        safetyFactor: 0.92,
        explanation: `Calculated priority score of ${sec.priorityScore}/100. High civic density hotspot in ${sec.district}, impacting ~${sec.impactPopulation.toLocaleString()} citizens.`,
      },
    });
  }

  // 3. Flagship Jharkhand Challenge (Harmu River & Urban Drainage in Ranchi)
  const flagshipProblem = createdProblems[0]; // Harmu River
  const flagshipDhanbadProblem = createdProblems[3]; // Jharia Coalfire

  const challenge1 = await prisma.challenge.create({
    data: {
      problemId: flagshipProblem.id,
      title: "Real-time Optical IoT Silt & Industrial Effluent Telemetry for Harmu River Urban Corridor",
      description:
        "Design and deploy solar-powered multi-parameter river sensors measuring siltation, dissolved oxygen, and toxic runoff levels along the 12km Harmu drainage canal to trigger automated sluice gates and municipal alerts before monsoon residential flooding.",
      category: "Water & Sanitation",
      department: "Jharkhand Urban Infrastructure Development Company (JUIDCO)",
      requiredExpertise: "Embedded IoT Sensors, Water Quality Analysis, LoRaWAN Telemetry, Civil Environmental Engineering",
      budgetEstimate: "₹4,50,000",
      status: "OPEN",
      createdBy: "Er. Prabhat Kumar Sinha (JUIDCO Ranchi)",
    },
  });

  const challenge2 = await prisma.challenge.create({
    data: {
      problemId: flagshipDhanbadProblem.id,
      title: "Drone-Assisted Thermal Infrared Mapping & Wireless Gas Sensor Mesh for Jharia Subterranean Mine Fires",
      description:
        "Deploy edge gas sensor pods (CO, SO2, CH4) paired with thermal imaging drones to track underground coalfire migration and alert settlements prior to catastrophic surface subsidence.",
      category: "Environment & Mining",
      department: "Jharkhand State Pollution Control Board & BCCL",
      requiredExpertise: "Thermal Drone GIS, Toxic Gas Telemetry, Geotechnical Engineering, Edge AI",
      budgetEstimate: "₹6,00,000",
      status: "OPEN",
      createdBy: "Er. S. K. Murmu (JSPCB Dhanbad)",
    },
  });

  // 4. University Teams & Proposals (BIT Mesra Ranchi & IIT ISM Dhanbad)
  const team1 = await prisma.team.create({
    data: {
      name: "Chotanagpur Civic Sensor Labs",
      institution: "Birla Institute of Technology (BIT) Mesra, Ranchi",
      leadName: "Dr. Anupam Agrawal",
      leadEmail: "dr.agrawal@bitmesra.ac.in",
      leadPhone: "9430155678",
      skills: "Environmental Engineering, Embedded C, LoRaWAN Mesh, Optical Water Sensors, GIS Mapping",
    },
  });

  const proposal1 = await prisma.proposal.create({
    data: {
      challengeId: challenge1.id,
      teamId: team1.id,
      title: "Solar LoRaWAN Water Quality & Ultrasonic Silt Gauge Mesh for Harmu River",
      description:
        "We propose installing 6 IP68 solar-powered water sensing pods across Vidhyapati Nagar, Harmu Housing Colony, and Kadru outfall with real-time GSM/LoRa telemetry transmitting turbidity, DO, and flood level metrics to JUIDCO.",
      technicalApproach:
        "1. Optical multi-wavelength turbidity & pH sensor array\n2. Ultrasonic level measurement with 5-minute sampling\n3. Edge threshold alert triggering SMS to Ranchi Municipal Control Room\n4. Cloud GIS dashboard integration with OpenStreetMap",
      estimatedCost: "₹2,25,000",
      expectedImpact: "Protects ~45,000 residents across 14 municipal wards from toxic sewage backflow during monsoon.",
      status: "ACCEPTED",
    },
  });

  await prisma.evaluation.create({
    data: {
      proposalId: proposal1.id,
      reviewerName: "Er. Prabhat Kumar Sinha (JUIDCO Ranchi)",
      feasibilityScore: 9.6,
      scalabilityScore: 9.3,
      innovationScore: 9.4,
      technicalViability: 9.7,
      overallScore: 9.5,
      comments:
        "Exceptional proposal tailored to Ranchi's urban topography. Solar LoRaWAN deployment bypasses vulnerable overhead wiring. Approved for field prototype deployment.",
    },
  });

  // 5. Active Implementation & Milestones
  const implementation1 = await prisma.implementation.create({
    data: {
      proposalId: proposal1.id,
      challengeId: challenge1.id,
      title: "Harmu River Corridor Telemetry Pod Deployment & Calibration",
      status: "IN_PROGRESS",
      progressPercentage: 70,
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        implementationId: implementation1.id,
        title: "Milestone 1: Sensor Hardware Fabrication & BIT Mesra Water Lab Testing",
        description: "Fabricated 6 IP68 waterproof sensor pods; calibrated optical turbidity sensors with Harmu river silt samples.",
        orderIndex: 1,
        status: "COMPLETED",
        proofEvidenceUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        completedAt: new Date(),
      },
      {
        implementationId: implementation1.id,
        title: "Milestone 2: On-Site Mounting at Harmu Bridge & Vidhyapati Nagar Sluice",
        description: "Mounted physical sensor pods on bridge piers with 20W solar panels and 4G telemetry modules.",
        orderIndex: 2,
        status: "COMPLETED",
        proofEvidenceUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
        completedAt: new Date(),
      },
      {
        implementationId: implementation1.id,
        title: "Milestone 3: JUIDCO Control Room Telemetry Integration & Siren Trigger Test",
        description: "Connecting live telemetry data feed to Ranchi Municipal Corporation GIS dashboard.",
        orderIndex: 3,
        status: "IN_PROGRESS",
      },
    ],
  });

  // 6. Impact Record
  await prisma.impactRecord.create({
    data: {
      implementationId: implementation1.id,
      problemTitle: "Harmu River Corridor & Industrial Drainage Zone",
      peopleImpacted: 45000,
      metricsSummary: "45,000 residents secured across 14 municipal wards; 3 severe industrial discharge violations detected within 24 hours.",
      verifiedBy: "JUIDCO & Ranchi Municipal Corporation Health Division",
      beforeAfterProofUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80",
    },
  });

  console.log(`✅ Seed completed successfully with ${JHARKHAND_SECTORS.length} Jharkhand State GIS Civic Hotspots!`);
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
