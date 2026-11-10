import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Gauge, Images, Layers, MousePointerClick, Search, Smartphone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion, useViewport } from "../hooks";
import { DemoFrame, type DemoFrameHandle } from "../ui/DemoFrame";
import { DemoOverlay } from "../ui/DemoOverlay";

type Capitulo = { hash: string; titulo: string; texto: string; desde: number; hasta: number; Icon: typeof Zap };

// What the visitor of the new site sees, in the order a client would. `desde`/`hasta` = how far the demo page scrolls.
const CAPITULOS: Capitulo[] = [
  { hash: "#/inicio", titulo: "Quién es INECSO, en cinco segundos", texto: "Una foto real de obra, su especialidad y un botón para cotizar.", desde: 0, hasta: 0.12, Icon: Zap },
  { hash: "#/inicio", titulo: "Lo que hacen, explicado con lo que hacen", texto: "Un corte simulado: cae la red, parte el grupo y se transfiere la carga.", desde: 0.12, hasta: 0.55, Icon: MousePointerClick },
  { hash: "#/inicio", titulo: "Servicios y clientes", texto: "Claros para un administrador, completos para un ingeniero, y con quiénes han trabajado.", desde: 0.55, hasta: 1, Icon: Layers },
  { hash: "#/obras", titulo: "Obras con foto, tipo y año", texto: "Lo que más convence a un cliente nuevo.", desde: 0, hasta: 0.6, Icon: Images },
  { hash: "#/contacto", titulo: "Una cotización que llega completa", texto: "Una calculadora orienta el tamaño del grupo; el formulario pide lo justo.", desde: 0, hasta: 0.7, Icon: Gauge },
];

const EXTRAS = [
  { Icon: Smartphone, t: "Rápida en el celular", d: "Muchas visitas llegan desde una faena." },
  { Icon: Search, t: "Encontrable en Google", d: "Para «mantención de grupos electrógenos» o «empresa eléctrica en La Florida»." },
  { Icon: Layers, t: "Ustedes no tocan nada", d: "Me mandan los cambios por WhatsApp o correo y yo los hago." },
];

