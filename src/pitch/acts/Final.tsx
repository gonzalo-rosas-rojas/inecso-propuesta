import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "../hooks";

const LAMPARAS = [12, 31, 50, 69, 88]; // x in % of the width

function Lampara({ x, p, i }: { x: number; p: MotionValue<number>; i: number }) {
  const a = 0.12 + i * 0.07;
  const on = useTransform(p, [a, a + 0.05], [0, 1]);
  return (
    <g transform={`translate(${x * 10} 0)`}>
      <path d="M0 0v46" stroke="var(--color-linea)" strokeWidth="2" />
      <motion.path d="M-150 400 L-22 70 H22 L150 400 Z" fill="url(#cono)" style={{ opacity: on }} />
      <path d="M-26 70 Q0 40 26 70 Z" fill="var(--color-grafito-3)" stroke="var(--color-linea)" strokeWidth="1.5" />
      <circle cx="0" cy="72" r="9" fill="var(--color-linea-osc)" />
      <motion.circle cx="0" cy="72" r="9" fill="var(--color-energia)" className="luminaria-luz" style={{ opacity: on }} />
    </g>
  );
}

/** Quién hace esto + act 9, "Puesta en servicio": the one big gesture of the page. */
export function Final() {
  const ref = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useTransform(scrollYProgress, (v) => (rm ? 1 : v));
  const radio = useTransform(p, [0.42, 0.78], [0, 150]);
  const clip = useTransform(radio, (r) => `circle(${r}% at 50% 16%)`);
  const texto = useTransform(p, [0.5, 0.7], ["#eceeea", "#22292f"]);
  const sub = useTransform(p, [0.5, 0.7], ["rgba(236,238,234,0.75)", "rgba(34,41,47,0.75)"]);

  return (
    <>
      <section aria-labelledby="h-quien" className="bg-papel px-5 py-20 sm:px-10 min-[1100px]:px-16">
        <div className="mx-auto grid max-w-[1180px] gap-6 border-t border-linea pt-12 md:grid-cols-[0.8fr_1.4fr]">
          <h2 id="h-quien" className="wdth-125 text-[1.6rem] font-extrabold leading-tight">
            Quién hace esto
          </h2>
          <div className="max-w-[64ch] space-y-3 text-[1.05rem]">
            <p>
              <b>Gonzalo Rosas</b>, desarrollador fullstack senior especializado en inteligencia artificial aplicada. Esta página y la demo
              las construí para ustedes, desde cero, con sus propios textos y fotos.
            </p>
            <p className="text-tinta-suave">
              Otro trabajo mío, publicado:{" "}
              <a className="font-semibold text-cianotipo underline underline-offset-4" href="https://gonzalo-rosas-rojas.github.io/jobbot-showcase/?lang=es" target="_blank" rel="noopener">
                The Night Shift
              </a>
              , la historia de un programa que hice para automatizar una búsqueda de empleo.
            </p>
          </div>
        </div>
      </section>

      <section id="servicio" ref={ref} aria-labelledby="h-fin" className={cn("relative bg-grafito", !rm && "h-[200vh]")}>
        <div className={cn("relative overflow-hidden", !rm ? "sticky top-0 h-[100svh]" : "py-24")}>
          <motion.div aria-hidden="true" className="absolute inset-0 bg-blanco" style={{ clipPath: clip }} />
          <svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMin slice" className="pointer-events-none absolute inset-x-0 top-0 h-[60%] w-full" aria-hidden="true">
            <defs>
              <linearGradient id="cono" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f2c014" stopOpacity="0.45" />
                <stop offset="1" stopColor="#f2c014" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 2h1000" stroke="var(--color-linea)" strokeWidth="2" />
            {LAMPARAS.map((x, i) => (
              <Lampara key={x} x={x} p={p} i={i} />
            ))}
          </svg>
          <div className="relative flex h-full items-end px-5 pb-[12vh] pt-[42vh] sm:px-10 min-[1100px]:px-16">
            <div className="mx-auto w-full max-w-[1180px]">
              <motion.p style={{ color: sub }} className="wdth-87 font-semibold">
                Puesta en servicio
              </motion.p>
              <motion.h2
                id="h-fin"
                style={{ color: texto }}
                className="mt-2 max-w-[22ch] wdth-125 text-[clamp(1.9rem,1rem+2.8vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-balance"
              >
                Una obra se entrega energizada y certificada. Esta, cuando el primer informe le llega solo a la empresa mandante.
              </motion.h2>
              <motion.p style={{ color: sub }} className="mt-5 max-w-[60ch] text-[1.06rem]">
                El primer paso: media hora de conversación para ajustar el alcance. El dominio inecso.cl vence el 3 de marzo de 2027;
                la web nueva puede estar funcionando antes.
              </motion.p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:gonzalo.rosas.rojas@gmail.com?subject=Propuesta%20web%20INECSO"
                  className="inline-flex items-center gap-2 rounded-lg bg-energia px-6 py-3.5 wdth-87 text-[1.05rem] font-bold text-grafito shadow-[0_12px_30px_-12px_var(--color-energia-osc)] transition-transform hover:-translate-y-0.5"
                >
                  <Mail className="size-5" aria-hidden="true" />
                  Conversemos
                </a>
                <motion.span style={{ color: sub }} className="text-[0.9rem]">
                  gonzalo.rosas.rojas@gmail.com
                </motion.span>
              </div>
              <motion.p style={{ color: sub }} className="mt-10 max-w-[80ch] text-[0.8rem]">
                Textos y fotos de INECSO tomados de sus webs anteriores (archivo de internet, 2008–2025); las descripciones de obras y el
                portal usan datos de ejemplo. Propuesta válida por 30 días.
              </motion.p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
