/**
 * Seeds Payload from the existing Fase 0 `content/` mock modules — same `exemplo`
 * data, nothing invented. Idempotent unless `--force`.
 *
 * Usage:
 *   pnpm payload:seed
 *   pnpm payload:seed -- --force
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { getPayload } from "payload";

import config from "../payload.config";
import { colecoes } from "../src/content/colecoes";
import { marca } from "../src/content/marca";
import { mostruario } from "../src/content/mostruario";
import { produtos } from "../src/content/produtos";
import { revendedores } from "../src/content/revendedores";

function loadEnv(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const env = readFileSync(resolve(import.meta.dirname, "../.env"), "utf8");
    for (const line of env.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m?.[1] === key) return m[2]?.trim();
    }
  } catch {
    /* no .env */
  }
  return undefined;
}

/** Minimal Lexical state for a single plain-text paragraph. */
function plainToLexical(text: string) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          textFormat: 0,
          textStyle: "",
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  };
}

const force = process.argv.includes("--force");

async function main() {
  if (!loadEnv("DATABASE_URL")) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  const marker = await payload.find({
    collection: "colecoes",
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: "exemplo" } },
  });

  if (marker.docs.length > 0 && !force) {
    console.log("Already seeded (coleção `exemplo` exists). Use --force to replace.");
    if (payload.db?.destroy) await payload.db.destroy();
    return;
  }

  if (force && marker.docs.length > 0) {
    console.log("Force: clearing seeded rows…");
    const skus = produtos.map((p) => p.sku);
    const slugs = revendedores.map((r) => r.slug);

    const existingMostruario = await payload.find({
      collection: "mostruario",
      limit: 1000,
      overrideAccess: true,
      depth: 0,
    });
    for (const row of existingMostruario.docs) {
      await payload.delete({
        collection: "mostruario",
        id: row.id,
        overrideAccess: true,
      });
    }

    for (const sku of skus) {
      const found = await payload.find({
        collection: "produtos",
        limit: 1,
        overrideAccess: true,
        where: { sku: { equals: sku } },
      });
      for (const doc of found.docs) {
        await payload.delete({ collection: "produtos", id: doc.id, overrideAccess: true });
      }
    }

    for (const slug of slugs) {
      const found = await payload.find({
        collection: "revendedores",
        limit: 1,
        overrideAccess: true,
        where: { slug: { equals: slug } },
      });
      for (const doc of found.docs) {
        await payload.delete({ collection: "revendedores", id: doc.id, overrideAccess: true });
      }
    }

    for (const c of colecoes) {
      const found = await payload.find({
        collection: "colecoes",
        limit: 1,
        overrideAccess: true,
        where: { slug: { equals: c.slug } },
      });
      for (const doc of found.docs) {
        await payload.delete({ collection: "colecoes", id: doc.id, overrideAccess: true });
      }
    }
  }

  console.log("Seeding config global…");
  await payload.updateGlobal({
    slug: "config",
    overrideAccess: true,
    data: {
      whatsappMarca: loadEnv("WHATSAPP_MARCA") || marca.whatsapp || undefined,
      instagram: marca.instagram || undefined,
      email: marca.email || undefined,
      desde: marca.desde,
      heroTitulo: "Uma armação é uma decisão sobre o que você olha.",
      heroSubtitulo:
        "Armações escolhidas por quem é genuinamente obcecada por elas — desde 2002.",
      rodapeTexto:
        "Trísion Eyewear — revenda oficial em óticas independentes. Produtos de demonstração no catálogo até a entrada dos modelos reais.",
    },
  });

  const colecaoIds = new Map<string, number | string>();
  for (const c of colecoes) {
    const doc = await payload.create({
      collection: "colecoes",
      overrideAccess: true,
      data: {
        nome: c.nome,
        slug: c.slug,
        ano: c.ano,
        texto: c.texto,
      },
    });
    colecaoIds.set(c.slug, doc.id);
    console.log(`  colecoes: ${c.slug}`);
  }

  const revendedorIds = new Map<string, number | string>();
  for (const r of revendedores) {
    const doc = await payload.create({
      collection: "revendedores",
      overrideAccess: true,
      data: {
        nome: r.nome,
        slug: r.slug,
        cidade: r.cidade,
        uf: r.uf,
        whatsapp: r.whatsapp || undefined,
        instagram: r.instagram || undefined,
        sobre: r.sobre,
        endereco: r.endereco ? { texto: r.endereco } : undefined,
        horarios: r.horarios ? { texto: r.horarios } : undefined,
        status: r.status,
        destinoLead: "marca",
      },
    });
    revendedorIds.set(r.slug, doc.id);
    console.log(`  revendedores: ${r.slug}`);
  }

  const produtoIds = new Map<string, number | string>();
  for (const p of produtos) {
    const colecaoId = colecaoIds.get(p.colecaoSlug);
    if (!colecaoId) throw new Error(`Missing coleção for ${p.sku}`);

    const doc = await payload.create({
      collection: "produtos",
      overrideAccess: true,
      data: {
        nome: p.nome,
        sku: p.sku,
        marca: p.marca,
        colecao: colecaoId,
        categoria: p.categoria,
        formato: p.formato,
        material: p.material,
        cor: { nome: p.cor, hexAprox: p.corHex },
        genero: p.genero,
        medidas: p.medidas,
        descricao: plainToLexical(p.descricao),
        status: p.status,
      },
    });
    produtoIds.set(p.sku, doc.id);
    console.log(`  produtos: ${p.sku}`);
  }

  for (const m of mostruario) {
    const revendedorId = revendedorIds.get(m.revendedorSlug);
    const produtoId = produtoIds.get(m.produtoSku);
    if (!revendedorId || !produtoId) {
      throw new Error(`Missing rels for mostruario ${m.revendedorSlug}/${m.produtoSku}`);
    }

    await payload.create({
      collection: "mostruario",
      overrideAccess: true,
      data: {
        revendedor: revendedorId,
        produto: produtoId,
        disponivel: m.disponivel,
        destaque: m.destaque,
        ordem: m.ordem,
        observacao: m.observacao,
      },
    });
    console.log(`  mostruario: ${m.revendedorSlug} → ${m.produtoSku}`);
  }

  console.log("Done.");
  if (payload.db?.destroy) await payload.db.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