/** Act 3: the new site itself, on a laptop that plays the demo as you scroll. */
export function WebNueva() {
  const ref = useRef<HTMLElement>(null);
  const demo = useRef<DemoFrameHandle>(null);
  const rm = usePrefersReducedMotion();
  const { w, h } = useViewport();
  const pinned = !rm && w >= 1000 && h >= 640;
  const [cap, setCap] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rot = useTransform(scrollYProgress, [0, 0.1], [24, 0]);
  const sc = useTransform(scrollYProgress, [0, 0.1], [0.86, 1]);
  const extrasOp = useTransform(scrollYProgress, [0.08, 0.14], [0, 1]);
  const extrasY = useTransform(scrollYProgress, [0.08, 0.14], [-14, 0]);

  // scroll drives the chapter and, inside it, how far down the demo page we are
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!pinned) return;
    const q = Math.min(0.9999, Math.max(0, (p - 0.08) / 0.88)) * CAPITULOS.length;
    const i = Math.floor(q);
    const c = CAPITULOS[i];
    if (i !== cap) setCap(i);
    demo.current?.go(c.hash);
    demo.current?.scrollTo(c.desde + (c.hasta - c.desde) * (q - i));
  });

  // without pinning (phones, reduced motion) the chapters are buttons
  useEffect(() => {
    if (pinned) return;
    const c = CAPITULOS[cap];
    demo.current?.go(c.hash);
    const t = setTimeout(() => demo.current?.scrollTo(c.desde), 120);
    return () => clearTimeout(t);
  }, [cap, pinned]);

  const actual = CAPITULOS[cap];

  return (
    <section id="web" ref={ref} aria-labelledby="h-web" className={cn("relative bg-papel-2", pinned && "h-[560vh]")}>
      <div className={cn("px-5 py-20 sm:px-10 min-[1100px]:px-12", pinned && "sticky top-0 flex h-[100svh] flex-col justify-center py-5")}>
        {pinned && (
          <motion.ul style={{ opacity: extrasOp, y: extrasY }} className="mx-auto mb-5 grid w-full max-w-[1380px] grid-cols-3 gap-x-8 border-b border-linea pb-4">
            {EXTRAS.map((x) => (
              <li key={x.t} className="flex gap-3">
                <x.Icon className="mt-0.5 size-5 shrink-0 text-cianotipo" aria-hidden="true" />
                <p className="leading-snug">
                  <b className="block wdth-87 text-[0.95rem]">{x.t}</b>
                  <span className="text-[0.85rem] text-tinta-suave">{x.d}</span>
                </p>
              </li>
            ))}
          </motion.ul>
        )}
        <div className="mx-auto grid w-full max-w-[1380px] items-center gap-10 lg:grid-cols-[minmax(280px,0.72fr)_1.6fr]">
          <div>
            <p className="wdth-87 font-semibold text-cianotipo">Proyecto, primer hito</p>
            <h2 id="h-web" className="mt-2 wdth-125 text-[clamp(1.9rem,1.2rem+2vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
              Así se vería. Y funciona.
            </h2>
            <p className="mt-3 max-w-[48ch] text-tinta-suave">
              Con sus textos y diez fotos de sus webs anteriores. Las descripciones de obras son de ejemplo.
            </p>
            <ol className="mt-6 space-y-1" aria-label="Lo que muestra la demo">
              {CAPITULOS.map((c, i) => {
                const on = i === cap;
                return (
                  <li key={c.titulo}>
                    <button
                      type="button"
                      onClick={() => {
                        if (pinned && ref.current) {
                          const top = ref.current.offsetTop + (ref.current.offsetHeight - window.innerHeight) * (0.08 + (0.88 * (i + 0.15)) / CAPITULOS.length);
                          window.scrollTo({ top, behavior: "smooth" });
                        } else setCap(i);
                      }}
                      aria-current={on ? "step" : undefined}
                      className={cn(
                        "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        on ? "bg-blanco shadow-[0_1px_0_var(--color-linea)]" : "hover:bg-blanco/60",
                      )}
                    >
                      <c.Icon className={cn("mt-0.5 size-5 shrink-0 transition-colors", on ? "text-cianotipo" : "text-tinta-suave")} aria-hidden="true" />
                      <span>
                        <span className={cn("block wdth-87 font-bold leading-snug", !on && "text-tinta-suave")}>{c.titulo}</span>
                        <motion.span
                          initial={false}
                          animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                          className="block overflow-hidden text-[0.93rem] leading-snug text-tinta-suave"
                        >
                          <span className="block pt-1">{c.texto}</span>
                        </motion.span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              onClick={() => setOverlay(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-energia px-5 py-3 wdth-87 font-bold text-grafito shadow-[0_8px_24px_-10px_var(--color-energia-osc)] transition-transform hover:-translate-y-0.5"
            >
              <MousePointerClick className="size-5" aria-hidden="true" />
              Recórranla ustedes
            </button>
          </div>

          <div>
            {pinned ? (
              <motion.div style={{ rotateX: rot, scale: sc, transformPerspective: 1600, maxWidth: "calc((100svh - 250px) * 1.6)" }} className="mx-auto origin-bottom">
                <div className="rounded-[18px] border border-linea bg-grafito p-2.5 pb-3 shadow-[0_50px_90px_-40px_rgb(27_32_36/0.55)]">
                  <div className="mb-2 flex items-center gap-2 px-2" aria-hidden="true">
                    <i className="size-2.5 rounded-full bg-linea-osc" />
                    <i className="size-2.5 rounded-full bg-linea-osc" />
                    <i className="size-2.5 rounded-full bg-linea-osc" />
                    <span className="ml-3 flex-1 rounded bg-grafito-3 px-3 py-0.5 wdth-87 text-[0.75rem] text-linea">
                      inecso.cl{actual.hash === "#/inicio" ? "" : actual.hash.replace("#", "")}
                    </span>
                  </div>
                  <DemoFrame ref={demo} layoutWidth={1280} hash="#/inicio" title="Demo de la nueva web de INECSO" className="aspect-[16/10] rounded-[10px]" />
                </div>
              </motion.div>
            ) : (
              <div className="mx-auto w-full max-w-[360px] rounded-[38px] border border-linea bg-grafito p-2.5 shadow-[0_40px_80px_-40px_rgb(27_32_36/0.6)]">
                <DemoFrame ref={demo} layoutWidth={390} interactive hash="#/inicio" title="Demo de la nueva web de INECSO en un celular" className="aspect-[390/780] rounded-[30px]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {!pinned && (
      <div className="bg-papel-2 px-5 pb-24 sm:px-10 min-[1100px]:px-12">
        <ul className="mx-auto grid max-w-[1380px] gap-x-10 gap-y-6 border-t border-linea pt-10 md:grid-cols-3">
          {EXTRAS.map((x) => (
            <li key={x.t} className="flex gap-4">
              <x.Icon className="mt-1 size-6 shrink-0 text-cianotipo" aria-hidden="true" />
              <p>
                <b className="block wdth-87">{x.t}</b>
                <span className="text-[0.95rem] text-tinta-suave">{x.d}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
      )}
      <DemoOverlay open={overlay} hash={actual.hash} onClose={() => setOverlay(false)} />
    </section>
  );
}
