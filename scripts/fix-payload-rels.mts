/**
 * Repairs a half-finished Payload schema push after renaming auth collection
 * `users` → `usuarios`. Drizzle then tries to DROP a FK that no longer exists.
 *
 * Usage: pnpm exec tsx scripts/fix-payload-rels.mts
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

async function columnExists(table: string, column: string): Promise<boolean> {
  const r = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [table, column],
  );
  return r.rowCount === 1;
}

async function constraintExists(name: string): Promise<boolean> {
  const r = await pool.query(`SELECT 1 FROM pg_constraint WHERE conname = $1`, [name]);
  return r.rowCount === 1;
}

try {
  for (const table of ["payload_locked_documents_rels", "payload_preferences_rels"]) {
    const hasUsers = await columnExists(table, "users_id");
    const hasUsuarios = await columnExists(table, "usuarios_id");

    if (hasUsers && !hasUsuarios) {
      console.log(`${table}: renaming users_id → usuarios_id`);
      await pool.query(`ALTER TABLE "${table}" RENAME COLUMN users_id TO usuarios_id`);
    } else if (hasUsers && hasUsuarios) {
      console.log(`${table}: dropping stale users_id`);
      await pool.query(`ALTER TABLE "${table}" DROP COLUMN users_id`);
    } else if (!hasUsuarios) {
      console.log(`${table}: adding usuarios_id`);
      await pool.query(
        `ALTER TABLE "${table}" ADD COLUMN usuarios_id integer REFERENCES usuarios(id) ON DELETE CASCADE`,
      );
    } else {
      console.log(`${table}: usuarios_id already present`);
    }

    const fk = `${table}_usuarios_fk`;
    if (!(await constraintExists(fk))) {
      console.log(`${table}: adding ${fk}`);
      await pool.query(
        `ALTER TABLE "${table}"
         ADD CONSTRAINT "${fk}" FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE CASCADE`,
      );
    }
  }

  console.log("Done. Restart `pnpm dev` — /admin should load without the FK drop error.");
} finally {
  await pool.end();
}
