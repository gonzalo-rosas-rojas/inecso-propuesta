import { motion } from "motion/react";
import { ArrowRight, CalendarPlus, ChevronsRight, ClipboardCheck, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { ETAPAS, MANDANTE, PAUTA, TIPO_OT, clienteNombre, diasEntre, fecha, miles, modeloEquipo, nombreEquipo, reglaTexto, vencimiento, type Equipo, type ObraP, type OT } from "./datos";
import { useStore } from "../../store";
import { avanzarEtapa, siguienteEtapa, usePortal } from "./estado";
import { ChipMant, ChipOT, Etiqueta } from "./ui";

export function enDias(d: number) {
  if (d === 0) return "hoy";
  if (d === 1) return "mañana";
  if (d === -1) return "ayer";
  return d > 0 ? `en ${d} días` : `hace ${-d} días`;
}

/** Results of a closed work order, in one line. */
export function resumenOT(ot: OT) {
  const v = PAUTA.map((p) => ot.items[p.id]?.r);
  const ok = v.filter((r) => r === "ok").length;
  const at = v.filter((r) => r === "atencion").length;
  return at ? `${ok} OK, ${at} requiere${at > 1 ? "n" : ""} atención` : `${ok} de ${PAUTA.length} OK`;
}

export function FilaEquipo({ q, onProgramar, onAbrir }: { q: Equipo; onProgramar?: () => void; onAbrir?: () => void }) {
  const { e, hoy, sesion } = usePortal();
  const v = vencimiento(q, hoy);
  const pendiente = e.ots.find((o) => o.equipoId === q.id && o.estado !== "cerrada");
  const admin = sesion.rol === "inecso";
  return (
    <li className="grid gap-3 py-4 first:pt-1 last:pb-1 md:grid-cols-[1fr_auto] md:items-start md:gap-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="font-bold">{nombreEquipo(q)}</h3>
          <ChipMant estado={v.estado} />
          {pendiente && (
            <a href={`#/portal/ot/${pendiente.id}`} className="rounded-full text-[0.8rem] font-semibold text-cianotipo hover:underline">
              {pendiente.id} {pendiente.estado === "abierta" ? "en terreno" : `programada ${enDias(diasEntre(hoy, pendiente.fecha))}`}
            </a>
          )}
        </div>
        <p className="mt-0.5 text-[0.86rem] text-tinta-suave">
          {modeloEquipo(q)}, serie {q.serie}. {sesion.rol !== "cliente" && <>{clienteNombre(q.clienteId)}, </>}
          {q.ubicacion}.
          {sesion.rol === "inecso" && q.mandante && <Etiqueta className="ml-2 align-middle">Vía {MANDANTE.toLowerCase()}</Etiqueta>}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.86rem] sm:grid-cols-[auto_auto_1fr]">
          <div>
            <dt className="text-tinta-suave">Horómetro</dt>
            <dd className="font-semibold tabular-nums">{miles(q.horometro)} h</dd>
          </div>
          <div>
            <dt className="text-tinta-suave">Última mantención</dt>
            <dd className="font-semibold tabular-nums">
              {fecha(q.ultima.fecha)}, {miles(q.ultima.horometro)} h
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-tinta-suave">Próxima</dt>
            <dd className={cn("font-semibold tabular-nums", v.estado === "atrasada" && "text-falla")}>
              {fecha(v.fecha)} ({enDias(v.dias)}),{" "}
              <span className="font-normal text-tinta-suave">
                {v.motivo === "horas" ? `al llegar a ${miles(v.horasLimite ?? 0)} h` : "por calendario"}
              </span>
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-[0.8rem] text-tinta-suave">Pauta: {reglaTexto(q.regla).replace(/^./, (c) => c.toLowerCase())}.</p>
      </div>
      {admin && (
        <div className="flex flex-wrap gap-2 md:justify-end">
          {pendiente ? (
            <a href={`#/portal/ot/${pendiente.id}`} className="btn btn-azul px-3.5 py-2 text-[0.85rem]">
              <ClipboardList className="size-4" aria-hidden="true" />
              {pendiente.estado === "abierta" ? "Continuar OT" : "Ver OT"}
            </a>
          ) : (
            <>
              <button type="button" onClick={onProgramar} className="btn btn-linea px-3.5 py-2 text-[0.85rem] text-tinta">
                <CalendarPlus className="size-4" aria-hidden="true" />
                Programar
              </button>
              <button type="button" onClick={onAbrir} className="btn btn-azul px-3.5 py-2 text-[0.85rem]">
                <ClipboardList className="size-4" aria-hidden="true" />
                Abrir OT
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

export function FilaOT({ ot }: { ot: OT }) {
  const { e, hoy, sesion } = usePortal();
  const q = e.equipos.find((x) => x.id === ot.equipoId);
  if (!q) return null;
  const hechos = PAUTA.filter((p) => ot.items[p.id]?.r).length;
  return (
    <li>
      <a href={`#/portal/ot/${ot.id}`} className="group flex items-center gap-3 py-3">
        <ClipboardList className="size-5 shrink-0 text-cianotipo" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <b className="text-[0.95rem] tabular-nums group-hover:text-cianotipo">{ot.id}</b>
            <ChipOT estado={ot.estado} />
          </span>
          <span className="block text-[0.86rem] text-tinta-suave">
            {TIPO_OT[ot.tipo]}, {nombreEquipo(q)}
            {sesion.rol !== "cliente" && <>. {clienteNombre(q.clienteId)}</>}
          </span>
          <span className="block text-[0.8rem] text-tinta-suave tabular-nums">
            {ot.estado === "abierta" ? `Pauta ${hechos} de ${PAUTA.length}. ` : ""}
            {fecha(ot.fecha)} ({enDias(diasEntre(hoy, ot.fecha))}). {ot.tecnico}
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-tinta-suave transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
    </li>
  );
}

export function FilaInforme({ ot }: { ot: OT }) {
  const { e, sesion } = usePortal();
  const q = e.equipos.find((x) => x.id === ot.equipoId);
  if (!q || !ot.cierre) return null;
  const atencion = PAUTA.some((p) => ot.items[p.id]?.r === "atencion");
  return (
    <li>
      <a href={`#/portal/informe/${ot.id}`} className="group flex items-center gap-3 py-3">
        <ClipboardCheck className={cn("size-5 shrink-0", atencion ? "text-energia-osc" : "text-tierra")} aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <b className="text-[0.95rem] group-hover:text-cianotipo">Informe {ot.id}</b>
            {q.mandante && sesion.rol !== "cliente" && (
              <span className={cn("rounded-full px-2 py-0.5 text-[0.75rem] font-semibold", ot.revision ? "bg-tierra/12 text-tierra" : "bg-energia/25 text-energia-osc")}>
                {ot.revision ? "Revisado por la mandante" : "Por revisar"}
              </span>
            )}
          </span>
          <span className="block text-[0.86rem] text-tinta-suave">
            {nombreEquipo(q)}
            {sesion.rol !== "cliente" && <>. {clienteNombre(q.clienteId)}</>}
          </span>
          <span className="block text-[0.8rem] text-tinta-suave tabular-nums">
            {fecha(ot.cierre.fecha)}. {resumenOT(ot)}
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-tinta-suave transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
    </li>
  );
}

/** A job with its stage and progress. INECSO can advance its stage right here. */
export function FilaObra({ o, i = 0 }: { o: ObraP; i?: number }) {
  const { hoy, hacer, sesion } = usePortal();
  const { toast } = useStore();
  const lista = o.avance >= 100;
  const sig = siguienteEtapa(o);
  return (
    <motion.li layout="position" className="grid items-center gap-3 py-3.5 sm:grid-cols-[1fr_14rem] sm:gap-5">
      <a href={`#/portal/obra/${o.id}`} className="group min-w-0">
        <span className="block text-[0.8rem] text-tinta-suave tabular-nums">
          {o.codigo}. {sesion.rol !== "cliente" ? `${clienteNombre(o.clienteId)}, ` : ""}
          {o.lugar}
        </span>
        <b className="block leading-snug group-hover:text-cianotipo">{o.titulo}</b>
      </a>
      <div>
        <div className="flex items-baseline justify-between text-[0.82rem]">
          <span className={cn("rounded-full px-2 py-0.5 font-semibold", lista ? "bg-tierra/12 text-tierra" : "bg-cianotipo/10 text-cianotipo")}>{lista ? "Entregada" : ETAPAS[o.etapa]}</span>
          <span className="font-bold tabular-nums">{o.avance} %</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-papel-2">
          <motion.div
            className={cn("h-full origin-left rounded-full", lista ? "bg-tierra" : "bg-cianotipo")}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: o.avance / 100 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          />
        </div>
        {sesion.rol === "inecso" && sig && (
            <button
              type="button"
              className="btn btn-linea mt-2.5 w-full px-3 py-2 text-[0.82rem] whitespace-normal text-tinta"
              onClick={() => {
                hacer((s) => avanzarEtapa(s, o.id, hoy));
                toast(`${o.codigo} pasa a ${sig === "Entregada" ? "entregada" : sig}. ${clienteNombre(o.clienteId)}${o.mandante ? ` y la ${MANDANTE}` : ""} lo ven en el portal.`);
              }}
            >
              <ChevronsRight className="size-4 shrink-0" aria-hidden="true" />
              {sig === "Entregada" ? "Marcar entregada" : `Pasar a ${sig}`}
            </button>
        )}
      </div>
    </motion.li>
  );
}
