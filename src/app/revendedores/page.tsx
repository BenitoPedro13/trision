import type { Metadata } from "next";
import Link from "next/link";
import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { RevendedorEndosso } from "@/components/revendedor/revendedor-endosso";
import { Revela } from "@/components/revela";
import { VisorCursor } from "@/components/visor-cursor";
import { marca } from "@/content/marca";
import { revendedoresAtivos } from "@/lib/tenant/scope";

export const metadata: Metadata = { title: "Revendedores" };

export default async function RevendedoresPage() {
  const revendedores = await revendedoresAtivos();

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
          <Revela secao>
            <h1 className="mb-4 text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
              Revendedores
            </h1>
            <p className="mb-10 max-w-[42ch] text-[1.0625rem] leading-relaxed text-luz">
              A rede de revendas oficiais Trísion Eyewear — desde {marca.desde}, escolhida
              armação a armação.
            </p>
          </Revela>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {revendedores.map((revendedor, i) => (
              <Revela key={revendedor.slug} atraso={Math.min(i * 0.08, 0.56)}>
                <Link
                  href={`/loja/${revendedor.slug}`}
                  data-alvo
                  className="foco-visor inline-block transition-opacity hover:opacity-90"
                >
                  <RevendedorEndosso revendedor={revendedor} />
                </Link>
              </Revela>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
