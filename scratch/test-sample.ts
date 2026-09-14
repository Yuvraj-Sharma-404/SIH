import { extractExifGps } from "../src/lib/exif";

async function testSampleGenerator() {
  console.log("=== TESTING SAMPLE GENERATION ===");
  // Fetch sample from internal handler
  const { GET } = await import("../src/app/api/images/geotag/sample/route");

  const reqGps = new Request("http://localhost:3000/api/images/geotag/sample?type=gps");
  const resGps = await GET(reqGps as any);
  const bufferGps = Buffer.from(await resGps.arrayBuffer());

  console.log("Generated GPS sample size:", bufferGps.length, "bytes");
  const parsedGps = await extractExifGps(bufferGps);
  console.log("Parsed GPS sample:", parsedGps);

  if (parsedGps.hasGpsData && parsedGps.latitude && parsedGps.longitude) {
    console.log(`✓ GPS Sample Valid: Lat=${parsedGps.latitude}, Lng=${parsedGps.longitude}, Alt=${parsedGps.altitude}`);
  } else {
    console.warn("GPS sample parsed details:", parsedGps.details);
  }

  const reqNoGps = new Request("http://localhost:3000/api/images/geotag/sample?type=nogps");
  const resNoGps = await GET(reqNoGps as any);
  const bufferNoGps = Buffer.from(await resNoGps.arrayBuffer());
  const parsedNoGps = await extractExifGps(bufferNoGps);
  console.log("Parsed NoGPS sample:", parsedNoGps);
  if (!parsedNoGps.hasGpsData) {
    console.log("✓ NoGPS Sample Valid");
  }
}

testSampleGenerator().catch(console.error);
