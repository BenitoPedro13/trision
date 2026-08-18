import Image from "next/image";
import Link from "next/link";
import { Numeracao } from "@/components/numeracao";
import { Visor } from "@/components/visor";
import type { Produto } from "@/lib/catalog/types";

/* `ProdutoCard` — spec-design.md §8. Each frame sits inside brackets, not a box: the
   card itself has no border, only the four corners `Visor` draws (§3.1's binding
   rule — a bracket must frame something real, and a product tile is exactly that). */
export function ProdutoCard({ produto }: { produto: Produto }) {
  return (
    <Link href={`/oculos/${produto.sku}`} data-alvo className="foco-visor block">
      <Visor>
        <div className="relative aspect-square rounded-[var(--radius-lente)] bg-lente">
          {produto.fotos[0] ? (
            <Image
              src={produto.fotos[0]}
              alt={produto.nome}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="rounded-[var(--radius-lente)] object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: produto.corHex }}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div>
            <p className="text-[.9375rem] font-medium text-luz">{produto.nome}</p>
            <Numeracao {...produto.medidas} className="mt-1 text-[.75rem] text-cinza" />
          </div>
          <p className="shrink-0 font-mono text-[.8125rem] text-prata">
            {produto.precoSugerido != null
              ? `R$ ${produto.precoSugerido.toLocaleString("pt-BR")}`
              : "Consulte o valor"}
          </p>
        </div>
        {produto.exemplo && (
          <p className="mt-1 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
            exemplo
          </p>
        )}
      </Visor>
    </Link>
  );
}
