"use client";

import { useState } from "react";
import Image from "next/image";
import type { Produto } from "@/lib/catalog/types";

/* `GaleriaProduto` — spec-design.md §11. Selected-thumbnail state belongs to this
   component alone (nothing else in the tree reads or writes it), so `useState` is
   correct and reaching for Zustand here would be state management for its own sake
   — contrast with `filtro-store.ts`, which exists precisely because its state is
   shared between siblings. See TASK-frontend-fase-0.md §3.

   No photography exists yet (TASK-normalizar-imagens.md ships the pipeline, not
   content) — every example product's `fotos` is `[]`. The empty state below is
   honest about that: a `--lente` plate labelled "sem foto," not an invented photo. */
export function GaleriaProduto({ produto }: { produto: Produto }) {
  const [indice, setIndice] = useState(0);

  if (produto.fotos.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[var(--radius-lente)] bg-lente">
        <p className="font-mono text-[.75rem] uppercase tracking-[.16em] text-lente-tinta">
          Sem foto
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square rounded-[var(--radius-lente)] bg-lente">
        <Image
          src={produto.fotos[indice]}
          alt={produto.nome}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="rounded-[var(--radius-lente)] object-cover"
        />
      </div>
      {produto.fotos.length > 1 && (
        <div className="mt-3 flex gap-2">
          {produto.fotos.map((foto, i) => (
            <button
              key={foto}
              type="button"
              data-alvo
              onClick={() => setIndice(i)}
              aria-current={i === indice}
              className={`foco-visor relative h-16 w-16 shrink-0 rounded-[var(--radius-lente)] bg-lente ${
                i === indice ? "outline outline-1 outline-ouro" : ""
              }`}
            >
              <Image
                src={foto}
                alt=""
                fill
                sizes="64px"
                className="rounded-[var(--radius-lente)] object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
