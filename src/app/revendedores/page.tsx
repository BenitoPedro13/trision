import type { Metadata } from "next";
import Link from "next/link";
import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import {
  FiltroRevendedores,
  type FiltrosRevendedoresAtivos,
} from "@/components/revendedor/filtro-revendedores";
import { RevendedorEndosso } from "@/components/revendedor/revendedor-endosso";
import { Revela } from "@/components/revela";
import { VisorCursor } from "@/components/visor-cursor";
import { marca } from "@/content/marca";
import { revendedoresAtivos } from "@/lib/tenant/scope";

export const metadata: Metadata = { title: "Revendedores" };

export default async function RevendedoresPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ativos: FiltrosRevendedoresAtivos = {
    cidade: typeof params.cidade === "string" ? params.cidade : undefined,
    uf: typeof params.uf === "string" ? params.uf : undefined,
  };

  const todos = await revendedoresAtivos();
  const ufsDisponiveis = [...new Set(todos.map((r) => r.uf))].sort();
  // A city belongs to exactly one UF, so once a UF is active the Cidade row only
  // offers cities that actually exist inside it — otherwise cidade+uf could combine
  // into a self-contradicting filter (e.g. cidade=São Paulo, uf=PR) that always
  // returns zero results. See TASK-loja-identidade-e-busca-revendedores.md §2.5.
  const cidadesDisponiveis = [
    ...new Set(
      todos.filter((r) => !ativos.uf || r.uf === ativos.uf).map((r) => r.cidade),
    ),
  ].sort();

  const revendedores = todos.filter(
    (r) =>
      (!ativos.cidade || r.cidade === ativos.cidade) &&
      (!ativos.uf || r.uf === ativos.uf),
  );

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
          <FiltroRevendedores
            basePath="/revendedores"
            ativos={ativos}
            cidadesDisponiveis={cidadesDisponiveis}
            ufsDisponiveis={ufsDisponiveis}
          />
          {revendedores.length === 0 ? (
            <p className="border border-aro px-6 py-10 text-center text-sm text-cinza">
              Nenhuma revenda encontrada com esses filtros.
            </p>
          ) : (
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
          )}
        </main>
      </div>
    </>
  );
}
