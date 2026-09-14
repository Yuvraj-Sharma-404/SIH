import { extractImageGps } from "../src/lib/geotag/image-extractor";
import { extractVideoGps } from "../src/lib/geotag/video-extractor";
import { parseIso6709, dmsToDecimal, decimalToDms, isValidCoordinate } from "../src/lib/geotag/types";
import { POST as mediaGeotagPost } from "../src/app/api/media/geotag/route";
import { GET as sampleGet } from "../src/app/api/images/geotag/sample/route";

async function runComprehensiveTestSuite() {
  console.log("===============================================================");
  console.log("=== COMPREHENSIVE IMAGE + VIDEO GEOTAGGING TEST SUITE ===");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`✕ FAILED: ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // Section A: DMS -> Decimal and ISO 6709 Coordinate Conversion
  // -------------------------------------------------------------
  console.log("--- Test Section A: Coordinate Conversion & Validation ---");
  const latPrompt = dmsToDecimal([28, 36, 50], "N");
  const lngPrompt = dmsToDecimal([77, 12, 32], "E");
  assert(
    latPrompt !== null && Math.abs(latPrompt - 28.613889) < 0.0001,
    `Prompt DMS Latitude [28, 36, 50]N -> ${latPrompt?.toFixed(6)} (Expected ~28.613889)`
  );
  assert(
    lngPrompt !== null && Math.abs(lngPrompt - 77.208889) < 0.0001,
    `Prompt DMS Longitude [77, 12, 32]E -> ${lngPrompt?.toFixed(6)} (Expected ~77.208889)`
  );

  // Negative coordinates: Southern & Western Hemispheres
  const southLat = dmsToDecimal([33, 51, 0], "S");
  const westLng = dmsToDecimal([151, 12, 0], "W");
  assert(southLat === -33.85, "Southern Hemisphere returns negative decimal latitude (-33.85)");
  assert(westLng === -151.2, "Western Hemisphere returns negative decimal longitude (-151.2)");

  // ISO 6709 parsing
  const isoSample1 = parseIso6709("+28.6139+077.2090+215.000/");
  assert(
    isoSample1 !== null &&
      Math.abs(isoSample1.latitude - 28.6139) < 0.0001 &&
      Math.abs(isoSample1.longitude - 77.209) < 0.0001 &&
      isoSample1.altitude === 215,
    "ISO 6709 decimal format (+28.6139+077.2090+215.000/) correctly parsed"
  );

  const isoSampleDms = parseIso6709("+283650+0771232/");
  assert(
    isoSampleDms !== null &&
      Math.abs(isoSampleDms.latitude - 28.613889) < 0.0001 &&
      Math.abs(isoSampleDms.longitude - 77.208889) < 0.0001,
    "ISO 6709 DDMMSS format (+283650+0771232/) correctly parsed to 28.613889, 77.208889"
  );

  // Invalid Coordinates Check
  assert(!isValidCoordinate(95, 20), "Invalid latitude > 90 rejected");
  assert(!isValidCoordinate(20, 200), "Invalid longitude > 180 rejected");
  assert(!isValidCoordinate(0, 0), "Uncalibrated 0,0 Null Island coordinate rejected");

  // -------------------------------------------------------------
  // Section B: Image Metadata Extractor
  // -------------------------------------------------------------
  console.log("\n--- Test Section B: Image Metadata Extractor ---");
  // 1. JPEG with GPS
  const reqImgGps = new Request("http://localhost/sample?type=gps");
  const resImgGps = await sampleGet(reqImgGps as any);
  const bufImgGps = Buffer.from(await resImgGps.arrayBuffer());
  const imgGpsResult = await extractImageGps(bufImgGps, "india-gate.jpg");

  assert(
    imgGpsResult.hasGpsData === true &&
      typeof imgGpsResult.latitude === "number" &&
      typeof imgGpsResult.longitude === "number",
    "JPEG with GPS extracted latitude & longitude successfully"
  );
  assert(imgGpsResult.altitude === 215, "JPEG with GPS extracted altitude (215 m)");

  // 2. JPEG without GPS
  const reqImgNoGps = new Request("http://localhost/sample?type=nogps");
  const resImgNoGps = await sampleGet(reqImgNoGps as any);
  const bufImgNoGps = Buffer.from(await resImgNoGps.arrayBuffer());
  const imgNoGpsResult = await extractImageGps(bufImgNoGps, "plain.jpg");

  assert(
    imgNoGpsResult.hasGpsData === false &&
      imgNoGpsResult.message === "No GPS location data found in this image.",
    "JPEG without GPS returns hasGpsData = false with standard message"
  );

  // 3. Corrupted Image Buffer
  const corruptImg = Buffer.from("CORRUPT_BUFFER_NOT_AN_IMAGE");
  const corruptImgResult = await extractImageGps(corruptImg, "corrupted.jpg");
  assert(
    corruptImgResult.hasGpsData === false,
    "Corrupted image handled gracefully without throwing"
  );

  // -------------------------------------------------------------
  // Section C: Video Metadata Extractor
  // -------------------------------------------------------------
  console.log("\n--- Test Section C: Video Metadata Extractor ---");
  // 1. MP4 with ISO 6709 location atom
  const reqVidGps = new Request("http://localhost/sample?type=video_gps");
  const resVidGps = await sampleGet(reqVidGps as any);
  const bufVidGps = Buffer.from(await resVidGps.arrayBuffer());
  const vidGpsResult = await extractVideoGps(bufVidGps, "drone-survey.mp4");

  assert(
    vidGpsResult.hasGpsData === true &&
      vidGpsResult.mediaType === "video" &&
      Math.abs((vidGpsResult.latitude || 0) - 28.6139) < 0.0001 &&
      Math.abs((vidGpsResult.longitude || 0) - 77.209) < 0.0001,
    `MP4 with GPS parsed ISO 6709 atom (+28.6139+077.2090) to Lat: ${vidGpsResult.latitude}, Lng: ${vidGpsResult.longitude}`
  );
  assert(vidGpsResult.altitude === 215, "Video parsed altitude: 215 m");
  assert(
    vidGpsResult.duration !== null && vidGpsResult.duration! > 0,
    `Video parsed duration: ${vidGpsResult.duration} seconds`
  );
  assert(
    vidGpsResult.width === 1920 && vidGpsResult.height === 1080,
    `Video parsed track dimensions: ${vidGpsResult.width}x${vidGpsResult.height}`
  );

  // 2. MP4 without GPS
  const reqVidNoGps = new Request("http://localhost/sample?type=video_nogps");
  const resVidNoGps = await sampleGet(reqVidNoGps as any);
  const bufVidNoGps = Buffer.from(await resVidNoGps.arrayBuffer());
  const vidNoGpsResult = await extractVideoGps(bufVidNoGps, "standard-recording.mp4");

  assert(
    vidNoGpsResult.hasGpsData === false &&
      vidNoGpsResult.message === "No GPS location data found in this video.",
    "MP4 without GPS returns hasGpsData = false with standard message"
  );

  // 3. Corrupted Video Buffer
  const corruptVid = Buffer.from("CORRUPT_BUFFER_NOT_A_VIDEO_12345");
  const corruptVidResult = await extractVideoGps(corruptVid, "bad-video.mp4");
  assert(
    corruptVidResult.hasGpsData === false,
    "Corrupted video handled gracefully without throwing"
  );

  // -------------------------------------------------------------
  // Section D: Unified POST /api/media/geotag Live Endpoint
  // -------------------------------------------------------------
  console.log("\n--- Test Section D: Unified API Endpoint (POST /api/media/geotag) ---");

  // Subtest 1: Video with GPS uploaded to API
  const formDataVid = new FormData();
  formDataVid.append("media", new Blob([new Uint8Array(bufVidGps)], { type: "video/mp4" }), "field-video.mp4");
  const apiVidReq = new Request("http://localhost/api/media/geotag", {
    method: "POST",
    body: formDataVid,
  });
  const apiVidRes = await mediaGeotagPost(apiVidReq as any);
  const apiVidJson = await apiVidRes.json();

  assert(
    apiVidJson.success === true &&
      apiVidJson.hasGpsData === true &&
      apiVidJson.mediaType === "video" &&
      apiVidJson.source === "embedded_metadata" &&
      typeof apiVidJson.latitude === "number" &&
      typeof apiVidJson.longitude === "number",
    "API successfully processed video with GPS and returned source='embedded_metadata'"
  );
  assert(
    typeof apiVidJson.locationName === "string" && apiVidJson.locationName.length > 0,
    `API reverse geocoded video location: "${apiVidJson.locationName}"`
  );

  // Subtest 2: Image with GPS uploaded to API
  const formDataImg = new FormData();
  formDataImg.append("media", new Blob([new Uint8Array(bufImgGps)], { type: "image/jpeg" }), "field-photo.jpg");
  const apiImgReq = new Request("http://localhost/api/media/geotag", {
    method: "POST",
    body: formDataImg,
  });
  const apiImgRes = await mediaGeotagPost(apiImgReq as any);
  const apiImgJson = await apiImgRes.json();

  assert(
    apiImgJson.success === true &&
      apiImgJson.hasGpsData === true &&
      apiImgJson.mediaType === "image",
    "API successfully processed image with GPS"
  );

  // Subtest 3: Video without GPS uploaded to API
  const formDataNoGps = new FormData();
  formDataNoGps.append("media", new Blob([new Uint8Array(bufVidNoGps)], { type: "video/mp4" }), "no-gps.mp4");
  const apiNoGpsReq = new Request("http://localhost/api/media/geotag", {
    method: "POST",
    body: formDataNoGps,
  });
  const apiNoGpsRes = await mediaGeotagPost(apiNoGpsReq as any);
  const apiNoGpsJson = await apiNoGpsRes.json();

  assert(
    apiNoGpsJson.success === true &&
      apiNoGpsJson.hasGpsData === false &&
      apiNoGpsJson.message === "No GPS location data found in this video.",
    "API returned exact required message for video without GPS"
  );

  // Subtest 4: Unsupported File Type (.exe)
  const formUnsupported = new FormData();
  formUnsupported.append("media", new Blob(["NOT_MEDIA_BINARY"], { type: "application/octet-stream" }), "malware.exe");
  const apiUnsuppReq = new Request("http://localhost/api/media/geotag", {
    method: "POST",
    body: formUnsupported,
  });
  const apiUnsuppRes = await mediaGeotagPost(apiUnsuppReq as any);
  const apiUnsuppJson = await apiUnsuppRes.json();

  assert(
    apiUnsuppJson.success === false && apiUnsuppJson.unsupportedFormat === true,
    "API rejected unsupported file format (.exe) with unsupportedFormat flag"
  );

  // Subtest 5: Oversized Video (> 50 MB)
  const largeVidBlob = new Blob([new Uint8Array(51 * 1024 * 1024)], { type: "video/mp4" });
  const formLarge = new FormData();
  formLarge.append("media", largeVidBlob, "oversized.mp4");
  const apiLargeReq = new Request("http://localhost/api/media/geotag", {
    method: "POST",
    body: formLarge,
  });
  const apiLargeRes = await mediaGeotagPost(apiLargeReq as any);
  const apiLargeJson = await apiLargeRes.json();

  assert(
    apiLargeJson.success === false && apiLargeJson.error.includes("exceeds the maximum allowed limit of 50 MB"),
    "API enforced 50 MB video size limit"
  );

  console.log("\n===============================================================");
  console.log(`=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  console.log("===============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
