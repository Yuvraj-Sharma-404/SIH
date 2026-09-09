#!/usr/bin/env node
/**
 * Local development server for your extracted website.
 * Zero external dependencies — uses only Node.js built-ins.
 *
 * Usage:
 *   node _serve.js          (then open http://localhost:3000)
 *   node _serve.js 8080     (custom port)
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const ROOT = __dirname;
const PORT = parseInt(process.argv[2] || "3000", 10);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm":  "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml":  "application/xml; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico":  "image/x-icon",
  ".bmp":  "image/bmp",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".eot":  "application/vnd.ms-fontobject",
  ".otf":  "font/otf",
  ".mp4":  "video/mp4",
  ".webm": "video/webm",
  ".ogg":  "video/ogg",
  ".pdf":  "application/pdf",
  ".txt":  "text/plain; charset=utf-8",
  ".zip":  "application/zip",
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    "Content-Type": mime,
    "Content-Length": stat.size,
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const rawPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(ROOT, rawPath);

  try {
    const stat = fs.existsSync(filePath) && fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      const idx = path.join(filePath, "index.html");
      if (fs.existsSync(idx)) return serveFile(idx, res);
    }
    if (stat && stat.isFile()) return serveFile(filePath, res);

    // SPA fallback: serve the nearest index.html up the directory tree
    let dir = filePath;
    while (dir !== ROOT && dir !== path.dirname(dir)) {
      dir = path.dirname(dir);
      const idx = path.join(dir, "index.html");
      if (fs.existsSync(idx)) return serveFile(idx, res);
    }

    // Absolute fallback
    const rootIdx = path.join(ROOT, "index.html");
    if (fs.existsSync(rootIdx)) return serveFile(rootIdx, res);

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found: " + rawPath);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Internal Error: " + e.message);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const url = "http://localhost:" + PORT;
  console.log("\n  ✓ Serving extracted site at " + url + "\n");
  const open = process.platform === "darwin" ? "open"
             : process.platform === "win32"  ? "start"
             : "xdg-open";
  exec(open + " " + url, () => {});
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error("  ✗ Port " + PORT + " is already in use. Try: node _serve.js " + (PORT + 1));
  } else {
    console.error("  ✗ Server error:", e.message);
  }
  process.exit(1);
});
