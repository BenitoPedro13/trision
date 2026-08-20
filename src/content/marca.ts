import type { Marca } from "@/lib/catalog/types";

/** Brand config stand-in for Fase 0 — replaces the Payload `config` global in Fase 1. */
export const marca = {
  // Confirmed 2026-08-20 — spec-brand.md §6 question 3
  whatsapp: "+5521980118467",
  // Confirmed 2026-08-20 — spec-brand.md §6 question 3
  instagram: "trisioneyewear",
  // [VERIFICAR: a confirmed contact email, if she wants one public]
  email: "",
  desde: 2002,
} as const satisfies Marca;
