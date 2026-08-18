"use client";

import { RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { MarcaLockup } from "@/components/marca";
import * as Drawer from "@/components/ui/drawer";

const LINKS = [
  { href: "/catalogo", rotulo: "Catálogo" },
  { href: "/colecoes", rotulo: "Coleções" },
  { href: "/revendedores", rotulo: "Revendedores" },
  { href: "/sobre", rotulo: "Sobre" },
  { href: "/seja-revendedor", rotulo: "Seja revendedor" },
];

/* Shared nav for every marca route added in TASK-frontend-fase-0.md. Renders the same
   `MarcaLockup` used at hero scale on `/`, just scaled down (TASK-logo-cabecalho-
   unificado.md) — one logo treatment at two sizes, not a separate icon-only mark that
   duplicated the hero's full lockup. Storefront pages (`/loja/[rev]`) render their own
   header via `RevendedorEndosso` instead — the mark stays Trísion's everywhere
   (spec-brand.md §3), but the storefront's identity line takes the header's place
   there rather than sitting beside it.

   `/sobre` added to this list (TASK-footer.md originally left it out — "a separate,
   nameable task if wanted" — but on mobile this drawer is the *only* nav, the desktop
   row is hidden entirely, so leaving a real route out of it was a bigger gap than it
   looked on desktop, where the footer at least also links to it; user caught it: "no
   Sobre on mobile menu").

   Below `lg` the four links don't fit beside the mark (TASK-nav-mobile.md) — reuses the
   off-canvas `Drawer` chrome `FiltroDrawer` already ships on `/catalogo`, rather than a
   second mobile-menu pattern. One component owns the open/closed state alone, so plain
   `useState` is correct here (AGENTS.md §0, state-management point 5) — no store needed. */
export function Cabecalho() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="relative z-10 flex items-center justify-between px-[clamp(24px,5vw,88px)] py-6">
      <Link href="/" data-alvo className="foco-visor block">
        <MarcaLockup
          simbolo="w-7"
          texto="text-[1.0625rem]"
          subtexto="text-[.625rem]"
          gap="gap-3"
        />
      </Link>
      <nav className="hidden items-center gap-6 font-mono text-[.8125rem] uppercase tracking-[.1em] text-prata lg:flex">
        {LINKS.map(({ href, rotulo }) => (
          <Link key={href} href={href} data-alvo className="foco-visor hover:text-luz">
            {rotulo}
          </Link>
        ))}
      </nav>
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
            {LINKS.map(({ href, rotulo }) => (
              <Link
                key={href}
                href={href}
                data-alvo
                onClick={() => setAberto(false)}
                className="foco-visor py-3 font-mono text-[.9375rem] uppercase tracking-[.1em] text-prata hover:text-luz"
              >
                {rotulo}
              </Link>
            ))}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </header>
  );
}
