import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ceu } from "@/components/ceu";
import { GradeProdutos } from "@/components/produto/grade-produtos";
import { Revela } from "@/components/revela";
import { RevendedorEndosso } from "@/components/revendedor/revendedor-endosso";
import { VisorCursor } from "@/components/visor-cursor";
import { escopoRevendedor, revendedoresAtivosSlugs } from "@/lib/tenant/scope";

/* Fase 0 path shape — see TASK-frontend-fase-0.md §2.4. `<slug>.trision.com.br/` is
   the real target once the domain and `middleware.ts` exist; this route is very
   likely deleted, not evolved, when that lands. */
export async function generateStaticParams() {
  const slugs = await revendedoresAtivosSlugs();
  return slugs.map((rev) => ({ rev }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rev: string }>;
}): Promise<Metadata> {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);
  return { title: escopo ? escopo.revendedor.nome : "Loja" };
}

export default async function LojaPage({ params }: { params: Promise<{ rev: string }> }) {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);
  if (!escopo) notFound();

  const { revendedor, itens } = escopo;
  const destaques = itens.filter((item) => item.destaque);
  const vitrine = destaques.length > 0 ? destaques : itens;

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <header className="px-[clamp(24px,5vw,88px)] py-6">
          <Revela secao>
            <RevendedorEndosso revendedor={revendedor} />
          </Revela>
        </header>
        <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
          <Revela secao>
            <p className="mb-10 max-w-[60ch] text-[1.0625rem] leading-relaxed text-luz">
              {revendedor.sobre}
            </p>
          </Revela>
          <GradeProdutos
            produtos={vitrine.map((item) => item.produto)}
            hrefBase={`/loja/${revendedor.slug}/oculos`}
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/loja/${revendedor.slug}/a-loja`}
              data-alvo
              className="foco-visor inline-block border border-aro px-6 py-3.5 text-sm font-semibold text-luz transition-colors hover:border-prata"
            >
              Endereço e horários
            </Link>
            {itens.length > vitrine.length && (
              <Link
                href={`/loja/${revendedor.slug}/mostruario`}
                data-alvo
                className="foco-visor inline-block border border-aro px-6 py-3.5 text-sm font-semibold text-luz transition-colors hover:border-prata"
              >
                Ver tudo que essa loja tem
              </Link>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
