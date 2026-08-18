"use client";

import { RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MarcaSimbolo } from "@/components/marca";
import * as Drawer from "@/components/ui/drawer";
import { RevendedorEndosso } from "@/components/revendedor/revendedor-endosso";
import type { Revendedor } from "@/lib/catalog/types";

/* Storefront nav — TASK-loja-navegacao.md. Every /loja/[rev]/* page used to render just
   `RevendedorEndosso` in its header with no links at all: a visitor landing on a deep link
   had no way back to the shop's own front page short of the browser back button. `Cabecalho`
   isn't reused here on purpose — this needs the shop's own identity, not the brand's
   (spec-brand.md §3), so it's a separate small component, not a variant of that one.

   First pass crammed the three tabs + mark icon inline at every width, `flex-wrap`, no
   drawer — measured fine at 375px with no overflow, but user feedback ("no mobile menu for
   revendedores") wanted the same off-canvas pattern `Cabecalho` already uses, not just
   "doesn't overflow." Mirrors that component's `lg:` breakpoint and `Drawer` usage exactly
   for consistency, rather than a second mobile-nav idiom on the same site. */
export function LojaCabecalho({ revendedor }: { revendedor: Revendedor }) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const base = `/loja/${revendedor.slug}`;

  const TABS = [
    { href: base, rotulo: "Vitrine" },
    { href: `${base}/mostruario`, rotulo: "Mostruário" },
    { href: `${base}/a-loja`, rotulo: "A loja" },
  ];

  return (
    <header className="flex flex-wrap items-center justify-between gap-6 px-[clamp(24px,5vw,88px)] py-6">
      <RevendedorEndosso revendedor={revendedor} />

      <div className="hidden items-center gap-6 lg:flex">
        <nav className="flex items-center gap-6 font-mono text-[.8125rem] uppercase tracking-[.1em]">
          {TABS.map(({ href, rotulo }) => (
            <Link
              key={href}
              href={href}
              data-alvo
              aria-current={pathname === href ? "page" : undefined}
              className={`foco-visor hover:text-luz ${
                pathname === href ? "text-luz" : "text-prata"
              }`}
            >
              {rotulo}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          data-alvo
          aria-label="Ver o catálogo completo da Trísion"
          className="foco-visor block text-cinza transition-colors hover:text-prata"
        >
          <MarcaSimbolo className="h-6 w-6" />
        </Link>
      </div>

      <button
        type="button"
        data-alvo
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        className="foco-visor text-luz lg:hidden"
      >
        <RiMenuLine className="h-6 w-6" aria-hidden="true" />
      </button>
      <Drawer.Root open={aberto} onOpenChange={setAberto}>
        <Drawer.Content className="lg:hidden">
          <Drawer.Header className="border-b border-stroke-soft-200">
            <Drawer.Title>Menu</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-1 p-5">
            {TABS.map(({ href, rotulo }) => (
              <Link
                key={href}
                href={href}
                data-alvo
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setAberto(false)}
                className={`foco-visor py-3 font-mono text-[.9375rem] uppercase tracking-[.1em] hover:text-luz ${
                  pathname === href ? "text-luz" : "text-prata"
                }`}
              >
                {rotulo}
              </Link>
            ))}
            <Link
              href="/"
              data-alvo
              onClick={() => setAberto(false)}
              className="foco-visor py-3 font-mono text-[.9375rem] uppercase tracking-[.1em] text-cinza hover:text-prata"
            >
              Catálogo Trísion
            </Link>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </header>
  );
}
