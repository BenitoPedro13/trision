import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The pitch is not public, and /ir is the lead redirect that lands in Fase 2 —
         crawlers hitting it would manufacture leads (spec-architecture.md §7.4).
         /loja/ is TASK-frontend-fase-0.md's path-based storefront stand-in — it is
         replaced by subdomain routing once the domain exists (§2.4), so indexing it
         now would index a URL shape that's about to disappear. */
      disallow: ["/apresentacao", "/ir/", "/loja/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
