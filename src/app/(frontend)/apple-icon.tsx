import { ImageResponse } from "next/og";
import { MARCA_PATHS, MARCA_VIEWBOX } from "@/lib/marca-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <svg width="126" height="126" viewBox={MARCA_VIEWBOX}>
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
