import { NextRequest, NextResponse } from "next/server";
import { defaultLocationProvider } from "@/lib/geotag/location-provider";
import { MediaType } from "@/lib/geotag/types";
import { reverseGeocodeCoordinates } from "@/lib/geocoding";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/tiff",
  "image/heic",
  "image/heif",
]);

const ALLOWED_VIDEO_MIME = new Set([
  "video/mp4",
  "video/quicktime",
  "video/x-m4v",
  "video/3gpp",
  "video/webm",
  "application/mp4",
]);

const ALLOWED_IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".heic", ".heif"]);
const ALLOWED_VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".3gp", ".webm"]);

function getExtension(name: string): string {
  const lastDot = name.lastIndexOf(".");
  return lastDot !== -1 ? name.slice(lastDot).toLowerCase() : "";
}

function detectMediaType(mime: string, ext: string): MediaType | null {
  if (ALLOWED_IMAGE_MIME.has(mime) || ALLOWED_IMAGE_EXT.has(ext) || mime.startsWith("image/")) {
    return "image";
  }
  if (ALLOWED_VIDEO_MIME.has(mime) || ALLOWED_VIDEO_EXT.has(ext) || mime.startsWith("video/")) {
    return "video";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch((err) => {
      console.warn("[MediaGeotag] Failed to parse formData:", err);
      return null;
    });

    if (!formData) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request. Must be multipart/form-data with a 'media' or 'file' field.",
        },
        { status: 400 }
      );
    }

    // Support candidate keys: 'media', 'file', 'image', 'video', 'evidence'
    let file: File | null = null;
    const candidateKeys = ["media", "file", "video", "image", "evidence", "attachment"];
    for (const key of candidateKeys) {
      const item = formData.get(key);
      if (item && typeof item === "object" && typeof (item as File).arrayBuffer === "function") {
        file = item as File;
        break;
      }
    }

    // Fallback: iterate all entries
    if (!file) {
      for (const [, val] of formData.entries()) {
        if (val && typeof val === "object" && typeof (val as any).arrayBuffer === "function") {
          file = val as File;
          break;
        }
      }
    }

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No media file provided. Please upload an image or video under the 'media' or 'file' field.",
        },
        { status: 400 }
      );
    }

    // 1. Check empty file
    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The uploaded file is empty (0 bytes).",
        },
        { status: 400 }
      );
    }

    const ext = getExtension(file.name);
    const mime = (file.type || "").toLowerCase();
    const mediaType = detectMediaType(mime, ext);

    if (!mediaType) {
      return NextResponse.json(
        {
          success: false,
          unsupportedFormat: true,
          error: `Unsupported media format "${file.name}". Supported formats: Images (JPG, JPEG, PNG, WebP) and Videos (MP4, MOV, M4V).`,
        },
        { status: 400 }
      );
    }

    // 2. Check size limit based on mediaType
    const maxSize = mediaType === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const maxSizeMB = mediaType === "video" ? 50 : 15;

    if (file.size > maxSize) {
      const fileMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          success: false,
          error: `${mediaType === "video" ? "Video" : "Image"} file size (${fileMB} MB) exceeds the maximum allowed limit of ${maxSizeMB} MB.`,
        },
        { status: 400 }
      );
    }

    // 3. Buffer inspection & Magic Bytes Check
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length < 32) {
      return NextResponse.json(
        {
          success: false,
          error: "The uploaded file is corrupted or too small to be valid media.",
        },
        { status: 400 }
      );
    }

    // Verify magic bytes
    let isValidHeader = false;
    if (mediaType === "image") {
      const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
      const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      const isWebp = buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
      const isTiff =
        (buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2a && buffer[3] === 0x00) ||
        (buffer[0] === 0x4d && buffer[1] === 0x4d && buffer[2] === 0x00 && buffer[3] === 0x2a);
      isValidHeader = isJpeg || isPng || isWebp || isTiff;
    } else if (mediaType === "video") {
      // MP4/MOV container check: box header has 'ftyp', 'moov', 'wide', 'mdat', 'skip'
      const tag = buffer.toString("latin1", 4, 8);
      const isIsoContainer = ["ftyp", "moov", "mdat", "wide", "skip", "free"].includes(tag);
      const isWebm = buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3;
      isValidHeader = isIsoContainer || isWebm;
    }

    if (!isValidHeader) {
      return NextResponse.json(
        {
          success: false,
          error: `The uploaded ${mediaType} file is not a valid media file or the header is corrupted.`,
        },
        { status: 400 }
      );
    }

    // 4. Extract GPS and Metadata using EmbeddedMetadataLocationProvider
    const result = await defaultLocationProvider.getLocation({
      buffer,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || (mediaType === "video" ? "video/mp4" : "image/jpeg"),
      mediaType,
    });

    // 5. If no GPS data present
    if (!result.hasGpsData || result.latitude === undefined || result.longitude === undefined) {
      return NextResponse.json({
        success: true,
        hasGpsData: false,
        mediaType,
        message: result.message || `No GPS location data found in this ${mediaType}.`,
        details: result.details || `The ${mediaType} does not contain embedded GPS metadata. Location cannot be determined from media metadata.`,
        duration: result.duration || null,
        width: result.width || null,
        height: result.height || null,
        capturedAt: result.capturedAt || null,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || (mediaType === "video" ? "video/mp4" : "image/jpeg"),
      });
    }

    // 6. Perform Reverse Geocoding with Fallback Resilience
    const lat = result.latitude;
    const lng = result.longitude;

    let locationName = "Location name temporarily unavailable.";
    let city: string | null = null;
    let district: string | null = null;
    let state: string | null = null;
    let country: string | null = null;

    try {
      const geoResult = await reverseGeocodeCoordinates(lat, lng);
      if (geoResult && geoResult.success) {
        locationName = geoResult.formattedAddress;
        city = geoResult.address.city || geoResult.address.locality;
        district = geoResult.address.district;
        state = geoResult.address.state;
        country = geoResult.address.country;
      }
    } catch (geoErr) {
      console.warn("[MediaGeotag] Reverse geocode error (retaining valid coordinates):", geoErr);
      // Valid coordinates are kept even if reverse geocoding is temporarily unavailable
    }

    // 7. Structured Response according to Section 7 specification
    return NextResponse.json({
      success: true,
      hasGpsData: true,
      mediaType,
      latitude: lat,
      longitude: lng,
      altitude: result.altitude ?? null,
      heading: result.heading ?? null,
      capturedAt: result.capturedAt ?? null,
      dmsLatitude: result.dmsLatitude,
      dmsLongitude: result.dmsLongitude,
      locationName,
      city: city || district || null,
      district: district || null,
      state: state || null,
      country: country || null,
      source: mediaType === "video" ? "embedded_metadata" : "EXIF",
      duration: result.duration || null,
      width: result.width || null,
      height: result.height || null,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || (mediaType === "video" ? "video/mp4" : "image/jpeg"),
    });
  } catch (error: any) {
    console.error("[MediaGeotag] Internal server error processing media:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unexpected error occurred while processing media geotag metadata.",
      },
      { status: 500 }
    );
  }
}
