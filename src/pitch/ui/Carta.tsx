import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CALENDARIO, DIAS_CON_HOLGURA, DIAS_SIN_RETRASOS, HITOS } from "@/data/portal";

const TONO = { web: "bg-cianotipo", lev: "bg-cianotipo-claro", portal: "bg-energia" } as const;
const pct = (d: number) => `${(d / DIAS_CON_HOLGURA) * 100}%`;
const SEMANAS = Array.from({ length: DIAS_CON_HOLGURA / 5 }, (_, i) => i);

/** Track with the week lines, the milestones and the slack week, drawn per row so everything lines up with the bars. */
function Pista({ children }: { children?: React.ReactNode }) {
  return (
    <span className="relative h-7">
      <span aria-hidden="true" className="absolute -inset-y-1.5 right-0 rounded-sm bg-tinta-suave/8" style={{ left: pct(DIAS_SIN_RETRASOS) }} />
      {SEMANAS.slice(1).map((s) => (
        <span key={s} aria-hidden="true" className="absolute -inset-y-1.5 border-l border-linea" style={{ left: pct(s * 5) }} />
      ))}
      {HITOS.map((h) => (
        <span key={h.t} aria-hidden="true" className="absolute -inset-y-1.5 border-l border-dashed border-tinta-suave/50" style={{ left: pct(h.dia) }} />
      ))}
      {children}
    </span>
  );
}

/** The whole job in business days from signing: the website first, the survey in parallel, then the three portal stages. */
export function Carta() {
  return (
    <figure className="rounded-2xl bg-papel p-5 sm:p-7">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <b className="wdth-87">La web y el portal, semana a semana</b>
        <span className="text-[0.85rem] text-tinta-suave">Desde la firma; las fechas se fijan juntos.</span>
      </figcaption>
      <ol className="mt-6 space-y-3">
        <li className="grid items-end gap-x-4 md:grid-cols-[30%_1fr]" aria-hidden="true">
          <span />
          <span className="relative h-5 text-[0.74rem] text-tinta-suave">
            {SEMANAS.map((s) => (
              <span key={s} className="absolute wdth-87 font-semibold" style={{ left: pct(s * 5), width: pct(5) }}>
                <span className="pl-1.5">{s + 1 === SEMANAS.length ? "Holgura" : `Semana ${s + 1}`}</span>
              </span>
            ))}
          </span>
        </li>
        {CALENDARIO.map((f, i) => (
          <li key={f.t} className="grid items-center gap-x-4 gap-y-1 md:grid-cols-[30%_1fr]">
            <span className="leading-tight">
              <b className="wdth-87 text-[0.92rem]">{f.t}</b>
              <span className="block text-[0.8rem] text-tinta-suave">{f.d}</span>
            </span>
            <Pista>
              <motion.span
                className={cn("absolute inset-y-0 origin-left rounded-md", TONO[f.tono])}
                style={{ left: pct(f.desde), width: pct(f.hasta - f.desde) }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ delay: 0.12 * i, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </Pista>
          </li>
        ))}
      </ol>
      <ul className="mt-6 grid gap-2 text-[0.85rem] sm:grid-cols-3">
        {HITOS.map((h) => (
          <li key={h.t} className="flex gap-2">
            <i className="mt-1.5 size-2 shrink-0 rotate-45 bg-energia" aria-hidden="true" />
            <span>
              <b className="wdth-87">Semana {Math.ceil(h.dia / 5)}:</b> {h.t}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[80ch] text-[0.85rem] leading-relaxed text-tinta-suave">
        Sin retrasos son tres semanas; la cuarta es holgura para lo que no depende de mí.
      </p>
    </figure>
  );
}
