import type { Revendedor } from "@/lib/catalog/types";

/** Mock resellers for Fase 0 — exercises the storefront, directory filter, and tenancy
 * seam ahead of Fase 1's Payload-backed `revendedores`. Fictional shops, obviously so
 * (`exemplo: true`), same license as `content/produtos.ts`. */
export const revendedores = [
  {
    nome: "Ótica Exemplo",
    slug: "otica-exemplo",
    cidade: "Volta Redonda",
    uf: "RJ",
    // [VERIFICAR: not a real shop — a fake number here would be worse than none]
    whatsapp: "",
    instagram: "",
    sobre:
      "Loja de demonstração para o scaffold do storefront. Não é uma revenda real da Trísion.",
    // [VERIFICAR: placeholder address — not a real shop location]
    endereco: "Rua Exemplo, 100 — Centro, Volta Redonda — RJ",
    horarios: "Seg–Sex 9h–18h · Sáb 9h–13h",
    retrato: "",
    status: "ativo",
    exemplo: true,
  },
  {
    nome: "Ótica Demonstração",
    slug: "otica-demonstracao",
    cidade: "São Paulo",
    uf: "SP",
    whatsapp: "",
    instagram: "",
    sobre:
      "Segunda loja de demonstração — só para exercitar o filtro por cidade e UF no diretório.",
    endereco: "Av. Exemplo, 500 — Bela Vista, São Paulo — SP",
    horarios: "Seg–Sex 10h–19h",
    retrato: "",
    status: "ativo",
    exemplo: true,
  },
  {
    nome: "Loja Exemplo",
    slug: "loja-exemplo",
    cidade: "Curitiba",
    uf: "PR",
    whatsapp: "",
    instagram: "",
    sobre: "Terceira loja fictícia — outra UF no filtro, outro slug no storefront.",
    endereco: "Rua Demonstração, 42 — Batel, Curitiba — PR",
    horarios: "Seg–Sex 9h–18h · Sáb 9h–12h",
    retrato: "",
    status: "ativo",
    exemplo: true,
  },
] as const satisfies readonly Revendedor[];
