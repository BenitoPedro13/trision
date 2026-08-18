import Link from "next/link";
import { MarcaSimbolo } from "@/components/marca";

/* Shared nav for every marca route added in TASK-frontend-fase-0.md. Storefront pages
   (`/loja/[rev]`) render their own header via `RevendedorEndosso` instead — the mark
   stays Trísion's everywhere (spec-brand.md §3), but the storefront's identity line
   takes the header's place there rather than sitting beside it. */
export function Cabecalho() {
  return (
    <header className="relative z-10 flex items-center justify-between px-[clamp(24px,5vw,88px)] py-6">
      <Link href="/" data-alvo className="foco-visor block">
        <MarcaSimbolo className="h-8 w-8 text-foco" />
        <span className="sr-only">Trísion Eyewear</span>
      </Link>
      <nav className="flex items-center gap-6 font-mono text-[.8125rem] uppercase tracking-[.1em] text-prata">
        <Link href="/catalogo" data-alvo className="foco-visor hover:text-luz">
          Catálogo
        </Link>
        <Link href="/colecoes" data-alvo className="foco-visor hover:text-luz">
          Coleções
        </Link>
        <Link href="/revendedores" data-alvo className="foco-visor hover:text-luz">
          Revendedores
        </Link>
        <Link href="/seja-revendedor" data-alvo className="foco-visor hover:text-luz">
          Seja revendedor
        </Link>
      </nav>
    </header>
  );
}
