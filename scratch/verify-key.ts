import fs from "fs";
import path from "path";

// Read .env file directly
try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      process.env[key.trim()] = vals.join("=").trim();
    }
  }
} catch (e) {
  // ignore
}

import { GoogleGenerativeAI } from "@google/generative-ai";

async function verifyApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("-----------------------------------------");
  console.log("Checking GEMINI_API_KEY from environment:");
  console.log("Key length:", apiKey ? apiKey.length : 0);
  console.log("Key prefix:", apiKey ? apiKey.slice(0, 8) + "..." : "NONE");
  console.log("-----------------------------------------");

  if (!apiKey) {
    console.error("ERROR: No GEMINI_API_KEY found in .env!");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with direct fetch to list models
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    console.log("List Models HTTP Status:", listRes.status);
    const listData = await listRes.json();
    if (listData.models) {
      const generateModels = listData.models
        .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m: any) => m.name.replace("models/", ""));
      console.log("Supported generateContent models:", generateModels);

      const targetModel = "gemini-3.6-flash";

      console.log(`\nTesting generateContent with model: "${targetModel}"...`);
      const model = genAI.getGenerativeModel({ model: targetModel });
      const res = await model.generateContent("Hello! Confirm you are working by replying with the word: GEMINI_ONLINE");
      console.log(">>> RESPONSE RECEIVED FROM GEMINI:", res.response.text().trim());
      console.log(">>> RESULT: YOUR API KEY IS 100% WORKING AND ONLINE!");
    }
  } catch (err: any) {
    console.error(">>> Test Failed!", err);
  }
}

verifyApiKey();
