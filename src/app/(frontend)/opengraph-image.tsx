import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { MARCA_PATHS, MARCA_VIEWBOX, estrelas } from "@/lib/marca-paths";
import { SITE } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.nome} — ${SITE.slogan}`;

/* Satori cannot use the variable font next/font serves, so static instances are
   committed in src/assets. The card is the brand's own composition: her starfield
   ground, the mark, the wordmark, and the whole canvas framed by the visor. */
export default async function OG() {
  const [regular, bold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/archivo-400.ttf")),
    readFile(path.join(process.cwd(), "src/assets/archivo-700.ttf")),
  ]);

  const canto = (pos: React.CSSProperties, lados: React.CSSProperties) => ({
    position: "absolute" as const,
    width: 34,
    height: 34,
    ...pos,
    ...lados,
  });
  const risco = "2px solid #CCA866";

  return new ImageResponse(
    (
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

        {/* the visor, framing the whole card */}
        <div style={canto({ left: 40, top: 40 }, { borderLeft: risco, borderTop: risco })} />
        <div style={canto({ right: 40, top: 40 }, { borderRight: risco, borderTop: risco })} />
        <div style={canto({ left: 40, bottom: 40 }, { borderLeft: risco, borderBottom: risco })} />
        <div style={canto({ right: 40, bottom: 40 }, { borderRight: risco, borderBottom: risco })} />

        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <svg width="104" height="104" viewBox={MARCA_VIEWBOX}>
            <g fill="#FFFFFF">
              {MARCA_PATHS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 62, fontWeight: 400, color: "#FFFFFF", letterSpacing: 1 }}>
              Trísion
            </div>
            <div
              style={{
                fontSize: 21,
                fontWeight: 700,
                color: "#A6B2B6",
                letterSpacing: 1,
                marginTop: 2,
              }}
            >
              Eyewear
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 18,
              paddingLeft: 22,
              borderLeft: "1px solid #242E32",
              fontSize: 17,
              letterSpacing: 5,
              color: "#CCA866",
            }}
          >
            DESDE {SITE.desde}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.03,
              letterSpacing: -2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Uma vitrine para cada revendedor.</span>
            <span>Um catálogo só.</span>
          </div>
          <div style={{ fontSize: 25, color: "#78858A", marginTop: 22 }}>
            trision.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Archivo", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
