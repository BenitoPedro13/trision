import { montarLinkWhatsapp, type DadosContatoWhatsapp } from "@/lib/lead/link";

/* `BotaoWhatsApp` — spec-design.md §8, the one primary CTA (§4.2 rule 3: `--noite`
   text on an `--ouro` fill, never white — exactly one such button per page). No
   number ⇒ `montarLinkWhatsapp` returns `null` and this renders disabled, same
   fallback shape as `precoSugerido` absent → "Consulte o valor": a missing fact is
   shown as missing, never as an invented one. */
export function BotaoWhatsApp({ dados }: { dados: DadosContatoWhatsapp }) {
  const href = montarLinkWhatsapp(dados);

  if (!href) {
    return (
      <p className="border border-aro px-6 py-3.5 text-center text-sm text-cinza">
        Consulte o WhatsApp
      </p>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-alvo
      className="foco-visor block bg-ouro px-6 py-3.5 text-center text-sm font-semibold text-noite transition-opacity hover:opacity-90"
    >
      Falar no WhatsApp
    </a>
  );
}
