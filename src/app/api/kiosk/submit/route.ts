import { NextRequest, NextResponse } from "next/server";
import { processIngestionPipeline } from "@/lib/pipeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      kioskId = "KIOSK-WARDHA-01",
      action = "RECORD", // RECORD, PHOTO, DOCUMENT
      transcription,
      title,
      description,
      imageUrl,
      latitude = 20.7453,
      longitude = 78.6022,
      reporterName = "Village Kiosk Citizen",
    } = body;

    let finalTitle = title;
    let finalDesc = description;

    if (!finalTitle) {
      if (action === "RECORD") {
        finalTitle = "Audio Grievance via Village Assisted Kiosk";
        finalDesc =
          transcription ||
          "Citizen voice report recorded at physical kiosk: High water pressure cracked the underground valve near Panchayat building.";
      } else if (action === "PHOTO") {
        finalTitle = "Photo Evidence submitted via Assisted Kiosk";
        finalDesc =
          transcription ||
          "High-resolution camera snapshot captured of dangerous open electrical transformer next to bus stop.";
      } else {
        finalTitle = "Citizen Grievance Document scanned at Kiosk";
        finalDesc =
          transcription ||
          "Official written representation scanned by citizen regarding delay in desilting village drainage canal.";
      }
    }

    const result = await processIngestionPipeline({
      title: finalTitle,
      description: finalDesc,
      reporterName: `${reporterName} (${kioskId})`,
      reporterPhone: "Kiosk-Assisted",
      latitude: Number(latitude),
      longitude: Number(longitude),
      address: "Gram Panchayat Assisted Terminal, Wardha",
      evidenceType: action === "RECORD" ? "AUDIO" : action === "PHOTO" ? "IMAGE" : "DOCUMENT",
      evidenceUrl:
        imageUrl ||
        (action === "PHOTO"
          ? "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80"
          : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"),
    });

    return NextResponse.json({
      success: true,
      message: `Assisted Kiosk [${action}] processed successfully`,
      kioskId,
      action,
      data: result.problem,
      duplicatesFound: result.duplicateResult.isDuplicateFound,
      duplicateMatches: result.duplicateResult.matches,
      priorityScore: result.priorityResult.totalScore,
    });
  } catch (error) {
    console.error("Failed to process kiosk submission:", error);
    return NextResponse.json(
      { success: false, error: "Kiosk ingestion failed" },
      { status: 500 }
    );
  }
}
