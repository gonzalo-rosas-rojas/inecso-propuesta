import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ESTADO_MANT, type EstadoMant, type OT } from "@/data/portal-demo";

/** White panel: the portal's one container. */
export function Panel({ children, className, titulo, accion, id }: { children: ReactNode; className?: string; titulo?: ReactNode; accion?: ReactNode; id?: string }) {
  const h = useId();
  return (
    <section id={id} className={cn("rounded-md bg-blanco p-5 ring-1 ring-linea/70 sm:p-6", className)} aria-labelledby={titulo ? h : undefined}>
      {titulo && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <h2 id={h} className="font-bold">
            {titulo}
          </h2>
          {accion}
        </div>
      )}
      {children}
    </section>
  );
}

const TONO_MANT: Record<EstadoMant, string> = {
  atrasada: "bg-falla/10 text-falla",
  proxima: "bg-energia/25 text-energia-osc",
  aldia: "bg-tierra/12 text-tierra",
};

export function ChipMant({ estado, className }: { estado: EstadoMant; className?: string }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={estado}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.8rem] font-semibold whitespace-nowrap", TONO_MANT[estado], className)}
      >
        <span className={cn("size-1.5 rounded-full", estado === "atrasada" ? "bg-falla" : estado === "proxima" ? "bg-energia-osc" : "bg-tierra")} aria-hidden="true" />
        {ESTADO_MANT[estado]}
      </motion.span>
    </AnimatePresence>
  );
}

const TONO_OT: Record<OT["estado"], [string, string]> = {
  programada: ["Programada", "bg-papel-2 text-tinta"],
  abierta: ["En terreno", "bg-cianotipo/10 text-cianotipo"],
  cerrada: ["Cerrada", "bg-tierra/12 text-tierra"],
};

export function ChipOT({ estado }: { estado: OT["estado"] }) {
  const [t, c] = TONO_OT[estado];
  return <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[0.8rem] font-semibold whitespace-nowrap", c)}>{t}</span>;
}

export function Etiqueta({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex shrink-0 rounded-full bg-papel px-2 py-0.5 text-[0.75rem] font-semibold whitespace-nowrap text-tinta-suave ring-1 ring-linea/60", className)}>{children}</span>;
}

/** A count with its label. The number fades in again when it changes, so a change made elsewhere is noticed. */
export function Kpi({ icon: Icon, n, t, sub, tono = "azul" }: { icon: LucideIcon; n: ReactNode; t: string; sub?: ReactNode; tono?: "azul" | "falla" | "energia" | "tierra" }) {
  return (
    <li className="flex items-start gap-3 rounded-md bg-blanco p-4 ring-1 ring-linea/70">
      <Icon
        className={cn("mt-0.5 size-5 shrink-0", tono === "falla" ? "text-falla" : tono === "energia" ? "text-energia-osc" : tono === "tierra" ? "text-tierra" : "text-cianotipo")}
        aria-hidden="true"
      />
      <div className="min-w-0 text-[0.9rem] leading-snug text-tinta-suave">
        <motion.b key={String(n)} className="block text-[1.35rem] text-tinta tabular-nums" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          {n}
        </motion.b>
        <span className="block">{t}</span>
        {sub && <span className="mt-1 block text-[0.8rem]">{sub}</span>}
      </div>
    </li>
  );
}

/**
 * Native modal <dialog> (top layer, Escape closes it, focus returns to the opener). No Radix: its scroll lock injects a
 * <style> tag, which the page's Content Security Policy blocks. Children mount only while open, so forms start fresh.
 */
export function Dialogo({ abierto, onCerrar, titulo, children, ancho = "32rem" }: { abierto: boolean; onCerrar: () => void; titulo: string; children: ReactNode; ancho?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const h = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={h}
      onClose={onCerrar}
      onClick={(ev) => ev.target === ref.current && onCerrar()}
      style={{ width: `min(${ancho}, calc(100vw - 2rem))` }}
      className="m-auto max-h-[calc(100dvh-2rem)] max-w-none overflow-y-auto rounded-md bg-blanco p-0 text-tinta shadow-2xl ring-1 ring-linea/70 backdrop:bg-grafito/55"
    >
      {abierto && (
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={h} className="wdth-112 text-[1.3rem] leading-tight font-extrabold">
              {titulo}
            </h2>
            <button type="button" onClick={onCerrar} className="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded text-tinta-suave hover:bg-papel hover:text-tinta" aria-label="Cerrar">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function Campo({ label, children, ayuda }: { label: string; children: ReactNode; ayuda?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.92rem] font-semibold">{label}</span>
      {children}
      {ayuda && <span className="text-[0.8rem] text-tinta-suave">{ayuda}</span>}
    </label>
  );
}

/** Empty-state line. */
export function Vacio({ children }: { children: ReactNode }) {
  return <p className="mt-4 rounded-[3px] bg-papel px-4 py-3 text-[0.9rem] text-tinta-suave">{children}</p>;
}
