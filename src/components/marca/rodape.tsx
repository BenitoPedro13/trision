import Link from "next/link";
import { MarcaLockup } from "@/components/marca";
import { marca } from "@/content/marca";
import { montarLinkWhatsapp } from "@/lib/lead/link";

const LINKS = [
  { href: "/catalogo", rotulo: "Catálogo" },
  { href: "/colecoes", rotulo: "Coleções" },
  { href: "/revendedores", rotulo: "Revendedores" },
  { href: "/sobre", rotulo: "Sobre" },
  { href: "/atendimento-exclusivo", rotulo: "Atendimento Exclusivo" },
  { href: "/seja-revendedor", rotulo: "Seja revendedor" },
];

/* Shared footer for every route that renders `Cabecalho` (TASK-footer.md). Three columns
   — brand, navigation, contact — not a shrunk repeat of the header (user feedback: "make
   a proper footer, professional, not a copy of a header"). No WhatsApp *button* here
   still: each page already carries its one `--ouro`-fill `BotaoWhatsApp`
   (spec-design.md §4.2 rule 3), so the contact column links out as plain text instead of
   a second gold CTA. No `/apresentacao` link — that page is Amanda's private pitch,
   disallowed in robots.ts, and this footer is shared across every public route. */
export function Rodape() {
  const whatsappHref = montarLinkWhatsapp({
    numero: marca.whatsapp,
    assunto: "Quero saber mais sobre a Trísion.",
  });
  const temContato = whatsappHref || marca.email || marca.instagram;

  return (
    <footer className="mt-[clamp(64px,10vh,160px)] border-t border-aro px-[clamp(24px,5vw,88px)] pb-16 pt-12">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-8">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" data-alvo className="foco-visor block">
            <MarcaLockup
              simbolo="w-7"
              texto="text-[1.0625rem]"
              subtexto="text-[.625rem]"
              gap="gap-3"
              desde={false}
            />
          </Link>
          <p className="mt-4 max-w-[32ch] text-[.9375rem] leading-relaxed text-prata">
            Uma linha curada — não o catálogo mais largo, a certa.
          </p>
        </div>

        <nav>
          <p className="mb-4 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
            Navegação
          </p>
          <ul className="flex flex-col gap-2.5 text-[.9375rem] text-prata">
            {LINKS.map(({ href, rotulo }) => (
              <li key={href}>
                <Link href={href} data-alvo className="foco-visor hover:text-luz">
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
            Contato
          </p>
          {temContato ? (
            <ul className="flex flex-col gap-2.5 text-[.9375rem] text-prata">
              {whatsappHref && (
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-alvo
                    className="foco-visor hover:text-luz"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {marca.email && (
                <li>
                  <a href={`mailto:${marca.email}`} data-alvo className="foco-visor hover:text-luz">
                    {marca.email}
                  </a>
                </li>
              )}
              {marca.instagram && (
                <li>
                  <a
                    href={`https://instagram.com/${marca.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-alvo
                    className="foco-visor hover:text-luz"
                  >
                    @{marca.instagram}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-[.9375rem] text-cinza">Consulte o WhatsApp</p>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-aro pt-6 font-mono text-[.6875rem] text-cinza">
        <p>
          © {new Date().getFullYear()} Trísion Eyewear · Desde {marca.desde}
        </p>
        <a
          href="https://blessed-moon.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          data-alvo
          className="foco-visor hover:opacity-80"
        >
          Powered by <span className="text-ouro">Blessed Moon Studio</span>
        </a>
      </div>
    </footer>
  );
}
