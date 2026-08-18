import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";

import type { Colecao, MostruarioItem, Produto, Revendedor } from "@/lib/catalog/types";

type MediaDoc = { url?: string | null };

type ColecaoDoc = { slug: string };

type ProdutoDoc = {
  nome: string;
  sku: string;
  marca: string;
  colecao: ColecaoDoc | string | number;
  categoria: Produto["categoria"];
  formato: Produto["formato"];
  material: Produto["material"];
  cor: { nome: string; hexAprox: string };
  genero: Produto["genero"];
  medidas: Produto["medidas"];
  fotos?: { foto: MediaDoc | string | number }[] | null;
  descricao: Record<string, unknown> | string;
  precoSugerido?: number | null;
  status: Produto["status"];
};

type RevendedorDoc = {
  nome: string;
  slug: string;
  cidade: string;
  uf: string;
  whatsapp?: string | null;
  instagram?: string | null;
  sobre?: string | null;
  endereco?: { texto?: string | null } | null;
  horarios?: { texto?: string | null } | null;
  retrato?: MediaDoc | string | number | null;
  status: Revendedor["status"];
};

type MostruarioDoc = {
  revendedor: RevendedorDoc | string | number;
  produto: ProdutoDoc | string | number;
  disponivel?: boolean | null;
  destaque?: boolean | null;
  ordem: number;
  observacao?: string | null;
};

function mediaUrl(value: MediaDoc | string | number | null | undefined): string {
  if (!value || typeof value === "string" || typeof value === "number") return "";
  return value.url ?? "";
}

function colecaoSlug(value: ColecaoDoc | string | number): string {
  if (typeof value === "object" && value !== null && "slug" in value) return value.slug;
  return "";
}

function descricaoPlain(value: ProdutoDoc["descricao"]): string {
  if (typeof value === "string") return value;
  if (!value) return "";
  return convertLexicalToPlaintext({
    data: value as unknown as Parameters<typeof convertLexicalToPlaintext>[0]["data"],
  });
}

export function mapProduto(doc: ProdutoDoc): Produto {
  return {
    nome: doc.nome,
    sku: doc.sku,
    marca: doc.marca,
    colecaoSlug: colecaoSlug(doc.colecao),
    categoria: doc.categoria,
    formato: doc.formato,
    material: doc.material,
    cor: doc.cor.nome,
    corHex: doc.cor.hexAprox,
    genero: doc.genero,
    medidas: doc.medidas,
    fotos: (doc.fotos ?? []).map((item) => mediaUrl(item.foto)).filter(Boolean),
    descricao: descricaoPlain(doc.descricao),
    precoSugerido: doc.precoSugerido ?? undefined,
    status: doc.status,
    exemplo: false,
  };
}

export function mapColecao(doc: {
  nome: string;
  slug: string;
  ano: number;
  capa?: MediaDoc | string | number | null;
  texto: string;
}): Colecao {
  return {
    nome: doc.nome,
    slug: doc.slug,
    ano: doc.ano,
    capa: mediaUrl(doc.capa),
    texto: doc.texto,
  };
}

export function mapRevendedor(doc: RevendedorDoc): Revendedor {
  return {
    nome: doc.nome,
    slug: doc.slug,
    cidade: doc.cidade,
    uf: doc.uf,
    whatsapp: doc.whatsapp ?? "",
    instagram: doc.instagram ?? "",
    sobre: doc.sobre ?? "",
    endereco: doc.endereco?.texto ?? "",
    horarios: doc.horarios?.texto ?? "",
    retrato: mediaUrl(doc.retrato),
    status: doc.status,
    exemplo: false,
  };
}

export function mapMostruario(doc: MostruarioDoc): MostruarioItem | null {
  const revendedor = doc.revendedor;
  if (typeof revendedor !== "object" || revendedor === null || !("slug" in revendedor)) {
    return null;
  }
  const produto = doc.produto;
  const produtoSku =
    typeof produto === "object" && produto !== null && "sku" in produto ? produto.sku : null;
  if (!produtoSku) return null;
  return {
    revendedorSlug: revendedor.slug,
    produtoSku,
    disponivel: doc.disponivel ?? true,
    destaque: doc.destaque ?? false,
    ordem: doc.ordem,
    observacao: doc.observacao ?? undefined,
  };
}
