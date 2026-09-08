/**
 * AI Provider Abstraction
 * Supports Google Gemini, OpenAI, or local deterministic NLP fallback for resilient offline demos.
 */

export interface StructuredProblemResult {
  summary: string;
  category: string;
  problemType: string;
  severity: number; // 0.0 to 1.0
  urgency: number; // 0.0 to 1.0
  recommendedDepartment: string;
  requiredExpertise: string[];
  confidence: number;
}

export function computeTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(
    text1
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  const words2 = new Set(
    text2
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  words1.forEach((w) => {
    if (words2.has(w)) intersection++;
  });

  const union = new Set([...Array.from(words1), ...Array.from(words2)]).size;
  const jaccard = intersection / (union || 1);

  // Boost for key infrastructure/societal terms match
  return Math.min(1.0, Number((jaccard * 1.5).toFixed(2)));
}

export async function generateStructuredAnalysisWithLLM(
  title: string,
  description: string
): Promise<{ result: StructuredProblemResult; provider: string } | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

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
            provider: "GEMINI",
            result: {
              summary: parsed.summary || title,
              category: parsed.category || "Infrastructure",
              problemType: parsed.problemType || "Civic Grievance",
              severity: Number(parsed.severity) || 0.7,
              urgency: Number(parsed.urgency) || 0.7,
              recommendedDepartment: parsed.recommendedDepartment || "Public Works Department",
              requiredExpertise: Array.isArray(parsed.requiredExpertise)
                ? parsed.requiredExpertise
                : ["Civil Engineering"],
              confidence: Number(parsed.confidence) || 0.9,
            },
          };
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed:", e);
    }
  }

  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an AI civic governance assistant for India. Respond with JSON matching the requested schema.",
            },
            {
              role: "user",
              content: `Analyze this issue:
Title: "${title}"
Description: "${description}"

Schema JSON:
{
  "summary": "1-2 sentence executive summary",
  "category": "Infrastructure | Water & Sanitation | Public Health | Education | Environment | Energy | Agriculture",
  "problemType": "short classification",
  "severity": number between 0.1 and 1.0,
  "urgency": number between 0.1 and 1.0,
  "recommendedDepartment": "Name of relevant Indian government department",
  "requiredExpertise": ["Skill 1", "Skill 2"],
  "confidence": 0.95
}`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            provider: "OPENAI",
            result: {
              summary: parsed.summary || title,
              category: parsed.category || "Infrastructure",
              problemType: parsed.problemType || "Civic Grievance",
              severity: Number(parsed.severity) || 0.7,
              urgency: Number(parsed.urgency) || 0.7,
              recommendedDepartment: parsed.recommendedDepartment || "Public Works Department",
              requiredExpertise: Array.isArray(parsed.requiredExpertise)
                ? parsed.requiredExpertise
                : ["Civil Engineering"],
              confidence: Number(parsed.confidence) || 0.95,
            },
          };
        }
      }
    } catch (e) {
      console.warn("OpenAI API call failed:", e);
    }
  }

  return null;
}
