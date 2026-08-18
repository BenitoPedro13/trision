import { notFound } from "next/navigation";
import { Ceu } from "@/components/ceu";
import { LojaCabecalho } from "@/components/revendedor/loja-cabecalho";
import { VisorCursor } from "@/components/visor-cursor";
import { escopoRevendedor } from "@/lib/tenant/scope";

/* Shared chrome for every /loja/[rev]/* page (TASK-loja-navegacao.md) — the same fix
   (marca)/layout.tsx applied to the brand site, applied here to the storefront. `[rev]`
   is already the dynamic segment every storefront route sits under, so a regular nested
   layout — not a route group — covers all four pages.

   Each page still calls `escopoRevendedor(rev)` again for its own content and keeps its
   own `if (!escopo) notFound()` guard for type narrowing; the second call is free in
   Fase 0 (in-memory content/*.ts arrays, no I/O). */
export default async function LojaRevLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ rev: string }>;
}) {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);
  if (!escopo) notFound();

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <LojaCabecalho revendedor={escopo.revendedor} />
        {children}
      </div>
    </>
  );
}
