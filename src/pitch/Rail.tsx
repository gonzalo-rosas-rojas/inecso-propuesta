import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type Etapa = { id: string; nombre: string };

/**
 * The single-line diagram: it starts at the service entrance with the breaker open, the breaker closes on the first
 * scroll and the current (yellow) runs from node to node down to the load. It is also the page's navigation.
 */
export function Rail({ etapas, active, closed, dark }: { etapas: Etapa[]; active: string; closed: boolean; dark: boolean }) {
  const idx = Math.max(0, etapas.findIndex((e) => e.id === active));
  const fill = closed ? idx / (etapas.length - 1) : 0;
  return (
    <nav
      aria-label="Etapas de la propuesta"
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col py-8 pl-8 pr-4 transition-colors duration-500 min-[1100px]:flex",
        dark ? "bg-grafito text-papel" : "bg-papel text-tinta",
      )}
    >
      <a href="#corte" className="mb-4 block wdth-125 text-[0.95rem] font-extrabold leading-none tracking-tight">
        INECSO
        <span className={cn("mt-1 block wdth-87 text-[0.75rem] font-medium", dark ? "text-linea" : "text-tinta-suave")}>
          Propuesta, noviembre 2026
        </span>
      </a>
      {/* service entrance + breaker */}
      <svg viewBox="0 0 40 70" className="ml-[-11px] h-[70px] w-10 shrink-0" aria-hidden="true">
        <path d="M20 0v22M20 48v22" className={dark ? "stroke-linea" : "stroke-tinta"} strokeWidth="2" fill="none" />
        <path d="M13 22h14" className={dark ? "stroke-linea" : "stroke-tinta"} strokeWidth="2" />
        <motion.path
          d="M20 48 L20 22"
          stroke="var(--color-energia)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ originX: "20px", originY: "48px" }}
          initial={false}
          animate={{ rotate: closed ? 0 : -32 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        />
        <circle cx="20" cy="48" r="3" fill="var(--color-energia)" />
      </svg>
      <div className="relative flex min-h-0 flex-1">
        <div className={cn("absolute left-[8px] top-0 bottom-0 w-[2px]", dark ? "bg-linea-osc" : "bg-linea")} aria-hidden="true" />
        <motion.div
          aria-hidden="true"
          className="absolute left-[7px] top-0 w-[4px] origin-top rounded-full bg-energia shadow-[0_0_12px_var(--color-energia)]"
          style={{ height: "100%" }}
          initial={false}
          animate={{ scaleY: fill }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
        />
        <ol className="relative flex flex-1 flex-col justify-between">
          {etapas.map((e, i) => {
            const reached = closed && i <= idx;
            const current = e.id === active;
            return (
              <li key={e.id}>
                <a
                  href={`#${e.id}`}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "group flex items-center gap-3 py-1 wdth-87 text-[0.86rem] leading-tight transition-colors",
                    current ? "font-bold" : "font-medium",
                    dark ? (reached ? "text-papel" : "text-linea") : reached ? "text-tinta" : "text-tinta-suave",
                  )}
                >
                  <span
                    className={cn(
                      "relative grid size-[18px] shrink-0 place-items-center rounded-full border-2 transition-all duration-300",
                      reached ? "border-energia bg-energia" : dark ? "border-linea-osc bg-grafito" : "border-linea bg-papel",
                      current && "scale-125 shadow-[0_0_0_5px_color-mix(in_srgb,var(--color-energia)_30%,transparent)]",
                    )}
                  >
                    <span className={cn("size-[6px] rounded-full", reached ? "bg-grafito" : "bg-transparent")} />
                  </span>
                  <span className="group-hover:underline group-hover:underline-offset-4">{e.nombre}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/** On narrow screens the diagram becomes a top bar: stage name and how much of the circuit is energized. */
export function RailMovil({ etapas, active, progress, dark }: { etapas: Etapa[]; active: string; progress: number; dark: boolean }) {
  const e = etapas.find((x) => x.id === active) ?? etapas[0];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex h-11 items-center justify-between px-4 wdth-87 text-[0.82rem] font-semibold backdrop-blur-md transition-colors duration-500 min-[1100px]:hidden",
        dark ? "bg-grafito/85 text-papel" : "bg-papel/85 text-tinta",
      )}
    >
      <span className="wdth-125 font-extrabold">INECSO</span>
      <span>{e.nombre}</span>
      <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-energia transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
