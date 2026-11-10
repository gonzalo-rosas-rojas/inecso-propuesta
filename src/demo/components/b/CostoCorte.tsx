import { useId, useState } from "react";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { CORTE_AFECTADO_DEFAULT, CORTE_COSTO_HORA_DEFAULT, CORTE_EVITA, CORTE_HORAS_DEFAULT } from "@/data/inecso";
import { AnimatedClp } from "./AnimatedClp";


function Supuesto() {
  return <span className="ml-2 rounded-full bg-energia/25 px-2 py-0.5 wdth-87 text-[0.72rem] font-semibold text-tinta">Supuesto conservador: cámbielo por sus datos</span>;
}

/**
 * Version B, "potential growth" made honest: what a power cut costs the visitor, with THEIR numbers, and what an
 * automatic standby generator avoids, as a range with the low end first. No sector statistics are invented: every
 * default is labelled as a conservative assumption, and INECSO confirms it in a technical visit.
 */
export function CostoCorte() {
  const [horas, setHoras] = useState(CORTE_HORAS_DEFAULT);
  const [costo, setCosto] = useState(CORTE_COSTO_HORA_DEFAULT);
  const [afectado, setAfectado] = useState(CORTE_AFECTADO_DEFAULT);
  const ids = { h: useId(), c: useId(), a: useId() };

  const perdida = horas * costo * (afectado / 100);
  const bajo = perdida * CORTE_EVITA.bajo;
  const alto = perdida * CORTE_EVITA.alto;
  const restoAlto = 1 - CORTE_EVITA.bajo; // what is still lost in the low case
  const restoBajo = 1 - CORTE_EVITA.alto;

  return (
    <section id="costo-corte" className="scroll-mt-24 bg-blanco py-20 lg:py-28" aria-labelledby="cc-h">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h2 id="cc-h" className="wdth-125 text-[clamp(1.9rem,1.2rem+2.6vw,3.2rem)] leading-[1.02] font-extrabold text-balance">
            ¿Cuánto le cuesta un corte?
          </h2>
          <p className="mt-3 text-tinta-suave">
            Con sus propios números. Los valores de partida son bajos a propósito: es mejor que la cuenta se quede corta a que prometa de más.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6 rounded-md bg-papel p-5 ring-1 ring-linea/70 sm:p-7">
            <div>
              <label htmlFor={ids.h} className="flex flex-wrap items-center font-semibold">
                Horas de corte en un año
                <Supuesto />
              </label>
              <div className="mt-3 flex items-center gap-4">
                <input id={ids.h} type="range" min={1} max={60} step={1} value={horas} onChange={(e) => setHoras(+e.target.value)} className="w-full accent-cianotipo" />
                <output htmlFor={ids.h} className="w-20 text-right wdth-100 text-[1.2rem] font-bold tabular-nums">
                  {horas} h
                </output>
              </div>
              <p className="mt-1 text-[0.85rem] text-tinta-suave">
                Viene puesto el promedio de un año normal: en 2023, un cliente en Chile estuvo 13,6 horas sin luz. En 2024 fueron 27,6 horas, y
                29,4 en la Región Metropolitana (SEC, citado por Diario Financiero, 2025).
              </p>
            </div>

            <div>
              <label htmlFor={ids.c} className="flex flex-wrap items-center font-semibold">
                Costo de una hora detenida
                <Supuesto />
              </label>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-tinta-suave">$</span>
                <input
                  id={ids.c}
                  inputMode="numeric"
                  className="campo max-w-[14rem] tabular-nums"
                  value={costo.toLocaleString("es-CL")}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/\D/g, "") || "0", 10);
                    setCosto(Math.min(v, 999_999_999));
                  }}
                  aria-describedby={`${ids.c}-d`}
                />
              </div>
              <p id={`${ids.c}-d`} className="mt-1 text-[0.85rem] text-tinta-suave">
                Lo que se pierde en una hora: ventas, producción, mermas y horas de personal sin poder trabajar.
              </p>
            </div>

            <div>
              <label htmlFor={ids.a} className="flex flex-wrap items-center font-semibold">
                Parte de la operación que se detiene
                <Supuesto />
              </label>
              <div className="mt-3 flex items-center gap-4">
                <input id={ids.a} type="range" min={10} max={100} step={5} value={afectado} onChange={(e) => setAfectado(+e.target.value)} className="w-full accent-cianotipo" />
                <output htmlFor={ids.a} className="w-20 text-right wdth-100 text-[1.2rem] font-bold tabular-nums">
                  {afectado} %
                </output>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-md bg-grafito p-5 text-blanco sm:p-7" aria-live="polite">
            <p className="wdth-87 text-[0.9rem] text-blanco/70">Hoy, sin respaldo, los cortes de un año le cuestan</p>
            <p className="mt-1 wdth-112 text-[clamp(1.8rem,1.3rem+1.6vw,2.5rem)] font-extrabold tabular-nums">
              <AnimatedClp value={perdida} />
            </p>

            <p className="mt-6 wdth-87 text-[0.9rem] text-blanco/70">Con un grupo electrógeno y transferencia automática, evitaría</p>
            <p className="mt-1 wdth-112 text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] font-extrabold text-energia tabular-nums">
              entre <AnimatedClp value={bajo} /> y <AnimatedClp value={alto} />
            </p>
            <p className="text-[0.85rem] text-blanco/60">al año. La cifra baja, si respalda solo lo crítico; la alta, si respalda todo lo que se detiene. Ese 60 y ese 95 % también son supuestos: dependen de qué cargas quedan conectadas al grupo.</p>

            <div className="mt-6 space-y-3" aria-hidden="true">
              <div>
                <p className="mb-1 text-[0.78rem] text-blanco/60">Sin respaldo</p>
                <div className="h-3 overflow-hidden rounded-full bg-blanco/10">
                  <motion.div className="h-full origin-left rounded-full bg-falla" initial={false} animate={{ scaleX: perdida > 0 ? 1 : 0 }} />
                </div>
              </div>
              <div>
                <p className="mb-1 text-[0.78rem] text-blanco/60">Con respaldo: lo que aún se pierde</p>
                <div className="relative h-3 overflow-hidden rounded-full bg-blanco/10">
                  <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-energia/35" initial={false} animate={{ scaleX: perdida > 0 ? restoAlto : 0 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                  <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-energia" initial={false} animate={{ scaleX: perdida > 0 ? restoBajo : 0 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                </div>
              </div>
            </div>

            <p className="mt-auto flex gap-2 pt-8 text-[0.82rem] leading-snug text-blanco/60">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Cálculo orientativo con sus datos; no incluye el costo del equipo ni de su mantención. INECSO lo confirma en una visita técnica.
              </span>
            </p>
            <a href="#/contacto" className="btn btn-energia mt-5 self-start px-6 py-3.5">
              Pedir una visita técnica
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
