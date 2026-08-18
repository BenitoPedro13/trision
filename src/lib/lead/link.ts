import type { CategoriaProduto, MaterialProduto, MedidasProduto } from "@/lib/catalog/types";
import { formatarNumeracao } from "@/lib/numeracao";

export interface DadosContatoProduto {
  /** E.164. Empty ⇒ `montarLinkWhatsapp` returns `null` — never a fabricated number. */
  numero: string;
  revendedorNome?: string;
  cidade?: string;
  uf?: string;
  produtoNome: string;
  categoria: CategoriaProduto;
  material: MaterialProduto;
  cor: string;
  medidas?: MedidasProduto;
  /** Attribution code from `/ir/[rev]/[sku]` (`spec-architecture.md` §7.1) — Fase 1.
   * Absent in Fase 0: there is no `leads` collection to mint it against yet. */
  codigo?: string;
}

export interface DadosContatoGeral {
  /** E.164. Empty ⇒ `montarLinkWhatsapp` returns `null` — never a fabricated number. */
  numero: string;
  assunto: string;
}

export type DadosContatoWhatsapp = DadosContatoProduto | DadosContatoGeral;

/** The one `wa.me` builder (`spec-architecture.md` §6.3) — nothing else in this codebase
 * composes a WhatsApp URL. F&A Móveis shipped `localhost` into production messages because
 * more than one place built this string; that bug is already paid for.
 *
 * Product inquiries follow §7.3 exactly, minus the trailing `[codigo]` until `/ir/` exists.
 * General inquiries (`assunto`) cover pages with no product context — e.g. `/seja-revendedor`. */
export function montarLinkWhatsapp(dados: DadosContatoWhatsapp): string | null {
  const numeroLimpo = dados.numero.replace(/\D/g, "");
  if (!numeroLimpo) return null;

  const mensagem =
    "produtoNome" in dados
      ? (() => {
          const origem = dados.revendedorNome
            ? `Vim pela loja da ${dados.revendedorNome}${
                dados.cidade ? ` (${dados.cidade}${dados.uf ? `, ${dados.uf}` : ""})` : ""
              } e quero saber sobre o `
            : `Quero saber sobre o `;

          const numeracao = formatarNumeracao(dados.medidas);
          const ficha = [dados.categoria, dados.material, dados.cor, numeracao]
            .filter(Boolean)
            .join(", ");

          let texto = `Olá! ${origem}${dados.produtoNome} — ${ficha}.`;
          if (dados.codigo) texto += `  [${dados.codigo}]`;
          return texto;
        })()
      : `Olá! ${dados.assunto}`;

  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}
