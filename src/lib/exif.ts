import exifr from "exifr";

export interface ExifGpsResult {
  hasGpsData: boolean;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  capturedAt?: string; // ISO 8601 string
  dmsLatitude?: string;
  dmsLongitude?: string;
  source: string;
  details?: string;
  rawGps?: {
    GPSLatitude?: any;
    GPSLatitudeRef?: string;
    GPSLongitude?: any;
    GPSLongitudeRef?: string;
    GPSAltitude?: number;
    GPSAltitudeRef?: any;
    DateTimeOriginal?: any;
  };
}

/**
 * Converts Degrees, Minutes, Seconds (DMS) to Decimal Degrees.
 * Formula: decimal = degrees + (minutes / 60) + (seconds / 3600)
 * Applies negative multiplier if reference is South (S) or West (W).
 */
export function dmsToDecimal(
  coord: number | number[] | { degrees?: number; minutes?: number; seconds?: number } | null | undefined,
  ref?: string | null
): number | null {
  if (coord === null || coord === undefined) return null;

  let decimal: number;

  if (typeof coord === "number") {
    decimal = coord;
  } else if (Array.isArray(coord)) {
    if (coord.length === 0) return null;
    const deg = Number(coord[0]) || 0;
    const min = Number(coord[1]) || 0;
    const sec = Number(coord[2]) || 0;
    decimal = deg + min / 60 + sec / 3600;
  } else if (typeof coord === "object") {
    const deg = Number(coord.degrees) || 0;
    const min = Number(coord.minutes) || 0;
    const sec = Number(coord.seconds) || 0;
    decimal = deg + min / 60 + sec / 3600;
  } else {
    return null;
  }

  if (isNaN(decimal) || !Number.isFinite(decimal)) return null;

  // Apply hemispheric direction if provided
  if (ref) {
    const cleanRef = String(ref).trim().toUpperCase();
    if (cleanRef === "S" || cleanRef === "W") {
      decimal = -Math.abs(decimal);
    } else if (cleanRef === "N" || cleanRef === "E") {
      decimal = Math.abs(decimal);
    }
  }

  return decimal;
}

/**
 * Formats a decimal degree coordinate into standard DMS notation.
 * Example: 28.6139 => 28°36'50"N
 */
export function decimalToDms(decimal: number, isLatitude: boolean): string {
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesWithDecimals = (abs - degrees) * 60;
  const minutes = Math.floor(minutesWithDecimals);
  const seconds = Math.round((minutesWithDecimals - minutes) * 60);

  let direction = "";
  if (isLatitude) {
    direction = decimal >= 0 ? "N" : "S";
  } else {
    direction = decimal >= 0 ? "E" : "W";
  }

  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

/**
 * Validates coordinate limits:
 * - Latitude: -90 to +90
 * - Longitude: -180 to +180
 * Also filters out (0.0, 0.0) placeholder coordinates from uncalibrated GPS receivers.
 */
export function isValidCoordinate(latitude: number, longitude: number): boolean {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    return false;
  }

  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;

  // Reject exact 0,0 Null Island (standard EXIF uncalibrated/unlocked dummy fix)
  if (Math.abs(latitude) < 0.000001 && Math.abs(longitude) < 0.000001) {
    return false;
  }

  return true;
}

/**
 * Normalizes EXIF date representations into an ISO-8601 string.
 * EXIF dates often come as "YYYY:MM:DD HH:MM:SS".
 */
