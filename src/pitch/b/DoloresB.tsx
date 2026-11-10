import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { FileStack, PhoneCall, SearchX, ClipboardX, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion, useViewport } from "../hooks";

type Dolor = { Icon: typeof SearchX; t: string; d: string; prueba: string; verificado: boolean };

export const DOLORES: Dolor[] = [
  {
    Icon: SearchX,
    t: "Quien los revisa, no encuentra una vitrina.",
    d: "inecso.cl está vacía, inecsoingenieria.cl no existe desde noviembre de 2025 y Google muestra datos antiguos.",
    prueba: "Medido el 6 de noviembre de 2026",
    verificado: true,
  },
  {
    Icon: ClipboardX,
    t: "Cada informe se arma a mano.",
    d: "Después de cada visita hay que juntar fotos y mediciones, y redactar.",
    prueba: "Habitual en el rubro",
    verificado: false,
  },
  {
    Icon: PhoneCall,
    t: "La empresa mandante y los clientes llaman para saber cómo va.",
    d: "Cada llamada interrumpe a alguien que debe averiguar y responder.",
    prueba: "Habitual en el rubro",
    verificado: false,
  },
  {
    Icon: UserRound,
    t: "Cada técnico registra a su manera.",
    d: "Dos mantenciones iguales quedan escritas distinto; auditar o responder un reclamo cuesta.",
    prueba: "Habitual en el rubro",
    verificado: false,
  },
  {
    Icon: FileStack,
    t: "Las mantenciones viven en planillas y correos.",
    d: "Qué equipo toca o cuál se pasó de horas depende de quién lo sepa.",
    prueba: "Habitual en el rubro",
    verificado: false,
  },
];

/** Version B, act 2: the obstacles between INECSO and that future, one at a time as you scroll. */
export function DoloresB() {
  const ref = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const { w, h } = useViewport();
  const pinned = !rm && w >= 1000 && h >= 680;
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!pinned) return;
    const n = Math.min(DOLORES.length - 1, Math.floor(p * DOLORES.length * 1.05));
    setI((c) => (c === n ? c : n));
  });

  return (
    <section id="dolores" ref={ref} aria-labelledby="h-dol" className={cn("relative bg-grafito text-papel", pinned && "h-[300vh]")}>
      <div className={cn("grilla-osc px-5 py-20 sm:px-10 min-[1100px]:px-16", pinned && "sticky top-0 flex h-[100svh] items-center py-0")}>
        <div className="mx-auto grid w-full max-w-[1180px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="wdth-87 font-semibold text-energia">Lo que hoy lo impide</p>
            <h2 id="h-dol" className="mt-2 max-w-[14ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
              Cinco cosas se interponen.
            </h2>
            <p className="mt-4 max-w-[44ch] text-papel/70">
              La primera la medí yo. Las otras cuatro son habituales en el rubro y se confirman con ustedes.
            </p>
            {pinned && (
              <p className="mt-8 wdth-125 text-[4rem] font-extrabold leading-none tabular-nums text-energia" aria-hidden="true">
                {i + 1}
                <span className="text-[1.6rem] text-papel/40"> / {DOLORES.length}</span>
              </p>
            )}
          </div>
          <ol className="space-y-3">
            {DOLORES.map((x, k) => {
              const on = !pinned || k === i;
              const visto = !pinned || k <= i;
              return (
                <motion.li
                  key={x.t}
                  initial={false}
                  animate={{ opacity: on ? 1 : visto ? 0.45 : 0.22, x: on && pinned ? 8 : 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className={cn("flex gap-4 rounded-xl px-4 py-4 transition-colors", on && pinned ? "bg-grafito-2" : "")}
                >
                  <x.Icon className={cn("mt-0.5 size-6 shrink-0", x.verificado ? "text-falla" : "text-energia")} aria-hidden="true" />
                  <div>
                    <h3 className="wdth-100 text-[1.12rem] font-bold leading-snug">{x.t}</h3>
                    <motion.p initial={false} animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }} className="overflow-hidden">
                      <span className="block pt-1 leading-relaxed text-papel/75">{x.d}</span>
                      <span className={cn("mt-2 inline-block rounded-full px-2.5 py-0.5 wdth-87 text-[0.74rem] font-semibold", x.verificado ? "bg-falla/20 text-[#f0a493]" : "bg-papel/10 text-papel/70")}>
                        {x.prueba}
                      </span>
                    </motion.p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
