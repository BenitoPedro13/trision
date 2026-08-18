import { getPayload, type Payload } from "payload";
import config from "@payload-config";

let cached: Payload | null = null;

export async function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = await getPayload({ config });
  }
  return cached;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
