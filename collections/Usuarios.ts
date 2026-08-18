import type { CollectionConfig } from "payload";

import { adminOnly, adminOrSelfUsuarios, getUser, isAdmin } from "@/payload/access";

export const Usuarios: CollectionConfig = {
  slug: "usuarios",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: adminOnly,
    read: adminOrSelfUsuarios,
    update: adminOrSelfUsuarios,
    delete: adminOnly,
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "revendedor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Revendedor", value: "revendedor" },
      ],
      access: {
        create: ({ req }) => isAdmin(getUser(req)),
        update: ({ req }) => isAdmin(getUser(req)),
        read: () => true,
      },
    },
  ],
};
