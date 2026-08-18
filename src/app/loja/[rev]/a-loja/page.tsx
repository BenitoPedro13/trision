import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ceu } from "@/components/ceu";
import { Revela } from "@/components/revela";
import { RevendedorEndosso } from "@/components/revendedor/revendedor-endosso";
import { VisorCursor } from "@/components/visor-cursor";
import { escopoRevendedor, revendedoresAtivosSlugs } from "@/lib/tenant/scope";

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
  return { title: escopo ? `A loja · ${escopo.revendedor.nome}` : "Loja" };
}

function CampoIdentidade({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
        {rotulo}
      </p>
      <p className="text-[1.0625rem] leading-relaxed text-luz">{valor}</p>
    </div>
  );
}

export default async function ALojaPage({ params }: { params: Promise<{ rev: string }> }) {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);
  if (!escopo) notFound();

  const { revendedor } = escopo;

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
            <h1 className="mb-10 text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
              A loja
            </h1>
          </Revela>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[min(420px,100%)_1fr] lg:gap-16">
            <Revela secao>
              {revendedor.retrato ? (
                <div className="relative aspect-square rounded-[var(--radius-lente)] bg-lente">
                  <Image
                    src={revendedor.retrato}
                    alt={revendedor.nome}
                    fill
                    className="rounded-[var(--radius-lente)] object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-[var(--radius-lente)] bg-lente">
                  <p className="font-mono text-[.75rem] uppercase tracking-[.16em] text-lente-tinta">
                    Sem foto
                  </p>
                </div>
              )}
            </Revela>
            <Revela secao atraso={0.08}>
              <div className="flex flex-col gap-8">
                {revendedor.endereco && (
                  <CampoIdentidade rotulo="Endereço" valor={revendedor.endereco} />
                )}
                {revendedor.horarios && (
                  <CampoIdentidade rotulo="Horários" valor={revendedor.horarios} />
                )}
              </div>
            </Revela>
          </div>
          <Link
            href={`/loja/${revendedor.slug}`}
            data-alvo
            className="foco-visor mt-10 inline-block border border-aro px-6 py-3.5 text-sm font-semibold text-luz transition-colors hover:border-prata"
          >
            Voltar à vitrine
          </Link>
        </main>
      </div>
    </>
  );
}
