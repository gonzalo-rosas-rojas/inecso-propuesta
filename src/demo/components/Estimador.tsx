import { useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useSpring } from "motion/react";
import { Minus, Plus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { go } from "../router";
import { useStore } from "../store";

/**
 * "¿Qué grupo electrógeno necesito?": an orientative sizing. Continuous load with power factor 0.8 and 25 % reserve,
 * or the load plus twice the largest motor (starting current), whichever is larger, rounded up to a common size.
 */

interface Carga {
  id: string;
  t: string;
  u: string;
  kw: number;
  motor: boolean;
  q: number;
}

const INICIAL: Carga[] = [
  { id: "luz", t: "Iluminación LED", u: "por cada 100 m²", kw: 1, motor: false, q: 4 },
  { id: "pc", t: "Computadores y servidores", u: "por equipo", kw: 0.3, motor: false, q: 10 },
  { id: "frio", t: "Refrigeración", u: "cámara o vitrina", kw: 3, motor: true, q: 1 },
  { id: "bomba", t: "Bomba de agua de 3 HP", u: "por bomba", kw: 2.2, motor: true, q: 1 },
  { id: "clima", t: "Climatización", u: "equipo de 24.000 BTU", kw: 2.4, motor: true, q: 2 },
  { id: "ascensor", t: "Ascensor", u: "por ascensor", kw: 11, motor: true, q: 0 },
  { id: "cocina", t: "Cocina u horno eléctrico", u: "por equipo", kw: 6, motor: false, q: 0 },
];

const TAMANOS = [20, 30, 45, 60, 80, 100, 125, 150, 200, 250, 300, 400, 500, 625, 800, 1000, 1250, 1500];
const FP = 0.8;

const n1 = (x: number) => x.toLocaleString("es-CL", { maximumFractionDigits: 1 });

export function calcular(cargas: Carga[]) {
  const kw = cargas.reduce((s, c) => s + c.kw * c.q, 0);
  const motorMayor = cargas.filter((c) => c.motor && c.q > 0).reduce((m, c) => Math.max(m, c.kw), 0);
  const kvaCarga = kw / FP;
  const kvaReserva = kvaCarga * 1.25;
  const kvaArranque = (kw + 2 * motorMayor) / FP;
  const requerido = Math.max(kvaReserva, kvaArranque);
  const sugerido = TAMANOS.find((s) => s >= requerido) ?? null;
  const uso = sugerido ? kvaCarga / sugerido : 1;
  return { kw, motorMayor, kvaCarga, kvaReserva, kvaArranque, requerido, sugerido, uso };
}

function Animado({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const mv = useMotionValue(value);
  const [txt, setTxt] = useState(value.toFixed(decimals));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [value, mv]);
  useMotionValueEvent(mv, "change", (v) => setTxt(v.toLocaleString("es-CL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })));
  return <span className={className}>{txt}</span>;
}

function Gauge({ uso }: { uso: number }) {
  const v = Math.min(1.1, Math.max(0, uso));
  const rot = useSpring(-90 + v * 180, { stiffness: 140, damping: 18 });
  useEffect(() => rot.set(-90 + Math.min(1, v) * 180), [v, rot]);
  const arc = (a0: number, a1: number) => {
    const r = 86;
    const p = (a: number) => {
      const t = Math.PI * (1 - a);
      return [100 + r * Math.cos(t), 100 - r * Math.sin(t)];
    };
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <svg viewBox="0 0 200 118" className="w-full max-w-[17rem]" aria-hidden="true">
      <path d={arc(0, 1)} className="fill-none stroke-linea/50" strokeWidth="14" />
      <path d={arc(0, 0.8)} className="fill-none stroke-tierra" strokeWidth="14" />
      <path d={arc(0.8, 0.92)} className="fill-none stroke-energia" strokeWidth="14" />
      <path d={arc(0.92, 1)} className="fill-none stroke-falla" strokeWidth="14" />
      {Array.from({ length: 11 }).map((_, i) => {
        const t = Math.PI * (1 - i / 10);
        return (
          <line
            key={i}
            x1={100 + 70 * Math.cos(t)}
            y1={100 - 70 * Math.sin(t)}
            x2={100 + 64 * Math.cos(t)}
            y2={100 - 64 * Math.sin(t)}
            className="stroke-tinta/40"
            strokeWidth={i % 5 === 0 ? 2 : 1}
          />
        );
      })}
      <text x="22" y="116" className="fill-tinta-suave text-[10px]">0 %</text>
      <text x="164" y="116" className="fill-tinta-suave text-[10px]">100 %</text>
      <motion.g style={{ rotate: rot, transformBox: "view-box", transformOrigin: "100px 100px" }}>
        <path d="M97 100 L100 30 L103 100 Z" className="fill-grafito" />
      </motion.g>
      <circle cx="100" cy="100" r="7" className="fill-grafito" />
      <circle cx="100" cy="100" r="2.5" className="fill-energia" />
    </svg>
  );
}

export function Estimador({ compacto = false }: { compacto?: boolean }) {
  const [cargas, setCargas] = useState(INICIAL);
  const r = useMemo(() => calcular(cargas), [cargas]);
  const { setBorrador } = useStore();

  const setQ = (id: string, q: number) => setCargas((cs) => cs.map((c) => (c.id === id ? { ...c, q: Math.max(0, Math.min(99, q)) } : c)));

  const cotizar = () => {
    const lista = cargas
      .filter((c) => c.q > 0)
      .map((c) => `${c.q} × ${c.t} (${c.u})`)
      .join("; ");
    setBorrador({
      tipo: "grupo",
      kva: r.sugerido ?? undefined,
      mensaje: `Necesito un grupo electrógeno de respaldo. Estimación de la web: ${r.sugerido ? r.sugerido + " kVA" : "sobre 1.500 kVA"} para unos ${n1(r.kw)} kW de carga. Cargas: ${lista}.`,
    });
    go("#/contacto");
  };

  return (
    <section className={cn("bg-papel-2", compacto ? "py-16" : "py-20 lg:py-28")} aria-labelledby="es-h">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h2 id="es-h" className="wdth-125 text-[clamp(1.8rem,1.2rem+2.4vw,3rem)] leading-[1.02] font-extrabold text-balance">
            ¿Qué grupo electrógeno necesito?
          </h2>
          <p className="mt-3 text-tinta-suave">Marque lo que tiene que seguir funcionando durante un corte. La cuenta es orientativa: INECSO la confirma en la visita técnica.</p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <ul className="divide-y divide-linea/60 overflow-hidden rounded-md bg-blanco ring-1 ring-linea/70">
            {cargas.map((c) => (
              <li key={c.id} className={cn("flex items-center gap-3 px-4 py-3 transition-colors sm:px-5", c.q > 0 ? "bg-blanco" : "bg-blanco/60")}>
                <div className="min-w-0 flex-1">
                  <p className={cn("font-semibold", c.q === 0 && "text-tinta-suave")}>{c.t}</p>
                  <p className="text-[0.82rem] text-tinta-suave">
                    {c.u}, {n1(c.kw)} kW{c.motor ? ", con motor" : ""}
                  </p>
                </div>
                <div className="flex items-center rounded-[3px] ring-1 ring-linea">
                  <button type="button" className="grid size-9 place-items-center text-tinta-suave hover:bg-papel hover:text-tinta disabled:opacity-30" onClick={() => setQ(c.id, c.q - 1)} disabled={c.q === 0} aria-label={`Quitar uno: ${c.t}`}>
                    <Minus className="size-4" />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={99}
                    value={c.q}
                    onChange={(e) => setQ(c.id, Number(e.target.value) || 0)}
                    className="w-11 [appearance:textfield] border-x border-linea bg-transparent py-1.5 text-center font-semibold tabular-nums outline-none focus:bg-energia/15 [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label={`Cantidad: ${c.t}`}
                  />
                  <button type="button" className="grid size-9 place-items-center text-tinta-suave hover:bg-papel hover:text-tinta" onClick={() => setQ(c.id, c.q + 1)} aria-label={`Agregar uno: ${c.t}`}>
                    <Plus className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col rounded-md bg-grafito p-6 text-papel sm:p-7 lg:sticky lg:top-24 lg:self-start">
            <p className="wdth-75 text-[0.85rem] font-medium text-papel/60">Grupo sugerido</p>
            <p className="wdth-125 mt-1 flex items-baseline gap-2 text-blanco" aria-live="polite">
              {r.sugerido ? (
                <>
                  <Animado value={r.sugerido} className="text-[3.6rem] leading-none font-extrabold tabular-nums" />
                  <span className="text-[1.4rem] font-bold">kVA</span>
                </>
              ) : (
                <span className="text-[1.6rem] font-extrabold">Sobre 1.500 kVA: proyecto a medida</span>
              )}
            </p>
            <div className="mt-6 flex flex-col items-center rounded-md bg-papel px-4 pt-4 pb-3 text-tinta">
              <Gauge uso={r.uso} />
              <p className="mt-1 text-[0.85rem] text-tinta-suave">
                Uso del grupo con toda la carga: <b className="text-tinta tabular-nums">{Math.round(r.uso * 100)} %</b>
              </p>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[0.88rem]">
              <div>
                <dt className="text-papel/55">Carga total</dt>
                <dd className="font-semibold tabular-nums"><Animado value={r.kw} decimals={1} /> kW</dd>
              </div>
              <div>
                <dt className="text-papel/55">Motor mayor</dt>
                <dd className="font-semibold tabular-nums">{r.motorMayor ? n1(r.motorMayor) + " kW" : "Ninguno"}</dd>
              </div>
              <div>
                <dt className="text-papel/55">Con 25 % de reserva</dt>
                <dd className="font-semibold tabular-nums">{n1(r.kvaReserva)} kVA</dd>
              </div>
              <div>
                <dt className="text-papel/55">Con el arranque del motor</dt>
                <dd className="font-semibold tabular-nums">{n1(r.kvaArranque)} kVA</dd>
              </div>
            </dl>
            <button type="button" onClick={cotizar} disabled={r.kw === 0} className="btn btn-energia mt-6 w-full py-3.5">
              {r.sugerido ? `Cotizar un grupo de ${r.sugerido} kVA` : "Cotizar un proyecto a medida"}
            </button>
            <p className="mt-3 flex gap-2 text-[0.78rem] leading-snug text-papel/50">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Factor de potencia 0,8. La potencia real depende de los equipos, los arranques simultáneos y la altura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
