/* Trailing slashes are stripped here, once. F&A Móveis shipped two production bugs
   on exactly this (`e40ec63`, `e57ef97`) — an empty or slashed SITE_URL broke the
   build and then broke every OG card. One normalisation, one place. */
const bruto = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://trision.vercel.app";

export const SITE_URL = bruto.replace(/\/+$/, "");

export const SITE = {
  nome: "Trísion Eyewear",
  /* The accent is part of the spelling — including in <title> and OG tags. */
  titulo: "Trísion Eyewear",
  slogan: "Uma vitrine para cada revendedor. Um catálogo só.",
  descricao:
    "Trísion Eyewear, desde 2002. Óculos selecionados por quem é obcecada por óculos — com uma vitrine própria para cada revendedor.",
  desde: "2002",
  locale: "pt_BR",
} as const;
