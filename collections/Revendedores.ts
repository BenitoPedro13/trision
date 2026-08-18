import type { CollectionConfig } from "payload";

import {
  adminOnly,
  revendedorFieldRead,
  revendedorFieldUpdate,
  revendedorOwnTenantUpdate,
} from "@/payload/access";

export const Revendedores: CollectionConfig = {
  slug: "revendedores",
  admin: { useAsTitle: "nome" },
  access: {
    create: adminOnly,
    read: () => true,
    update: revendedorOwnTenantUpdate,
    delete: adminOnly,
  },
  fields: [
    {
      name: "nome",
      type: "text",
      required: true,
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(false) },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(false) },
    },
    {
      name: "cidade",
      type: "text",
      required: true,
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(false) },
    },
    {
      name: "uf",
      type: "text",
      required: true,
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(false) },
    },
    {
      name: "whatsapp",
      type: "text",
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(true) },
    },
    {
      name: "instagram",
      type: "text",
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(true) },
    },
    {
      name: "endereco",
      type: "group",
      fields: [
        {
          name: "texto",
          type: "textarea",
          access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(true) },
        },
      ],
    },
    {
      name: "horarios",
      type: "group",
      fields: [
        {
          name: "texto",
          type: "text",
          access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(true) },
        },
      ],
    },
    {
      name: "retrato",
      type: "upload",
      relationTo: "media",
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(true) },
    },
    {
      name: "sobre",
      type: "textarea",
      maxLength: 400,
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(true) },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "ativo",
      options: [
        { label: "Ativo", value: "ativo" },
        { label: "Pausado", value: "pausado" },
      ],
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(false) },
    },
    {
      name: "destinoLead",
      type: "select",
      required: true,
      defaultValue: "marca",
      options: [
        { label: "Marca (Amanda)", value: "marca" },
        { label: "Revendedor", value: "revendedor" },
      ],
      access: { read: revendedorFieldRead(true), update: revendedorFieldUpdate(false) },
    },
  ],
};
