import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Archivo is chosen for its width axis (wdth 62–125) — headlines run wide to echo
   the Trísion logotype's extension, body runs at 100 and stays readable, from one
   family and one file. docs/spec-design.md §6. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/* The technical layer: numeração, SKUs, lead codes, prices. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trísion Eyewear",
  description:
    "Uma vitrine para cada revendedor. Um catálogo só. Trísion Eyewear, desde 2002.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${plexMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
