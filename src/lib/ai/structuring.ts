import { StructuredProblemResult } from "./provider";

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
): Promise<StructuredProblemResult> {
  const combined = `${title} ${description}`.toLowerCase();

  // Try calling Gemini if API key is provided
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an AI civic governance assistant for India. Analyze this societal issue and return valid JSON only (no markdown):
Title: "${title}"
Description: "${description}"

Schema:
{
  "summary": "1-2 sentence executive summary",
  "category": "Infrastructure | Water & Sanitation | Public Health | Education | Environment | Energy | Agriculture",
  "problemType": "short classification",
  "severity": number between 0.1 and 1.0,
  "urgency": number between 0.1 and 1.0,
  "recommendedDepartment": "Name of relevant Indian government department",
  "requiredExpertise": ["Skill 1", "Skill 2", "Skill 3"],
  "confidence": 0.95
}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          return {
            summary: parsed.summary || title,
            category: parsed.category || "Infrastructure",
            problemType: parsed.problemType || "Civic Grievance",
            severity: parsed.severity ?? 0.7,
            urgency: parsed.urgency ?? 0.7,
            recommendedDepartment: parsed.recommendedDepartment || "Public Works Department",
            requiredExpertise: parsed.requiredExpertise || ["Civil Engineering"],
            confidence: parsed.confidence ?? 0.9,
          };
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to deterministic NLP engine:", e);
    }
  }

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
