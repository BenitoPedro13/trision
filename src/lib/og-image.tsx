import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { MARCA_PATHS, MARCA_VIEWBOX, estrelas } from "@/lib/marca-paths";
import type { MedidasProduto } from "@/lib/catalog/types";

/** One Satori composition, reused by every route's `opengraph-image.tsx` — the same
 * "one composer" pattern as `lib/marca-paths.ts` (the mark) and `lib/lead/link.ts`
 * (wa.me). Text-only: no `fotos`/`capa`/`retrato` in `content/*.ts` have a real path
 * yet (`TASK-normalizar-imagens.md` isn't built), so this never invents a photograph —
 * the same rule that gates the gallery's "sem foto" empty state. */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let fontesPromise: Promise<
  { name: string; data: Buffer; weight: 400 | 700; style: "normal" }[]
> | null = null;

function fontesOg() {
  fontesPromise ??= Promise.all([
    readFile(path.join(process.cwd(), "src/assets/archivo-400.ttf")),
    readFile(path.join(process.cwd(), "src/assets/archivo-700.ttf")),
  ]).then(([regular, bold]) => [
    { name: "Archivo", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: bold, weight: 700 as const, style: "normal" as const },
  ]);
  return fontesPromise;
}

export interface CartaoOgProps {
  kicker: string;
  titulo: string;
  subtitulo?: string;
  /** Pass `produto.medidas` directly, never a pre-formatted string — `NumeracaoOg`
   * mirrors `components/numeracao.tsx`'s reason for existing. */
  medidas?: MedidasProduto;
  rodape?: string;
}

/** Satori equivalent of `components/numeracao.tsx`. `□` is U+25A1, which the static
 * Archivo TTF Satori reads (`src/assets/archivo-{400,700}.ttf`) doesn't ship — it
 * rendered as a tofu box in testing. Drawn as inline SVG instead, same as the DOM
 * component, for the same reason: "opticians read the box as the box," never a
 * substitute character (`AGENTS.md` §0). No measurements ⇒ renders nothing. */
function NumeracaoOg({ medidas }: { medidas?: MedidasProduto }) {
  if (!medidas) return null;
  const { aro, ponte, haste } = medidas;
  if (aro == null || ponte == null || haste == null) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 22, color: "#CCA866" }}>
      <span>{aro}</span>
      <svg width={16} height={16} viewBox="0 0 9 9">
        <rect x="1" y="1" width="7" height="7" fill="none" stroke="#CCA866" strokeWidth="1.2" />
      </svg>
      <span>
        {ponte}-{haste}
      </span>
    </div>
  );
}

function canto(pos: React.CSSProperties, lados: React.CSSProperties): React.CSSProperties {
  return { position: "absolute", width: 34, height: 34, ...pos, ...lados };
}
const RISCO = "2px solid #CCA866";

function CartaoOg({ kicker, titulo, subtitulo, medidas, rodape }: CartaoOgProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#070B0C",
        padding: 64,
        fontFamily: "Archivo",
        position: "relative",
      }}
    >
      {estrelas(90, 1200, 630).map((e, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: e.left,
            top: e.top,
            width: e.size,
            height: e.size,
            borderRadius: e.size,
            background: `rgba(232,235,236,${e.opacity})`,
          }}
        />
      ))}

      <div style={canto({ left: 40, top: 40 }, { borderLeft: RISCO, borderTop: RISCO })} />
      <div style={canto({ right: 40, top: 40 }, { borderRight: RISCO, borderTop: RISCO })} />
      <div
        style={canto({ left: 40, bottom: 40 }, { borderLeft: RISCO, borderBottom: RISCO })}
      />
      <div
        style={canto({ right: 40, bottom: 40 }, { borderRight: RISCO, borderBottom: RISCO })}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg width="44" height="44" viewBox={MARCA_VIEWBOX}>
          <g fill="#FFFFFF">
            {MARCA_PATHS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#A6B2B6",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {kicker}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            fontSize: 66,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.05,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          {titulo}
        </div>
        {subtitulo && (
          <div style={{ fontSize: 26, color: "#A6B2B6", lineHeight: 1.35, display: "flex" }}>
            {subtitulo}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <NumeracaoOg medidas={medidas} />
          <div style={{ fontSize: 20, color: "#5C6669", display: "flex" }}>
            {rodape ?? "trision.vercel.app"}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function gerarOgImage(props: CartaoOgProps) {
  const fonts = await fontesOg();
  return new ImageResponse(<CartaoOg {...props} />, { ...OG_SIZE, fonts });
}