export function parseExifDate(rawDate: any): string | undefined {
  if (!rawDate) return undefined;

  try {
    if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
      return rawDate.toISOString();
    }

    if (typeof rawDate === "string") {
      // Handle standard EXIF format: "YYYY:MM:DD HH:MM:SS"
      const match = rawDate.match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        const [, y, m, d, hh, mm, ss] = match;
        const parsed = new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}`);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
      }

      const direct = new Date(rawDate);
      if (!isNaN(direct.getTime())) {
        return direct.toISOString();
      }
    }
  } catch (err) {
    // Non-critical: suppress date parse failures
  }

  return undefined;
}

/**
 * Primary EXIF extraction routine for image Buffers or Uint8Arrays.
 * Supports JPEG, WebP, PNG, TIFF, HEIC.
 */
export async function extractExifGps(imageBuffer: Buffer | Uint8Array): Promise<ExifGpsResult> {
  try {
    if (!imageBuffer || imageBuffer.length < 16) {
      return {
        hasGpsData: false,
        source: "EXIF",
        details: "Image file is too small or truncated.",
      };
    }

    // 1. First attempt to extract high-level GPS coordinates and tags via exifr
    const parsed = await exifr.parse(imageBuffer, {
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
        hasGpsData: false,
        source: "EXIF",
        details: "The image does not contain embedded GPS metadata. Location cannot be determined from EXIF data.",
      };
    }

    // 2. Look for latitude and longitude
    let latitude: number | null = null;
    let longitude: number | null = null;
    let altitude: number | undefined = undefined;

    // Check if exifr already computed decimal latitude and longitude
    if (typeof parsed.latitude === "number" && typeof parsed.longitude === "number") {
      latitude = parsed.latitude;
      longitude = parsed.longitude;
    } else {
      // Manually calculate from GPSLatitude / GPSLongitude and Ref tags
      const rawLat = parsed.GPSLatitude ?? parsed.latitude;
      const rawLatRef = parsed.GPSLatitudeRef ?? (parsed.latitude && parsed.latitude < 0 ? "S" : "N");
      const rawLng = parsed.GPSLongitude ?? parsed.longitude;
      const rawLngRef = parsed.GPSLongitudeRef ?? (parsed.longitude && parsed.longitude < 0 ? "W" : "E");

      latitude = dmsToDecimal(rawLat, rawLatRef);
      longitude = dmsToDecimal(rawLng, rawLngRef);
    }

    // 3. Extract Altitude
    if (parsed.GPSAltitude !== undefined && parsed.GPSAltitude !== null) {
      let altVal = Number(parsed.GPSAltitude);
      if (Number.isFinite(altVal)) {
        // If GPSAltitudeRef is 1, altitude is below sea level (negative)
        if (parsed.GPSAltitudeRef === 1 || parsed.GPSAltitudeRef === "1") {
          altVal = -Math.abs(altVal);
        }
        altitude = Math.round(altVal * 100) / 100;
      }
    }

    // 4. Extract Timestamp (DateTimeOriginal or CreateDate)
    const capturedAt = parseExifDate(parsed.DateTimeOriginal || parsed.CreateDate || parsed.ModifyDate);

    // 5. Check if valid GPS coordinates were successfully retrieved
    if (latitude !== null && longitude !== null && isValidCoordinate(latitude, longitude)) {
      // Normalize precision to 6 decimal places (~0.11m precision)
      const latRounded = Math.round(latitude * 1000000) / 1000000;
      const lngRounded = Math.round(longitude * 1000000) / 1000000;

      return {
        hasGpsData: true,
        latitude: latRounded,
        longitude: lngRounded,
        altitude,
        capturedAt,
        dmsLatitude: decimalToDms(latRounded, true),
        dmsLongitude: decimalToDms(lngRounded, false),
        source: "EXIF",
        rawGps: {
          GPSLatitude: parsed.GPSLatitude,
          GPSLatitudeRef: parsed.GPSLatitudeRef,
          GPSLongitude: parsed.GPSLongitude,
          GPSLongitudeRef: parsed.GPSLongitudeRef,
          GPSAltitude: parsed.GPSAltitude,
          GPSAltitudeRef: parsed.GPSAltitudeRef,
          DateTimeOriginal: parsed.DateTimeOriginal,
        },
      };
    }

    return {
      hasGpsData: false,
      source: "EXIF",
      details: "The image does not contain embedded GPS metadata. Location cannot be determined from EXIF data.",
    };
  } catch (error: any) {
    return {
      hasGpsData: false,
      source: "EXIF",
      details: `Failed to extract metadata: ${error?.message || "Corrupted or unreadable format"}`,
    };
  }
}
