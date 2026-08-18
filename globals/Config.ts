import type { GlobalConfig } from "payload";

import { adminOnly } from "@/payload/access";

export const Config: GlobalConfig = {
  slug: "config",
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: "whatsappMarca",
      type: "text",
      admin: { description: "E.164 — mirrors WHATSAPP_MARCA env fallback." },
    },
    { name: "instagram", type: "text" },
    { name: "email", type: "text" },
    { name: "desde", type: "number", required: true, defaultValue: 2002 },
    { name: "heroTitulo", type: "text" },
    { name: "heroSubtitulo", type: "textarea" },
    { name: "rodapeTexto", type: "textarea" },
  ],
};
