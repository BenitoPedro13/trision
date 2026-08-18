import Link from "next/link";
import { revendedoresQueCarregam } from "@/lib/tenant/scope";

/* `OndeComprar` — spec-design.md §11's product-page purpose list. Reads through
   `lib/tenant/scope.ts` only (the one tenancy-scoping module) — never
   `content/revendedores.ts`/`content/mostruario.ts` directly. */
export async function OndeComprar({ sku }: { sku: string }) {
  const revendedores = await revendedoresQueCarregam(sku);
  if (revendedores.length === 0) return null;

  return (
    <div>
      <p className="mb-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
        Onde encontrar
      </p>
      <ul className="flex flex-col gap-1.5">
        {revendedores.map((revendedor) => (
          <li key={revendedor.slug}>
            <Link
              href={`/loja/${revendedor.slug}`}
              data-alvo
              className="foco-visor text-[.8125rem] text-luz underline decoration-aro underline-offset-4 hover:decoration-prata"
            >
              {revendedor.nome} — {revendedor.cidade}, {revendedor.uf}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
