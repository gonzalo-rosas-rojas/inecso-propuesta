import { useState } from "react";
import { ChartColumn, CalendarClock, CalendarPlus, ClipboardCheck, ClipboardList, Factory, HardHat, NotebookPen, Plus, Send, Wrench } from "lucide-react";
import { MANDANTE, clienteNombre, fecha, finDeMes, nombreEquipo, vencimiento, type Equipo } from "./datos";
import { usePortal, useVisible } from "./estado";
import { PortalShell, Encabezado } from "./Shell";
import { FilaInforme, FilaOT, FilaObra, enDias } from "./Listas";
import { BitacoraDialog, NuevaObraDialog, OTDialog } from "./Formularios";
import { ChipMant, Kpi, Panel, Vacio } from "./ui";

type Abierto = null | "obra" | "bitacora" | { modo: "programar" | "abrir"; equipoId?: string };

export function PortalTablero() {
  const { e, hoy, sesion, quien } = usePortal();
  const { obras, equipos, ots } = useVisible();
  const [dlg, setDlg] = useState<Abierto>(null);
  const admin = sesion.rol === "inecso";

  const venc = equipos.map((q) => ({ q, v: vencimiento(q, hoy) })).sort((a, b) => a.v.dias - b.v.dias);
  const atrasadas = venc.filter((x) => x.v.estado === "atrasada");
  const proximas = venc.filter((x) => x.v.estado === "proxima");
  const esteMes = venc.filter((x) => x.v.dias >= 0 && x.v.fecha <= finDeMes(hoy));
  const activas = obras.filter((o) => o.avance < 100);
  const abiertas = ots.filter((o) => o.estado === "abierta");
  const programadas = ots.filter((o) => o.estado === "programada").sort((a, b) => a.fecha.localeCompare(b.fecha));
  const porEnviar = abiertas.filter((o) => o.fecha <= hoy);
  const cerradas = ots.filter((o) => o.estado === "cerrada").sort((a, b) => (b.cierre?.fecha ?? "").localeCompare(a.cierre?.fecha ?? "") || b.id.localeCompare(a.id));
  const deMandante = (id: string) => e.equipos.find((q) => q.id === id)?.mandante;
  const porRevisar = cerradas.filter((o) => deMandante(o.equipoId) && !o.revision);
  const clientes = new Set([...obras.map((o) => o.clienteId), ...equipos.map((q) => q.clienteId)]);
  const pendienteDe = (q: Equipo) => e.ots.find((o) => o.equipoId === q.id && o.estado !== "cerrada");

  const mant = (
    <Panel titulo={sesion.rol === "cliente" ? "Mantenciones de sus equipos" : "Mantenciones por atender"} accion={<a href="#/portal/mantenciones" className="text-[0.88rem] font-semibold text-cianotipo hover:underline">Ver todas</a>}>
      {[...atrasadas, ...proximas].length === 0 ? (
        <Vacio>Todos los equipos están al día.</Vacio>
      ) : (
        <ul className="mt-2 divide-y divide-linea/60">
          {[...atrasadas, ...proximas].map(({ q, v }) => {
            const p = pendienteDe(q);
            return (
              <li key={q.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <b className="text-[0.95rem]">{nombreEquipo(q)}</b>
                    <ChipMant estado={v.estado} />
                  </p>
                  <p className="text-[0.85rem] text-tinta-suave">
                    {sesion.rol !== "cliente" && <>{clienteNombre(q.clienteId)}, </>}
                    {q.ubicacion}
                  </p>
                  <p className="text-[0.8rem] text-tinta-suave tabular-nums">
                    {v.estado === "atrasada" ? "Venció" : "Vence"} el {fecha(v.fecha)} ({enDias(v.dias)}){v.motivo === "horas" ? ", por horas de uso" : ""}.
                    {p && (
                      <>
                        {" "}
                        <a href={`#/portal/ot/${p.id}`} className="font-semibold text-cianotipo hover:underline">
                          {p.id} {p.estado === "abierta" ? "en terreno" : `el ${fecha(p.fecha)}`}
                        </a>
                      </>
                    )}
                  </p>
                </div>
                {admin && !p && (
                  <button type="button" className="btn btn-linea px-3 py-2 text-[0.82rem] text-tinta" onClick={() => setDlg({ modo: "programar", equipoId: q.id })}>
                    <CalendarPlus className="size-4" aria-hidden="true" />
                    Programar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );

  const panelObras = (
    <Panel titulo={sesion.rol === "cliente" ? "Sus obras en curso" : "Obras activas"} accion={<a href="#/portal/obras" className="text-[0.88rem] font-semibold text-cianotipo hover:underline">Ver todas</a>}>
      {activas.length ? (
        <ul className="mt-1 divide-y divide-linea/60">
          {activas.map((o, i) => (
            <FilaObra key={o.id} o={o} i={i} />
          ))}
        </ul>
      ) : (
        <Vacio>No hay obras en curso.</Vacio>
      )}
    </Panel>
  );

  const panelOT = (
    <Panel titulo={sesion.rol === "cliente" ? "Visitas programadas" : "Órdenes de trabajo"}>
      {abiertas.length + programadas.length ? (
        <ul className="mt-1 divide-y divide-linea/60">
          {[...abiertas, ...programadas].map((o) => (
            <FilaOT key={o.id} ot={o} />
          ))}
        </ul>
      ) : (
        <Vacio>No hay órdenes de trabajo abiertas ni programadas.</Vacio>
      )}
    </Panel>
  );

  const panelInformes = (
    <Panel
      titulo={sesion.rol === "mandante" ? "Informes por revisar" : "Informes recientes"}
      accion={<a href="#/portal/informes" className="text-[0.88rem] font-semibold text-cianotipo hover:underline">Ver todos</a>}
    >
      {(sesion.rol === "mandante" ? porRevisar : cerradas.slice(0, 4)).length ? (
        <ul className="mt-1 divide-y divide-linea/60">
          {(sesion.rol === "mandante" ? porRevisar : cerradas.slice(0, 4)).map((o) => (
            <FilaInforme key={o.id} ot={o} />
          ))}
        </ul>
      ) : (
        <Vacio>{sesion.rol === "mandante" ? "No tiene informes pendientes de revisión." : "Todavía no hay informes."}</Vacio>
      )}
    </Panel>
  );

  const proxima = venc.find((x) => x.v.dias >= 0) ?? venc[0];

  return (
    <PortalShell>
      <Encabezado
        antes={sesion.rol === "inecso" ? `Hoy, ${fecha(hoy)}` : sesion.rol === "mandante" ? "Trabajos subcontratados a INECSO" : quien}
        titulo={sesion.rol === "inecso" ? "Resumen de operaciones" : sesion.rol === "mandante" ? "Resumen para la mandante" : "Resumen de sus servicios"}
      >
        {sesion.rol !== "cliente" && (
          <a href="#/portal/gestion" className="btn btn-linea px-3.5 py-2.5 text-[0.88rem] text-tinta">
            <ChartColumn className="size-4" aria-hidden="true" />
            Resumen de gestión del mes
          </a>
        )}
      </Encabezado>
      {sesion.rol === "mandante" && (
        <p className="mt-2 max-w-3xl text-tinta-suave">Todo lo que subcontrató a INECSO, de todos sus clientes. Cada informe llega aquí cuando INECSO cierra la orden de trabajo.</p>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {sesion.rol === "inecso" && (
          <>
            <Kpi icon={HardHat} n={activas.length} t="obras activas" sub={`${activas.filter((o) => o.mandante).length} vía la ${MANDANTE.toLowerCase()}`} />
            <Kpi icon={CalendarClock} n={esteMes.length} t="mantenciones vencen este mes" sub={`${atrasadas.length} atrasadas, ${proximas.length} próximas en 30 días`} tono={atrasadas.length ? "falla" : "azul"} />
            <Kpi icon={ClipboardList} n={abiertas.length} t={abiertas.length === 1 ? "orden de trabajo abierta" : "órdenes de trabajo abiertas"} sub={programadas.length === 1 ? "1 programada" : `${programadas.length} programadas`} />
            <Kpi icon={Send} n={porEnviar.length} t="informes por enviar" sub="Salen solos al cerrar la orden" tono={porEnviar.length ? "energia" : "tierra"} />
          </>
        )}
        {sesion.rol === "mandante" && (
          <>
            <Kpi icon={HardHat} n={activas.length} t="obras subcontratadas en curso" />
            <Kpi icon={CalendarClock} n={atrasadas.length} t="mantenciones atrasadas" sub={`${proximas.length} próximas en 30 días`} tono={atrasadas.length ? "falla" : "tierra"} />
            <Kpi icon={ClipboardCheck} n={porRevisar.length} t="informes por revisar" sub={`${cerradas.length} informes en total`} tono={porRevisar.length ? "energia" : "tierra"} />
            <Kpi icon={Factory} n={clientes.size} t="clientes atendidos" sub={`${equipos.length} grupos electrógenos`} />
          </>
        )}
        {sesion.rol === "cliente" && (
          <>
            <Kpi icon={HardHat} n={activas.length} t={activas.length === 1 ? "obra en curso" : "obras en curso"} />
            {programadas[0] ? (
              <Kpi icon={CalendarClock} n={fecha(programadas[0].fecha)} t="próxima visita de mantención" sub={nombreEquipo(e.equipos.find((q) => q.id === programadas[0].equipoId)!)} />
            ) : (
              <Kpi icon={CalendarClock} n={proxima ? fecha(proxima.v.fecha) : "Sin fecha"} t="próxima mantención según pauta" sub={proxima ? nombreEquipo(proxima.q) : undefined} />
            )}
            <Kpi icon={Wrench} n={equipos.length} t="equipos con pauta de mantención" sub={atrasadas.length ? `${atrasadas.length} con mantención atrasada` : "Todos al día"} tono={atrasadas.length ? "falla" : "tierra"} />
            <Kpi icon={ClipboardCheck} n={cerradas.length} t="informes de mantención" sub={cerradas[0]?.cierre ? `Último: ${fecha(cerradas[0].cierre.fecha)}` : undefined} />
          </>
        )}
      </ul>

      {admin && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-blanco p-3 ring-1 ring-linea/70 sm:p-4">
          <span className="mr-2 w-full text-[0.88rem] font-semibold sm:w-auto">Acciones</span>
          <button type="button" className="btn btn-azul px-3.5 py-2.5 text-[0.88rem]" onClick={() => setDlg("obra")}>
            <Plus className="size-4" aria-hidden="true" />
            Nueva obra
          </button>
          <button type="button" className="btn btn-linea px-3.5 py-2.5 text-[0.88rem] text-tinta" onClick={() => setDlg({ modo: "programar" })}>
            <CalendarPlus className="size-4" aria-hidden="true" />
            Programar mantención
          </button>
          <button type="button" className="btn btn-linea px-3.5 py-2.5 text-[0.88rem] text-tinta" onClick={() => setDlg({ modo: "abrir" })}>
            <ClipboardList className="size-4" aria-hidden="true" />
            Abrir orden de trabajo
          </button>
          <button type="button" className="btn btn-linea px-3.5 py-2.5 text-[0.88rem] text-tinta" onClick={() => setDlg("bitacora")}>
            <NotebookPen className="size-4" aria-hidden="true" />
            Agregar a bitácora
          </button>
        </div>
      )}

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="grid gap-4">
          {sesion.rol === "mandante" ? panelInformes : panelObras}
          {panelOT}
          {sesion.rol === "mandante" && panelObras}
        </div>
        <div className="grid gap-4">
          {mant}
          {sesion.rol !== "mandante" && panelInformes}
        </div>
      </div>
      <p className="mt-6 text-[0.82rem] text-tinta-suave">Empresas, obras, equipos y fechas de ejemplo.</p>

      <NuevaObraDialog abierto={dlg === "obra"} onCerrar={() => setDlg(null)} />
      <BitacoraDialog abierto={dlg === "bitacora"} onCerrar={() => setDlg(null)} />
      <OTDialog
        abierto={typeof dlg === "object" && dlg !== null}
        onCerrar={() => setDlg(null)}
        modo={typeof dlg === "object" && dlg ? dlg.modo : "programar"}
        equipoId={typeof dlg === "object" && dlg ? dlg.equipoId : undefined}
      />
    </PortalShell>
  );
}
