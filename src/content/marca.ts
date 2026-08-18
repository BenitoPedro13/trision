import type { Marca } from "@/lib/catalog/types";

/** Brand config stand-in for Fase 0 — replaces the Payload `config` global in Fase 1. */
export const marca = {
  // [VERIFICAR: Amanda's real WhatsApp number, spec-brand.md §6 question 6]
  whatsapp: "",
  // [VERIFICAR: Amanda's Instagram handle, if public and confirmed]
  instagram: "",
  desde: 2002,
} as const satisfies Marca;
