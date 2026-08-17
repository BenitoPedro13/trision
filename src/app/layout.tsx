import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { SITE, SITE_URL } from "@/lib/site-config";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.titulo} — ${SITE.slogan}`,
    template: `%s · ${SITE.titulo}`,
  },
  description: SITE.descricao,
  applicationName: SITE.nome,
  keywords: [
    "Trísion",
    "Trísion Eyewear",
    "óculos",
    "óculos de sol",
    "armações",
    "óculos de grau",
    "revendedor de óculos",
    "eyewear",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.nome,
    locale: SITE.locale,
    url: SITE_URL,
    title: `${SITE.titulo} — ${SITE.slogan}`,
    description: SITE.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.titulo} — ${SITE.slogan}`,
    description: SITE.descricao,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

/* The ground behind the browser chrome, so a phone's status bar matches the page
   instead of flashing white on load. */
export const viewport: Viewport = {
  themeColor: "#0C1214",
  colorScheme: "dark",
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
