import Link from "next/link";
import { MarcaLockup } from "@/components/marca";
import { Ceu } from "@/components/ceu";
import { VisorCursor } from "@/components/visor-cursor";

/* Holding page. The real homepage is Fase 0 and is blocked on Amanda's
   photographs, product data and measurements — docs/spec-brand.md §6. */
export default function Home() {
  return (
    <>
      <Ceu />
      <VisorCursor />
      <main className="relative z-10 flex min-h-dvh flex-col justify-center gap-10 p-[clamp(24px,5vw,88px)]">
        <MarcaLockup />
        <p className="max-w-[46ch] text-[clamp(1.05rem,1vw+.85rem,1.35rem)] leading-snug text-prata">
          Uma vitrine para cada revendedor. Um catálogo só.
        </p>
        <Link
          href="/apresentacao"
          data-alvo
          className="foco-visor self-start border border-aro px-6 py-3.5 text-sm font-semibold text-luz transition-colors hover:border-prata"
        >
          Ver a apresentação
        </Link>
      </main>
    </>
  );
}
