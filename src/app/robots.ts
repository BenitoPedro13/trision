import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The pitch is not public, and /ir is the lead redirect that lands in Fase 2 —
         crawlers hitting it would manufacture leads (spec-architecture.md §7.4). */
      disallow: ["/apresentacao", "/ir/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
