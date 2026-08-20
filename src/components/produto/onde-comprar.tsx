import Link from "next/link";
import { revendedoresAtivos } from "@/lib/tenant/scope";

/* `OndeComprar` — spec-design.md §11's product-page purpose list. Reads through
   `lib/tenant/scope.ts` only (the one tenancy-scoping module) — never
   `content/revendedores.ts` directly. Every active reseller carries every active
   product now (`TASK-catalogo-unico-sem-mostruario.md`), so this no longer filters by
   sku — it just points to the directory. */
export async function OndeComprar() {
  const revendedores = await revendedoresAtivos();
  if (revendedores.length === 0) return null;

  return (
    <div>
      <p className="mb-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
        Onde encontrar
      </p>
      <Link
        href="/revendedores"
        data-alvo
        className="foco-visor text-[.8125rem] text-luz underline decoration-aro underline-offset-4 hover:decoration-prata"
      >
        Encontre uma revenda oficial perto de você
      </Link>
    </div>
  );
}
