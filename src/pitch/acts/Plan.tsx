import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Carta } from "../ui/Carta";
import { RELOJ } from "@/data/portal";

type Paso = { t: string; d: string; quien: "yo" | "ustedes" | "juntos"; pago?: string; etapa: "web" | "portal" };

const PASOS: Paso[] = [
  { t: "Acuerdo", d: "Modalidad, alcance y fechas, en un acuerdo simple.", quien: "juntos", pago: "40 % de la web", etapa: "web" },
  { t: "Contenido", d: "Confirmar datos, certificado SEC y clientes que se pueden mostrar.", quien: "ustedes", etapa: "web" },
  { t: "Diseño", d: "Primera demo, sobre la web funcionando.", quien: "yo", pago: "30 % al aprobarlo", etapa: "web" },
  { t: "Levantamiento del portal", d: "Cómo trabajan hoy; termina en alcance y precio cerrado.", quien: "juntos", pago: "Sin costo", etapa: "portal" },
  { t: "Construcción y pruebas", d: "Segunda demo y pruebas de velocidad y seguridad.", quien: "yo", etapa: "web" },
  { t: "Publicación", d: "En inecso.cl, con su ficha de Google y una capacitación.", quien: "yo", pago: "30 % al publicar", etapa: "web" },
  { t: "Portal por etapas", d: "Mantenciones e informes, avance para la mandante, gestión.", quien: "yo", pago: "Por etapa", etapa: "portal" },
];

const COLOR = { yo: "bg-cianotipo text-blanco", ustedes: "bg-tierra text-blanco", juntos: "bg-cianotipo-claro text-grafito" } as const;
const QUIEN = { yo: "Lo hago yo", ustedes: "Lo entregan ustedes", juntos: "Juntos" } as const;

/** Act 7: the work plan as a sequence of milestones (dates are agreed when signing), with the payments on it. */
export function Plan() {
  return (
    <section id="plan" aria-labelledby="h-plan" className="bg-blanco px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-cianotipo">Plan de trabajo</p>
        <h2 id="h-plan" className="mt-2 max-w-[20ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          La web en días. Web y portal, en un mes.
        </h2>
        <p className="mt-4 max-w-[66ch] text-[1.05rem] text-tinta-suave">{RELOJ}</p>

        <div className="mt-10">
          <Carta />
        </div>

        <ol className="relative mt-12 grid gap-x-4 gap-y-8 md:grid-cols-7">
          <motion.span
            aria-hidden="true"
            className="absolute left-[11px] top-3 hidden h-[3px] origin-left rounded-full bg-energia md:block"
            style={{ width: "calc(100% - 22px)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
          />
          <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-3 w-[3px] rounded-full bg-energia md:hidden" />
          {PASOS.map((p, i) => (
            <motion.li
              key={p.t}
              className="relative pl-10 md:pl-0"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ delay: 0.15 * i, duration: 0.35 }}
            >
              <span className={cn("absolute left-0 top-0 grid size-6 place-items-center rounded-full border-2 border-blanco text-[0.72rem] font-bold md:relative", COLOR[p.quien])}>{i + 1}</span>
              {p.t === "Portal por etapas" && <span className="absolute -top-6 left-10 wdth-87 text-[0.75rem] font-semibold text-tinta-suave md:left-0">Después de publicar</span>}
              <b className="mt-0 block wdth-87 leading-tight md:mt-4">{p.t}</b>
              <span className="mt-1 block text-[0.86rem] leading-snug text-tinta-suave">{p.d}</span>
              <span className="mt-2 block wdth-87 text-[0.74rem] text-tinta-suave">{QUIEN[p.quien]}</span>
              {p.pago && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-energia/20 px-2 py-0.5 wdth-87 text-[0.74rem] font-bold">
                  <i className="size-2 rotate-45 bg-energia" />
                  {p.pago}
                </span>
              )}
            </motion.li>
          ))}
        </ol>
        <p className="mt-10 max-w-[72ch] text-[0.95rem] text-tinta-suave">
          Si las fotos nuevas tardan, se publica con lo rescatado de sus webs anteriores: la web no espera.
        </p>
      </div>
    </section>
  );
}
