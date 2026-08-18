// Fase 0 verification pass — docs/tasks/TASK-verificacao-fase-0.md §2.1/§2.2.
//
// Measures the budgets in spec-design.md §12 / spec-architecture.md §13 against the live
// build, instead of leaving them asserted but unmeasured. Two engines, one per the kind of
// check it's actually good at (both ultimately speak CDP):
//   - Lighthouse for LCP / CLS / JS transfer weight — CWV has no Playwright equivalent.
//   - Playwright (+ axe-core) for contrast-as-rendered, keyboard/focus, reduced-motion,
//     coarse-pointer — things Lighthouse's page-load audit doesn't touch.
//
// Prerequisite: a production server already running (`pnpm build && pnpm start`), because
// `pnpm dev` is unthrottled/unminified and would produce numbers nobody could act on.
//
// Run: pnpm exec tsx scripts/verificar-fase-0.mts [baseUrl]

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.argv[2] ?? "http://localhost:3000";
const PAGES = [
  "/",
  "/apresentacao",
  "/catalogo",
  "/oculos/TRI-MOD-A",
  "/loja/otica-exemplo/mostruario",
];
const LIGHTHOUSE_RUNS = 3;

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

type LighthouseResult = { lcpMs: number; cls: number; jsKb: number };

function runLighthouseOnce(url: string): LighthouseResult {
  const dir = mkdtempSync(path.join(tmpdir(), "lh-"));
  const outPath = path.join(dir, "report.json");
  try {
    execFileSync(
      "node_modules/.bin/lighthouse",
      [
        url,
        "--output=json",
        `--output-path=${outPath}`,
        "--only-categories=performance",
        // devtools, not Lighthouse's default "simulate": simulate estimates timing from
        // a dependency graph and was measured (2026-08-17) to overstate LCP by ~1s on
        // this page shape versus an actual throttled replay — devtools applies real
        // CPU/network throttling and records what actually happened.
        "--throttling-method=devtools",
        "--chrome-flags=--headless=new --no-sandbox",
        "--quiet",
      ],
      { stdio: ["ignore", "ignore", "inherit"] },
    );
    const report = JSON.parse(readFileSync(outPath, "utf8"));
    const audits = report.audits;
    const lcpMs = audits["largest-contentful-paint"].numericValue as number;
    const cls = audits["cumulative-layout-shift"].numericValue as number;
    const items = (audits["network-requests"]?.details?.items ?? []) as Array<{
      resourceType?: string;
      transferSize?: number;
    }>;
    const jsBytes = items
      .filter((i) => i.resourceType === "Script")
      .reduce((sum, i) => sum + (i.transferSize ?? 0), 0);
    return { lcpMs, cls, jsKb: jsBytes / 1024 };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function measurePage(pathname: string) {
  const url = `${BASE_URL}${pathname}`;
  const runs = Array.from({ length: LIGHTHOUSE_RUNS }, () => runLighthouseOnce(url));
  return {
    lcpS: median(runs.map((r) => r.lcpMs)) / 1000,
    cls: median(runs.map((r) => r.cls)),
    jsKb: median(runs.map((r) => r.jsKb)),
  };
}

/** Dark-only site: axe and keyboard checks run only after tokens are on the DOM. */
async function waitForReady(page: import("playwright").Page) {
  await page.waitForFunction(() => {
    if (!document.documentElement.classList.contains("dark")) return false;
    const bg = getComputedStyle(document.body).backgroundColor;
    return bg !== "rgba(0, 0, 0, 0)" && bg !== "rgb(255, 255, 255)";
  });
}

async function contrastViolations(page: import("playwright").Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
  return results.violations.filter((v) => v.id === "color-contrast");
}

async function keyboardPass(page: import("playwright").Page) {
  const focused: string[] = [];
  const failures: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      return {
        tag: el.tagName.toLowerCase(),
        hasFocoVisor: el.classList.contains("foco-visor"),
        text: (el.textContent ?? "").trim().slice(0, 40),
      };
    });
    if (!info) break;
    const label = `${info.tag}${info.hasFocoVisor ? " (.foco-visor bracket)" : " — NO BRACKET STYLE"} — ${info.text}`;
    focused.push(label);
    if (!info.hasFocoVisor) failures.push(label);
  }
  return { focused, failures };
}

async function ceuIsStaticUnderReducedMotion(context: import("playwright").BrowserContext, url: string) {
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  const canvas = page.locator("canvas");
  if ((await canvas.count()) === 0) {
    await page.close();
    return "no <canvas> on this page";
  }
  const frame1 = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.waitForTimeout(500);
  const frame2 = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.close();
  return frame1 === frame2 ? "static (matches spec §7.1/§7.5)" : "STILL ANIMATING under reduced-motion";
}

