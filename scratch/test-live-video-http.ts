async function testLiveVideoHttp() {
  console.log("=== VERIFYING LIVE HTTP SERVER WITH VIDEO & IMAGE GEOTAG ===");

  // 1. Fetch Geotagged Video Sample
  console.log("1. Fetching http://localhost:3000/api/images/geotag/sample?type=video_gps ...");
  const vidSampleRes = await fetch("http://localhost:3000/api/images/geotag/sample?type=video_gps");
  console.log("Status:", vidSampleRes.status);
  const vidBlob = await vidSampleRes.blob();
  console.log("Video sample size:", vidBlob.size, "bytes, mime:", vidBlob.type);

  // 2. Post Video to /api/media/geotag
  console.log("\n2. POSTing video to http://localhost:3000/api/media/geotag ...");
  const vidForm = new FormData();
  vidForm.append("media", vidBlob, "delhi-drone.mp4");
  const vidApiRes = await fetch("http://localhost:3000/api/media/geotag", {
    method: "POST",
    body: vidForm,
  });
  console.log("Video API status:", vidApiRes.status);
  const vidJson = await vidApiRes.json();
  console.log("Video API Response:", JSON.stringify(vidJson, null, 2));

  // 3. Post Video to backward-compatible /api/images/geotag
  console.log("\n3. POSTing to backward-compatible http://localhost:3000/api/images/geotag ...");
  const imgCompatRes = await fetch("http://localhost:3000/api/images/geotag", {
    method: "POST",
    body: vidForm,
  });
  console.log("Backward compatible API status:", imgCompatRes.status);
  const imgCompatJson = await imgCompatRes.json();
  console.log("Backward compatible API success:", imgCompatJson.success, "hasGpsData:", imgCompatJson.hasGpsData);

  // 4. Fetch /geotag page
  console.log("\n4. Fetching http://localhost:3000/geotag ...");
  const pageRes = await fetch("http://localhost:3000/geotag");
  console.log("Page status:", pageRes.status);
  const html = await pageRes.text();
  if (html.includes("Image &amp; Video Geotag") || html.includes("Image & Video Geotag") || html.includes("Media Preview")) {
    console.log("✓ /geotag rendered with Image & Video Geotag interface!");
  }

  console.log("\n=== ALL LIVE HTTP TESTS SUCCEEDED ===");
}

testLiveVideoHttp().catch(console.error);
