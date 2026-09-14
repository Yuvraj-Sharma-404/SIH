import { NextRequest } from "next/server";
import { POST as mediaGeotagHandler } from "@/app/api/media/geotag/route";

export const dynamic = "force-dynamic";

/**
 * Backward-compatible wrapper forwarding to unified media geotag endpoint.
 */
export async function POST(req: NextRequest) {
  return mediaGeotagHandler(req);
}
