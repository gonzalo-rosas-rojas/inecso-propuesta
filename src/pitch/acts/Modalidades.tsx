import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CircleAlert, Info, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONCEPTOS, CRITERIOS, FECHA_PRECIOS, MESES_USO, MODALIDADES, antes, dosAnios, type Concepto, type Modalidad } from "@/data/modalidades";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { clp, millones } from "../format";

const HITO_MAX = 2_000_000; // same scale for every modality, so the bars can be compared

/** The payments as a flow of milestones (not dates): how long each step takes is agreed when signing. */
function Flujo({ m }: { m: Modalidad }) {
  let acc = 0;
  const presentes = (Object.keys(CONCEPTOS) as Concepto[]).filter((c) => m.hitos.some((h) => h.concepto === c));
  return (
    <figure>
      <figcaption className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 wdth-87 text-[0.85rem] text-tinta-suave">
        <span className="font-semibold text-tinta">Qué se paga en cada hito</span>
        {presentes.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <i className="size-2.5 rounded-sm" style={{ background: CONCEPTOS[c].color }} />
            {CONCEPTOS[c].nombre}
          </span>
        ))}
      </figcaption>
      <ol className="relative space-y-1.5 border-l-2 border-linea pl-5">
        {m.hitos.map((h, i) => {
          acc += h.clp;
          return (
            <motion.li
              key={`${m.id}-${h.hito}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.035, duration: 0.25 }}
              className="relative grid grid-cols-[minmax(110px,190px)_1fr_auto] items-center gap-3 text-[0.86rem]"
            >
              <i className="absolute -left-[27px] size-3 rounded-full border-2 border-blanco" style={{ background: CONCEPTOS[h.concepto].color }} />
              <span className="wdth-87 leading-tight">{h.hito}</span>
              <span className="h-3 overflow-hidden rounded-full bg-papel-2">
                <motion.span
                  className="block h-full origin-left rounded-full"
                  style={{ background: CONCEPTOS[h.concepto].color, width: `${Math.min(100, (h.clp / HITO_MAX) * 100)}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1 + i * 0.035, type: "spring", stiffness: 120, damping: 20 }}
                />
              </span>
              <span className="w-[104px] text-right tabular-nums">
                <b>{clp(h.clp)}</b>
                <span className="block text-[0.74rem] text-tinta-suave">van {clp(acc)}</span>
              </span>
            </motion.li>
          );
        })}
        <li className="relative !mt-3 rounded-lg bg-grafito px-4 py-3 text-papel">
          <i className="absolute -left-[27px] top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-blanco bg-tierra" />
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="wdth-87 text-[0.86rem]">Cada mes, con el portal en uso: {m.mensual.que.toLowerCase()}</span>
            <b className="wdth-100 text-[1.1rem] tabular-nums text-energia">{clp(m.mensual.clp)}</b>
          </span>
        </li>
      </ol>
    </figure>
  );
}

function Medidor({ v, on }: { v: number; on: boolean }) {
  return (
    <span className="inline-flex gap-[3px]" aria-label={`${v} de 5`}>
      {[1, 2, 3, 4, 5].map((k) => (
        <i key={k} className={cn("h-3 w-[7px] rounded-[2px] transition-colors duration-300", k <= v ? (on ? "bg-energia" : "bg-cianotipo") : "bg-linea/60")} />
      ))}
    </span>
  );
}

