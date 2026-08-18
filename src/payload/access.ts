import type { Access, FieldAccess, PayloadRequest, Where } from "payload";

export type UserRole = "admin" | "revendedor";

export interface TrisionUser {
  id: number | string;
  role: UserRole;
  collection: "usuarios";
  email: string;
  tenants?: { tenant: number | string; id?: string }[];
}

export function getUser(req: PayloadRequest): TrisionUser | null {
  return (req.user as TrisionUser | null | undefined) ?? null;
}

export const isAdmin = (user: TrisionUser | null): boolean => user?.role === "admin";

export const isRevendedor = (user: TrisionUser | null): boolean =>
  user?.role === "revendedor";

/** Lock 1 — only admins create products (`spec-architecture.md` §6.2). */
export const adminOnly: Access = ({ req }) => isAdmin(getUser(req));

export const produtosRead: Access = ({ req }) => {
  const user = getUser(req);
  if (isAdmin(user)) return true;
  if (isRevendedor(user)) {
    return { status: { equals: "ativo" } } satisfies Where;
  }
  return true;
};

export const adminOrSelfUsuarios: Access = ({ req, id }) => {
  const user = getUser(req);
  if (isAdmin(user)) return true;
  if (!user) return false;
  return { id: { equals: user.id } } satisfies Where;
};

export const revendedorOwnTenantUpdate: Access = ({ req }) => {
  const user = getUser(req);
  if (isAdmin(user)) return true;
  if (!user || !isRevendedor(user) || !user.tenants?.length) return false;
  const tenantIds = user.tenants.map((t) => t.tenant);
  return { id: { in: tenantIds } } satisfies Where;
};

export const revendedorFieldUpdate =
  (allowed: boolean): FieldAccess =>
  ({ req }) =>
    isAdmin(getUser(req)) || allowed;

export const revendedorFieldRead =
  (allowed: boolean): FieldAccess =>
  ({ req }) =>
    isAdmin(getUser(req)) || allowed;
