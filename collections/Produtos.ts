import type { CollectionConfig } from "payload";

import { adminOnly, produtosRead } from "@/payload/access";

export const Produtos: CollectionConfig = {
  slug: "produtos",
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "sku", "categoria", "status"],
  },
  access: {
    create: adminOnly,
    read: produtosRead,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "nome", type: "text", required: true },
    { name: "sku", type: "text", required: true, unique: true, index: true },
    { name: "marca", type: "text", required: true, defaultValue: "Trísion" },
    { name: "colecao", type: "relationship", relationTo: "colecoes", required: true },
    {
      name: "categoria",
      type: "select",
      required: true,
      options: [
        { label: "Solar", value: "solar" },
        { label: "Grau", value: "grau" },
        { label: "Clip-on", value: "clip-on" },
      ],
    },
    {
      name: "formato",
      type: "select",
      required: true,
      options: [
        { label: "Aviador", value: "aviador" },
        { label: "Quadrado", value: "quadrado" },
        { label: "Redondo", value: "redondo" },
        { label: "Gatinho", value: "gatinho" },
        { label: "Hexagonal", value: "hexagonal" },
        { label: "Retangular", value: "retangular" },
      ],
    },
    {
      name: "material",
      type: "select",
      required: true,
      options: [
        { label: "Acetato", value: "acetato" },
        { label: "Metal", value: "metal" },
        { label: "TR90", value: "TR90" },
        { label: "Titânio", value: "titânio" },
      ],
    },
    {
      name: "cor",
      type: "group",
      fields: [
        { name: "nome", type: "text", required: true },
        { name: "hexAprox", type: "text", required: true },
      ],
    },
    {
      name: "genero",
      type: "select",
      required: true,
      options: [
        { label: "Feminino", value: "feminino" },
        { label: "Masculino", value: "masculino" },
        { label: "Unissex", value: "unissex" },
      ],
    },
    {
      name: "medidas",
      type: "group",
      fields: [
        { name: "aro", type: "number", required: true },
        { name: "ponte", type: "number", required: true },
        { name: "haste", type: "number", required: true },
      ],
    },
    {
      name: "fotos",
      type: "array",
      fields: [{ name: "foto", type: "upload", relationTo: "media", required: true }],
    },
    { name: "descricao", type: "richText", required: true },
    {
      name: "precoSugerido",
      type: "number",
      admin: { description: "Ausente ⇒ Consulte o valor. Nunca preencher por padrão." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "ativo",
      options: [
        { label: "Ativo", value: "ativo" },
        { label: "Descontinuado", value: "descontinuado" },
      ],
    },
  ],
};
