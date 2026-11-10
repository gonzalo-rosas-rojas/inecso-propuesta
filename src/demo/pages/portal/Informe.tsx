import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Lock, MessageSquare, Printer, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMPRESA } from "@/data/inecso";
import { MANDANTE, PAUTA, RESULTADO, TIPO_OT, clienteNombre, fecha, miles, modeloEquipo, nombreEquipo, type Resultado } from "./datos";
import { useStore } from "../../store";
import { comentarInforme, equipoDe, revisarInforme, usePortal, ve, ROL_NOMBRE } from "./estado";
import { PortalShell } from "./Shell";
import { FirmaVista } from "./Firma";
import { resumenOT } from "./Listas";
import { srcFoto } from "./OT";
import { Panel } from "./ui";

const TONO: Record<Resultado, string> = {
  ok: "bg-tierra/12 text-tierra",
  atencion: "bg-energia/30 text-energia-osc",
  na: "bg-papel-2 text-tinta-suave",
};

export function PortalInforme({ id }: { id: string }) {
  const { e, hoy, sesion, hacer } = usePortal();
  const { toast } = useStore();
  const [texto, setTexto] = useState("");
  const ot = e.ots.find((o) => o.id === id);
  const q = ot && equipoDe(e, ot);

  if (!ot || !q || !ve(sesion, q) || ot.estado !== "cerrada" || !ot.cierre) {
    const abierta = ot && q && ve(sesion, q) && ot.estado !== "cerrada";
    return (
      <PortalShell>
        <a href="#/portal/informes" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-cianotipo hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Informes
        </a>
        <div className="mt-6 flex max-w-xl items-start gap-3 rounded-md bg-blanco p-5 ring-1 ring-linea/70">
          <Lock className="mt-0.5 size-5 shrink-0 text-tinta-suave" aria-hidden="true" />
          <p>
            <b className="block">{abierta ? "Este informe todavía no existe" : ot ? "Este perfil no ve este informe" : "No existe este informe"}</b>
            <span className="text-tinta-suave">
              {abierta ? (
                <>
                  Se genera al cerrar la{" "}
                  <a className="font-semibold text-cianotipo hover:underline" href={`#/portal/ot/${ot.id}`}>
                    orden {ot.id}
                  </a>
                  .
                </>
              ) : ot ? (
                "Cambie de perfil arriba para verlo."
              ) : (
                "Puede que se haya borrado al reiniciar la demo."
              )}
            </span>
          </p>
        </div>
      </PortalShell>
    );
  }

  const c = ot.cierre;
  const verComentarios = sesion.rol !== "cliente" && q.mandante;
  const puedeComentar = sesion.rol === "mandante" || sesion.rol === "inecso";

  const comentar = (ev: FormEvent) => {
    ev.preventDefault();
    if (!texto.trim()) return;
    hacer((s) => comentarInforme(s, ot.id, sesion.rol, texto.trim(), hoy));
    setTexto("");
    toast(sesion.rol === "mandante" ? "Comentario enviado a INECSO." : `Comentario enviado a la ${MANDANTE}.`);
  };

  return (
    <PortalShell>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <a href="#/portal/informes" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-cianotipo hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Informes
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {sesion.rol === "mandante" && !ot.revision && (
            <button
              type="button"
              className="btn btn-azul px-3.5 py-2.5 text-[0.88rem]"
              onClick={() => {
                hacer((s) => revisarInforme(s, ot.id, hoy));
                toast(`Informe ${ot.id} marcado como revisado. INECSO lo ve en su resumen.`);
              }}
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Marcar como revisado
            </button>
          )}
          <button type="button" className="btn btn-linea px-3.5 py-2.5 text-[0.88rem] text-tinta" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden="true" />
            Imprimir o guardar PDF
          </button>
        </div>
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-tierra/10 px-4 py-3 text-[0.9rem] print:hidden">
        <Send className="size-4 shrink-0 text-tierra" aria-hidden="true" />
        <span>
          Enviado a <b>{c.enviadoA.join(" y ")}</b> el {fecha(c.fecha)} a las {c.hora}.
        </span>
        {q.mandante && sesion.rol !== "cliente" && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={ot.revision ? "r" : "p"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("rounded-full px-2.5 py-0.5 text-[0.8rem] font-semibold", ot.revision ? "bg-tierra/15 text-tierra" : "bg-energia/25 text-energia-osc")}>
              {ot.revision ? `Revisado por la ${MANDANTE.toLowerCase()} el ${fecha(ot.revision.fecha)}` : `Pendiente de revisión por la ${MANDANTE.toLowerCase()}`}
            </motion.span>
          </AnimatePresence>
        )}
      </p>

      <article className="hoja mx-auto mt-4 max-w-4xl rounded-md bg-blanco p-5 ring-1 ring-linea/70 sm:p-10 print:mt-0 print:rounded-none print:p-0 print:ring-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-grafito pb-4">
          <div>
            <p className="wdth-125 text-[1.35rem] leading-none font-extrabold">INECSO Ingeniería</p>
            <p className="mt-1.5 text-[0.82rem] text-tinta-suave">
              {EMPRESA.especialidad}. {EMPRESA.sec}.
            </p>
          </div>
          <div className="text-right">
            <p className="wdth-87 text-[0.85rem] font-semibold text-tinta-suave">Informe de {TIPO_OT[ot.tipo].toLowerCase()}</p>
            <p className="wdth-112 text-[1.5rem] leading-tight font-extrabold tabular-nums">{ot.id}</p>
            <p className="text-[0.85rem] tabular-nums">{fecha(c.fecha)}</p>
          </div>
        </header>

        <section className="mt-5" aria-labelledby="inf-eq">
          <h2 id="inf-eq" className="sr-only">
            Equipo y visita
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[0.9rem] sm:grid-cols-4">
            {[
              ["Cliente", clienteNombre(q.clienteId)],
              ["Ubicación", q.ubicacion],
              ["Equipo", nombreEquipo(q)],
              ["Marca y modelo", `${modeloEquipo(q)}, serie ${q.serie}`],
              ["Horómetro", `${miles(ot.horometro ?? q.horometro)} h`],
              ["Técnico", ot.tecnico],
              ["Visita", `${fecha(ot.fecha)}, cierre ${c.hora}`],
              ["Encargo", q.mandante ? `Subcontrato de la ${MANDANTE.toLowerCase()}` : "Directo con el cliente"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.8rem] text-tinta-suave">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-7" aria-labelledby="inf-pauta">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="inf-pauta" className="font-bold">
              Pauta estándar de mantención
            </h2>
            <p className="text-[0.85rem] text-tinta-suave">{resumenOT(ot)}</p>
          </div>
          <table className="mt-2 w-full border-collapse text-[0.9rem]">
            <thead>
              <tr className="border-b border-linea text-left text-[0.8rem] text-tinta-suave">
                <th scope="col" className="w-7 py-2 pr-2 font-semibold">
                  N°
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Punto revisado
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody>
              {PAUTA.map((p, i) => {
                const it = ot.items[p.id];
                return (
                  <tr key={p.id} className="border-b border-linea/60 align-top">
                    <td className="py-2.5 pr-2 text-tinta-suave tabular-nums">{i + 1}</td>
                    <td className="py-2.5 pr-3">
                      <b className="font-semibold">{p.t}</b>
                      {p.id === "horometro" && ot.horometro !== undefined && <span className="tabular-nums">: {miles(ot.horometro)} h</span>}
                      {it?.nota && <span className="block text-[0.85rem] text-tinta-suave">{it.nota}</span>}
                    </td>
                    <td className="py-2.5 text-right">
                      {it?.r && <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.8rem] font-semibold whitespace-nowrap", TONO[it.r])}>{RESULTADO[it.r]}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-7" aria-labelledby="inf-obs">
          <h2 id="inf-obs" className="font-bold">
            Observaciones
          </h2>
          <p className="mt-1.5 leading-relaxed whitespace-pre-line">{ot.observaciones.trim() || "Sin observaciones."}</p>
        </section>

        {ot.fotos.length > 0 && (
          <section className="mt-7" aria-labelledby="inf-fotos">
            <h2 id="inf-fotos" className="font-bold">
              Fotos de la visita
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ot.fotos.map((f, i) => (
                <li key={i}>
                  <img src={srcFoto(f)} alt={`Foto ${i + 1} de la visita`} className="aspect-[4/3] w-full rounded-[3px] object-cover" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8 grid gap-6 sm:grid-cols-2" aria-label="Firmas">
          {[
            [ot.firmaTecnico, ot.tecnico, "Técnico, INECSO Ingeniería"],
            [ot.firmaRecibe, ot.recibe.nombre, `Recibe conforme${ot.recibe.cargo ? `, ${ot.recibe.cargo}` : ""}`],
          ].map(([f, n, r], i) => (
            <figure key={i}>
              <FirmaVista firma={f as typeof ot.firmaTecnico} className="aspect-[10/3] w-full max-w-xs" />
              <figcaption className="border-t border-tinta pt-1.5 text-[0.88rem]">
                <b className="block">{n as string}</b>
                <span className="text-tinta-suave">{r as string}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <footer className="mt-8 border-t border-linea pt-3 text-[0.78rem] text-tinta-suave">
          Enviado a {c.enviadoA.join(" y ")} el {fecha(c.fecha)} a las {c.hora}. Informe generado por el portal de INECSO. Datos de ejemplo.
        </footer>
      </article>

      {verComentarios && (
        <Panel titulo={`Comentarios entre INECSO y la ${MANDANTE.toLowerCase()}`} className="mx-auto mt-4 max-w-4xl print:hidden">
          <p className="mt-1 text-[0.82rem] text-tinta-suave">El cliente no ve esta conversación.</p>
          {ot.comentarios.length > 0 && (
            <ul className="mt-4 grid gap-3">
              <AnimatePresence initial={false}>
                {ot.comentarios.map((k, i) => (
                  <motion.li key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <MessageSquare className={cn("mt-0.5 size-4 shrink-0", k.autor === "mandante" ? "text-cianotipo" : "text-energia-osc")} aria-hidden="true" />
                    <p>
                      <span className="text-[0.82rem] text-tinta-suave">
                        <b className="text-tinta">{ROL_NOMBRE[k.autor]}</b>, {fecha(k.fecha)}
                      </span>
                      <span className="block">{k.texto}</span>
                    </p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
          {puedeComentar && (
            <form onSubmit={comentar} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="coment">
                Comentario
              </label>
              <input
                id="coment"
                className="campo py-2.5"
                value={texto}
                onChange={(ev) => setTexto(ev.target.value)}
                placeholder={sesion.rol === "mandante" ? "Escriba un comentario para INECSO" : `Responda a la ${MANDANTE.toLowerCase()}`}
              />
              <button type="submit" className="btn btn-azul shrink-0 py-2.5" disabled={!texto.trim()}>
                Comentar
              </button>
            </form>
          )}
        </Panel>
      )}
    </PortalShell>
  );
}
