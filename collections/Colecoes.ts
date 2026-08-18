import type { CollectionConfig } from "payload";

import { adminOnly } from "@/payload/access";

export const Colecoes: CollectionConfig = {
  slug: "colecoes",
  admin: { useAsTitle: "nome" },
  access: {
    create: adminOnly,
    read: () => true,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "nome", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "ano", type: "number", required: true },
    { name: "capa", type: "upload", relationTo: "media" },
    { name: "texto", type: "textarea", required: true },
  ],
};
