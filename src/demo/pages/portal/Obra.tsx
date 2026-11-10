import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CalendarPlus, Check, ChevronsRight, Download, FileText, Lock, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ETAPAS, MANDANTE, clienteNombre, fecha } from "./datos";
import { useStore } from "../../store";
import { avanzarEtapa, siguienteEtapa, usePortal, ve } from "./estado";
import { PortalShell } from "./Shell";
import { CurvaS } from "./CurvaS";
import { BitacoraDialog } from "./Formularios";
import { Etiqueta, Vacio } from "./ui";
import { PublicarWeb } from "./PublicarWeb";

export function PortalObra({ id }: { id: string }) {
  const { e, hoy, sesion, hacer } = usePortal();
  const { toast } = useStore();
  const [bitacora, setBitacora] = useState(false);
  const o = e.obras.find((x) => x.id === id);
  const admin = sesion.rol === "inecso";

  if (!o || !ve(sesion, o)) {
    return (
      <PortalShell>
        <a href="#/portal/obras" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-cianotipo hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Obras
        </a>
        <div className="mt-6 flex max-w-xl items-start gap-3 rounded-md bg-blanco p-5 ring-1 ring-linea/70">
          <Lock className="mt-0.5 size-5 shrink-0 text-tinta-suave" aria-hidden="true" />
          <p>
            <b className="block">{o ? "Este perfil no ve esta obra" : "No existe esta obra"}</b>
            <span className="text-tinta-suave">
              {o ? "Cada perfil ve solo lo que le corresponde. Cambie de perfil arriba para verla." : "Puede que se haya borrado al reiniciar la demo."}
            </span>
          </p>
        </div>
      </PortalShell>
    );
  }

  const lista = o.avance >= 100;
  const sig = siguienteEtapa(o);
  const avisados = `${clienteNombre(o.clienteId)}${o.mandante ? ` y la ${MANDANTE}` : ""}`;

  return (
    <PortalShell>
      <a href="#/portal/obras" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-cianotipo hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {sesion.rol === "cliente" ? "Sus obras" : "Obras"}
      </a>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.85rem] text-tinta-suave tabular-nums">
            <span>
              {o.codigo}. {sesion.rol !== "cliente" && `${clienteNombre(o.clienteId)}, `}
              {o.lugar}. Inicio {fecha(o.inicio)}
            </span>
            {sesion.rol === "inecso" && o.mandante && <Etiqueta>Vía {MANDANTE.toLowerCase()}</Etiqueta>}
          </p>
          <h1 className="wdth-112 mt-1 text-[clamp(1.6rem,1.1rem+1.8vw,2.4rem)] leading-tight font-extrabold text-balance">{o.titulo}</h1>
        </div>
        <div className="flex items-end gap-5">
          <p className="flex items-baseline gap-1 leading-none">
            <NumberTicker value={o.avance} className="wdth-125 text-[3.6rem] font-extrabold text-cianotipo" />
            <span className="text-[1.5rem] font-bold text-cianotipo">%</span>
          </p>
          <p className="pb-1.5 text-[0.85rem] text-tinta-suave">
            {lista ? "Obra entregada" : "de avance"}
            <br />
            {lista ? fecha(o.entrega) : `entrega ${fecha(o.entrega)}`}
          </p>
        </div>
      </div>

      {/* stages */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="font-bold">
          Etapas <span className="font-normal text-tinta-suave">· {lista ? "obra entregada" : `en ${ETAPAS[o.etapa].toLowerCase()}`}</span>
        </h2>
        {admin && sig && (
          <button
            type="button"
            className="btn btn-linea px-3 py-1.5 text-[0.82rem] text-tinta"
            onClick={() => {
              hacer((s) => avanzarEtapa(s, o.id, hoy));
              toast(`${o.codigo} pasa a ${sig === "Entregada" ? "entregada" : sig}. ${avisados} lo ven en el portal.`);
            }}
          >
            <ChevronsRight className="size-4" aria-hidden="true" />
            {sig === "Entregada" ? "Marcar entregada" : `Pasar a ${sig}`}
          </button>
        )}
      </div>
      <ol className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Etapas de la obra">
        {ETAPAS.map((et, k) => {
          const hecho = k < o.etapa || lista;
          const actual = k === o.etapa && !lista;
          return (
            <li key={et} aria-current={actual ? "step" : undefined} className="min-w-0">
              <div className="h-1.5 overflow-hidden rounded-full bg-linea/50">
                <motion.div
                  className={cn("h-full origin-left", hecho ? "bg-tierra" : "bg-cianotipo")}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hecho ? 1 : actual ? 0.5 : 0 }}
                  transition={{ delay: 0.15 + k * 0.08, duration: 0.45 }}
                />
              </div>
              <p className={cn("mt-2 flex items-center gap-1 text-[0.82rem] leading-tight font-semibold", hecho ? "text-tierra" : actual ? "text-cianotipo" : "text-tinta-suave/70")}>
                {hecho && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
                <span className="truncate">{et}</span>
              </p>
              <p className="text-[0.75rem] text-tinta-suave">{hecho ? "Lista" : actual ? "En curso" : "Pendiente"}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-md bg-blanco p-5 ring-1 ring-linea/70 sm:p-6" aria-labelledby="cs-h">
          <h2 id="cs-h" className="font-bold">
            Avance real y planificado
          </h2>
          <div className="mt-4">
            <CurvaS plan={o.plan} real={o.real} />
          </div>
        </section>

        <section className="rounded-md bg-blanco p-5 ring-1 ring-linea/70 sm:p-6" aria-labelledby="eq-h">
          <div className="flex items-center justify-between gap-3">
            <h2 id="eq-h" className="font-bold">
              Equipo a cargo
            </h2>
            {sesion.rol === "cliente" && (
              <button
                type="button"
                className="btn btn-azul px-3.5 py-2 text-[0.85rem]"
                onClick={() => toast("Solicitud de visita enviada al jefe de proyecto. Le confirmará la fecha por correo. (Demo: no se envió nada.)")}
              >
                <CalendarPlus className="size-4" aria-hidden="true" />
                Solicitar visita
              </button>
            )}
          </div>
          <ul className="mt-4 grid gap-3">
            {o.equipo.map((p) => (
              <li key={p.n} className="flex items-center gap-3">
                <span className="wdth-87 grid size-10 shrink-0 place-items-center rounded-full bg-grafito text-[0.82rem] font-bold text-blanco">{p.ini}</span>
                <span>
                  <b className="block text-[0.95rem]">{p.n}</b>
                  <span className="text-[0.85rem] text-tinta-suave">{p.r}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.82rem] text-tinta-suave">Ven esta obra: INECSO, {clienteNombre(o.clienteId)}{o.mandante ? ` y la ${MANDANTE}` : ""}.</p>
        </section>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-md bg-blanco p-5 ring-1 ring-linea/70 sm:p-6" aria-labelledby="bi-h">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="bi-h" className="font-bold">
              Bitácora de terreno
            </h2>
            {admin && !lista && (
              <button type="button" className="btn btn-linea px-3 py-1.5 text-[0.82rem] text-tinta" onClick={() => setBitacora(true)}>
                <NotebookPen className="size-4" aria-hidden="true" />
                Agregar entrada
              </button>
            )}
          </div>
          <ol className="relative mt-5 grid gap-6 pl-6">
            <span className="absolute top-1 bottom-1 left-[5px] w-px bg-linea" aria-hidden="true" />
            <AnimatePresence initial={false}>
              {o.bitacora.map((b, i) => (
                <motion.li
                  key={`${o.bitacora.length - i}-${b.d}`}
                  layout="position"
                  className="relative"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + Math.min(i, 5) * 0.06 }}
                >
                  <span className={cn("absolute top-1.5 -left-6 size-[11px] rounded-full ring-4 ring-blanco", i === 0 ? "bg-energia" : "bg-linea")} aria-hidden="true" />
                  <p className="flex flex-wrap items-baseline gap-x-3 text-[0.82rem] text-tinta-suave">
                    <time dateTime={b.d} className="font-semibold text-tinta tabular-nums">
                      {fecha(b.d)}
                    </time>
                    {b.q}
                  </p>
                  <p className="mt-1 max-w-3xl leading-relaxed">{b.t}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </section>

        <section className="rounded-md bg-blanco p-5 ring-1 ring-linea/70 sm:p-6" aria-labelledby="doc-h">
          <h2 id="doc-h" className="font-bold">
            Documentos
          </h2>
          {o.docs.length === 0 && <Vacio>Todavía no hay documentos. Aparecen aquí cuando INECSO los sube.</Vacio>}
          <ul className="mt-3 divide-y divide-linea/60">
            {o.docs.map((d) => (
              <li key={d.n}>
                <button
                  type="button"
                  onClick={() => toast(`En la web real aquí se abre o descarga el ${d.f}. En la demo no hay archivos.`)}
                  className="group flex w-full items-center gap-3 py-3 text-left"
                >
                  <FileText className="size-5 shrink-0 text-falla/80" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.93rem] font-semibold group-hover:text-cianotipo">
                      {d.n}
                      {d.nuevo && <span className="ml-2 rounded-full bg-energia px-1.5 py-0.5 align-middle text-[0.68rem] font-bold text-grafito">Nuevo</span>}
                    </span>
                    <span className="text-[0.8rem] text-tinta-suave tabular-nums">
                      {d.f}, {fecha(d.d)}
                    </span>
                  </span>
                  <Download className="size-4 shrink-0 text-tinta-suave opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {admin && <PublicarWeb o={o} />}
      <p className="mt-6 text-[0.82rem] text-tinta-suave">Obra, fechas, documentos y equipo de ejemplo.</p>
      <BitacoraDialog abierto={bitacora} onCerrar={() => setBitacora(false)} obraId={o.id} />
    </PortalShell>
  );
}
