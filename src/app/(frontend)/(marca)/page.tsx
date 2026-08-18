import Link from "next/link";
import { ColecaoCard } from "@/components/colecao/colecao-card";
import { FocoVerdadeiro } from "@/components/foco-verdadeiro";
import { Revela } from "@/components/revela";
import { catalogSource } from "@/lib/catalog/source";

export default async function Home() {
  const colecoes = await catalogSource.listarColecoes();

  return (
    <main className="flex flex-col gap-[clamp(64px,10vh,160px)] px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
      <section className="flex min-h-[80vh] flex-col justify-center gap-10">
        <p className="text-[clamp(3rem,6.75vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-foco">
          <FocoVerdadeiro texto="Uma armação é uma decisão sobre o que você olha." />
        </p>
        <Revela className="flex flex-wrap items-center gap-4">
          <Link
            href="/catalogo"
            data-alvo
            className="iridescencia foco-visor bg-ouro px-6 py-3.5 text-sm font-semibold text-noite transition-opacity hover:opacity-90"
          >
            Ver o catálogo
          </Link>
          <Link
            href="/revendedores"
            data-alvo
            className="foco-visor border border-aro px-6 py-3.5 text-sm font-semibold text-luz transition-colors hover:border-prata"
          >
            Encontre um revendedor
          </Link>
        </Revela>
      </section>

      {colecoes.length > 0 && (
        <section>
          <Revela secao>
            <p className="mb-6 font-mono text-[.6875rem] uppercase tracking-[.16em] text-ouro">
              01 — Coleções
            </p>
          </Revela>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {colecoes.map((colecao, i) => (
              <Revela key={colecao.slug} atraso={Math.min(i * 0.08, 0.56)}>
                <ColecaoCard colecao={colecao} />
              </Revela>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
