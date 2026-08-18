import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { Rodape } from "@/components/marca/rodape";
import { ProvedorMotion } from "@/components/provedor-motion";
import { VisorCursor } from "@/components/visor-cursor";

/* Shared chrome for every brand-site route (TASK-footer.md) — `Ceu`, `VisorCursor`,
   `Cabecalho`, `Rodape` were identical boilerplate copy-pasted into eight page files
   before this.

   `ProvedorMotion` now wraps `children` here too (it didn't originally — `motion` was
   scoped to just `/` and `/apresentacao`, the only two routes mounting `FocoVerdadeiro`,
   to protect the spec-design.md §12 JS budget). Reversed once `Revela` itself moved from
   CSS-only to `motion/react` (`components/revela.tsx`) — every route rendering a grid or
   card list needs `motion` now regardless, so gating it here bought nothing. `/`'s own
   local `<ProvedorMotion>` around its hero `<main>` was removed as redundant.

   Route group, not a URL segment — `/`, `/catalogo`, etc. are unchanged. Deliberately NOT
   the same thing as the target `(marca)/` in AGENTS.md's "Layout (target)" section: this
   one exists only to share chrome; it doesn't wait on `middleware.ts` or the domain, and
   nothing here assumes subdomain routing. When Fase 1 adds that, this layout is what the
   route group already looks like — one less thing to build then, not a redo. */
export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProvedorMotion>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        {children}
        <Rodape />
      </div>
    </ProvedorMotion>
  );
}
