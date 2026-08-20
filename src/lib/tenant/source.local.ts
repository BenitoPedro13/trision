import { revendedores } from "@/content/revendedores";
import type { TenantSource } from "./source";

/** Fase 0 implementation — reads typed TS modules in `content/`, no I/O. */
export const tenantSourceLocal: TenantSource = {
  async listarRevendedores() {
    return [...revendedores];
  },

  async buscarRevendedorPorSlug(slug) {
    return revendedores.find((r) => r.slug === slug);
  },
};
