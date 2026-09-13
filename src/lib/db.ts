import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  // When running in Vercel serverless functions, the root filesystem is read-only.
  // We copy the pre-seeded SQLite database to /tmp so the serverless runtime can read and write.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDb = path.join("/tmp", "dev.db");
    if (!fs.existsSync(tmpDb)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          try {
            fs.copyFileSync(p, tmpDb);
            break;
          } catch (e) {
            console.error("Failed to copy SQLite database to /tmp:", e);
          }
        }
      }
    }
    return `file:${tmpDb}`;
  }

  const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  if (rawUrl.startsWith("file:")) {
    const filePath = rawUrl.replace(/^file:/, "");
    if (!path.isAbsolute(filePath)) {
      const resolved = path.resolve(process.cwd(), filePath).replace(/\\/g, "/");
      return `file:${resolved}`;
    }
  }
  return rawUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma_v3: PrismaClient | undefined;
};

const dbUrl = getDatabaseUrl();

process.env.DATABASE_URL = dbUrl;

export const prisma =
  globalForPrisma.prisma_v3 ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v3 = prisma;
