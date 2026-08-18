import Link from "next/link";
import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { ColecaoCard } from "@/components/colecao/colecao-card";
import { MarcaLockup } from "@/components/marca";
import { VisorCursor } from "@/components/visor-cursor";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

/* The real homepage — replaces the holding page from TASK-scaffold-e-apresentacao.md.
   Every product/collection below is `exemplo: true`; the thesis line is static type,
   not React Bits' `TrueFocus` (spec-design.md §7.4) — that library isn't installed
   yet (TASK-frontend-fase-0.md §2.3). */
export default async function Home() {
  const colecoes = await catalogSourceLocal.listarColecoes();

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        <main className="flex flex-col gap-[clamp(64px,10vh,160px)] px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
          <section className="flex flex-col gap-10">
            <MarcaLockup />
            <p className="max-w-[18ch] text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-foco">
              Uma armação é uma decisão sobre o que você olha.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo"
                data-alvo
                className="foco-visor bg-ouro px-6 py-3.5 text-sm font-semibold text-noite transition-opacity hover:opacity-90"
              >
                Ver o catálogo
              </Link>
              <Link
                href="/loja/otica-exemplo"
                data-alvo
                className="foco-visor border border-aro px-6 py-3.5 text-sm font-semibold text-luz transition-colors hover:border-prata"
              >
                Encontre um revendedor
              </Link>
            </div>
          </section>

          {colecoes.length > 0 && (
            <section>
              <p className="mb-6 font-mono text-[.6875rem] uppercase tracking-[.16em] text-ouro">
                ⌐ 01 — Coleções ¬
              </p>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {colecoes.map((colecao) => (
                  <ColecaoCard key={colecao.slug} colecao={colecao} />
                ))}
              </div>
            </section>
          )}

          <footer className="border-t border-aro pt-8 font-mono text-[.75rem] text-cinza">
            <Link href="/apresentacao" data-alvo className="foco-visor hover:text-prata">
              A apresentação
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
}
