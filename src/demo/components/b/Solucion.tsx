import { motion } from "motion/react";
import { DOLORES, SOLUCION } from "@/data/inecso";

/**
 * Version B, the bridge: each obstacle on the left, connected by a line that energizes as it comes into view, to how
 * INECSO removes it on the right. It is the one orchestrated move of this section.
 */
export function Solucion() {
  return (
    <section className="plano py-20 text-blanco lg:py-28" aria-labelledby="so-h">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="so-h" className="wdth-125 max-w-3xl text-[clamp(1.9rem,1.2rem+2.6vw,3.2rem)] leading-[1.02] font-extrabold text-balance">
          Un solo responsable, del proyecto a la mantención.
        </h2>
        <p className="mt-4 max-w-2xl text-blanco/75">
          Diagnóstico y proyecto, suministro e instalación del grupo con su tablero de transferencia automática, obras civiles e izaje, pruebas y
          protocolos, declaración SEC y mantención. Así se resuelve cada problema:
        </p>

        <ol className="mt-12 space-y-3">
          {SOLUCION.map((s, i) => {
            const dolor = DOLORES.find((d) => d.id === s.dolor)!;
            return (
              <li key={s.t} className="grid items-center gap-3 rounded-[4px] bg-grafito/70 p-4 ring-1 ring-blanco/10 md:grid-cols-[1fr_120px_1.35fr] md:gap-0 md:p-0 md:ring-0 md:bg-transparent">
                <p className="text-[0.95rem] text-blanco/55 md:rounded-l-[4px] md:bg-grafito-2 md:px-5 md:py-5">{dolor.t}</p>
                <div className="relative hidden h-full items-center md:flex" aria-hidden="true">
                  <span className="absolute inset-x-0 h-0.5 bg-blanco/15" />
                  <motion.span
                    className="absolute inset-x-0 h-0.5 origin-left bg-energia shadow-[0_0_10px_var(--color-energia)]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                    transition={{ duration: 0.6, delay: 0.12 * i, ease: [0.2, 0.7, 0.2, 1] }}
                  />
                  <motion.span
                    className="absolute right-0 size-2.5 translate-x-1/2 rounded-full bg-energia"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                    transition={{ delay: 0.12 * i + 0.55, type: "spring", stiffness: 500, damping: 20 }}
                  />
                </div>
                <div className="md:rounded-r-[4px] md:bg-blanco/[0.06] md:px-6 md:py-5 md:ring-1 md:ring-blanco/10">
                  <h3 className="wdth-100 text-[1.1rem] font-bold text-energia">{s.t}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-blanco/80">{s.d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