async function visorCursorOff(context: import("playwright").BrowserContext, url: string) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await waitForReady(page);
  const visor = page.locator('div.fixed.z-50.pointer-events-none[aria-hidden="true"]');
  if ((await visor.count()) === 0) {
    await page.close();
    return "no VisorCursor element found";
  }
  await page.mouse.move(200, 200);
  await page.mouse.move(240, 240);
  await page.waitForTimeout(150);
  const opacity = await visor.evaluate((el) => getComputedStyle(el).opacity);
  await page.close();
  return opacity === "0" ? "off (correct)" : `opacity=${opacity} — STILL ON`;
}

async function main() {
  console.log(`Base URL: ${BASE_URL}\n`);
  let failed = false;

  console.log("## Lighthouse (median of 3 runs)\n");
  console.log("| Page | LCP (s) | budget ≤2.0s | CLS | budget ≤0.05 | JS transfer (KB) | budget ≤180KB |");
  console.log("|---|---|---|---|---|---|---|");
  for (const p of PAGES) {
    const m = measurePage(p);
    const lcpPass = m.lcpS <= 2.0;
    const clsPass = m.cls <= 0.05;
    const jsPass = m.jsKb <= 180;
    if (!lcpPass || !clsPass || !jsPass) failed = true;
    console.log(
      `| \`${p}\` | ${m.lcpS.toFixed(2)} | ${lcpPass ? "PASS" : "FAIL"} | ${m.cls.toFixed(3)} | ${clsPass ? "PASS" : "FAIL"} | ${m.jsKb.toFixed(1)} | ${jsPass ? "PASS" : "FAIL"} |`,
    );
  }

  const browser = await chromium.launch();

  const checkCtx = await browser.newContext();

  console.log("\n## Contrast (axe-core, WCAG AA, rendered DOM)\n");
  for (const p of PAGES) {
    const page = await checkCtx.newPage();
    await page.goto(`${BASE_URL}${p}`, { waitUntil: "networkidle" });
    await waitForReady(page);
    const violations = await contrastViolations(page);
    const pass = violations.length === 0;
    if (!pass) failed = true;
    console.log(`\`${p}\`: ${pass ? "PASS — no color-contrast violations" : `FAIL — ${violations.length} violation(s)`}`);
    for (const v of violations) {
      for (const node of v.nodes) console.log(`  - ${node.target.join(" ")}: ${node.failureSummary}`);
    }
    await page.close();
  }

  console.log("\n## Keyboard / focus (.foco-visor bracket)\n");
  for (const p of PAGES) {
    const page = await checkCtx.newPage();
    await page.goto(`${BASE_URL}${p}`, { waitUntil: "networkidle" });
    await waitForReady(page);
    const { focused, failures } = await keyboardPass(page);
    if (failures.length) failed = true;
    console.log(
      `\`${p}\`: ${focused.length === 0 ? "no focusable elements found" : focused.join(", ")}`,
    );
    if (failures.length) console.log(`  FAIL — ${failures.length} stop(s) without .foco-visor`);
    await page.close();
  }

  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(`${BASE_URL}/catalogo`, { waitUntil: "networkidle" });
  await waitForReady(mobilePage);
  const mobileKb = await keyboardPass(mobilePage);
  if (mobileKb.failures.length) failed = true;
  console.log(
    `\`/catalogo\` (mobile 390px): ${mobileKb.focused.length === 0 ? "no focusable elements" : mobileKb.focused.join(", ")}`,
  );
  if (mobileKb.failures.length) {
    console.log(`  FAIL — ${mobileKb.failures.length} stop(s) without .foco-visor`);
  }
  await mobilePage.close();
  await mobileCtx.close();
  await checkCtx.close();

  console.log("\n## prefers-reduced-motion — Ceu\n");
  const ctx1 = await browser.newContext();
  for (const p of PAGES) {
    console.log(`\`${p}\`: ${await ceuIsStaticUnderReducedMotion(ctx1, `${BASE_URL}${p}`)}`);
  }
  await ctx1.close();

  console.log("\n## VisorCursor off under reduced-motion\n");
  const ctx2 = await browser.newContext({ reducedMotion: "reduce" });
  for (const p of PAGES) {
    console.log(`\`${p}\`: ${await visorCursorOff(ctx2, `${BASE_URL}${p}`)}`);
  }
  await ctx2.close();

  console.log("\n## VisorCursor off under coarse pointer\n");
  const ctx3 = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  for (const p of PAGES) {
    console.log(`\`${p}\`: ${await visorCursorOff(ctx3, `${BASE_URL}${p}`)}`);
  }
  await ctx3.close();

  console.log("\n## No-WebGL fallback\n");
  console.log("N/A this build — Ceu uses a 2D canvas context only; no WebGL component exists yet (React Bits deferred, AGENTS.md §0).");

  await browser.close();

  if (failed) {
    console.error("\nOne or more checks failed.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
