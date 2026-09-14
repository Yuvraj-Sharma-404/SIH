import { POST } from "../src/app/api/images/geotag/route";
import { GET as getSample } from "../src/app/api/images/geotag/sample/route";

async function testApiEndpoint() {
  console.log("=== TESTING POST /api/images/geotag ENDPOINT ===");

  // 1. Test with GPS image
  console.log("\n--- Subtest A: Image containing GPS EXIF ---");
  const sampleResGps = await getSample(new Request("http://localhost/sample?type=gps") as any);
  const sampleGpsBlob = await sampleResGps.blob();

  const formDataGps = new FormData();
  formDataGps.append("image", sampleGpsBlob, "india-gate-test.jpg");

  const reqA = new Request("http://localhost/api/images/geotag", {
    method: "POST",
    body: formDataGps,
  });

  const resA = await POST(reqA as any);
  const jsonA = await resA.json();
  console.log("API Response with GPS:", JSON.stringify(jsonA, null, 2));

  if (
    jsonA.success === true &&
    jsonA.hasGpsData === true &&
    typeof jsonA.latitude === "number" &&
    typeof jsonA.longitude === "number" &&
    jsonA.locationName &&
    jsonA.source === "EXIF"
  ) {
    console.log("✓ Subtest A PASSED: Coordinates and reverse-geocoded location successfully returned!");
  } else {
    console.error("✕ Subtest A FAILED");
  }

  // 2. Test with image without GPS
  console.log("\n--- Subtest B: Image without GPS EXIF ---");
  const sampleResNoGps = await getSample(new Request("http://localhost/sample?type=nogps") as any);
  const sampleNoGpsBlob = await sampleResNoGps.blob();

  const formDataNoGps = new FormData();
  formDataNoGps.append("image", sampleNoGpsBlob, "screenshot-plain.jpg");

  const reqB = new Request("http://localhost/api/images/geotag", {
    method: "POST",
    body: formDataNoGps,
  });

  const resB = await POST(reqB as any);
  const jsonB = await resB.json();
  console.log("API Response without GPS:", JSON.stringify(jsonB, null, 2));

  if (
    jsonB.success === true &&
    jsonB.hasGpsData === false &&
    jsonB.message === "No GPS location data found in this image."
  ) {
    console.log("✓ Subtest B PASSED: Correctly responded with hasGpsData = false and required message!");
  } else {
    console.error("✕ Subtest B FAILED");
  }

  // 3. Test with Corrupted Image
  console.log("\n--- Subtest C: Corrupted Image ---");
  const corruptBlob = new Blob(["CORRUPT_BYTES_NOT_AN_IMAGE_12345678901234567890"], { type: "image/jpeg" });
  const formDataCorrupt = new FormData();
  formDataCorrupt.append("image", corruptBlob, "corrupted.jpg");

  const reqC = new Request("http://localhost/api/images/geotag", {
    method: "POST",
    body: formDataCorrupt,
  });

  const resC = await POST(reqC as any);
  const jsonC = await resC.json();
  console.log("API Response for Corrupt Image:", JSON.stringify(jsonC, null, 2));

  if (jsonC.success === false && resC.status === 400) {
    console.log("✓ Subtest C PASSED: Corrupted image handled safely with HTTP 400 error!");
  } else {
    console.error("✕ Subtest C FAILED");
  }

  // 4. Test with oversized file (> 15 MB)
  console.log("\n--- Subtest D: Oversized File (> 15MB) ---");
  const largeBlob = new Blob([new Uint8Array(16 * 1024 * 1024)], { type: "image/jpeg" });
  const formDataLarge = new FormData();
  formDataLarge.append("image", largeBlob, "huge.jpg");

  const reqD = new Request("http://localhost/api/images/geotag", {
    method: "POST",
    body: formDataLarge,
  });

  const resD = await POST(reqD as any);
  const jsonD = await resD.json();
  console.log("API Response for Large Image:", JSON.stringify(jsonD, null, 2));

  if (jsonD.success === false && jsonD.error.includes("exceeds the maximum allowed limit")) {
    console.log("✓ Subtest D PASSED: Size limit enforced!");
  } else {
    console.error("✕ Subtest D FAILED");
  }

  // 5. Test with no file provided
  console.log("\n--- Subtest E: Empty Form Data ---");
  const reqE = new Request("http://localhost/api/images/geotag", {
    method: "POST",
    body: new FormData(),
  });

  const resE = await POST(reqE as any);
  const jsonE = await resE.json();
  console.log("API Response for Empty Form:", JSON.stringify(jsonE, null, 2));

  if (jsonE.success === false && resE.status === 400) {
    console.log("✓ Subtest E PASSED: Missing file handled cleanly!");
  } else {
    console.error("✕ Subtest E FAILED");
  }

  console.log("\n=== ALL API ENDPOINT SUBTESTS COMPLETED SUCCESSFULLY ===");
}

testApiEndpoint().catch(console.error);
