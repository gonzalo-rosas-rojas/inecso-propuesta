import { motion } from "motion/react";
import { CalendarCheck, ClipboardCheck, FileDown, Gauge, Globe, MessageSquareText } from "lucide-react";

const DIA = [
  { h: "08:40", Icon: CalendarCheck, t: "Tocaba la mantención del grupo de 500 kVA", d: "El portal avisó: 250 horas de uso." },
  { h: "11:15", Icon: ClipboardCheck, t: "Orden de trabajo cerrada en terreno", d: "Con la pauta, fotos y firma del cliente." },
  { h: "11:16", Icon: FileDown, t: "El informe se envió solo", d: "A la empresa mandante y al cliente." },
  { h: "15:30", Icon: Gauge, t: "La empresa mandante revisó sus obras", d: "Tres en ejecución, una en pruebas." },
  { h: "16:05", Icon: Globe, t: "Un cliente nuevo revisó inecso.cl", d: "Vio sus obras y su certificación SEC antes de reunirse." },
];

/** Version B, act 1: the vision first. The first words of the headline carry the future INECSO gets. */
export function VisionB() {
  return (
    <section id="vision" aria-labelledby="h-vision" className="grilla relative isolate overflow-hidden bg-papel px-5 pb-20 pt-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-6 wdth-87 text-[0.95rem] text-tinta-suave">
            Propuesta para INECSO Ingeniería
            <br />
            Preparada por Gonzalo Rosas, noviembre de 2026
          </p>
          <h1 id="h-vision" className="wdth-125 text-[clamp(2.4rem,1.2rem+3.6vw,4.8rem)] font-extrabold leading-[0.97] tracking-[-0.02em]">
            <motion.span className="block" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}>
              Que quien los busque, los encuentre.
            </motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}>
              Que cada obra se siga sin llamar.
            </motion.span>
          </h1>
          <p className="mt-7 max-w-[54ch] text-[1.1rem] leading-relaxed text-tinta-suave">
            Primero, una web que sea su vitrina. Después, un portal que ordena obras, mantenciones e informes.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#dolores" className="inline-flex items-center gap-2 rounded-lg bg-grafito px-5 py-3 wdth-87 font-bold text-papel transition-transform hover:-translate-y-0.5">
              Qué lo impide hoy
            </a>
            <a href="#solucion" className="inline-flex items-center gap-2 rounded-lg border border-linea bg-blanco px-5 py-3 wdth-87 font-bold transition-transform hover:-translate-y-0.5">
              Ver la solución
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-linea bg-blanco p-5 shadow-[0_40px_80px_-40px_rgb(27_32_36/0.45)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-linea pb-3">
              <p className="wdth-87 font-bold">Así se vería un día</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-papel px-2.5 py-0.5 wdth-87 text-[0.75rem] text-tinta-suave">
                <MessageSquareText className="size-3.5" aria-hidden="true" />
                Ejemplo
              </span>
            </div>
            <ol className="relative mt-4 space-y-3 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-linea">
              {DIA.map((x, i) => (
                <motion.li
                  key={x.h + x.t}
                  className="relative grid grid-cols-[40px_1fr] gap-3"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.45, type: "spring", stiffness: 260, damping: 24 }}
                >
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-linea bg-papel">
                    <x.Icon className="size-[18px] text-cianotipo" aria-hidden="true" />
                  </span>
                  <span className="rounded-xl bg-papel px-3.5 py-2.5">
                    <span className="flex items-baseline justify-between gap-3">
                      <b className="wdth-87 leading-snug">{x.t}</b>
                      <span className="shrink-0 text-[0.78rem] tabular-nums text-tinta-suave">{x.h}</span>
                    </span>
                    <span className="mt-0.5 block text-[0.88rem] leading-snug text-tinta-suave">{x.d}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
