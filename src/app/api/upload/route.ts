import { NextRequest, NextResponse } from "next/server";
import {
  saveUploadedFile,
  deleteUploadedFile,
  validateFile,
  FILE_LIMITS,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract files from formData - accept both "files" (multiple) and "file" (single)
    const rawFiles: File[] = [];
    const filesList = formData.getAll("files");
    const singleFile = formData.get("file");

    if (filesList.length > 0) {
      for (const item of filesList) {
        if (item instanceof File) {
          rawFiles.push(item);
        }
      }
    } else if (singleFile instanceof File) {
      rawFiles.push(singleFile);
    }

    if (rawFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files were provided in upload request." },
        { status: 400 }
      );
    }

    if (rawFiles.length > FILE_LIMITS.MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: `You can upload a maximum of ${FILE_LIMITS.MAX_FILES} files per grievance.`,
        },
        { status: 400 }
      );
    }

    // Calculate total combined size
    let totalSize = 0;
    for (const f of rawFiles) {
      totalSize += f.size;
    }

    if (totalSize > FILE_LIMITS.TOTAL_MAX_SIZE) {
      const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          success: false,
          error: `Total upload size (${totalMB} MB) exceeds the 100 MB maximum limit per grievance.`,
        },
        { status: 400 }
      );
    }

    // Validate each file before saving any to avoid partial writes
    for (const file of rawFiles) {
      const validation = validateFile(file.name, file.size, file.type);
      if (!validation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: `Validation failed for "${file.name}": ${validation.error}`,
          },
          { status: 400 }
        );
      }
    }

    // Save files
    const savedFiles = [];
    for (const file of rawFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const stored = await saveUploadedFile(buffer, file.name, file.type);

      savedFiles.push({
        storageKey: stored.storageKey,
        originalName: stored.originalName,
        fileSize: stored.fileSize,
        mimeType: stored.mimeType,
        category: stored.category,
        fileUrl: stored.fileUrl,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${savedFiles.length} file(s)`,
      files: savedFiles,
    });
  } catch (error: any) {
    console.error("[Upload] Error processing file upload:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during file upload.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Missing 'key' query parameter." },
        { status: 400 }
      );
    }

    const removed = await deleteUploadedFile(key);
    return NextResponse.json({
      success: true,
      removed,
      message: removed ? "File deleted from storage." : "File not found or already deleted.",
    });
  } catch (error: any) {
    console.error("[Upload] Error deleting file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete file from storage." },
      { status: 500 }
    );
  }
}
