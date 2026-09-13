import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_SECRET = process.env.SESSION_SECRET || "smadhanx-national-portal-secure-salt-key-2025";
export const SESSION_COOKIE_NAME = "smadhanx_user_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  department?: string | null;
  organization?: string | null;
  createdAt: number;
}

/**
 * Creates an HMAC-SHA256 signature for a payload string.
 */
function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

/**
 * Encodes and signs a session payload into a token string.
 */
export function encodeSessionToken(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json, "utf-8").toString("base64url");
  const signature = sign(base64);
  return `${base64}.${signature}`;
}

/**
 * Decodes and verifies a session token. Returns null if invalid or tampered.
 */
export function decodeSessionToken(token: string): SessionPayload | null {
  try {
    const [base64, signature] = token.split(".");
    if (!base64 || !signature) return null;

    const expectedSignature = sign(base64);
    if (signature !== expectedSignature) {
      return null;
    }

    const json = Buffer.from(base64, "base64url").toString("utf-8");
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Reads session from current request cookies (Server Components / Route Handlers).
 */
export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return decodeSessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Attaches the session cookie to an outgoing NextResponse.
 */
export function attachSessionCookie(response: NextResponse, payload: SessionPayload): NextResponse {
  const token = encodeSessionToken(payload);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: false, // Ensures cookie functions properly on both localhost (HTTP) and deployed (HTTPS)
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

/**
 * Clears the session cookie on logout.
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
