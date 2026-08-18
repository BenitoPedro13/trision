import Image from "next/image";
import Link from "next/link";
import { Visor } from "@/components/visor";
import type { Colecao } from "@/lib/catalog/types";

export function ColecaoCard({ colecao }: { colecao: Colecao }) {
  return (
    <Link href={`/colecoes/${colecao.slug}`} data-alvo className="foco-visor block">
      <Visor>
        <div className="relative aspect-[4/5] bg-fumo">
          {colecao.capa && (
            <Image
              src={colecao.capa}
              alt={colecao.nome}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="text-[1.0625rem] font-medium text-luz">{colecao.nome}</p>
          <p className="font-mono text-[.8125rem] text-cinza">{colecao.ano}</p>
        </div>
      </Visor>
    </Link>
  );
}
