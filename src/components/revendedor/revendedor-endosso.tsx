import Link from "next/link";
import { Visor } from "@/components/visor";
import type { Revendedor } from "@/lib/catalog/types";

/* The exact attribution line from spec-brand.md §3 — a reseller is an endorsement,
   never a co-brand. Inside `Visor`: spec-design.md §3.1's "reseller badge" role —
   "a storefront is the catalogue in a frame, and the frame says whose."

   `inline-block` by default (shrink-to-fit, right for `LojaCabecalho`'s flex row).
   `/revendedores` passes `className="w-full"` instead — without it, each grid card
   shrink-wraps to its own reseller name's length, so cards in the same row land at
   different widths and the bracket frames stop lining up (user report, screenshot).

   `compacto` (`LojaCabecalho`'s centered header badge, TASK-loja-cabecalho-invertido.md)
   drops the always-on `Visor` frame and the "Trísion Eyewear" kicker (redundant next to
   the header's own mark) in favour of the site's existing hover/focus bracket system —
   `data-alvo` + `foco-visor` — the same mechanism every other header/nav target already
   uses (`VisorCursor` snaps its brackets on hover, `.foco-visor:focus-visible::after`
   draws them on keyboard focus). The full 3-line badge wrapped onto 4 lines at mid
   viewport widths and visually dominated the header (user screenshot); a permanently
   framed box was also the wrong read for a compact header slot — "a bracket frames
   something real: focus, selection" (`AGENTS.md` §0), not a passive label. */
export function RevendedorEndosso({
  revendedor,
  className = "",
  compacto = false,
}: {
  revendedor: Revendedor;
  className?: string;
  compacto?: boolean;
}) {
  if (compacto) {
    return (
      <Link
        href={`/loja/${revendedor.slug}/a-loja`}
        data-alvo
        className={`foco-visor block px-2 py-1 text-center text-[.8125rem] text-luz transition-colors hover:text-foco ${className}`}
      >
        Revenda oficial · {revendedor.nome} · {revendedor.cidade}, {revendedor.uf}
        {revendedor.exemplo && (
          <span className="ml-2 font-mono text-[.625rem] uppercase tracking-[.16em] text-cinza">
            exemplo
          </span>
        )}
      </Link>
    );
  }

  return (
    <Visor className={`inline-block px-4 py-3 ${className}`}>
      <p className="font-mono text-[.6875rem] uppercase tracking-[.2em] text-ouro">
        Trísion Eyewear
      </p>
      <p className="mt-1 text-[.9375rem] text-luz">
        Revenda oficial · {revendedor.nome} · {revendedor.cidade}, {revendedor.uf}
      </p>
      {revendedor.exemplo && (
        <p className="mt-1 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
          exemplo
        </p>
      )}
    </Visor>
  );
}
