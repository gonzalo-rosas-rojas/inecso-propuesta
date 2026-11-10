import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AREAS, IMG, type AreaId } from "@/data/inecso";
import { PageHead } from "../components/PageHead";
import { Estimador } from "../components/Estimador";
import { CtaBanda } from "../components/CtaBanda";

const FOTO: Record<AreaId, { src: string; pie: string }> = {
  gen: { src: IMG.grupoJaula, pie: "Grupo electrógeno montado en un recinto enrejado." },
  ing: { src: IMG.hipot, pie: "Medición de aislación con equipo HIPOT antes de energizar." },
  civil: { src: IMG.terraza, pie: "Grupo en terraza, sobre estructura calculada y con cobertizo." },
};

export function Servicios() {
  const [area, setArea] = useState<AreaId>("gen");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const a = AREAS.find((x) => x.id === area)!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + AREAS.length) % AREAS.length;
    setArea(AREAS[n].id);
    tabs.current[n]?.focus();
  };

  return (
    <>
      <PageHead titulo="Servicios" img={IMG.desarmeMotor}>
        Consultoría, proyecto, ejecución y mantención. Trabajamos con planos y normas, y entregamos cada instalación probada y certificada.
      </PageHead>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div role="tablist" aria-label="Áreas de servicio" className="sin-barra -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 rounded-md bg-papel-2 p-1">
            {AREAS.map((x, i) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={area === x.id}
                aria-controls={`panel-${x.id}`}
                tabIndex={area === x.id ? 0 : -1}
                onClick={() => setArea(x.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn("relative rounded-[4px] px-4 py-2.5 text-[0.95rem] font-semibold whitespace-nowrap transition-colors", area === x.id ? "text-blanco" : "text-tinta-suave hover:text-tinta")}
              >
                {area === x.id && <motion.span layoutId="tab-area" className="absolute inset-0 rounded-[4px] bg-cianotipo" transition={{ type: "spring", stiffness: 480, damping: 38 }} />}
                <span className="relative">
                  {x.titulo} <span className="tabular-nums opacity-70">{x.servicios.length}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={area}
            role="tabpanel"
            id={`panel-${area}`}
            aria-labelledby={`tab-${area}`}
            className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            <figure className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-md bg-grafito">
                <motion.img src={FOTO[area].src} alt={FOTO[area].pie} className="aspect-[4/3] w-full object-cover" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }} />
              </div>
              <figcaption className="mt-3 text-[0.85rem] text-tinta-suave">{FOTO[area].pie} Foto de INECSO.</figcaption>
              <p className="mt-6 text-[1.08rem] leading-relaxed">{a.resumen}</p>
            </figure>
            <ol className="grid gap-px overflow-hidden rounded-md bg-linea/60 ring-1 ring-linea/60 sm:grid-cols-2">
              {a.servicios.map((s, i) => (
                <motion.li
                  key={s.t}
                  className="group bg-blanco p-5 transition-colors hover:bg-papel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.35 }}
                >
                  <span className="mb-3 block h-0.5 w-6 bg-linea transition-[width,background-color] duration-300 group-hover:w-10 group-hover:bg-energia" aria-hidden="true" />
                  <h2 className="text-[1.05rem] leading-snug font-bold">{s.t}</h2>
                  <p className="mt-1.5 text-[0.92rem] leading-relaxed text-tinta-suave">{s.d}</p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
        <p className="mt-6 text-[0.82rem] text-tinta-suave">Textos de la última web de INECSO (2017–2025). La planta externa de cobre y fibra que aparecía en la web de 2012 se incluye si sigue vigente.</p>
      </section>

      <Estimador compacto />
      <CtaBanda />
    </>
  );
}
