import { Visor } from "@/components/visor";
import type { Revendedor } from "@/lib/catalog/types";

/* The exact attribution line from spec-brand.md §3 — a reseller is an endorsement,
   never a co-brand. Inside `Visor`: spec-design.md §3.1's "reseller badge" role —
   "a storefront is the catalogue in a frame, and the frame says whose."

   `inline-block` by default (shrink-to-fit, right for `LojaCabecalho`'s flex row).
   `/revendedores` passes `className="w-full"` instead — without it, each grid card
   shrink-wraps to its own reseller name's length, so cards in the same row land at
   different widths and the bracket frames stop lining up (user report, screenshot). */
export function RevendedorEndosso({
  revendedor,
  className = "",
}: {
  revendedor: Revendedor;
  className?: string;
}) {
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
