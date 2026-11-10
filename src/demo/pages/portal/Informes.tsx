import { useState } from "react";
import { cn } from "@/lib/utils";
import { MANDANTE } from "./datos";
import { usePortal, useVisible } from "./estado";
import { PortalShell, Encabezado } from "./Shell";
import { FilaInforme, FilaOT } from "./Listas";
import { Panel, Vacio } from "./ui";

export function PortalInformes() {
  const { e, sesion } = usePortal();
  const { ots } = useVisible();
  const mandante = sesion.rol === "mandante";
  const [filtro, setFiltro] = useState<"todos" | "revisar">(mandante ? "revisar" : "todos");
  const cerradas = ots.filter((o) => o.estado === "cerrada").sort((a, b) => (b.cierre?.fecha ?? "").localeCompare(a.cierre?.fecha ?? "") || b.id.localeCompare(a.id));
  const deMandante = (id: string) => !!e.equipos.find((q) => q.id === id)?.mandante;
  const porRevisar = cerradas.filter((o) => deMandante(o.equipoId) && !o.revision);
  const lista = mandante && filtro === "revisar" ? porRevisar : cerradas;
  const enTerreno = ots.filter((o) => o.estado === "abierta");

  return (
    <PortalShell>
      <Encabezado antes={sesion.rol === "cliente" ? "Mantenciones de sus equipos" : "Mantenciones cerradas"} titulo="Informes" />
      <p className="mt-2 max-w-3xl text-tinta-suave">
        Cada informe sale de una orden de trabajo cerrada con la pauta estándar y las firmas en terreno.
        {sesion.rol === "inecso" && ` Al cerrarla, llega solo al cliente y, si el trabajo es de la ${MANDANTE.toLowerCase()}, también a ella.`}
        {mandante && " Márquelos como revisados o deje un comentario para INECSO."}
      </p>

      {mandante && (
        <div className="mt-5 flex gap-1.5" role="group" aria-label="Filtrar informes">
          {(
            [
              ["revisar", `Por revisar (${porRevisar.length})`],
              ["todos", `Todos (${cerradas.length})`],
            ] as const
          ).map(([v, t]) => (
            <button
              key={v}
              type="button"
              aria-pressed={filtro === v}
              onClick={() => setFiltro(v)}
              className={cn("rounded-full px-3.5 py-1.5 text-[0.88rem] font-semibold ring-1", filtro === v ? "bg-grafito text-blanco ring-grafito" : "bg-blanco text-tinta-suave ring-linea hover:text-tinta")}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_22rem]">
        <Panel>
          {lista.length ? (
            <ul className="divide-y divide-linea/60">
              {lista.map((o) => (
                <FilaInforme key={o.id} ot={o} />
              ))}
            </ul>
          ) : (
            <Vacio>{mandante && filtro === "revisar" ? "Revisó todos los informes." : "Todavía no hay informes."}</Vacio>
          )}
        </Panel>
        <Panel titulo={sesion.rol === "inecso" ? "Por enviar: órdenes en terreno" : "En terreno ahora"}>
          {enTerreno.length ? (
            <ul className="mt-1 divide-y divide-linea/60">
              {enTerreno.map((o) => (
                <FilaOT key={o.id} ot={o} />
              ))}
            </ul>
          ) : (
            <Vacio>No hay órdenes de trabajo en terreno.</Vacio>
          )}
        </Panel>
      </div>
      <p className="mt-6 text-[0.82rem] text-tinta-suave">Informes, equipos y firmas de ejemplo.</p>
    </PortalShell>
  );
}
