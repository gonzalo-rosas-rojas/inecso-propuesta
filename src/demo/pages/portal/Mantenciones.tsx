import { useState } from "react";
import { CalendarPlus, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENTES_PORTAL, ESTADO_MANT, vencimiento, type EstadoMant } from "./datos";
import { usePortal, useVisible } from "./estado";
import { PortalShell, Encabezado } from "./Shell";
import { FilaEquipo, FilaOT } from "./Listas";
import { OTDialog } from "./Formularios";
import { Panel, Vacio } from "./ui";

const GRUPOS: { id: EstadoMant; t: string; d: string }[] = [
  { id: "atrasada", t: "Atrasadas", d: "Pasó la fecha o las horas de la pauta." },
  { id: "proxima", t: "Próximas", d: "Vencen en los próximos 30 días." },
  { id: "aldia", t: "Al día", d: "" },
];

export function PortalMantenciones() {
  const { hoy, sesion } = usePortal();
  const { equipos, ots } = useVisible();
  const [filtro, setFiltro] = useState<"todas" | EstadoMant>("todas");
  const [cliente, setCliente] = useState("todos");
  const [dlg, setDlg] = useState<null | { modo: "programar" | "abrir"; equipoId?: string }>(null);
  const admin = sesion.rol === "inecso";

  const lista = equipos
    .filter((q) => cliente === "todos" || q.clienteId === cliente)
    .map((q) => ({ q, v: vencimiento(q, hoy) }))
    .sort((a, b) => a.v.dias - b.v.dias);
  const cuenta = (s: EstadoMant) => lista.filter((x) => x.v.estado === s).length;
  const clientes = CLIENTES_PORTAL.filter((c) => equipos.some((q) => q.clienteId === c.id));
  const enCurso = ots.filter((o) => o.estado !== "cerrada" && (cliente === "todos" || equipos.find((q) => q.id === o.equipoId)?.clienteId === cliente)).sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <PortalShell>
      <Encabezado antes={sesion.rol === "cliente" ? "Sus grupos electrógenos" : "Grupos electrógenos con pauta"} titulo="Mantenciones">
        {admin && (
          <>
            <button type="button" className="btn btn-linea px-3.5 py-2.5 text-[0.88rem] text-tinta" onClick={() => setDlg({ modo: "programar" })}>
              <CalendarPlus className="size-4" aria-hidden="true" />
              Programar mantención
            </button>
            <button type="button" className="btn btn-azul px-3.5 py-2.5 text-[0.88rem]" onClick={() => setDlg({ modo: "abrir" })}>
              <ClipboardList className="size-4" aria-hidden="true" />
              Abrir orden de trabajo
            </button>
          </>
        )}
      </Encabezado>
      <p className="mt-2 max-w-3xl text-tinta-suave">
        Cada grupo tiene su pauta: cada cierta cantidad de horas de operación o cada cierto tiempo, lo que ocurra primero. La próxima fecha se calcula con el horómetro y el uso de cada equipo.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="sin-barra flex gap-1.5 overflow-x-auto" role="group" aria-label="Filtrar por estado">
          {(["todas", "atrasada", "proxima", "aldia"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filtro === f}
              onClick={() => setFiltro(f)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[0.88rem] font-semibold whitespace-nowrap ring-1 transition-colors",
                filtro === f ? "bg-grafito text-blanco ring-grafito" : "bg-blanco text-tinta-suave ring-linea hover:text-tinta",
              )}
            >
              {f === "todas" ? `Todas (${lista.length})` : `${ESTADO_MANT[f]} (${cuenta(f)})`}
            </button>
          ))}
        </div>
        {sesion.rol !== "cliente" && clientes.length > 1 && (
          <label className="flex items-center gap-2 text-[0.88rem]">
            <span className="text-tinta-suave">Cliente</span>
            <select className="rounded-[3px] border border-linea bg-blanco px-2.5 py-1.5 font-semibold" value={cliente} onChange={(ev) => setCliente(ev.target.value)}>
              <option value="todos">Todos</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-4">
          {GRUPOS.filter((g) => filtro === "todas" || filtro === g.id).map((g) => {
            const items = lista.filter((x) => x.v.estado === g.id);
            if (!items.length && filtro === "todas") return null;
            return (
              <Panel key={g.id} titulo={`${g.t} (${items.length})`} accion={g.d ? <span className="text-[0.82rem] text-tinta-suave">{g.d}</span> : undefined}>
                {items.length ? (
                  <ul className="mt-2 divide-y divide-linea/60">
                    {items.map(({ q }) => (
                      <FilaEquipo key={q.id} q={q} onProgramar={() => setDlg({ modo: "programar", equipoId: q.id })} onAbrir={() => setDlg({ modo: "abrir", equipoId: q.id })} />
                    ))}
                  </ul>
                ) : (
                  <Vacio>No hay equipos en este estado.</Vacio>
                )}
              </Panel>
            );
          })}
        </div>
        <Panel titulo={sesion.rol === "cliente" ? "Visitas programadas" : "Órdenes de trabajo en curso"} className="lg:sticky lg:top-24">
          {enCurso.length ? (
            <ul className="mt-1 divide-y divide-linea/60">
              {enCurso.map((o) => (
                <FilaOT key={o.id} ot={o} />
              ))}
            </ul>
          ) : (
            <Vacio>No hay órdenes abiertas ni programadas.</Vacio>
          )}
        </Panel>
      </div>
      <p className="mt-6 text-[0.82rem] text-tinta-suave">Equipos, marcas, horómetros y fechas de ejemplo.</p>

      <OTDialog abierto={!!dlg} onCerrar={() => setDlg(null)} modo={dlg?.modo ?? "programar"} equipoId={dlg?.equipoId} />
    </PortalShell>
  );
}
