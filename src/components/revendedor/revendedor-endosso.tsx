import { Visor } from "@/components/visor";
import type { Revendedor } from "@/lib/catalog/types";

/* The exact attribution line from spec-brand.md §3 — a reseller is an endorsement,
   never a co-brand. Inside `Visor`: spec-design.md §3.1's "reseller badge" role —
   "a storefront is the catalogue in a frame, and the frame says whose." */
export function RevendedorEndosso({ revendedor }: { revendedor: Revendedor }) {
  return (
    <Visor className="inline-block px-4 py-3">
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
