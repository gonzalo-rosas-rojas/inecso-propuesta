import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE, CONTRASTE, MANT, NIVEL_RECOMENDADO, NIVELES, type Nivel } from "@/data/precios";
import { Punto } from "../ui/Punto";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { clp } from "../format";

/** Act 6: choose the scope; every price is shown with its list price, and the total updates as you choose. */
export function Alcance() {
  const [nivelId, setNivelId] = useState<Nivel["id"]>(NIVEL_RECOMENDADO);
  const nivel = NIVELES.find((n) => n.id === nivelId)!;
  const unaVez = nivel.lanzamiento;
  const alFirmar = nivel.lanzamiento * (nivel.pagos[0].pct / 100);
  const ia = nivel.id === "completa";

  return (
    <section id="alcance" aria-labelledby="h-alc" className="bg-papel px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-cianotipo">La web: alcance y precio</p>
        <h2 id="h-alc" className="mt-2 max-w-[22ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          Primero la vitrina. Elijan el nivel y vean el precio al tiro.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[1.05rem] text-tinta-suave">
          Tres niveles a precio cerrado; recomiendo partir por la esencial, base de las otras dos. El precio de lanzamiento (25 % menos) es a
          cambio de mostrarla en mi portafolio con un breve testimonio de INECSO.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-8">
            <fieldset>
              <legend className="mb-3 wdth-87 font-bold">Elijan el nivel</legend>
              <div className="grid gap-3 md:grid-cols-3">
                {NIVELES.map((n) => {
                  const on = n.id === nivelId;
                  const premium = n.id === "completa";
                  return (
                    <label
                      key={n.id}
                      className={cn(
                        "relative flex cursor-pointer flex-col overflow-hidden rounded-xl border p-4 transition-all",
                        premium ? (on ? "border-energia bg-grafito text-papel" : "border-grafito-3 bg-grafito text-papel hover:border-energia/60") : on ? "border-cianotipo bg-blanco shadow-[0_18px_40px_-26px_var(--color-cianotipo)]" : "border-linea bg-papel hover:bg-blanco/60",
                      )}
                    >
                      <input type="radio" name="nivel" value={n.id} checked={on} onChange={() => setNivelId(n.id)} className="peer sr-only" />
                      <span className="absolute inset-0 rounded-xl peer-focus-visible:outline-3 peer-focus-visible:outline-energia" aria-hidden="true" />
                      {n.id === NIVEL_RECOMENDADO && <span className="mb-2 self-start rounded-full bg-energia px-2.5 py-0.5 wdth-87 text-[0.75rem] font-bold text-grafito">Para partir</span>}
                      {n.id === "medida" && <span className="mb-2 self-start rounded-full bg-cianotipo/10 px-2.5 py-0.5 wdth-87 text-[0.75rem] font-bold text-cianotipo">La de esta demo</span>}
                      {premium && (
                        <span className="mb-2 inline-flex items-center gap-1.5 self-start rounded-full bg-energia/15 px-2.5 py-0.5 wdth-87 text-[0.75rem] font-bold text-energia">
                          <Sparkles className="size-3.5" aria-hidden="true" />
                          Con inteligencia artificial
                        </span>
                      )}
                      <b className="wdth-112 text-[1.1rem] leading-tight">{n.nombre}</b>
                      <span className={cn("mt-1 text-[0.9rem]", premium ? "text-papel/70" : "text-tinta-suave")}>{n.para}</span>
                      <span className="mt-4 wdth-100 text-[1.5rem] font-extrabold leading-none tabular-nums">{clp(n.lanzamiento)}</span>
                      <span className={cn("mt-1 wdth-87 text-[0.82rem] font-semibold", premium ? "text-papel/80" : "text-tinta")}>{n.semanas}</span>
                      <span className={cn("mt-1 text-[0.82rem]", premium ? "text-papel/60" : "text-tinta-suave")}>
                        Precio lista <s>{clp(n.lista)}</s>
                      </span>
                    </label>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={nivel.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={cn("mt-4 grid gap-5 rounded-xl p-5 md:grid-cols-[1.5fr_1fr]", ia ? "bg-grafito text-papel" : "bg-blanco")}
                >
                  <ul className="space-y-2.5 text-[0.94rem]">
                    {nivel.incluye.map((x) => (
                      <Punto key={x.t} x={x} oscuro={ia} />
                    ))}
                  </ul>
                  <div>
                    <p className="wdth-87 text-[0.85rem] font-bold">No incluye</p>
                    <ul className={cn("mt-1 space-y-1 text-[0.9rem]", ia ? "text-papel/60" : "text-tinta-suave")}>
                      {nivel.noIncluye.map((x) => (
                        <li key={x} className="flex gap-2">
                          <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                          {x}
                        </li>
                      ))}
                    </ul>
                    {nivel.nota && <p className={cn("mt-4 text-[0.85rem] leading-snug", ia ? "text-papel/60" : "font-semibold text-tierra")}>{nivel.nota}</p>}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 rounded-xl border border-linea bg-papel p-5">
                <p className="wdth-87 font-bold">En las tres, desde el primer día</p>
                <ul className="mt-4 grid gap-x-6 gap-y-3 text-[0.94rem] md:grid-cols-2">
                  {BASE.map((x) => (
                    <Punto key={x.t} x={x} />
                  ))}
                </ul>
              </div>

              <details className="group mt-4 rounded-xl bg-blanco px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 wdth-87 font-bold">
                  {CONTRASTE.t}
                  <Plus className="size-4 shrink-0 text-tinta-suave transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                {CONTRASTE.d.map((d) => (
                  <p key={d} className="mt-2 max-w-[75ch] text-[0.94rem] leading-relaxed text-tinta-suave">
                    {d}
                  </p>
                ))}
              </details>
            </fieldset>


          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start" aria-live="polite">
            <div className="overflow-hidden rounded-2xl bg-grafito text-papel shadow-[0_30px_60px_-30px_rgb(27_32_36/0.7)]">
              <div className="border-b border-linea-osc px-6 py-4">
                <p className="wdth-87 text-[0.85rem] text-linea">Su selección</p>
                <p className="wdth-112 text-[1.15rem] font-bold">
                  {nivel.nombre}
                </p>
              </div>
              <dl className="divide-y divide-linea-osc">
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Pago único</dt>
                  <dd className="wdth-100 text-[2.1rem] font-extrabold leading-none text-energia tabular-nums">
                    <AnimatedNumber value={unaVez} format={clp} />
                  </dd>
                  <dd className="mt-1 text-[0.88rem] text-papel/70">en cuotas, al cumplir cada hito</dd>
                </div>
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Plazo</dt>
                  <dd className="wdth-100 text-[1.3rem] font-bold">{nivel.semanas}</dd>
                  <dd className="text-[0.82rem] text-papel/70">Desde la firma. Parte en una dirección provisoria y pasa a inecso.cl con el dominio.</dd>
                </div>
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Al firmar</dt>
                  <dd className="wdth-100 text-[1.3rem] font-bold tabular-nums">
                    <AnimatedNumber value={alFirmar} format={clp} />
                  </dd>
                  <dd className="mt-2">
                    <ol className="flex overflow-hidden rounded-md text-[0.78rem]">
                      {nivel.pagos.map((p, i) => (
                        <motion.li layout key={p.cuando} className={cn("flex flex-col px-2 py-1.5", i === 0 ? "bg-energia text-grafito" : "bg-grafito-3 text-papel/80")} style={{ flexGrow: p.pct, flexBasis: 0 }}>
                          <b>{p.pct} %</b>
                          <span className="leading-tight">{p.cuando}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </dd>
                </div>
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Después de publicar</dt>
                  <dd className="wdth-100 text-[1.3rem] font-bold tabular-nums">{clp(MANT.web)} al mes</dd>
                  <dd className="text-[0.82rem] text-papel/70">
                    La mantención que recomiendo:{" "}
                    <a href="#postventa" className="underline underline-offset-2 hover:text-energia">
                      ver planes
                    </a>
                    .
                  </dd>
                </div>
              </dl>
              <p className="border-t border-linea-osc px-6 py-3 text-[0.78rem] text-papel/60">
                Montos sin IVA. Aparte, el dominio: unos $10.000 al año (el servidor puede ser gratuito).
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
