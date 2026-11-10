import { motion } from "motion/react";

/** Planned vs real cumulative progress ("curva S"), one point per week. */
export function CurvaS({ plan, real }: { plan: number[]; real: number[] }) {
  const W = 620;
  const H = 260;
  const L = 40;
  const R = 16;
  const T = 18;
  const B = 34;
  const n = plan.length - 1;
  const x = (i: number) => L + ((W - L - R) * i) / n;
  const y = (v: number) => T + (H - T - B) * (1 - v / 100);
  const path = (vs: number[]) => vs.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const hoy = real.length - 1;
  const diff = real[hoy] - plan[hoy];
  const area = `${path(real)} L${x(hoy)} ${y(0)} L${x(0)} ${y(0)} Z`;

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Curva de avance: real ${real[hoy]} %, planificado ${plan[hoy]} % a la semana ${hoy}.`}>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="stroke-linea/50" strokeDasharray={v ? "2 4" : undefined} />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" className="fill-tinta-suave text-[11px] tabular-nums">
              {v}
            </text>
          </g>
        ))}
        {plan.map((_, i) => (
          <text key={i} x={x(i)} y={H - 12} textAnchor="middle" className="fill-tinta-suave text-[10.5px] tabular-nums">
            {i === 0 ? "Inicio" : `S${i}`}
          </text>
        ))}
        <motion.path d={area} className="fill-cianotipo/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} />
        <motion.path
          d={path(plan)}
          className="fill-none stroke-tinta-suave/60"
          strokeWidth="2"
          strokeDasharray="5 5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={path(real)}
          className="fill-none stroke-cianotipo"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
        />
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <line x1={x(hoy)} x2={x(hoy)} y1={T} y2={y(0)} className="stroke-energia" strokeWidth="1.5" />
          <circle cx={x(hoy)} cy={y(real[hoy])} r="6" className="fill-energia stroke-grafito" strokeWidth="2" />
        </motion.g>
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.82rem] text-tinta-suave">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 bg-cianotipo" aria-hidden="true" /> Avance real
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0 w-5 border-t-2 border-dashed border-tinta-suave/60" aria-hidden="true" /> Planificado
        </span>
        <span className="font-semibold text-tinta">
          {real[hoy] >= 100 ? "Terminada" : diff >= 0 ? `${diff} puntos sobre el plan` : `${Math.abs(diff)} puntos bajo el plan`}
        </span>
      </figcaption>
    </figure>
  );
}
