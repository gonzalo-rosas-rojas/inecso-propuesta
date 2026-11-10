import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CalendarClock, CheckCircle2, FileText, HardHat, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ETAPAS, MANDANTE, clienteNombre, fecha, nombreEquipo, vencimiento } from "./datos";
import { usePortal, useVisible } from "./estado";
import { PortalShell } from "./Shell";
import { NuevaObraDialog } from "./Formularios";
import { Etiqueta, Kpi, Vacio } from "./ui";

export function PortalLista() {
  const { hoy, sesion } = usePortal();
  const { obras, equipos, ots } = useVisible();
  const [nueva, setNueva] = useState(false);
  const enCurso = obras.filter((o) => o.avance < 100).length;
  const entregadas = obras.length - enCurso;
  const nuevos = obras.reduce((s, o) => s + o.docs.filter((d) => d.nuevo).length, 0);
  const proxima = equipos.map((q) => ({ q, v: vencimiento(q, hoy) })).sort((a, b) => a.v.dias - b.v.dias)[0];
  const visita = ots.filter((o) => o.estado === "programada").sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  const qVisita = visita && equipos.find((q) => q.id === visita.equipoId);
  const corto = (n: string) => n.replace("Grupo electrógeno", "grupo de");

  return (
    <PortalShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="wdth-125 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] font-extrabold">{sesion.rol === "cliente" ? "Sus obras" : "Obras"}</h1>
        {sesion.rol === "inecso" && (
          <button type="button" className="btn btn-azul px-4 py-2.5 text-[0.9rem]" onClick={() => setNueva(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Nueva obra
          </button>
        )}
      </div>
      {sesion.rol === "mandante" && <p className="mt-2 text-tinta-suave">Las obras que subcontrató a INECSO, de todos sus clientes.</p>}
      <ul className="mt-6 grid gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={HardHat} n={enCurso} t={enCurso === 1 ? "obra en curso" : "obras en curso"} />
        <Kpi icon={CheckCircle2} n={entregadas} t={entregadas === 1 ? "entregada" : "entregadas"} tono="tierra" />
        <Kpi icon={FileText} n={nuevos} t="documentos nuevos" />
        {visita && qVisita ? (
          <Kpi icon={CalendarClock} n={fecha(visita.fecha)} t={`próxima visita de mantención, ${corto(nombreEquipo(qVisita))}`} tono="energia" />
        ) : (
          proxima && (
            <Kpi
              icon={CalendarClock}
              n={fecha(proxima.v.fecha)}
              t={`${proxima.v.estado === "atrasada" ? "mantención atrasada" : "próxima mantención"}, ${corto(nombreEquipo(proxima.q))}`}
              tono={proxima.v.estado === "atrasada" ? "falla" : "energia"}
            />
          )
        )}
      </ul>

      {obras.length === 0 && <Vacio>No hay obras para mostrar con este perfil.</Vacio>}
      <ul className="mt-8 grid gap-3">
        {obras.map((o, i) => {
          const lista = o.avance >= 100;
          return (
            <motion.li key={o.id} layout="position" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <a
                href={`#/portal/obra/${o.id}`}
                className="group grid items-center gap-4 rounded-md bg-blanco p-5 ring-1 ring-linea/70 transition-shadow hover:shadow-[0_14px_36px_-22px_rgb(0_0_0/0.45)] md:grid-cols-[1fr_15rem_auto]"
              >
                <div>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] text-tinta-suave tabular-nums">
                    <span>
                      {o.codigo}. {sesion.rol !== "cliente" && `${clienteNombre(o.clienteId)}, `}
                      {o.lugar}
                    </span>
                    {sesion.rol === "inecso" && o.mandante && <Etiqueta>Vía {MANDANTE.toLowerCase()}</Etiqueta>}
                  </p>
                  <h2 className="mt-0.5 text-[1.12rem] leading-snug font-bold">{o.titulo}</h2>
                  <p className="mt-1 text-[0.85rem] text-tinta-suave">{lista ? `Entregada el ${fecha(o.entrega)}` : `Entrega estimada: ${fecha(o.entrega)}`}</p>
                </div>
                <div>
                  <div className="flex items-baseline justify-between text-[0.85rem]">
                    <span className={cn("rounded-full px-2.5 py-0.5 font-semibold", lista ? "bg-tierra/12 text-tierra" : "bg-cianotipo/10 text-cianotipo")}>{lista ? "Entregada" : ETAPAS[o.etapa]}</span>
                    <span className="font-bold tabular-nums">{o.avance} %</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-papel-2">
                    <motion.div
                      className={cn("h-full origin-left rounded-full", lista ? "bg-tierra" : "bg-cianotipo")}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: o.avance / 100 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                    />
                  </div>
                </div>
                <ArrowRight className="hidden size-5 text-tinta-suave transition-transform group-hover:translate-x-1 md:block" aria-hidden="true" />
              </a>
            </motion.li>
          );
        })}
      </ul>
      <p className="mt-6 text-[0.82rem] text-tinta-suave">Clientes, obras y fechas de ejemplo.</p>
      <NuevaObraDialog abierto={nueva} onCerrar={() => setNueva(false)} />
    </PortalShell>
  );
}
