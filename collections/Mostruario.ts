import type { CollectionConfig } from "payload";

/** Join collection — tenant field `revendedor` is injected by the multi-tenant plugin
 * (`spec-architecture.md` §5.3). No `preco` field: open question #7 unresolved. */
export const Mostruario: CollectionConfig = {
  slug: "mostruario",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["revendedor", "produto", "disponivel", "destaque", "ordem"],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "produto", type: "relationship", relationTo: "produtos", required: true },
    { name: "disponivel", type: "checkbox", defaultValue: true },
    { name: "destaque", type: "checkbox", defaultValue: false },
    { name: "ordem", type: "number", required: true, defaultValue: 0 },
    { name: "observacao", type: "text" },
  ],
};
