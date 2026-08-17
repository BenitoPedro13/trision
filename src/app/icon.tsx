import { ImageResponse } from "next/og";
import { MARCA_PATHS, MARCA_VIEWBOX } from "@/lib/marca-paths";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/* The full mark at 64px. The brackets carry it at this size — the Tr reads as a
   dense monogram inside them, which is exactly how the tile reads on her profile. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C1214",
        }}
      >
        <svg width="52" height="52" viewBox={MARCA_VIEWBOX}>
          <g fill="#FFFFFF">
            {MARCA_PATHS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
