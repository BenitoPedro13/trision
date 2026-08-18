/**
 * Drops all public schema objects so Payload can push a clean schema.
 * Use when Drizzle push stalls mid-migration (e.g. users → usuarios rename).
 *
 * Requires DATABASE_URL_UNPOOLED (direct Neon connection, not pooler).
 *
 * Usage: pnpm exec tsx scripts/reset-payload-db.mts
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const pg = require("pg");

function loadEnv(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const env = readFileSync(resolve(import.meta.dirname, "../.env"), "utf8");
    for (const line of env.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m?.[1] === key) return m[2]?.trim();
    }
  } catch {
    /* no .env */
  }
  return undefined;
}

const url = loadEnv("DATABASE_URL_UNPOOLED") ?? loadEnv("DATABASE_URL");
if (!url) {
  console.error("Set DATABASE_URL_UNPOOLED or DATABASE_URL");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url });

try {
  console.log("Dropping public schema…");
  await pool.query("DROP SCHEMA public CASCADE");
  await pool.query("CREATE SCHEMA public");
  await pool.query("GRANT ALL ON SCHEMA public TO PUBLIC");
  await pool.query("GRANT ALL ON SCHEMA public TO neondb_owner");
  console.log("Done. Restart `pnpm dev` and create your admin user at /admin.");
} finally {
  await pool.end();
}
