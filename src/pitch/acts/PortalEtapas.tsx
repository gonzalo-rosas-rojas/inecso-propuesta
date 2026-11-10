import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BarChart3, Building2, FileCheck, Globe, HardHat, Laptop, ShieldCheck, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVANTAMIENTO, MANT, PORTAL_REF } from "@/data/precios";
import { ETAPAS_PORTAL, PAGO_ETAPA, PORTAL_DIAS, PORTAL_TOTAL, SEGURIDAD, type EtapaPortal } from "@/data/portal";
import { Punto } from "../ui/Punto";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { clp, millones } from "../format";

type N = EtapaPortal["n"];

const ENTRA = [
  { Icon: Smartphone, t: "El técnico, en terreno", d: "La orden de trabajo: pauta, mediciones, fotos y firma." },
  { Icon: Laptop, t: "La oficina", d: "Clientes, equipos, obras y documentos." },
];

const SALE: { Icon: typeof Globe; t: string; d: string; n: N }[] = [
  { Icon: FileCheck, t: "El informe, al cliente y a la mandante", d: "Al cerrar la orden, sin armarlo a mano.", n: 1 },
  { Icon: Building2, t: "El avance, a la vista", d: "La empresa mandante y cada cliente, sin llamar.", n: 2 },
  { Icon: BarChart3, t: "El resumen de gestión, a la gerencia", d: "Cada mes, listo para presentar.", n: 3 },
  { Icon: Globe, t: "Las obras terminadas, en inecso.cl", d: "La vitrina se mantiene al día sola.", n: 3 },
];

/**
 * The portal in concrete terms, as asked for the meeting with the owner: the portal as the engine that feeds the website and
 * the internal work, then three stages with scope, weeks and price each, and the data security underneath all of them.
 */
