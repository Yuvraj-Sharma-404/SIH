export interface GeocodedAddress {
  locality?: string;
  landmark?: string;
  district?: string;
  state?: string;
  country?: string;
  postcode?: string;
  rawDisplayName?: string;
}

export interface GeocodeResult {
  success: boolean;
  formattedAddress: string;
  address: {
    locality: string | null;
    city: string | null;
    landmark: string | null;
    district: string | null;
    state: string | null;
    country: string | null;
    postcode: string | null;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Formats structured location components into a clean, human-readable string.
 * Example: "Seloo, Wardha, Maharashtra" or "Connaught Place, New Delhi, Delhi, India"
 */
export function buildFormattedAddress(addr: GeocodedAddress): string {
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

  // 5. Country
  if (addr.country && !parts.includes(addr.country) && parts.length <= 3) {
    parts.push(addr.country);
  }

  // If we collected distinct parts, join them cleanly
  if (parts.length > 0) {
    return parts.join(", ");
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
 * Free, accurate worldwide and comprehensive for Indian villages, towns, and districts.
 */
export async function reverseGeocodeNominatim(lat: number, lng: number): Promise<GeocodedAddress | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "SmadhanX-Geotag-Engine/1.0 (contact@smadhanx.gov.in)",
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
export async function reverseGeocodeBigDataCloud(lat: number, lng: number): Promise<GeocodedAddress | null> {
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

    let district: string | undefined = undefined;
    if (data.localityInfo?.administrative && Array.isArray(data.localityInfo.administrative)) {
      const adminList = data.localityInfo.administrative;
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

/**
 * Comprehensive reverse-geocoding service.
 * Tries OpenStreetMap Nominatim first, falls back to BigDataCloud.
 */
export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<GeocodeResult | null> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  // 1. Primary: Nominatim
  let addressData = await reverseGeocodeNominatim(lat, lng);

  // 2. Fallback: BigDataCloud
  if (!addressData || (!addressData.locality && !addressData.district && !addressData.state)) {
    addressData = await reverseGeocodeBigDataCloud(lat, lng);
  }

  if (!addressData) {
    return null;
  }

  const formattedAddress = buildFormattedAddress(addressData);
  const locality = addressData.locality || null;
  const district = addressData.district || null;
  const state = addressData.state || null;
  const country = addressData.country || null;
  const landmark = addressData.landmark || null;
  const postcode = addressData.postcode || null;

  return {
    success: true,
    formattedAddress,
    address: {
      locality,
      city: locality || district,
      landmark,
      district,
      state,
      country,
      postcode,
    },
    coordinates: {
      latitude: lat,
      longitude: lng,
    },
  };
}
