import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getSessionFromCookies,
  clearSessionCookie,
  SESSION_COOKIE_NAME,
  decodeSessionToken,
} from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(req: NextRequest) {
  try {
    const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = rawToken ? decodeSessionToken(rawToken) : await getSessionFromCookies();

    // 1. If valid session token exists, use it (resilient across serverless SQLite containers)
    if (session && session.userId) {
      let dbUser = null;
      try {
        dbUser = await prisma.user.findUnique({
          where: { id: session.userId },
        });
      } catch {
        // Ephemeral serverless container fallback
      }

      const userData = {
        id: dbUser?.id || session.userId,
        name: dbUser?.name || session.name || "User",
        email: dbUser?.email || session.email || "",
        phone: dbUser?.phone || (session as any).phone || null,
        role: dbUser?.role || session.role || "CITIZEN",
        status: dbUser?.status || session.status || "VERIFIED",
        department: dbUser?.department || session.department || null,
        organization: dbUser?.organization || session.organization || null,
        designation: dbUser?.designation || (session as any).designation || null,
        profileData: dbUser?.profileData || null,
        createdAt: dbUser?.createdAt || (session.createdAt ? new Date(session.createdAt) : new Date()),
      };

      return NextResponse.json(
        {
          success: true,
          authenticated: true,
          data: userData,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Check fallback for preview query param
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    if (role) {
      try {
        const fallbackUser = await prisma.user.findFirst({
          where: { role },
        });
        if (fallbackUser) {
          return NextResponse.json(
            {
              success: true,
              authenticated: false,
              data: fallbackUser,
            },
            { headers: NO_CACHE_HEADERS }
          );
        }
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        data: null,
        error: "No authenticated user session.",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    return NextResponse.json(
      { success: false, authenticated: false, error: "Failed to fetch session" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
