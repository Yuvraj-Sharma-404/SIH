import exifr from "exifr";
import {
  GeotagLocationResult,
  dmsToDecimal,
  decimalToDms,
  isValidCoordinate,
  parseMediaDate,
} from "./types";

/**
 * Extracts embedded EXIF GPS and capture metadata from image buffers.
 * Supported formats: JPG, JPEG, PNG (eXIf chunks / XMP), WebP (VP8X EXIF), TIFF, HEIC.
 */
export async function extractImageGps(
  buffer: Buffer | Uint8Array,
  fileName?: string,
  fileSize?: number,
  mimeType?: string
): Promise<GeotagLocationResult> {
  const baseResult: GeotagLocationResult = {
    hasGpsData: false,
    mediaType: "image",
    source: "EXIF",
    fileName,
    fileSize: fileSize || buffer.length,
    mimeType: mimeType || "image/jpeg",
  };

  try {
    if (!buffer || buffer.length < 32) {
      return {
        ...baseResult,
        message: "The image file is corrupted or too small to be a valid image.",
        details: "Image payload buffer is smaller than minimum required header bytes.",
      };
    }

    // Parse EXIF, GPS, TIFF and XMP chunks
    const parsed = await exifr.parse(buffer, {
      tiff: true,
      xmp: true,
      gps: true,
      reviveValues: true,
      sanitize: true,
      translateKeys: true,
      translateValues: false,
    }).catch(() => null);

    if (!parsed) {
      return {
        ...baseResult,
        message: "No GPS location data found in this image.",
        details: "The image does not contain embedded GPS metadata. Location cannot be determined from EXIF data.",
      };
    }

    // 1. Latitude and Longitude extraction
    let latitude: number | null = null;
    let longitude: number | null = null;

    if (typeof parsed.latitude === "number" && typeof parsed.longitude === "number") {
      latitude = parsed.latitude;
      longitude = parsed.longitude;
    } else {
      const rawLat = parsed.GPSLatitude ?? parsed.latitude;
      const rawLatRef = parsed.GPSLatitudeRef ?? (parsed.latitude && parsed.latitude < 0 ? "S" : "N");
      const rawLng = parsed.GPSLongitude ?? parsed.longitude;
      const rawLngRef = parsed.GPSLongitudeRef ?? (parsed.longitude && parsed.longitude < 0 ? "W" : "E");

      latitude = dmsToDecimal(rawLat, rawLatRef);
      longitude = dmsToDecimal(rawLng, rawLngRef);
    }

    // 2. Altitude extraction
    let altitude: number | null = null;
    if (parsed.GPSAltitude !== undefined && parsed.GPSAltitude !== null) {
      const altVal = Number(parsed.GPSAltitude);
      if (Number.isFinite(altVal)) {
        // AltitudeRef = 1 indicates below sea level
        altitude = parsed.GPSAltitudeRef === 1 || parsed.GPSAltitudeRef === "1" ? -Math.abs(altVal) : Math.abs(altVal);
        altitude = Math.round(altitude * 100) / 100;
      }
    }

    // 3. Compass Heading / Direction (GPSImgDirection)
    let heading: number | null = null;
    if (parsed.GPSImgDirection !== undefined && parsed.GPSImgDirection !== null) {
      const headVal = Number(parsed.GPSImgDirection);
      if (Number.isFinite(headVal) && headVal >= 0 && headVal <= 360) {
        heading = Math.round(headVal * 10) / 10;
      }
    }

    // 4. Capture Timestamp (DateTimeOriginal or CreateDate)
    const capturedAt = parseMediaDate(parsed.DateTimeOriginal || parsed.CreateDate || parsed.ModifyDate);

    // 5. Image Dimensions
    const width = parsed.ImageWidth || parsed.ExifImageWidth || undefined;
    const height = parsed.ImageHeight || parsed.ExifImageHeight || undefined;

    // 6. Validate coordinates
    if (latitude !== null && longitude !== null && isValidCoordinate(latitude, longitude)) {
      const latRounded = Math.round(latitude * 1000000) / 1000000;
      const lngRounded = Math.round(longitude * 1000000) / 1000000;

      return {
        ...baseResult,
        hasGpsData: true,
        latitude: latRounded,
        longitude: lngRounded,
        altitude,
        heading,
        capturedAt: capturedAt || null,
        dmsLatitude: decimalToDms(latRounded, true),
        dmsLongitude: decimalToDms(lngRounded, false),
        width: width || null,
        height: height || null,
        rawTags: {
          GPSLatitude: parsed.GPSLatitude,
          GPSLatitudeRef: parsed.GPSLatitudeRef,
          GPSLongitude: parsed.GPSLongitude,
          GPSLongitudeRef: parsed.GPSLongitudeRef,
          GPSAltitude: parsed.GPSAltitude,
          GPSImgDirection: parsed.GPSImgDirection,
          DateTimeOriginal: parsed.DateTimeOriginal,
        },
      };
    }

    return {
      ...baseResult,
      message: "No GPS location data found in this image.",
      details: "The image does not contain embedded GPS metadata. Location cannot be determined from EXIF data.",
    };
  } catch (error: any) {
    return {
      ...baseResult,
      message: "Failed to extract metadata from image.",
      details: error?.message || "Corrupted or unsupported format.",
    };
  }
}
