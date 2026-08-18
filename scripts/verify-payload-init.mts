import { getPayload } from "payload";

import config from "../payload.config";

async function main() {
  const payload = await getPayload({ config });
  console.log("OK — collections:", Object.keys(payload.collections).sort().join(", "));
  if (payload.db?.destroy) await payload.db.destroy();
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