export function PortalEtapas() {
  const [n, setN] = useState<N>(1);
  const etapa = ETAPAS_PORTAL.find((e) => e.n === n)!;

  return (
    <section id="etapas" aria-labelledby="h-etapas" className="bg-blanco px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-cianotipo">El portal: alcance y precio</p>
        <h2 id="h-etapas" className="mt-2 max-w-[24ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          El portal es el motor: los datos se ingresan una vez y alimentan todo lo demás.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[1.05rem] text-tinta-suave">
          La web es la vitrina; el portal, la herramienta de trabajo. Se construye en tres etapas, cada una funcionando por sí sola y con su
          propio precio, y la primera es la que más horas les devuelve.
        </p>

        {/* The engine: what goes in once, and what comes out by itself. Each output is tagged with the stage that turns it on. */}
        <div className="mt-10 grid items-stretch gap-4 rounded-2xl bg-papel p-5 sm:p-7 md:grid-cols-[1fr_auto_1.1fr_auto_1.4fr]">
          <div>
            <p className="wdth-87 text-[0.85rem] font-bold text-tinta-suave">Se ingresa una vez</p>
            <ul className="mt-3 space-y-3">
              {ENTRA.map((x) => (
                <li key={x.t} className="flex gap-3 rounded-xl bg-blanco p-3">
                  <x.Icon className="mt-0.5 size-5 shrink-0 text-cianotipo" aria-hidden="true" />
                  <span>
                    <b className="block wdth-87 leading-tight">{x.t}</b>
                    <span className="text-[0.88rem] leading-snug text-tinta-suave">{x.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ArrowRight className="mx-auto size-6 rotate-90 self-center text-energia-osc md:rotate-0" aria-hidden="true" />
          <div className="flex flex-col justify-center rounded-xl bg-grafito p-5 text-papel">
            <HardHat className="size-6 text-energia" aria-hidden="true" />
            <b className="mt-2 wdth-112 text-[1.2rem] leading-tight">El portal de INECSO</b>
            <span className="mt-1 text-[0.9rem] leading-snug text-papel/75">Una sola versión de cada dato, con acceso para cada uno.</span>
            <span className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-papel/10 px-2.5 py-1 text-[0.78rem] text-papel/80">
              <ShieldCheck className="size-3.5 text-energia" aria-hidden="true" />
              Datos cifrados y respaldados
            </span>
          </div>
          <ArrowRight className="mx-auto size-6 rotate-90 self-center text-energia-osc md:rotate-0" aria-hidden="true" />
          <div>
            <p className="wdth-87 text-[0.85rem] font-bold text-tinta-suave">Sale solo</p>
            <ul className="mt-3 space-y-2">
              {SALE.map((x) => {
                const on = x.n === n;
                return (
                  <li key={x.t} className={cn("flex gap-3 rounded-xl border p-3 transition-all", on ? "border-cianotipo bg-blanco" : "border-transparent bg-blanco/60 opacity-60")}>
                    <x.Icon className={cn("mt-0.5 size-5 shrink-0", on ? "text-cianotipo" : "text-tinta-suave")} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <b className="block wdth-87 leading-tight">{x.t}</b>
                      <span className="text-[0.88rem] leading-snug text-tinta-suave">{x.d}</span>
                    </span>
                    <span className={cn("self-start whitespace-nowrap rounded-full px-2 py-0.5 wdth-87 text-[0.72rem] font-bold", on ? "bg-energia text-grafito" : "bg-papel-2 text-tinta-suave")}>
                      Etapa {x.n}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <div>
            <p className="mb-3 wdth-87 font-bold" id="etapas-elegir">
              Las tres etapas
            </p>
            <div className="grid gap-2 sm:grid-cols-3" role="group" aria-labelledby="etapas-elegir">
              {ETAPAS_PORTAL.map((e) => {
                const on = e.n === n;
                return (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setN(e.n)}
                    className={cn(
                      "flex flex-col rounded-xl border p-4 text-left transition-all focus-visible:outline-3 focus-visible:outline-energia",
                      on ? "border-cianotipo bg-blanco shadow-[0_18px_40px_-26px_var(--color-cianotipo)]" : "border-linea bg-papel hover:bg-blanco",
                    )}
                  >
                    <span className={cn("wdth-87 text-[0.8rem] font-bold", on ? "text-cianotipo" : "text-tinta-suave")}>Etapa {e.n}</span>
                    <b className="mt-0.5 wdth-112 leading-tight">{e.nombre}</b>
                    <span className="mt-3 wdth-100 text-[1.35rem] font-extrabold leading-none tabular-nums">{clp(e.clp)}</span>
                    <span className="mt-1 wdth-87 text-[0.82rem] font-semibold text-tinta">{e.dias} días hábiles</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={etapa.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-4 rounded-xl border border-linea bg-papel p-5"
                aria-live="polite"
              >
                <p className="text-[0.95rem] text-tinta-suave">
                  <b className="wdth-87 text-tinta">Resuelve: </b>
                  {etapa.resuelve}
                </p>
                <ul className="mt-4 grid gap-x-6 gap-y-3 text-[0.94rem] md:grid-cols-2">
                  {etapa.incluye.map((x) => (
                    <Punto key={x.t} x={x} />
                  ))}
                </ul>
                <div className="mt-5 grid gap-3 border-t border-linea pt-4 text-[0.9rem] sm:grid-cols-2">
                  <p>
                    <b className="block wdth-87">Lo que necesito de ustedes</b>
                    <span className="text-tinta-suave">{etapa.conUstedes}</span>
                  </p>
                  <p>
                    <b className="block wdth-87">Cómo saben que funciona</b>
                    <span className="text-tinta-suave">{etapa.hito}</span>
                  </p>
                  <p>
                    <b className="block wdth-87">Cómo se paga</b>
                    <span className="text-tinta-suave">{PAGO_ETAPA}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 rounded-xl bg-papel p-5">
              <p className="wdth-87 font-bold">Antes de partir: el levantamiento, sin costo</p>
              <p className="mt-1 max-w-[75ch] text-[0.92rem] leading-relaxed text-tinta-suave">
                Mientras se construye la web, una o dos reuniones sobre cómo trabajan hoy. Termina en un diagrama del proceso y el precio cerrado
                de cada etapa (valor referencial <s>{clp(LEVANTAMIENTO.referencial)}</s>). Si no siguen con el portal, no les cuesta nada.
              </p>
            </div>
            <p className="mt-3 max-w-[75ch] text-[0.9rem] leading-relaxed text-tinta-suave">
              <b className="wdth-87 text-tinta">Recomendado, y lo deciden ustedes:</b> que un técnico pruebe la orden de trabajo en una mantención
              real antes de pasarla a todo el equipo.
            </p>
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-2xl bg-grafito text-papel shadow-[0_30px_60px_-30px_rgb(27_32_36/0.7)]">
              <div className="border-b border-linea-osc px-6 py-4">
                <p className="wdth-87 text-[0.85rem] text-linea">El portal completo</p>
                <p className="wdth-112 text-[1.15rem] font-bold">Las tres etapas</p>
              </div>
              <dl className="divide-y divide-linea-osc">
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Total, a precio cerrado</dt>
                  <dd className="wdth-100 text-[2.1rem] font-extrabold leading-none text-energia tabular-nums">
                    <AnimatedNumber value={PORTAL_TOTAL} format={clp} />
                  </dd>
                  <dd className="mt-1 text-[0.85rem] text-papel/70">
                    Estimación de hoy: el levantamiento la fija entre {millones(PORTAL_REF.min)} y {millones(PORTAL_REF.max)}, y desde ahí el
                    precio no cambia.
                  </dd>
                </div>
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Plazo</dt>
                  <dd className="wdth-100 text-[1.3rem] font-bold">{PORTAL_DIAS} días hábiles de construcción</dd>
                  <dd className="text-[0.82rem] text-papel/70">Con la web, unas tres semanas desde la firma; un mes con holgura. <a href="#plan" className="underline underline-offset-2 hover:text-energia">Ver el plan</a>.</dd>
                </div>
                <div className="px-6 py-4">
                  <dt className="wdth-87 text-[0.85rem] text-linea">Después de entregarlo</dt>
                  <dd className="wdth-100 text-[1.1rem] font-bold tabular-nums">{clp(MANT.todo)} al mes, web y portal</dd>
                  <dd className="text-[0.82rem] text-papel/70">
                    Plan Crecimiento:{" "}
                    <a href="#postventa" className="underline underline-offset-2 hover:text-energia">
                      ver planes
                    </a>
                    .
                  </dd>
                </div>
              </dl>
              <p className="border-t border-linea-osc px-6 py-3 text-[0.78rem] text-papel/60">
                Montos sin IVA. También se puede tomar en suscripción o con plan mensual:{" "}
                <a href="#modalidades" className="underline underline-offset-2 hover:text-energia">
                  cómo se contrata
                </a>
                .
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-10 rounded-2xl border border-linea p-6 sm:p-8">
          <p className="flex items-center gap-2 wdth-87 font-bold">
            <ShieldCheck className="size-5 text-cianotipo" aria-hidden="true" />
            La seguridad de sus datos, en las tres etapas
          </p>
          <ul className="mt-4 grid gap-x-8 gap-y-4 text-[0.94rem] md:grid-cols-2 lg:grid-cols-3">
            {SEGURIDAD.map((x) => (
              <Punto key={x.t} x={{ t: x.t, tec: x.tec }} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
