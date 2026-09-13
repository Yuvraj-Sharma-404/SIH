import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const STORAGE_DIR = path.join(process.cwd(), "storage", "uploads");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  try {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  } catch (err) {
    console.error("[Storage] Failed to initialize storage directory:", err);
  }
}

export const FILE_LIMITS = {
  IMAGE: 10 * 1024 * 1024,      // 10 MB
  VIDEO: 50 * 1024 * 1024,      // 50 MB
  DOCUMENT: 10 * 1024 * 1024,   // 10 MB
  AUDIO: 20 * 1024 * 1024,      // 20 MB
  MAX_FILES: 10,
  TOTAL_MAX_SIZE: 100 * 1024 * 1024, // 100 MB
};

export type EvidenceCategory = "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";

interface CategoryDefinition {
  extensions: string[];
  mimeTypes: string[];
  maxSize: number;
}

export const ALLOWED_CATEGORIES: Record<EvidenceCategory, CategoryDefinition> = {
  IMAGE: {
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: FILE_LIMITS.IMAGE,
  },
  VIDEO: {
    extensions: [".mp4", ".mov", ".webm"],
    mimeTypes: ["video/mp4", "video/quicktime", "video/webm"],
    maxSize: FILE_LIMITS.VIDEO,
  },
  DOCUMENT: {
    extensions: [".pdf", ".doc", ".docx"],
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxSize: FILE_LIMITS.DOCUMENT,
  },
  AUDIO: {
    extensions: [".mp3", ".wav", ".m4a", ".webm"],
    mimeTypes: [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/wave",
      "audio/mp4",
      "audio/x-m4a",
      "audio/webm",
      "audio/ogg",
    ],
    maxSize: FILE_LIMITS.AUDIO,
  },
};

const DANGEROUS_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".php", ".phtml", ".pl", ".cgi",
  ".py", ".rb", ".js", ".jsx", ".ts", ".tsx", ".html", ".htm", ".svg",
  ".jar", ".vbs", ".msi", ".dll", ".scr", ".com", ".cpl", ".reg", ".ps1"
]);

export interface ValidationResult {
  valid: boolean;
  category?: EvidenceCategory;
  error?: string;
}

export function validateFile(fileName: string, fileSize: number, mimeType: string): ValidationResult {
  const ext = path.extname(fileName).toLowerCase();

  if (!ext || DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `File type "${ext || "unknown"}" is not permitted for security reasons.`,
    };
  }

  // Identify matching category
  let matchedCategory: EvidenceCategory | undefined;

  for (const [cat, def] of Object.entries(ALLOWED_CATEGORIES)) {
    const extMatch = def.extensions.includes(ext);
    const mimeMatch = def.mimeTypes.some(
      (m) => m.toLowerCase() === mimeType.toLowerCase() || mimeType.toLowerCase().startsWith(m.split("/")[0] + "/")
    );

    if (extMatch || mimeMatch) {
      matchedCategory = cat as EvidenceCategory;
      break;
    }
  }

  if (!matchedCategory) {
    return {
      valid: false,
      error: `Unsupported file type: "${ext}". Supported types: JPG, PNG, WEBP, MP4, MOV, PDF, DOC, DOCX, MP3, WAV, M4A.`,
    };
  }

  const limit = ALLOWED_CATEGORIES[matchedCategory].maxSize;
  const limitMB = Math.round(limit / (1024 * 1024));

  if (fileSize > limit) {
    const sizeMB = (fileSize / (1024 * 1024)).toFixed(1);
    const categoryName =
      matchedCategory === "IMAGE"
        ? "Photo"
        : matchedCategory === "VIDEO"
        ? "Video"
        : matchedCategory === "DOCUMENT"
        ? "Document"
        : "Audio";

    return {
      valid: false,
      error: `This ${categoryName.toLowerCase()} (${sizeMB} MB) exceeds the maximum allowed limit of ${limitMB} MB.`,
    };
  }

  return { valid: true, category: matchedCategory };
}

export interface StoredFile {
  storageKey: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  category: EvidenceCategory;
  fileUrl: string;
  storedPath: string;
}

export async function saveUploadedFile(
  buffer: Buffer,
  originalFilename: string,
  clientMimeType: string
): Promise<StoredFile> {
  const ext = path.extname(originalFilename).toLowerCase();
  const validation = validateFile(originalFilename, buffer.length, clientMimeType);

  if (!validation.valid || !validation.category) {
    throw new Error(validation.error || "File validation failed.");
  }

  // Generate safe cryptographically random filename
  const storageKey = `${randomUUID()}${ext}`;
  const storedPath = path.join(STORAGE_DIR, storageKey);

  await fs.promises.writeFile(storedPath, buffer);

  return {
    storageKey,
    originalName: path.basename(originalFilename),
    fileSize: buffer.length,
    mimeType: clientMimeType || "application/octet-stream",
    category: validation.category,
    fileUrl: `/api/attachments/${storageKey}`,
    storedPath,
  };
}

export async function deleteUploadedFile(storageKey: string): Promise<boolean> {
  // Prevent directory traversal
  const safeKey = path.basename(storageKey);
  const filePath = path.join(STORAGE_DIR, safeKey);

  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (err) {
    console.error(`[Storage] Failed to delete file ${storageKey}:`, err);
  }
  return false;
}

export function getUploadedFilePath(storageKey: string): string | null {
  const safeKey = path.basename(storageKey);
  const filePath = path.join(STORAGE_DIR, safeKey);

  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}
