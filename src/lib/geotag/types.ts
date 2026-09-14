export type MediaType = "image" | "video";

export interface GeotagLocationResult {
  hasGpsData: boolean;
  mediaType: MediaType;
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
  heading?: number | null;
  capturedAt?: string | null;
  dmsLatitude?: string;
  dmsLongitude?: string;
  locationName?: string;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  source: "embedded_metadata" | "EXIF";
  message?: string;
  details?: string;
  duration?: number | null; // For video, duration in seconds
  width?: number | null;
  height?: number | null;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  rawTags?: Record<string, any>;
}

/**
 * Validates geographic coordinate limits:
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

  // Filter out exact (0, 0) placeholder "Null Island"
  if (Math.abs(latitude) < 0.000001 && Math.abs(longitude) < 0.000001) {
    return false;
  }

  return true;
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
 * Parses ISO 6709 location strings commonly embedded in MP4 / QuickTime videos.
 *
 * Supported ISO 6709 representations:
 * 1. Decimal degrees: "+28.6139+077.2090/" or "+28.6139+077.2090+215.000/"
 * 2. Degrees and Minutes: "+2836.5+07712.5/"
 * 3. Degrees, Minutes, Seconds: "+283650+0771232/" or "+283650.0+0771232.0/"
 */
export function parseIso6709(raw: string): { latitude: number; longitude: number; altitude?: number } | null {
  if (!raw || typeof raw !== "string") return null;

  // Clean trailing nulls, slashes, whitespace
  const str = raw.trim().replace(/\0/g, "");
  if (str.length < 6) return null;

  // Pattern 1: Decimal degrees: ±DD.DDDD±DDD.DDDD[±AAA.AAA]/
  // Example: "+28.6139+077.2090+215.000/"
  const decimalMatch = str.match(/^([+-]\d{2}(?:\.\d+)?)([+-]\d{3}(?:\.\d+)?)(?:([+-]\d+(?:\.\d+)?))?\/?/);
  if (decimalMatch && (decimalMatch[1].includes(".") || decimalMatch[2].includes("."))) {
    const lat = parseFloat(decimalMatch[1]);
    const lng = parseFloat(decimalMatch[2]);
    const alt = decimalMatch[3] ? parseFloat(decimalMatch[3]) : undefined;
    if (isValidCoordinate(lat, lng)) {
      return { latitude: lat, longitude: lng, altitude: alt };
    }
  }

  // Pattern 2: Degrees, Minutes, Seconds (DDMMSS.SS): ±DDMMSS±DDDMMSS[±AAA.AAA]/
  // Example: "+283650+0771232/" => 28° 36' 50" N, 77° 12' 32" E
  const dmsMatch = str.match(/^([+-]\d{2})(\d{2})(\d{2}(?:\.\d+)?)([+-]\d{3})(\d{2})(\d{2}(?:\.\d+)?)(?:([+-]\d+(?:\.\d+)?))?\/?/);
  if (dmsMatch) {
    const latSign = dmsMatch[1].startsWith("-") ? -1 : 1;
    const latDeg = parseInt(dmsMatch[1].slice(1), 10);
    const latMin = parseInt(dmsMatch[2], 10);
    const latSec = parseFloat(dmsMatch[3]);
    const lat = latSign * (latDeg + latMin / 60 + latSec / 3600);

    const lngSign = dmsMatch[4].startsWith("-") ? -1 : 1;
    const lngDeg = parseInt(dmsMatch[4].slice(1), 10);
    const lngMin = parseInt(dmsMatch[5], 10);
    const lngSec = parseFloat(dmsMatch[6]);
    const lng = lngSign * (lngDeg + lngMin / 60 + lngSec / 3600);

    const alt = dmsMatch[7] ? parseFloat(dmsMatch[7]) : undefined;
    if (isValidCoordinate(lat, lng)) {
      return { latitude: lat, longitude: lng, altitude: alt };
    }
  }

  // Pattern 3: Degrees and Decimal Minutes (DDMM.MM): ±DDMM.MM±DDDMM.MM[±AAA.AAA]/
  const dmMatch = str.match(/^([+-]\d{2})(\d{2}(?:\.\d+)?)([+-]\d{3})(\d{2}(?:\.\d+)?)(?:([+-]\d+(?:\.\d+)?))?\/?/);
  if (dmMatch) {
    const latSign = dmMatch[1].startsWith("-") ? -1 : 1;
    const latDeg = parseInt(dmMatch[1].slice(1), 10);
    const latMin = parseFloat(dmMatch[2]);
    const lat = latSign * (latDeg + latMin / 60);

    const lngSign = dmMatch[3].startsWith("-") ? -1 : 1;
    const lngDeg = parseInt(dmMatch[3].slice(1), 10);
    const lngMin = parseFloat(dmMatch[4]);
    const lng = lngSign * (lngDeg + lngMin / 60);

    const alt = dmMatch[5] ? parseFloat(dmMatch[5]) : undefined;
    if (isValidCoordinate(lat, lng)) {
      return { latitude: lat, longitude: lng, altitude: alt };
    }
  }

  // Pattern 4: Fallback for loose integer decimal format: "+28+077/"
  if (decimalMatch) {
    const lat = parseFloat(decimalMatch[1]);
    const lng = parseFloat(decimalMatch[2]);
    const alt = decimalMatch[3] ? parseFloat(decimalMatch[3]) : undefined;
    if (isValidCoordinate(lat, lng)) {
      return { latitude: lat, longitude: lng, altitude: alt };
    }
  }

  return null;
}

/**
 * Normalizes date representations into an ISO-8601 string.
 */
export function parseMediaDate(rawDate: any): string | undefined {
  if (!rawDate) return undefined;

  try {
    if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
      return rawDate.toISOString();
    }

    if (typeof rawDate === "string") {
      const match = rawDate.match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        const [, y, m, d, hh, mm, ss] = match;
        const parsed = new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}Z`);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
      }

      const direct = new Date(rawDate);
      if (!isNaN(direct.getTime())) {
        return direct.toISOString();
      }
    }

    if (typeof rawDate === "number" && rawDate > 0) {
      // QuickTime / MP4 epoch: seconds since Jan 1, 1904 UTC
      // Unix epoch starts Jan 1, 1970 UTC (offset = 2082844800 seconds)
      const MP4_EPOCH_OFFSET = 2082844800;
      if (rawDate > MP4_EPOCH_OFFSET) {
        const unixMs = (rawDate - MP4_EPOCH_OFFSET) * 1000;
        const d = new Date(unixMs);
        if (!isNaN(d.getTime())) {
          return d.toISOString();
        }
      } else if (rawDate > 1000000000) {
        // Standard Unix timestamp in seconds
        return new Date(rawDate * 1000).toISOString();
      }
    }
  } catch {
    // Non-critical date parse fallback
  }

  return undefined;
}
