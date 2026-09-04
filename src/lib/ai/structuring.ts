import { StructuredProblemResult, generateStructuredAnalysisWithLLM } from "./provider";

interface DepartmentRule {
  keywords: string[];
  category: string;
  department: string;
  skills: string[];
  defaultSeverity: number;
}

const KNOWLEDGE_BASE: Record<string, DepartmentRule> = {
  bridge: {
    keywords: ["bridge", "crack", "collapse", "pier", "railings", "flyover", "culvert"],
    category: "Infrastructure",
    department: "Public Works Department (PWD)",
    skills: ["Civil Engineering", "Structural Health Monitoring", "NDT Testing", "GIS Mapping"],
    defaultSeverity: 0.85,
  },
  water: {
    keywords: ["water", "drinking", "pipeline", "contamination", "leakage", "dirty", "arsenic", "fluoride", "sewage"],
    category: "Water & Sanitation",
    department: "Jal Jeevan Mission / Water Supply Board",
    skills: ["Environmental Engineering", "Chemical Water Filtration", "IoT Flow Sensors", "Microbiology"],
    defaultSeverity: 0.78,
  },
  road: {
    keywords: ["road", "pothole", "asphalt", "highway", "accident", "traffic", "street"],
    category: "Infrastructure",
    department: "Municipal Roads & Highways Division",
    skills: ["Civil Engineering", "Computer Vision Road Inspection", "Material Science"],
    defaultSeverity: 0.65,
  },
  sanitation: {
    keywords: ["garbage", "dump", "waste", "drainage", "overflow", "plastic", "landfill"],
    category: "Water & Sanitation",
    department: "Municipal Solid Waste Management",
    skills: ["Waste-to-Energy", "Urban Planning", "Biogas Processing", "IoT Bin Sensors"],
    defaultSeverity: 0.6,
  },
  electricity: {
    keywords: ["power", "transformer", "wire", "blackout", "voltage", "pole", "spark", "electric"],
    category: "Energy",
    department: "State Power Distribution Corporation (DISCOM)",
    skills: ["Electrical Engineering", "Smart Grid Telemetry", "High-Voltage Safety"],
    defaultSeverity: 0.82,
  },
  health: {
    keywords: ["dengue", "malaria", "clinic", "hospital", "doctor", "medicine", "outbreak", "fever"],
    category: "Public Health",
    department: "District Health & Family Welfare Office",
    skills: ["Epidemiology", "Public Health Analytics", "Telemedicine", "Cold Chain Logistics"],
    defaultSeverity: 0.88,
  },
  agriculture: {
    keywords: ["crop", "canal", "irrigation", "drought", "fertilizer", "pest", "farmer", "soil"],
    category: "Agriculture",
    department: "Department of Agriculture & Farmer Welfare",
    skills: ["Agritech", "Precision Irrigation", "Soil Chemistry", "Satellite Crop Monitoring"],
    defaultSeverity: 0.7,
  },
};

export async function structureProblemWithAI(
  title: string,
  description: string
): Promise<StructuredProblemResult & { providerUsed?: string }> {
  // 1. Call real LLM provider (Gemini or OpenAI) if configured
  const llmResult = await generateStructuredAnalysisWithLLM(title, description);
  if (llmResult) {
    return {
      ...llmResult.result,
      providerUsed: llmResult.provider,
    };
  }

  // 2. Offline fallback engine (Keyword-based expert rules)
  const combined = `${title} ${description}`.toLowerCase();

  // Deterministic Expert System Fallback (resilient for offline/hackathon demo)
  let matchedRule: DepartmentRule = KNOWLEDGE_BASE.road;
  let maxScore = 0;

  for (const [key, rule] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (combined.includes(kw)) score += 2;
    }
    if (combined.includes(key)) score += 3;

    if (score > maxScore) {
      maxScore = score;
      matchedRule = rule;
    }
  }

  // Calculate urgency based on dangerous/critical terms
  const criticalTerms = ["collapse", "danger", "urgent", "death", "hospital", "hazard", "flood", "spark", "children", "crack", "arsenic"];
  let urgency = 0.5;
  for (const term of criticalTerms) {
    if (combined.includes(term)) urgency += 0.15;
  }
  urgency = Math.min(0.98, urgency);

  return {
    summary: `${title}: ${description.slice(0, 120)}${description.length > 120 ? "..." : ""}`,
    category: matchedRule.category,
    problemType: matchedRule.category + " Issue",
    severity: matchedRule.defaultSeverity,
    urgency: Number(urgency.toFixed(2)),
    recommendedDepartment: matchedRule.department,
    requiredExpertise: matchedRule.skills,
    confidence: 0.92,
  };
}
