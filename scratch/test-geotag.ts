import { extractExifGps, dmsToDecimal, decimalToDms } from "../src/lib/exif";
import { reverseGeocodeCoordinates } from "../src/lib/geocoding";

async function runTests() {
  console.log("=== RUNNING GEOTAG UNIT TESTS ===");

  // Test 1: DMS to Decimal calculation
  console.log("\n--- Test 1: DMS Conversion ---");
  // Example from prompt: Latitude 28°36'50"N, Longitude 77°12'32"E
  const latPrompt = dmsToDecimal([28, 36, 50], "N");
  const lngPrompt = dmsToDecimal([77, 12, 32], "E");
  console.log(`Prompt example: Lat DMS [28,36,50]N -> ${latPrompt?.toFixed(4)} (Expected ~28.6139)`);
  console.log(`Prompt example: Lng DMS [77,12,32]E -> ${lngPrompt?.toFixed(4)} (Expected ~77.2089)`);
  if (latPrompt && Math.abs(latPrompt - 28.613888) < 0.0001 && lngPrompt && Math.abs(lngPrompt - 77.208888) < 0.0001) {
    console.log("✓ Test 1 PASSED: DMS conversion formula is exact!");
  } else {
    console.error("✕ Test 1 FAILED");
  }

  // Test 2: Southern / Western Hemispheres
  console.log("\n--- Test 2: Southern & Western Hemispheres ---");
  const southLat = dmsToDecimal([33, 51, 0], "S");
  const westLng = dmsToDecimal([151, 12, 0], "W");
  console.log(`South Lat: ${southLat} (Expected -33.85)`);
  console.log(`West Lng: ${westLng} (Expected -151.2)`);
  if (southLat === -33.85 && westLng === -151.2) {
    console.log("✓ Test 2 PASSED: Negative coordinates handled accurately!");
  } else {
    console.error("✕ Test 2 FAILED");
  }

  // Test 3: Plain Image (No GPS EXIF)
  console.log("\n--- Test 3: Plain Image (No GPS) ---");
  const plainBase64 =
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
  const plainBuffer = Buffer.from(plainBase64, "base64");
  const plainResult = await extractExifGps(plainBuffer);
  console.log("Plain image result:", plainResult);
  if (!plainResult.hasGpsData) {
    console.log("✓ Test 3 PASSED: Non-GPS image correctly flagged hasGpsData = false!");
  } else {
    console.error("✕ Test 3 FAILED");
  }

  // Test 4: Corrupted buffer
  console.log("\n--- Test 4: Corrupted Buffer ---");
  const corruptBuffer = Buffer.from("THIS_IS_NOT_A_VALID_IMAGE_DATA_1234567890");
  const corruptResult = await extractExifGps(corruptBuffer);
  console.log("Corrupt image result:", corruptResult);
  if (!corruptResult.hasGpsData) {
    console.log("✓ Test 4 PASSED: Corrupted buffer handled gracefully without throwing!");
  } else {
    console.error("✕ Test 4 FAILED");
  }

  // Test 5: Reverse Geocoding
  console.log("\n--- Test 5: Reverse Geocoding Integration ---");
  console.log("Testing reverse-geocoding for New Delhi coordinates (28.6139, 77.2090)...");
  try {
    const geo = await reverseGeocodeCoordinates(28.6139, 77.2090);
    console.log("Geocode result:", geo);
    if (geo && geo.success && geo.formattedAddress) {
      console.log(`✓ Test 5 PASSED: Reverse geocoded address: "${geo.formattedAddress}"`);
    } else {
      console.log("Notice: Geocoding returned null or timed out (offline/network check)");
    }
  } catch (e: any) {
    console.warn("Geocoding network test note:", e.message);
  }

  console.log("\n=== ALL TESTS COMPLETED ===");
}

runTests().catch(console.error);
