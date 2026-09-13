import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getUploadedFilePath } from "@/lib/storage";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    if (!rawId) {
      return new NextResponse("Attachment ID missing", { status: 400 });
    }

    // Try finding by direct storage key or database Evidence ID
    let storageKey = path.basename(rawId);
    let originalName = storageKey;
    let mimeType = "application/octet-stream";

    // Check if rawId is a database Evidence record
    try {
      const dbEvidence = await prisma.evidence.findUnique({
        where: { id: rawId },
      });
      if (dbEvidence) {
        if (dbEvidence.fileUrl.startsWith("/api/attachments/")) {
          storageKey = path.basename(dbEvidence.fileUrl.replace("/api/attachments/", ""));
        } else if (dbEvidence.fileUrl.startsWith("http://") || dbEvidence.fileUrl.startsWith("https://")) {
          // If legacy external URL, redirect directly
          return NextResponse.redirect(dbEvidence.fileUrl);
        }
        if (dbEvidence.fileName) originalName = dbEvidence.fileName;
        if (dbEvidence.mimeType) mimeType = dbEvidence.mimeType;
      }
    } catch {
      // Ephemeral / pre-submit query before problem creation
    }

    const filePath = getUploadedFilePath(storageKey);
    if (!filePath || !fs.existsSync(filePath)) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileBuffer = await fs.promises.readFile(filePath);

    // Determine mimeType from extension if generic
    const ext = path.extname(storageKey).toLowerCase();
    if (mimeType === "application/octet-stream") {
      switch (ext) {
        case ".jpg":
        case ".jpeg":
          mimeType = "image/jpeg";
          break;
        case ".png":
          mimeType = "image/png";
          break;
        case ".webp":
          mimeType = "image/webp";
          break;
        case ".mp4":
          mimeType = "video/mp4";
          break;
        case ".mov":
          mimeType = "video/quicktime";
          break;
        case ".webm":
          mimeType = "video/webm";
          break;
        case ".pdf":
          mimeType = "application/pdf";
          break;
        case ".doc":
          mimeType = "application/msword";
          break;
        case ".docx":
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case ".mp3":
          mimeType = "audio/mpeg";
          break;
        case ".wav":
          mimeType = "audio/wav";
          break;
        case ".m4a":
          mimeType = "audio/mp4";
          break;
      }
    }

    const safeAsciiName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stat.size.toString(),
        "Content-Disposition": `inline; filename="${safeAsciiName}"`,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch (error: any) {
    console.error("[AttachmentStream] Error serving attachment:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
