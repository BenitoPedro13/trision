import config from "@payload-config";
import { getPayload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { TrisionUser } from "@/payload/access";

const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());

const ACCESS_MATRIX: Record<
  string,
  { admin: ("create" | "read" | "update" | "delete")[]; revendedor: ("create" | "read" | "update" | "delete")[] }
> = {
  produtos: { admin: ["create", "read", "update", "delete"], revendedor: ["read"] },
  colecoes: { admin: ["create", "read", "update", "delete"], revendedor: ["read"] },
  revendedores: { admin: ["create", "read", "update", "delete"], revendedor: ["read", "update"] },
  usuarios: { admin: ["create", "read", "update", "delete"], revendedor: ["read", "update"] },
  media: { admin: ["create", "read", "update", "delete"], revendedor: ["create", "read", "update"] },
};

async function canAccess(
  collection: string,
  operation: "create" | "read" | "update" | "delete",
  user: TrisionUser | null,
): Promise<boolean> {
  const payload = await getPayload({ config });
  const col = payload.collections[collection as keyof typeof payload.collections];
  const accessFn = col?.config.access?.[operation];
  if (!accessFn) return false;
  const result = await accessFn({ req: { user } as never, data: {} } as never);
  return result === true;
}

describe.skipIf(!hasDatabase)("tenancy access control", () => {
  beforeAll(async () => {
    await getPayload({ config });
  });

  afterAll(async () => {
    const payload = await getPayload({ config });
    if (payload.db?.destroy) await payload.db.destroy();
  });

  for (const [slug, matrix] of Object.entries(ACCESS_MATRIX)) {
    describe(`${slug} access matrix`, () => {
      for (const operation of ["create", "read", "update", "delete"] as const) {
        it(`admin ${operation}: ${matrix.admin.includes(operation) ? "allowed" : "denied"}`, async () => {
          const user: TrisionUser = {
            id: "admin-test",
            role: "admin",
            collection: "usuarios",
            email: "admin@test.local",
          };
          expect(await canAccess(slug, operation, user)).toBe(matrix.admin.includes(operation));
        });

        it(`revendedor ${operation}: ${matrix.revendedor.includes(operation) ? "allowed" : "denied"}`, async () => {
          const user: TrisionUser = {
            id: "rev-test",
            role: "revendedor",
            collection: "usuarios",
            email: "rev@test.local",
            tenants: [{ tenant: "tenant-a" }],
          };
          expect(await canAccess(slug, operation, user)).toBe(matrix.revendedor.includes(operation));
        });
      }
    });
  }

  it("lock 1 — revendedor cannot create produtos with access enforced", async () => {
    const payload = await getPayload({ config });
    const user: TrisionUser = {
      id: "rev-lock",
      role: "revendedor",
      collection: "usuarios",
      email: "rev-lock@test.local",
      tenants: [{ tenant: "tenant-a" }],
    };
    await expect(
      payload.create({
        collection: "produtos",
        overrideAccess: false,
        user,
        data: {
          nome: "Teste",
          sku: "TEST-LOCK-1",
          marca: "Trísion",
          categoria: "grau",
          formato: "quadrado",
          material: "acetato",
          cor: { nome: "preto", hexAprox: "#000000" },
          genero: "unissex",
          medidas: { aro: 52, ponte: 18, haste: 145 },
          descricao: {
            root: { type: "root", children: [], direction: null, format: "", indent: 0, version: 1 },
          },
          status: "ativo",
        },
      } as never),
    ).rejects.toThrow();
  });
});