/** Act 5: three ways to hire the work as a service, priced for the same job so they can be compared honestly. */
export function Modalidades() {
  const [id, setId] = useState<Modalidad["id"]>("proyecto");
  const m = MODALIDADES.find((x) => x.id === id)!;
  const pre = antes(m);
  const tot = dosAnios(m);
  const totales = MODALIDADES.map(dosAnios);
  // First month of use in which the subscription has cost more, in total, than the fixed price.
  const proy = MODALIDADES.find((x) => x.id === "proyecto")!;
  const sus = MODALIDADES.find((x) => x.id === "suscripcion")!;
  const dif = sus.mensual.clp - proy.mensual.clp;
  const cruce = dif > 0 ? Math.floor((antes(proy) - antes(sus)) / dif) + 1 : null;

  return (
    <section id="modalidades" aria-labelledby="h-mod" className="grilla bg-blanco px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-cianotipo">El portal: cómo se contrata</p>
        <h2 id="h-mod" className="mt-2 max-w-[22ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em] text-balance">
          El portal, de tres formas. En todas pagan resultados, no horas.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[1.05rem] text-tinta-suave">
          La web se paga siempre como proyecto. Las tres formas están calculadas para el mismo trabajo, web esencial y portal completo; cambia{" "}
          <b className="text-tinta">cuánto invierten al inicio, cuánta libertad tienen para cambiar y de quién es el código</b>.
        </p>

        <div role="tablist" aria-label="Modalidad" className="mt-10 flex flex-wrap gap-1 rounded-xl border border-linea bg-papel p-1.5 md:flex-nowrap">
          {MODALIDADES.map((x) => {
            const on = x.id === id;
            return (
              <button
                key={x.id}
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={on}
                aria-controls="panel-modalidad"
                onClick={() => setId(x.id)}
                className={cn("relative flex-1 whitespace-nowrap rounded-lg px-4 py-3 wdth-87 text-[0.95rem] font-bold transition-colors", on ? "text-grafito" : "text-tinta-suave hover:text-tinta")}
              >
                {on && <motion.span layoutId="mod-sel" className="absolute inset-0 rounded-lg bg-energia shadow-[0_6px_18px_-8px_var(--color-energia-osc)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{x.nombre}</span>
              </button>
            );
          })}
        </div>

        <div id="panel-modalidad" role="tabpanel" aria-labelledby={`tab-${id}`} className="mt-6 grid gap-8 rounded-2xl border border-linea bg-blanco p-5 sm:p-8 lg:grid-cols-[0.9fr_1.4fr]">
          <AnimatePresence mode="wait">
            <motion.div key={id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.22 }}>
              <h3 className="wdth-112 text-[1.45rem] font-extrabold leading-tight">{m.nombre}</h3>
              <p className="mt-3 leading-relaxed">{m.comoFunciona}</p>
              <dl className="mt-5 space-y-3 text-[0.95rem]">
                <div>
                  <dt className="wdth-87 font-bold">Cómo se paga</dt>
                  <dd className="text-tinta-suave">{m.comoSePaga}</dd>
                </div>
                <div className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-tierra" aria-hidden="true" />
                  <div>
                    <dt className="wdth-87 font-bold">Conviene</dt>
                    <dd className="text-tinta-suave">{m.conviene}</dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-energia-osc" aria-hidden="true" />
                  <div>
                    <dt className="wdth-87 font-bold">A considerar</dt>
                    <dd className="text-tinta-suave">{m.ojo}</dd>
                  </div>
                </div>
              </dl>
              <p className="mt-5 flex gap-2 text-[0.85rem] text-tinta-suave">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>Compromiso: {m.compromiso}</span>
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-linea bg-linea sm:grid-cols-4">
              <div className="bg-papel p-3.5">
                <p className="wdth-87 text-[0.8rem] text-tinta-suave">Hasta tener el portal</p>
                <p className="wdth-100 text-[1.3rem] font-extrabold tabular-nums">
                  <AnimatedNumber value={pre} format={clp} />
                </p>
                <p className="text-[0.78rem] text-tinta-suave">web y portal</p>
              </div>
              <div className="bg-papel p-3.5">
                <p className="wdth-87 text-[0.8rem] text-tinta-suave">Con {MESES_USO} meses de uso</p>
                <p className="wdth-100 text-[1.3rem] font-extrabold tabular-nums">
                  <AnimatedNumber value={tot} format={clp} />
                </p>
                <p className="text-[0.78rem] text-tinta-suave tabular-nums">luego {clp(m.mensual.clp)} al mes</p>
              </div>
              <div className="bg-papel p-3.5">
                <p className="wdth-87 text-[0.8rem] text-tinta-suave">Si algo se atrasa, lo asume</p>
                <p className="mt-1 wdth-87 font-bold leading-snug">{m.riesgo}</p>
              </div>
              <div className="bg-papel p-3.5">
                <p className="wdth-87 text-[0.8rem] text-tinta-suave">El código es de</p>
                <p className="mt-1 wdth-87 font-bold leading-snug">{m.codigo}</p>
              </div>
            </div>
            <div className="mt-6">
              <Flujo m={m} />
            </div>
          </div>
        </div>

        {cruce !== null && (
          <p className="mt-4 max-w-[70ch] text-[0.92rem] text-tinta-suave">
            La suscripción es la que menos pide al inicio, pero desde el mes {cruce} de uso el total pagado supera al del precio cerrado.
          </p>
        )}

        <details className="group mt-8 rounded-2xl border border-linea bg-blanco px-5 py-4 sm:px-8">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 wdth-87 font-bold">
            Ver detalle: las tres, lado a lado
            <Plus className="size-4 shrink-0 text-tinta-suave transition-transform group-open:rotate-45" aria-hidden="true" />
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[0.92rem]">
              <caption className="sr-only">Las tres, lado a lado</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[260px] pb-3 wdth-87 font-semibold text-tinta-suave">
                    Lo que les importa
                  </th>
                  {MODALIDADES.map((x) => (
                    <th key={x.id} scope="col" className="pb-3">
                      <button type="button" onClick={() => setId(x.id)} className={cn("rounded-md px-2 py-1 wdth-87 font-bold transition-colors", x.id === id ? "bg-energia text-grafito" : "hover:bg-papel")}>
                        {x.corto}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-linea">
                  <th scope="row" className="py-3 pr-4 font-medium">
                    Hasta tener el portal
                  </th>
                  {MODALIDADES.map((x) => (
                    <td key={x.id} className={cn("px-2 py-3 tabular-nums", x.id === id && "font-bold")}>
                      {clp(antes(x))}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-linea">
                  <th scope="row" className="py-3 pr-4 font-medium">
                    Con {MESES_USO} meses de uso
                  </th>
                  {MODALIDADES.map((x) => (
                    <td key={x.id} className={cn("px-2 py-3 tabular-nums", x.id === id && "font-bold")}>
                      {clp(dosAnios(x))}
                    </td>
                  ))}
                </tr>
                {CRITERIOS.map((c) => (
                  <tr key={c.key} className="border-t border-linea">
                    <th scope="row" className="py-3 pr-4 font-medium">
                      {c.nombre}
                      <span className="block text-[0.78rem] font-normal text-tinta-suave">{c.ayuda}</span>
                    </th>
                    {MODALIDADES.map((x) => (
                      <td key={x.id} className="px-2 py-3">
                        <Medidor v={x.puntajes[c.key]} on={x.id === id} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-grafito p-6 text-papel sm:p-8">
            <p className="wdth-125 text-[1.35rem] font-extrabold leading-tight text-energia">Lo que recomiendo</p>
            <ul className="mt-4 space-y-3 leading-relaxed text-papel/85">
              <li>
                <b className="text-papel">Partir por la web, a precio cerrado.</b> Saben cuánto pagan y el riesgo de un atraso es mío.
              </li>
              <li>
                <b className="text-papel">El portal, cuando la web ya esté trabajando</b>: a precio cerrado para ser dueños desde el inicio, en
                suscripción para no invertir al principio o con plan mensual para armarlo de a poco.
              </li>
            </ul>
          </div>
          <div className="self-start rounded-2xl border border-linea bg-papel px-6 py-2 sm:px-8">
            <div className="divide-y divide-linea">
              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 wdth-87 font-bold">
                  ¿Por qué no por hora?
                  <Plus className="size-4 shrink-0 text-tinta-suave transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="mt-2 leading-relaxed text-tinta-suave">
                  Por hora, ustedes pagan el tiempo y cargan el riesgo: si algo se alarga, la cuenta sube. Por entregable saben el precio antes y
                  pagan cuando está hecho. Lo que quede fuera del alcance se cotiza igual: precio cerrado y por escrito, antes de hacerlo.
                </p>
              </details>
              <details className="group py-4 text-[0.88rem] text-tinta-suave">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 wdth-87 text-[1rem] font-bold text-tinta">
                  Cómo se calcularon estos números
                  <Plus className="size-4 shrink-0 text-tinta-suave transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <div className="mt-2 space-y-2 leading-relaxed">
                  <p>
                    Web esencial ($1.080.000, precio de lanzamiento), portal con referencia de $6.400.000 (se cierra con el levantamiento) y 24
                    meses de mantención a $160.000 por web y portal. Total: entre {millones(Math.min(...totales))} y{" "}
                    {millones(Math.max(...totales))} según la modalidad.
                  </p>
                  <p>
                    Suscripción: instalación de $2.500.000 y $290.000 al mes por el portal, más $80.000 por la web. Plan mensual: 8 cuotas de
                    $850.000, con la mantención incluida mientras duran.
                  </p>
                  <p>Montos sin IVA, al {FECHA_PRECIOS}. Son estimaciones para comparar; cada acuerdo fija sus montos.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
