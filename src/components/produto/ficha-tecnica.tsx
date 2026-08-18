import { Numeracao } from "@/components/numeracao";
import type { Produto } from "@/lib/catalog/types";

/* `FichaTecnica` — spec-design.md §8, the WEB Eyewear tech-spec-table reference
   (references/frames/web-eyewear/014.jpg): Fit/Form/Material/Color as a hairline
   grid. Numeração renders nothing if a product has no measurements — never a
   placeholder (spec-design.md §5's binding rule). */
export function FichaTecnica({ produto }: { produto: Produto }) {
  const linhas: [string, string][] = [
    ["Formato", produto.formato],
    ["Material", produto.material],
    ["Cor", produto.cor],
    ["Gênero", produto.genero],
  ];

  return (
    <dl className="divide-y divide-aro border-y border-aro">
      {linhas.map(([rotulo, valor]) => (
        <div key={rotulo} className="flex items-center justify-between py-3">
          <dt className="text-[.8125rem] text-cinza">{rotulo}</dt>
          <dd className="text-[.8125rem] capitalize text-luz">{valor}</dd>
        </div>
      ))}
      {produto.medidas && (
        <div className="flex items-center justify-between py-3">
          <dt className="text-[.8125rem] text-cinza">Numeração</dt>
          <dd>
            <Numeracao {...produto.medidas} className="text-[.8125rem] text-luz" tamanho={10} />
          </dd>
        </div>
      )}
    </dl>
  );
}
