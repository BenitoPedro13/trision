import { Revela } from "@/components/revela";
import { ProdutoCard } from "./produto-card";
import type { Produto } from "@/lib/catalog/types";

/* The shared grid — `/catalogo` and `/loja/[rev]` both render this against the same
   catalogue (`spec-design.md` §11: "the two are the same components with a different
   tenantId"). If a storefront ever needs a grid this doesn't offer, that's the tenancy
   boundary being violated, not a reason to fork the component. */
export function GradeProdutos({
  produtos,
  hrefBase,
}: {
  produtos: Produto[];
  /** Passed through to `ProdutoCard` — see its own doc comment. */
  hrefBase?: string;
}) {
  if (produtos.length === 0) {
    return (
      <p className="border border-aro px-6 py-10 text-center text-sm text-cinza">
        Nenhum modelo encontrado com esses filtros.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {produtos.map((produto, i) => (
        <Revela key={produto.sku} atraso={Math.min(i * 0.08, 0.56)}>
          <ProdutoCard produto={produto} hrefBase={hrefBase} />
        </Revela>
      ))}
    </div>
  );
}
