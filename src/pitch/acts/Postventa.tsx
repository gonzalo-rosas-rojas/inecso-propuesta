import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPROMISOS, IMPREVISTOS, PLAN_RECOMENDADO, PLANES, type Plan } from "@/data/precios";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { Punto } from "../ui/Punto";
import { clp } from "../format";

/**
 * After-sales: what stays firm once the work is delivered (warranty, ownership, documentation, an orderly exit) and the
 * monthly maintenance plans. INECSO is not technical, so this act answers "who takes care of this afterwards?".
 */
export function Postventa() {
  const [planId, setPlanId] = useState<Plan["id"]>(PLAN_RECOMENDADO);
  const plan = PLANES.find((p) => p.id === planId)!;

  return (
    <section id="postventa" aria-labelledby="h-post" className="bg-papel px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-cianotipo">Postventa</p>
        <h2 id="h-post" className="mt-2 max-w-[22ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          Después de publicar, sigo con ustedes.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[1.05rem] text-tinta-suave">
          Con un plan de mantención, todo lo técnico corre por mi cuenta: cambios, vencimientos e imprevistos. Ustedes solo me escriben.
        </p>

        <div className="mt-10 rounded-2xl bg-blanco p-6 sm:p-8">
          <p className="wdth-87 font-bold">Lo que queda firme, tengan o no un plan</p>
          <ul className="mt-4 grid gap-x-8 gap-y-4 text-[0.95rem] md:grid-cols-2">
            {COMPROMISOS.map((x) => (
              <Punto key={x.t} x={x} />
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <fieldset>
            <legend className="mb-1 wdth-87 font-bold">Mantención mensual: yo me hago cargo</legend>
            <p className="mb-4 max-w-[70ch] text-[0.94rem] text-tinta-suave">Elijan cuánto quieren delegar.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PLANES.map((p) => {
                const on = p.id === planId;
                return (
                  <label key={p.id} className={cn("relative flex cursor-pointer flex-col rounded-xl border px-4 py-3 transition-colors", on ? "border-cianotipo bg-blanco" : "border-linea hover:bg-blanco/60")}>
                    <input type="radio" name="plan" value={p.id} checked={on} onChange={() => setPlanId(p.id)} className="peer sr-only" />
                    <span className="absolute inset-0 rounded-xl peer-focus-visible:outline-3 peer-focus-visible:outline-energia" aria-hidden="true" />
                    <span className="flex items-baseline justify-between gap-2">
                      <b className="wdth-87">{p.nombre}</b>
                      <span className="wdth-87 font-bold tabular-nums">{p.clp ? `${clp(p.clp)} al mes` : "—"}</span>
                    </span>
                    {p.id === PLAN_RECOMENDADO && <span className="mt-1 self-start rounded-full bg-energia px-2 py-0.5 wdth-87 text-[0.72rem] font-bold text-grafito">La que recomiendo</span>}
                    <span className="mt-1 text-[0.88rem] text-tinta-suave">{p.para}</span>
                  </label>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-3 rounded-xl bg-blanco p-5"
              >
                <ul className="grid gap-x-6 gap-y-3 text-[0.94rem] md:grid-cols-2">
                  {plan.incluye.map((x) => (
                    <Punto key={x.t} x={x} />
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 rounded-xl border border-linea bg-blanco/60 p-5">
              <p className="wdth-87 font-bold">¿Y si pasa algo?</p>
              <div className="mt-2 divide-y divide-linea">
                {IMPREVISTOS.map((x) => (
                  <details key={x.q} className="group py-2.5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 wdth-87 font-semibold">
                      {x.q}
                      <Plus className="size-4 shrink-0 text-tinta-suave transition-transform group-open:rotate-45" aria-hidden="true" />
                    </summary>
                    <p className="mt-1.5 max-w-[75ch] text-[0.92rem] leading-relaxed text-tinta-suave">{x.a}</p>
                  </details>
                ))}
              </div>
              <p className="mt-3 text-[0.82rem] text-tinta-suave">Así es con cualquier plan. Sin plan, cada caso se cotiza aparte.</p>
            </div>
          </fieldset>

          <aside className="lg:sticky lg:top-8 lg:self-start" aria-live="polite">
            <div className="overflow-hidden rounded-2xl bg-grafito text-papel shadow-[0_30px_60px_-30px_rgb(27_32_36/0.7)]">
              <div className="border-b border-linea-osc px-6 py-4">
                <p className="wdth-87 text-[0.85rem] text-linea">Su plan</p>
                <p className="wdth-112 text-[1.15rem] font-bold">{plan.nombre}</p>
              </div>
              <dl className="divide-y divide-linea-osc">
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Cada mes</dt>
                  <dd className="wdth-100 text-[2.1rem] font-extrabold leading-none text-energia tabular-nums">
                    {plan.clp ? <AnimatedNumber value={plan.clp} format={clp} /> : "Sin plan"}
                  </dd>
                  <dd className="mt-1 text-[0.88rem] text-papel/70">{plan.clp ? "Mínimo 6 meses; después, mes a mes." : "Cada trabajo se cotiza aparte."}</dd>
                </div>
                {plan.respuesta && (
                  <div className="px-6 py-4">
                    <dt className="wdth-87 text-[0.85rem] text-linea">Cuánto me demoro en responder</dt>
                    <dd className="mt-1 text-[0.95rem] leading-snug">{plan.respuesta}</dd>
                  </div>
                )}
                <div className="flex gap-3 px-6 py-4">
                  <MessageCircle className="mt-0.5 size-5 shrink-0 text-energia" aria-hidden="true" />
                  <dd className="text-[0.9rem] leading-snug text-papel/80">Me escriben por WhatsApp o correo, como a alguien del equipo.</dd>
                </div>
              </dl>
              <p className="border-t border-linea-osc px-6 py-3 text-[0.78rem] text-papel/60">Montos sin IVA.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
