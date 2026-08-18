import type { MedidasProduto } from "./catalog/types";

/** mm → `52□18-145` (`spec-design.md` §5). The `Numeracao` component draws `□` as inline
 * SVG for display; this plain-string form is what `lib/lead/link.ts` puts in the WhatsApp
 * message, so the number Amanda receives is byte-identical to the one on screen
 * (`spec-architecture.md` §7.3). No measurements ⇒ `undefined`, never a placeholder. */
export function formatarNumeracao(medidas?: MedidasProduto): string | undefined {
  if (!medidas) return undefined;
  const { aro, ponte, haste } = medidas;
  if (aro == null || ponte == null || haste == null) return undefined;
  return `${aro}□${ponte}-${haste}`;
}
