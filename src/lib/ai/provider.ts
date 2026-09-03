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
