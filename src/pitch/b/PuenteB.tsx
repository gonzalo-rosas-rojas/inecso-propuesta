import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FILAS = [
  { dolor: "Sin vitrina", pieza: "Web en inecso.cl: servicios, obras con foto, certificación SEC y ficha de Google", res: "Una carta de presentación seria", etapa: "Web" },
  { dolor: "Informes a mano", pieza: "Orden de trabajo con pauta: el informe se arma solo", res: "El mismo informe, el mismo día", etapa: "Portal" },
  { dolor: "Llamadas para saber el avance", pieza: "Vista de avance: etapas, bitácora y documentos", res: "Lo ven solos, a cualquier hora", etapa: "Portal" },
  { dolor: "Cada técnico a su manera", pieza: "Las mismas pautas y protocolos de prueba para todo el equipo", res: "Mantenciones comparables y auditables", etapa: "Portal" },
  { dolor: "Mantenciones en planillas", pieza: "Calendario por equipo, por horas de uso o fecha, con aviso", res: "Ninguna se pasa de fecha", etapa: "Portal" },
];

/** Version B, act 3: the bridge from each obstacle to the piece that removes it and what INECSO gets. */
export function PuenteB() {
  return (
    <section id="solucion" aria-labelledby="h-sol" className="bg-blanco px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-cianotipo">La solución</p>
        <h2 id="h-sol" className="mt-2 max-w-[22ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          Una pieza para cada obstáculo.
        </h2>
        <p className="mt-4 max-w-[64ch] text-[1.05rem] text-tinta-suave">
          Pocas pymes trabajan con un sistema así: ahí está la ventaja.
        </p>
        <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-linea bg-linea sm:grid-cols-2">
          <div className="bg-papel px-5 py-4">
            <dt className="wdth-125 text-[2rem] font-extrabold leading-none text-cianotipo">5 %</dt>
            <dd className="mt-2 text-[0.92rem] leading-snug">
              de las pymes chilenas usaba un sistema para gestionar clientes; las grandes, el 21 %.
              <span className="mt-1 block text-[0.78rem] text-tinta-suave">Min. de Economía, Encuesta TIC 2018</span>
            </dd>
          </div>
          <div className="bg-papel px-5 py-4">
            <dt className="wdth-125 text-[2rem] font-extrabold leading-none text-cianotipo">70 %</dt>
            <dd className="mt-2 text-[0.92rem] leading-snug">
              de las empresas del Chequeo Digital está en los dos niveles más bajos y digitaliza las ventas antes que la operación.
              <span className="mt-1 block text-[0.78rem] text-tinta-suave">Min. de Economía, Chequeo Digital 2021-2024 (publicado en 2026)</span>
            </dd>
          </div>
        </dl>

        <div className="mt-10 hidden grid-cols-[0.8fr_auto_1.5fr_auto_1fr] gap-x-4 border-b border-linea pb-2 wdth-87 text-[0.82rem] font-semibold text-tinta-suave md:grid">
          <span>Hoy</span>
          <span />
          <span>La pieza</span>
          <span />
          <span>Lo que ganan</span>
        </div>
        <ol className="divide-y divide-linea border-b border-linea">
          {FILAS.map((f, i) => (
            <motion.li
              key={f.dolor}
              className="grid items-center gap-x-4 gap-y-2 py-5 md:grid-cols-[0.8fr_auto_1.5fr_auto_1fr]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ delay: 0.06 * i, duration: 0.35 }}
            >
              <span className="wdth-87 font-semibold text-falla line-through decoration-falla/40">{f.dolor}</span>
              <ArrowRight className="hidden size-5 text-linea md:block" aria-hidden="true" />
              <span className="flex items-start gap-3">
                <span className={cn("mt-0.5 shrink-0 rounded-full px-2 py-0.5 wdth-87 text-[0.72rem] font-bold", f.etapa === "Web" ? "bg-cianotipo text-blanco" : "bg-energia text-grafito")}>
                  {f.etapa}
                </span>
                <span className="leading-snug">{f.pieza}</span>
              </span>
              <ArrowRight className="hidden size-5 text-linea md:block" aria-hidden="true" />
              <span className="wdth-100 font-bold leading-snug text-tierra">{f.res}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
