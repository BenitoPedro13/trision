import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { Rodape } from "@/components/marca/rodape";
import { VisorCursor } from "@/components/visor-cursor";

/* Shared chrome for every brand-site route (TASK-footer.md) — `Ceu`, `VisorCursor`,
   `Cabecalho`, `Rodape` were identical boilerplate copy-pasted into eight page files
   before this. Deliberately does NOT wrap `children` in `ProvedorMotion`
   (`components/provedor-motion.tsx`): that's scoped to just `/` and `/apresentacao`,
   the only two routes mounting `FocoVerdadeiro` — putting `motion` here would pull the
   runtime onto every catalogue/grid route and blow the spec-design.md §12 JS budget, per
   that component's own comment. `/` still wraps its own `<main>` in `<ProvedorMotion>`.

   Route group, not a URL segment — `/`, `/catalogo`, etc. are unchanged. Deliberately NOT
   the same thing as the target `(marca)/` in AGENTS.md's "Layout (target)" section: this
   one exists only to share chrome; it doesn't wait on `middleware.ts` or the domain, and
   nothing here assumes subdomain routing. When Fase 1 adds that, this layout is what the
   route group already looks like — one less thing to build then, not a redo. */
export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        {children}
        <Rodape />
      </div>
    </>
  );
}
