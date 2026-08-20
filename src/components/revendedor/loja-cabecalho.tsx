"use client";

import { RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MarcaLockup, MarcaSimbolo } from "@/components/marca";
import * as Drawer from "@/components/ui/drawer";
import { RevendedorEndosso } from "@/components/revendedor/revendedor-endosso";
import type { Revendedor } from "@/lib/catalog/types";

/* Storefront nav — TASK-loja-navegacao.md, inverted in TASK-loja-cabecalho-invertido.md.
   A reseller is an endorsement, not a sub-brand (spec-brand.md §3) — so Trísion's own
   mark leads the header (left, every breakpoint, linking to `/`, same compact
   `MarcaLockup` scale `Cabecalho` uses), the reseller's framed identity badge
   (`RevendedorEndosso`, unchanged as a component) sits centered, and the storefront's
   own nav — tabs on `lg+`, the drawer hamburger below it — stays on the right, exactly
   where it already was. `Cabecalho` isn't reused wholesale on purpose — this still needs
   the shop's own nav destinations, not the brand's five-link menu. */
export function LojaCabecalho({ revendedor }: { revendedor: Revendedor }) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const base = `/loja/${revendedor.slug}`;

  const TABS = [
    { href: base, rotulo: "Vitrine" },
    { href: `${base}/a-loja`, rotulo: "A loja" },
  ];

  return (
    <header className="grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-4 px-[clamp(24px,5vw,88px)] py-6 lg:gap-6">
      <Link
        href="/"
        data-alvo
        aria-label="Ver o catálogo completo da Trísion"
        className="foco-visor block shrink-0 justify-self-start text-foco"
      >
        <MarcaSimbolo className="h-8 w-8 lg:hidden" />
        <div className="hidden lg:block">
          <MarcaLockup
            simbolo="w-7"
            texto="text-[1.0625rem]"
            subtexto="text-[.625rem]"
            gap="gap-3"
            desde={false}
            quebra={false}
          />
        </div>
      </Link>

      <div className="min-w-0 justify-self-center">
        <RevendedorEndosso revendedor={revendedor} compacto />
      </div>

      <div className="flex items-center justify-self-end">
        <nav className="hidden items-center gap-6 font-mono text-[.8125rem] uppercase tracking-[.1em] lg:flex">
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

        <button
          type="button"
          data-alvo
          onClick={() => setAberto(true)}
          aria-label="Abrir menu"
          className="foco-visor text-luz lg:hidden"
        >
          <RiMenuLine className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

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
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </header>
  );
}
