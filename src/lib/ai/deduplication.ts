import { prisma } from "../db";
import { calculateDistanceMeters } from "../geo";
import { computeTextSimilarity } from "./provider";

export interface DuplicateCheckResult {
  isDuplicateFound: boolean;
  matches: Array<{
    targetProblemId: string;
    targetTitle: string;
    totalScore: number;
    semanticScore: number;
    distanceMeters: number;
    categoryMatch: boolean;
  }>;
}

export async function detectDuplicates(
  newProblemId: string,
  title: string,
  description: string,
  category: string,
  latitude?: number | null,
  longitude?: number | null
): Promise<DuplicateCheckResult> {
  // Build spatial bounding box filter if coordinates are available (approx 10km radius box)
  let whereClause: any = {
    id: { not: newProblemId },
    status: { notIn: ["REJECTED", "CLOSED"] },
  };

  if (latitude != null && longitude != null) {
    const radiusMeters = 10000;
    const deltaLat = radiusMeters / 111000;
    const cosLat = Math.cos((latitude * Math.PI) / 180);
    const deltaLng = radiusMeters / (111000 * (Math.abs(cosLat) > 0.01 ? cosLat : 1));

    whereClause = {
      id: { not: newProblemId },
      status: { notIn: ["REJECTED", "CLOSED"] },
      OR: [
        {
          latitude: {
            gte: latitude - deltaLat,
            lte: latitude + deltaLat,
          },
          longitude: {
            gte: longitude - deltaLng,
            lte: longitude + deltaLng,
          },
        },
        { latitude: null },
        { longitude: null },
      ],
    };
  }

  // Find spatially-plausible recent active problems in the system excluding the current one
  const candidates = await prisma.problem.findMany({
    where: whereClause,
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  const matches: DuplicateCheckResult["matches"] = [];
  const duplicateRecordsToCreate: Array<{
    sourceProblemId: string;
    matchedProblemId: string;
    semanticScore: number;
    geoDistanceMeters: number;
    categoryMatch: boolean;
    totalDuplicateScore: number;
    status: string;
  }> = [];

  for (const candidate of candidates) {
    let distanceMeters = 5000;
    let geoScore = 0;

    // 1. Spatial Gating & Scoring
    if (
      latitude != null &&
      longitude != null &&
      candidate.latitude != null &&
      candidate.longitude != null
    ) {
      distanceMeters = calculateDistanceMeters(
        latitude,
        longitude,
        candidate.latitude,
        candidate.longitude
      );

      if (distanceMeters <= 500) {
        geoScore = 1.0;
      } else if (distanceMeters <= 1500) {
        geoScore = 0.75;
      } else if (distanceMeters <= 3000) {
        geoScore = 0.4;
      } else {
        // Outside spatial boundary, skip or penalize heavily
        geoScore = 0.05;
      }
    } else {
      // Default if location is unmapped
      geoScore = 0.5;
      distanceMeters = 0;
    }

    // 2. Semantic Similarity
    const text1 = `${title} ${description}`;
    const text2 = `${candidate.title} ${candidate.description}`;
    const semanticScore = computeTextSimilarity(text1, text2);

    // 3. Category Match
    const categoryMatch =
      category.toLowerCase().trim() === candidate.category.toLowerCase().trim();
    const catScore = categoryMatch ? 1.0 : 0.0;

    // 4. Hybrid Formula: 45% semantic, 35% geo, 20% category
    const totalScore = Number(
      (0.45 * semanticScore + 0.35 * geoScore + 0.2 * catScore).toFixed(2)
    );

    // If score >= 0.50, flag as duplicate candidate
    if (totalScore >= 0.5) {
      matches.push({
        targetProblemId: candidate.id,
        targetTitle: candidate.title,
        totalScore,
        semanticScore,
        distanceMeters,
        categoryMatch,
      });

      duplicateRecordsToCreate.push({
        sourceProblemId: newProblemId,
        matchedProblemId: candidate.id,
        semanticScore,
        geoDistanceMeters: distanceMeters,
        categoryMatch,
        totalDuplicateScore: totalScore,
        status: "SUGGESTED",
      });
    }
  }

  if (duplicateRecordsToCreate.length > 0) {
    await prisma.duplicateMatch.createMany({
      data: duplicateRecordsToCreate,
    });
  }

  // Sort matches by highest score first
  matches.sort((a, b) => b.totalScore - a.totalScore);

  return {
    isDuplicateFound: matches.length > 0,
    matches,
  };
}
