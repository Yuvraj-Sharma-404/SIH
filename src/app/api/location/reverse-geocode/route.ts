import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface GeocodedAddress {
  locality?: string;
  landmark?: string;
  district?: string;
  state?: string;
  country?: string;
  postcode?: string;
  rawDisplayName?: string;
}

/**
 * Formats structured location components into a clean, human-readable string.
 * Example: "Seloo, Wardha, Maharashtra" or "Raisina Hill, New Delhi, Delhi"
 */
function buildFormattedAddress(addr: GeocodedAddress): string {
  const parts: string[] = [];

  // 1. Landmark or Road (if meaningful)
  if (addr.landmark && addr.landmark !== addr.locality) {
    parts.push(addr.landmark);
  }

  // 2. Village, Suburb, Town, or Locality
  if (addr.locality && !parts.includes(addr.locality)) {
    parts.push(addr.locality);
  }

  // 3. District / County
  if (addr.district && !parts.includes(addr.district)) {
    parts.push(addr.district);
  }

  // 4. State
  if (addr.state && !parts.includes(addr.state)) {
    parts.push(addr.state);
  }

  // If we collected distinct parts, join them cleanly
  if (parts.length > 0) {
    let result = parts.join(", ");
    if (addr.postcode && !result.includes(addr.postcode)) {
      result += ` - ${addr.postcode}`;
    }
    return result;
  }

  // Fallback to raw display name if structured parts were empty
  if (addr.rawDisplayName) {
    return addr.rawDisplayName
      .split(",")
      .map((s) => s.trim())
      .slice(0, 4)
      .join(", ");
  }

  return "Location Detected";
}

/**
 * Primary Provider: OpenStreetMap Nominatim
 */
async function reverseGeocodeNominatim(lat: number, lng: number): Promise<GeocodedAddress | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "SmadhanX-Public-Grievance-Portal/1.0 (contact@smadhanx.gov.in)",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.address) return null;

    const a = data.address;

    const locality =
      a.village ||
      a.suburb ||
      a.town ||
      a.neighbourhood ||
      a.residential ||
      a.city_district ||
      a.hamlet ||
      a.city ||
      a.municipality ||
      undefined;

    const landmark =
      a.landmark ||
      a.amenity ||
      a.building ||
      a.road ||
      a.subway ||
      a.bridge ||
      undefined;

    const district =
      a.state_district ||
      a.district ||
      a.county ||
      (a.city !== locality ? a.city : undefined) ||
      undefined;

    const state = a.state || undefined;
    const country = a.country || undefined;
    const postcode = a.postcode || undefined;

    return {
      locality,
      landmark,
      district,
      state,
      country,
      postcode,
      rawDisplayName: data.display_name,
    };
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Secondary Fallback Provider: BigDataCloud Client Reverse Geocoding
 */
async function reverseGeocodeBigDataCloud(lat: number, lng: number): Promise<GeocodedAddress | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data) return null;

    // Search administrative hierarchy for district if present
    let district: string | undefined = undefined;
    if (data.localityInfo?.administrative && Array.isArray(data.localityInfo.administrative)) {
      const adminList = data.localityInfo.administrative;
      // level 5 or 6 is typically district/county in India and international admin hierarchy
      const distObj = adminList.find(
        (adm: any) => adm.adminLevel === 5 || adm.adminLevel === 6 || adm.order === 10
      );
      if (distObj?.name) {
        district = distObj.name;
      }
    }

    if (!district && data.city && data.city !== data.locality) {
      district = data.city;
    }

    return {
      locality: data.locality || data.city || undefined,
      district,
      state: data.principalSubdivision || undefined,
      country: data.countryName || undefined,
      postcode: data.postcode || undefined,
    };
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    if (!latStr || !lngStr) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: 'lat' and 'lng' are required.",
        },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    // Security & Numeric Validation:
    // latitude must be between -90 and 90
    // longitude must be between -180 and 180
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid coordinates: latitude and longitude must be valid finite numbers.",
        },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid latitude: latitude must be between -90 and 90 degrees.",
        },
        { status: 400 }
      );
    }

    if (lng < -180 || lng > 180) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid longitude: longitude must be between -180 and 180 degrees.",
        },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[ReverseGeocode] GPS coordinates received: lat=${lat.toFixed(5)}, lng=${lng.toFixed(5)}`);
      console.log("[ReverseGeocode] Querying reverse-geocoding provider...");
    }

    // Try primary provider (Nominatim), then fallback to BigDataCloud
    let addressData = await reverseGeocodeNominatim(lat, lng);

    if (!addressData || (!addressData.locality && !addressData.district && !addressData.state)) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[ReverseGeocode] Nominatim returned insufficient data, trying BigDataCloud fallback...");
      }
      addressData = await reverseGeocodeBigDataCloud(lat, lng);
    }

    if (!addressData) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not resolve reverse-geocoding data for the specified coordinates.",
          coordinates: { latitude: lat, longitude: lng },
        },
        { status: 422 }
      );
    }

    const formattedAddress = buildFormattedAddress(addressData);

    if (process.env.NODE_ENV !== "production") {
      console.log(`[ReverseGeocode] Response received. Formatted address: "${formattedAddress}"`);
    }

    return NextResponse.json(
      {
        success: true,
        formattedAddress,
        address: {
          locality: addressData.locality || null,
          landmark: addressData.landmark || null,
          district: addressData.district || null,
          state: addressData.state || null,
          country: addressData.country || null,
          postcode: addressData.postcode || null,
        },
        coordinates: {
          latitude: lat,
          longitude: lng,
        },
      },
      {
        headers: {
          "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("[ReverseGeocode] Internal error during geocoding:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while processing geocoding request.",
      },
      { status: 500 }
    );
  }
}
