import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMPRESA, IMG } from "@/data/inecso";

type Estado = "normal" | "corte" | "respaldo";

/**
 * Version B hero: the future state first. The headline says what the client keeps (their operation running), and a
 * small status board plays one power cut with backup: the grid goes down, the generator takes over, the operation
 * never goes dark. It plays once on load (and on demand); with reduced motion it simply shows the final state.
 */
function Tablero() {
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<Estado>(reduce ? "respaldo" : "normal");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const jugar = () => {
    timers.current.forEach(clearTimeout);
    setEstado("normal");
    timers.current = [setTimeout(() => setEstado("corte"), 900), setTimeout(() => setEstado("respaldo"), 2300)];
  };
  useEffect(() => {
    if (!reduce) jugar();
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filas = [
    {
      t: "Red eléctrica",
      v: estado === "normal" ? "Con energía" : "Corte",
      c: estado === "normal" ? "bg-tierra" : "bg-falla",
    },
    {
      t: "Grupo electrógeno",
      v: estado === "respaldo" ? "En servicio" : estado === "corte" ? "Arrancando" : "En espera",
      c: estado === "respaldo" ? "bg-tierra" : estado === "corte" ? "bg-energia" : "bg-linea",
    },
    { t: "Su operación", v: "Encendida", c: "bg-energia" },
  ];

  return (
    <div className="w-full max-w-[22rem] rounded-[4px] bg-grafito/80 p-4 text-blanco ring-1 ring-blanco/15 backdrop-blur-md lg:mb-1">
      <div className="flex items-baseline justify-between gap-3">
        <p className="wdth-87 text-[0.8rem] font-semibold text-blanco/70">Un corte, con respaldo automático</p>
        <button type="button" onClick={jugar} className="wdth-87 text-[0.78rem] font-semibold text-energia underline-offset-4 hover:underline">
          Repetir
        </button>
      </div>
      <ul className="mt-3 divide-y divide-blanco/10" aria-live="polite">
        {filas.map((f) => (
          <li key={f.t} className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-[0.92rem]">{f.t}</span>
            <span className="inline-flex items-center gap-2 wdth-87 text-[0.88rem] font-bold">
              <span className="relative flex size-2.5">
                {f.t === "Su operación" && !reduce && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-energia opacity-60" aria-hidden="true" />
                )}
                <span className={cn("relative inline-flex size-2.5 rounded-full transition-colors duration-500", f.c)} aria-hidden="true" />
              </span>
              <motion.span key={f.v} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                {f.v}
              </motion.span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[0.72rem] leading-snug text-blanco/55">Ilustración de un tablero de transferencia automática.</p>
    </div>
  );
}

export function HeroB() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative -mt-16 overflow-hidden bg-grafito text-blanco lg:-mt-[76px]" aria-labelledby="herob-h">
      <motion.img src={IMG.portada} alt="" className="absolute inset-0 size-full object-cover object-[60%_50%]" style={{ scale, y }} fetchPriority="high" />
      <div className="absolute inset-0 bg-grafito/60 md:bg-[linear-gradient(90deg,rgb(27_32_36/0.94)_0%,rgb(27_32_36/0.76)_45%,rgb(27_32_36/0.2)_80%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-grafito/85 to-transparent" />

      <motion.div
        style={{ y: copyY, opacity: fade }}
        className="relative mx-auto grid min-h-[min(92svh,820px)] max-w-7xl items-end gap-10 px-4 pt-32 pb-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:pb-20"
      >
        <div className="max-w-[48rem]">
          <motion.h1
            id="herob-h"
            className="wdth-125 text-[clamp(2.2rem,1.1rem+4.2vw,4.4rem)] leading-[0.97] font-extrabold tracking-[-0.012em] text-balance"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          >
            Su operación sigue encendida aunque se corte la red.
          </motion.h1>
          <motion.p
            className="mt-6 max-w-[38rem] text-[1.06rem] leading-relaxed text-blanco/85 sm:text-[1.15rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Proyectamos, montamos y mantenemos grupos electrógenos con transferencia automática, para que un corte de luz sea un registro en la
            bitácora y no una pérdida. {EMPRESA.sec}, en {EMPRESA.comuna}.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <a href="#/contacto" className="btn btn-energia px-6 py-3.5 text-[1rem]">
              Pedir cotización
            </a>
            <a
              href="#costo-corte"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("costo-corte")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-linea-claro px-6 py-3.5 text-[1rem]"
            >
              ¿Cuánto le cuesta un corte?
            </a>
            <a href={EMPRESA.telefonoHref} className="ml-1 inline-flex items-center gap-2 text-[0.95rem] text-blanco/80 tabular-nums hover:text-blanco">
              <Phone className="size-4" aria-hidden="true" />
              {EMPRESA.telefono}
            </a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
          <Tablero />
        </motion.div>
      </motion.div>
    </section>
  );
}
