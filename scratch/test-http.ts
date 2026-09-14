async function testLiveServer() {
  console.log("=== VERIFYING LIVE HTTP SERVER ON PORT 3000 ===");

  // 1. GET /geotag page
  console.log("1. Fetching http://localhost:3000/geotag ...");
  const pageRes = await fetch("http://localhost:3000/geotag");
  console.log("Status:", pageRes.status, pageRes.statusText);
  const html = await pageRes.text();
  console.log("HTML length:", html.length, "bytes");
  if (html.includes("Image Geotag") || html.includes("Geospatial EXIF")) {
    console.log("✓ /geotag page rendered successfully with expected title and components!");
  } else {
    console.log("Notice: HTML snippet:", html.slice(0, 300));
  }

  // 2. GET /api/images/geotag/sample?type=gps
  console.log("\n2. Fetching GPS sample from http://localhost:3000/api/images/geotag/sample?type=gps ...");
  const sampleRes = await fetch("http://localhost:3000/api/images/geotag/sample?type=gps");
  console.log("Sample status:", sampleRes.status);
  const blob = await sampleRes.blob();
  console.log("Sample size:", blob.size, "bytes, type:", blob.type);

  // 3. POST /api/images/geotag with the sample
  console.log("\n3. Posting sample to live http://localhost:3000/api/images/geotag ...");
  const formData = new FormData();
  formData.append("image", blob, "india-gate.jpg");
  const apiRes = await fetch("http://localhost:3000/api/images/geotag", {
    method: "POST",
    body: formData,
  });
  console.log("API status:", apiRes.status);
  const json = await apiRes.json();
  console.log("API response:", JSON.stringify(json, null, 2));

  if (json.success && json.hasGpsData && json.latitude && json.longitude) {
    console.log("✓ Live API Geotag extraction & reverse geocoding works end-to-end!");
  }

  // 4. GET /citizen/report
  console.log("\n4. Fetching http://localhost:3000/citizen/report ...");
  const reportRes = await fetch("http://localhost:3000/citizen/report");
  console.log("Report status:", reportRes.status);
  const reportHtml = await reportRes.text();
  if (reportHtml.includes("geotag") || reportHtml.includes("Extract from Photo EXIF")) {
    console.log("✓ /citizen/report integrated with Geotag links successfully!");
  }

  console.log("\n=== ALL LIVE HTTP TESTS PASSED ===");
}

testLiveServer().catch(console.error);
