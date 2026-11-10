import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Power, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Signature piece: the single-line diagram of an automatic transfer switch (tablero de transferencia automática).
 * The visitor cuts the grid; the generator starts, reaches stable voltage, the switch moves and the load comes back.
 * Times are illustrative (a reference sequence), and the panel says so.
 */

type Fase = "normal" | "corte" | "arranque" | "estable" | "respaldo" | "retorno";

const SECUENCIA: { at: number; fase: Fase; log: string }[] = [
  { at: 0, fase: "corte", log: "Corte de red detectado" },
  { at: 0.8, fase: "arranque", log: "Arranque del motor del grupo" },
  { at: 4.6, fase: "estable", log: "Tensión y frecuencia estables: 380 V, 50 Hz" },
  { at: 5.6, fase: "respaldo", log: "Transferencia a grupo: la carga vuelve a tener energía" },
];

const fmt = (s: number) => s.toFixed(1).replace(".", ",") + " s";

export function Transferencia() {
  const reduce = useReducedMotion();
  const [fase, setFase] = useState<Fase>("normal");
  const [t, setT] = useState(0);
  const [log, setLog] = useState<{ at: number; log: string }[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const raf = useRef(0);

  const limpiar = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(raf.current);
  };
  useEffect(() => limpiar, []);

  const cortar = () => {
    limpiar();
    setLog([]);
    setT(0);
    const t0 = performance.now();
    const fin = SECUENCIA[SECUENCIA.length - 1].at;
    const tick = () => {
      const s = (performance.now() - t0) / 1000;
      setT(Math.min(s, fin));
      if (s < fin) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    SECUENCIA.forEach((p) => {
      timers.current.push(
        setTimeout(() => {
          setFase(p.fase);
          setLog((l) => [...l, { at: p.at, log: p.log }]);
        }, p.at * 1000),
      );
    });
  };

  const volver = () => {
    limpiar();
    setFase("retorno");
    setLog((l) => [...l, { at: -1, log: "Vuelve la red: retransferencia y enfriamiento del grupo" }]);
    timers.current.push(
      setTimeout(() => {
        setFase("normal");
        setLog((l) => [...l, { at: -1, log: "Grupo detenido, en espera automática" }]);
      }, 2600),
    );
  };

  const redOn = fase === "normal" || fase === "retorno";
  const grupoGira = fase === "arranque" || fase === "estable" || fase === "respaldo" || fase === "retorno";
  const grupoOn = fase === "estable" || fase === "respaldo";
  const enGrupo = fase === "respaldo";
  const cargaOn = redOn || enGrupo;
  const corriendo = fase === "corte" || fase === "arranque" || fase === "estable";

  const estado = cargaOn
    ? enGrupo
      ? "La carga está respaldada por el grupo electrógeno."
      : "La carga se alimenta desde la red."
    : "Sin energía en la carga: el grupo está arrancando.";

  return (
    <section id="transferencia" className="plano relative overflow-hidden py-20 text-papel lg:py-28" aria-labelledby="tr-h">
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 id="tr-h" className="wdth-125 text-[clamp(1.9rem,1.2rem+2.6vw,3.2rem)] leading-[1.02] font-extrabold text-blanco text-balance">
            Cuando se corta la luz, el grupo entra solo.
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-papel/75">
            Un tablero de transferencia automática vigila la red. Si se corta, arranca el grupo electrógeno, espera a que la tensión se estabilice y
            cambia la carga al grupo. Cuando la red vuelve, la devuelve y deja el grupo listo para la próxima vez. Eso es lo que montamos, probamos y
            mantenemos.
          </p>
        </div>

        <figure className="relative -mx-2 self-center sm:mx-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <svg viewBox="0 0 640 380" className="w-full" role="img" aria-label={`Diagrama unifilar de una transferencia automática. ${estado}`}>
            <defs>
              <filter id="brillo" filterUnits="userSpaceOnUse" x="0" y="0" width="640" height="380">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ---- grid side ---- */}
            <g>
              <text x="36" y="44" className="fill-papel/60 text-[15px]">Red eléctrica</text>
              {/* transformer symbol */}
              <circle cx="64" cy="100" r="20" className="fill-none stroke-cianotipo-claro" strokeWidth="2.5" />
              <circle cx="64" cy="128" r="20" className="fill-none stroke-cianotipo-claro" strokeWidth="2.5" />
              <path d="M84 114 H300" className="stroke-linea-osc" strokeWidth="5" strokeLinecap="round" />
              <motion.path d="M84 114 H300" className="stroke-energia" strokeWidth="5" strokeLinecap="round" filter="url(#brillo)" animate={{ opacity: redOn ? 1 : 0 }} transition={{ duration: 0.25 }} />
              <motion.g animate={{ opacity: redOn ? 0 : 1 }} transition={{ duration: 0.2 }}>
                <path d="M180 100 l18 28 M198 100 l-18 28" className="stroke-falla" strokeWidth="4" strokeLinecap="round" />
              </motion.g>
              <text x="150" y="92" className="fill-papel/45 text-[14px]">{redOn ? "Red normal" : "Sin red"}</text>
            </g>

            {/* ---- generator side ---- */}
            <g>
              <text x="36" y="356" className="fill-papel/60 text-[15px]">Grupo electrógeno</text>
              <circle cx="64" cy="300" r="30" className="fill-grafito stroke-cianotipo-claro" strokeWidth="2.5" />
              <g
                className={grupoGira && !reduce ? "animate-spin" : undefined}
                style={{ transformBox: "view-box", transformOrigin: "64px 300px", animationDuration: fase === "arranque" ? "1.4s" : "0.6s" }}
              >
                <circle cx="64" cy="300" r="22" className="fill-none stroke-papel/25" strokeWidth="1.5" strokeDasharray="4 6" />
              </g>
              <path d="M47 300c4-11 13-11 17 0s13 11 17 0" className={cn("fill-none transition-colors duration-300", grupoOn ? "stroke-energia" : "stroke-papel/70")} strokeWidth="3" strokeLinecap="round" />
              <path d="M94 300 H220 V262 H300" className="fill-none stroke-linea-osc" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
              <motion.path
                d="M94 300 H220 V262 H300"
                className="fill-none stroke-energia"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#brillo)"
                initial={false}
                animate={{ pathLength: grupoOn ? 1 : 0, opacity: grupoOn ? 1 : 0 }}
                transition={{ duration: grupoOn ? 0.7 : 0.3 }}
              />
              <text x="112" y="290" className="fill-papel/45 text-[14px]">
                {fase === "arranque" ? "Arrancando" : grupoOn ? "380 V, 50 Hz" : fase === "retorno" ? "Enfriando" : "En espera"}
              </text>
            </g>

            {/* ---- transfer switch ---- */}
            <g>
              <rect x="300" y="70" width="128" height="236" rx="6" className="fill-grafito-2/80 stroke-cianotipo-claro/70" strokeWidth="2" />
              <text x="364" y="58" textAnchor="middle" className="fill-papel/60 text-[15px]">Tablero de transferencia</text>
              <circle cx="330" cy="114" r="6" className={cn("transition-colors", redOn ? "fill-energia" : "fill-linea-osc")} />
              <circle cx="330" cy="262" r="6" className={cn("transition-colors", grupoOn ? "fill-energia" : "fill-linea-osc")} />
              <text x="344" y="104" className="fill-papel/45 text-[13px]">Red</text>
              <text x="344" y="284" className="fill-papel/45 text-[13px]">Grupo</text>
              {/* the blade pivots at (400,188) */}
              <path d="M300 114 H330 M300 262 H330" className="stroke-linea-osc" strokeWidth="4" />
              {/* plain CSS transform on a <g>: an SVG rotation about a fixed point in the drawing */}
              <g
                style={{
                  transformBox: "view-box",
                  transformOrigin: "400px 188px",
                  transform: `rotate(${enGrupo ? -48 : 48}deg)`,
                  transition: reduce ? "none" : "transform 520ms cubic-bezier(0.34, 1.45, 0.64, 1)",
                }}
              >
                <line x1="400" y1="188" x2="298" y2="188" strokeWidth="6" strokeLinecap="round" className={cn("transition-colors duration-300", cargaOn ? "stroke-energia" : "stroke-papel/70")} />
              </g>
              <circle cx="400" cy="188" r="7" className="fill-blanco" />
            </g>

            {/* ---- load ---- */}
            <g>
              <path d="M407 188 H500" className="stroke-linea-osc" strokeWidth="5" strokeLinecap="round" />
              <motion.path d="M407 188 H500" className="stroke-energia" strokeWidth="5" strokeLinecap="round" filter="url(#brillo)" animate={{ opacity: cargaOn ? 1 : 0 }} transition={{ duration: 0.25 }} />
              <rect x="500" y="96" width="112" height="184" rx="3" className="fill-grafito-2 stroke-cianotipo-claro/70" strokeWidth="2" />
              {Array.from({ length: 12 }).map((_, i) => {
                const c = i % 3;
                const r = Math.floor(i / 3);
                return (
                  <motion.rect
                    key={i}
                    x={516 + c * 30}
                    y={114 + r * 38}
                    width="20"
                    height="24"
                    rx="2"
                    className="fill-energia"
                    initial={false}
                    animate={{ opacity: cargaOn ? (i % 5 === 3 ? 0.35 : 0.92) : 0.06 }}
                    transition={{ delay: cargaOn ? 0.05 * i : 0, duration: 0.2 }}
                  />
                );
              })}
              <text x="556" y="304" textAnchor="middle" className="fill-papel/60 text-[15px]">Su instalación</text>
            </g>
          </svg>
          <figcaption className="sr-only">{estado}</figcaption>
        </figure>

        <div className="lg:col-start-1 lg:row-start-2">
          <div className="flex flex-wrap items-center gap-3">
            {fase === "respaldo" ? (
              <button type="button" onClick={volver} className="btn btn-linea-claro">
                <RotateCcw className="size-4" aria-hidden="true" />
                Volver la red
              </button>
            ) : (
              <button type="button" onClick={cortar} disabled={corriendo || fase === "retorno"} className="btn btn-energia">
                <Power className="size-4" aria-hidden="true" />
                {corriendo ? "Simulando…" : "Simular un corte de energía"}
              </button>
            )}
            <p className="text-[0.82rem] text-papel/50">Ilustración: tiempos de referencia; cada instalación se ajusta.</p>
          </div>

          <div className="mt-8 rounded-md bg-blanco/[0.04] p-4 ring-1 ring-blanco/10">
            <div className="flex items-baseline justify-between gap-4">
              <p className="wdth-75 text-[0.82rem] font-medium text-papel/55">Tiempo desde el corte</p>
              <p className="wdth-112 text-[1.9rem] leading-none font-bold text-blanco tabular-nums" aria-hidden="true">
                {fmt(t)}
              </p>
            </div>
            <ol className="mt-3 min-h-[7.5rem] space-y-1.5 text-[0.9rem]" aria-live="polite">
              {log.length === 0 && <li className="text-papel/45">Todo normal: la red alimenta la carga.</li>}
              <AnimatePresence initial={false}>
                {log.map((l, i) => (
                  <motion.li
                    key={i + l.log}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 text-papel/85"
                  >
                    <span className="w-12 shrink-0 text-papel/45 tabular-nums">{l.at >= 0 ? fmt(l.at) : "luego"}</span>
                    <span>{l.log}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
