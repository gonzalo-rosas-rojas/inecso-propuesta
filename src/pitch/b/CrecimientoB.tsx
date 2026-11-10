import { useId, useState } from "react";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { AnimatedNumber } from "../ui/AnimatedNumber";

// Hypotheses to measure, not promises. INECSO's focus is maintenance, standard processes and time, so this act measures
// the time the portal gives back. Reports drop more than follow-up because they are generated from the work order (still
// reviewed by hand); follow-up and document hunting drop less. Both ranges start low on purpose.
export const SUPUESTOS = {
  informes: [0.3, 0.5] as const, // share of report-writing time saved by reports generated from the standard work order
  seguimiento: [0.1, 0.2] as const, // share of status calls and document hunting saved by the shared view
};

const nf = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });
const SEMANAS_MES = 4.33;
const JORNADA = 8;

function Campo({ label, ayuda, value, onChange, min, max, step, fmt }: { label: string; ayuda: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; fmt: (v: number) => string }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="wdth-87 font-semibold">
          {label}
        </label>
        <output htmlFor={id} className="wdth-100 font-bold tabular-nums">
          {fmt(value)}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-cianotipo)]" />
      <p className="text-[0.8rem] text-tinta-suave">{ayuda}</p>
    </div>
  );
}

function Rango({ t, bajo, alto, fmt, nota }: { t: string; bajo: number; alto: number; fmt: (v: number) => string; nota?: string }) {
  return (
    <div className="bg-grafito px-5 py-4">
      <p className="wdth-87 text-[0.82rem] text-linea">{t}</p>
      <p className="mt-1 wdth-100 text-[1.5rem] font-extrabold leading-none tabular-nums text-energia">
        <AnimatedNumber value={bajo} format={fmt} />
      </p>
      <p className="mt-1 text-[0.82rem] tabular-nums text-papel/70">
        y hasta {fmt(alto)} {nota ?? ""}
      </p>
    </div>
  );
}

const horasFmt = (v: number) => `${nf.format(v)} h`;
const jornadasFmt = (v: number) => nf.format(v);
const pct = (x: number) => `${Math.round(x * 100)}`;

/** Version B, act: the time the portal gives back to the team, with INECSO's own numbers (the defaults are examples). */
export function CrecimientoB() {
  const [visitas, setVisitas] = useState(20);
  const [horasInforme, setHorasInforme] = useState(1.5);
  const [seguimiento, setSeguimiento] = useState(5);
  const [documentos, setDocumentos] = useState(2);

  const [ib, ia] = SUPUESTOS.informes;
  const [sb, sa] = SUPUESTOS.seguimiento;
  const informesMes = visitas * horasInforme;
  const seguimientoMes = (seguimiento + documentos) * SEMANAS_MES;
  const ahorroMes = (ki: number, ks: number) => informesMes * ki + seguimientoMes * ks;
  const bajo = ahorroMes(ib, sb);
  const alto = ahorroMes(ia, sa);
  const hoyMes = informesMes + seguimientoMes;

  return (
    <section id="crecimiento" aria-labelledby="h-crec" className="bg-papel px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-cianotipo">El tiempo que vuelve</p>
        <h2 id="h-crec" className="mt-2 max-w-[22ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          Con números chicos, y con los suyos.
        </h2>
        <p className="mt-4 max-w-[66ch] text-[1.05rem] text-tinta-suave">
          Pongan sus datos; los que vienen puestos son un ejemplo. El cálculo supone ahorrar entre un {pct(ib)} y un {pct(ia)} % del tiempo
          en informes y entre un {pct(sb)} y un {pct(sa)} % en seguimiento: hipótesis para medir, no promesas.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6 rounded-2xl border border-linea bg-blanco p-6">
            <p className="wdth-87 text-[0.85rem] font-bold text-tinta-suave">Informes</p>
            <Campo label="Mantenciones y visitas al mes" ayuda="Las que terminan en un informe." value={visitas} onChange={setVisitas} min={1} max={120} step={1} fmt={(v) => String(v)} />
            <Campo label="Horas para armar cada informe, hoy" ayuda="Juntar fotos, redactar, revisar y enviar." value={horasInforme} onChange={setHorasInforme} min={0.5} max={6} step={0.5} fmt={horasFmt} />
            <p className="border-t border-linea pt-5 wdth-87 text-[0.85rem] font-bold text-tinta-suave">Seguimiento</p>
            <Campo label="Horas semanales respondiendo por el avance" ayuda="Llamadas, correos y mensajes." value={seguimiento} onChange={setSeguimiento} min={0} max={40} step={1} fmt={horasFmt} />
            <Campo label="Horas semanales buscando y reenviando documentos" ayuda="Protocolos, certificados, planos e informes anteriores." value={documentos} onChange={setDocumentos} min={0} max={20} step={1} fmt={horasFmt} />
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl text-papel">
              <p className="bg-grafito-2 px-5 py-3 wdth-87 text-[0.85rem] font-bold">Cada mes, con el portal</p>
              <div className="grid gap-px bg-linea-osc sm:grid-cols-2">
                <Rango t="Horas que vuelven al equipo" bajo={bajo} alto={alto} fmt={horasFmt} nota={`(de unas ${nf.format(hoyMes)} h que se van hoy)`} />
                <Rango t="Equivalen a jornadas completas" bajo={bajo / JORNADA} alto={alto / JORNADA} fmt={jornadasFmt} nota="de 8 horas" />
                <Rango t="En informes" bajo={informesMes * ib} alto={informesMes * ia} fmt={horasFmt} />
                <Rango t="En seguimiento y documentos" bajo={seguimientoMes * sb} alto={seguimientoMes * sa} fmt={horasFmt} />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl text-papel">
              <p className="bg-grafito-2 px-5 py-3 wdth-87 text-[0.85rem] font-bold">En un año</p>
              <div className="bg-linea-osc">
                <Rango t="Horas que vuelven al equipo" bajo={bajo * 12} alto={alto * 12} fmt={horasFmt} nota={`(entre ${nf.format((bajo * 12) / JORNADA)} y ${nf.format((alto * 12) / JORNADA)} jornadas)`} />
              </div>
              <p className="bg-grafito px-5 pb-4 text-[0.88rem] leading-relaxed text-papel/75">
                Fuera de la cuenta: la información queda en la empresa, no en la memoria de las personas.
              </p>
            </div>
            <motion.p
              className="flex gap-3 rounded-xl border border-linea bg-blanco px-5 py-4 text-[0.92rem] leading-relaxed text-tinta-suave"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Info className="mt-1 size-4 shrink-0 text-cianotipo" aria-hidden="true" />
              <span>
                <b className="text-tinta">¿Cómo se comprueba?</b> Midiendo en INECSO: dos semanas de registro antes del portal y otra vez a los
                tres meses de uso. Lo que más pesa es que el sistema se use.
              </span>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
