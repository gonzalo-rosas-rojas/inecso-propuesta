import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowLeft, Camera, ClipboardCheck, ImagePlus, Lock, Play, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMG, MANDANTE, PAUTA, RESULTADO, TIPO_OT, clienteNombre, fecha, miles, modeloEquipo, nombreEquipo, type ClaveImg, type Foto, type ItemId, type OT, type Resultado } from "./datos";
import { useStore } from "../../store";
import { go } from "../../router";
import { cerrarOT, destinatarios, editarOT, equipoDe, iniciarOT, usePortal, ve } from "./estado";
import { PortalShell } from "./Shell";
import { FirmaPad, hayFirma } from "./Firma";
import { ChipOT, Panel } from "./ui";

const FOTOS_DEMO: ClaveImg[] = ["grupoJaula", "desarmeMotor", "desarmeSala", "grupoMovil", "piping", "ducto", "hipot", "terraza"];
export const srcFoto = (f: Foto) => (f.tipo === "demo" ? IMG[f.clave] : f.url);

/** Read a photo from the device and shrink it to a JPEG data URL. Nothing leaves the browser. */
function leerFoto(file: File): Promise<string> {
  return new Promise((ok, mal) => {
    const r = new FileReader();
    r.onerror = () => mal(r.error);
    r.onload = () => {
      const img = new Image();
      img.onerror = () => mal(new Error("imagen"));
      img.onload = () => {
        const k = Math.min(1, 900 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.72));
      };
      img.src = String(r.result);
    };
    r.readAsDataURL(file);
  });
}

function faltantes(ot: OT, horometroAnterior: number) {
  const f: { id: string; t: string }[] = [];
  for (const p of PAUTA) {
    const it = ot.items[p.id];
    if (!it?.r) f.push({ id: `it-${p.id}`, t: `${p.t}: falta el resultado` });
    else if (it.r === "atencion" && !it.nota?.trim()) f.push({ id: `it-${p.id}`, t: `${p.t}: explique en la nota qué requiere atención` });
  }
  if (ot.horometro === undefined || Number.isNaN(ot.horometro)) f.push({ id: "it-horometro", t: "Lectura de horómetro: falta el número" });
  else if (ot.horometro < horometroAnterior) f.push({ id: "it-horometro", t: `Lectura de horómetro: no puede ser menor que la anterior (${miles(horometroAnterior)} h)` });
  if (!hayFirma(ot.firmaTecnico)) f.push({ id: "firmas", t: "Falta la firma del técnico" });
  if (!ot.recibe.nombre.trim()) f.push({ id: "firmas", t: "Falta el nombre de quien recibe" });
  if (!hayFirma(ot.firmaRecibe)) f.push({ id: "firmas", t: "Falta la firma de quien recibe" });
  return f;
}

export function PortalOT({ id }: { id: string }) {
  const { e, hoy, sesion, hacer } = usePortal();
  const { toast } = useStore();
  const [intentado, setIntentado] = useState(false);
  const [galeria, setGaleria] = useState(false);
  const resumen = useRef<HTMLDivElement>(null);
  const ot = e.ots.find((o) => o.id === id);
  const q = ot && equipoDe(e, ot);
  const cerrada = ot?.estado === "cerrada";

  useEffect(() => {
    if (cerrada) go(`#/portal/informe/${id}`);
  }, [cerrada, id]);

  if (!ot || !q || !ve(sesion, q)) {
    return (
      <PortalShell>
        <a href="#/portal/mantenciones" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-cianotipo hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Mantenciones
        </a>
        <div className="mt-6 flex max-w-xl items-start gap-3 rounded-md bg-blanco p-5 ring-1 ring-linea/70">
          <Lock className="mt-0.5 size-5 shrink-0 text-tinta-suave" aria-hidden="true" />
          <p>
            <b className="block">{ot ? "Este perfil no ve esta orden de trabajo" : "No existe esta orden de trabajo"}</b>
            <span className="text-tinta-suave">{ot ? "Cambie de perfil arriba para verla." : "Puede que se haya borrado al reiniciar la demo."}</span>
          </p>
        </div>
      </PortalShell>
    );
  }

  if (cerrada) return null;

  const admin = sesion.rol === "inecso";
  const editable = admin && ot.estado === "abierta";
  const set = (patch: Partial<OT>) => hacer((s) => editarOT(s, ot.id, patch));
  const setItem = (k: ItemId, patch: { r?: Resultado; nota?: string }) => set({ items: { ...ot.items, [k]: { ...ot.items[k], ...patch } } });
  const hechos = PAUTA.filter((p) => ot.items[p.id]?.r).length;
  const para = destinatarios(q);
  const anterior = q.horometro;
  // once a close was attempted, the list of what is missing updates as the form is filled
  const errores = intentado ? faltantes(ot, anterior) : null;

  const cerrar = () => {
    if (faltantes(ot, anterior).length) {
      setIntentado(true);
      requestAnimationFrame(() => resumen.current?.focus());
      return;
    }
    hacer((s) => cerrarOT(s, ot.id, hoy));
    toast(q.mandante ? `Informe ${ot.id} enviado a la ${MANDANTE} y al cliente. Ya aparece en sus vistas.` : `Informe ${ot.id} enviado al cliente. Ya aparece en su vista.`);
    go(`#/portal/informe/${ot.id}`);
  };

  const subir = async (ev: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(ev.target.files ?? []).slice(0, 4);
    ev.target.value = "";
    const nuevas: Foto[] = [];
    for (const file of files) {
      try {
        nuevas.push({ tipo: "local", url: await leerFoto(file), nombre: file.name });
      } catch {
        toast(`No se pudo leer ${file.name}.`);
      }
    }
    if (nuevas.length) set({ fotos: [...ot.fotos, ...nuevas] });
  };

  return (
    <PortalShell>
      <a href="#/portal/mantenciones" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-cianotipo hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Mantenciones
      </a>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[0.88rem] text-tinta-suave tabular-nums">
            <span>
              {ot.id}. {TIPO_OT[ot.tipo]}
            </span>
            <ChipOT estado={ot.estado} />
          </p>
          <h1 className="wdth-112 mt-1 text-[clamp(1.6rem,1.1rem+1.8vw,2.3rem)] leading-tight font-extrabold">{nombreEquipo(q)}</h1>
          <p className="mt-1 text-tinta-suave">
            {modeloEquipo(q)}, serie {q.serie}. {clienteNombre(q.clienteId)}, {q.ubicacion}.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[0.86rem] sm:text-right">
          <dt className="text-tinta-suave">Fecha</dt>
          <dd className="font-semibold tabular-nums">{fecha(ot.fecha)}</dd>
          <dt className="text-tinta-suave">Técnico</dt>
          <dd className="font-semibold">{ot.tecnico}</dd>
          <dt className="text-tinta-suave">Informe para</dt>
          <dd className="font-semibold">{para.join(" y ")}</dd>
        </dl>
      </div>

      {ot.estado === "programada" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md bg-blanco p-5 ring-1 ring-linea/70">
          <p className="max-w-xl">
            <b className="block">Visita programada para el {fecha(ot.fecha)}</b>
            <span className="text-tinta-suave">
              {admin ? "Al llegar a terreno, inicie la orden para completar la pauta estándar." : "INECSO completará la pauta en terreno. El informe aparecerá aquí cuando cierre la orden."}
            </span>
          </p>
          {admin && (
            <button type="button" className="btn btn-azul" onClick={() => hacer((s) => iniciarOT(s, ot.id, hoy))}>
              <Play className="size-4" aria-hidden="true" />
              Iniciar en terreno
            </button>
          )}
        </div>
      )}
      {ot.estado === "abierta" && !admin && (
        <div className="mt-6 rounded-md bg-blanco p-5 ring-1 ring-linea/70">
          <b className="block">INECSO está en terreno</b>
          <span className="text-tinta-suave">
            Pauta: {hechos} de {PAUTA.length} puntos revisados. El informe aparecerá en su portal cuando el técnico cierre la orden.
          </span>
        </div>
      )}

      {admin && ot.estado === "abierta" && (
        <>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-linea/50">
              <motion.div className="h-full origin-left rounded-full bg-cianotipo" animate={{ scaleX: hechos / PAUTA.length }} transition={{ duration: 0.4 }} />
            </div>
            <span className="text-[0.85rem] font-semibold tabular-nums">
              {hechos} de {PAUTA.length}
            </span>
          </div>

          <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
            <Panel titulo="Pauta estándar de mantención preventiva">
              <p className="mt-1 text-[0.85rem] text-tinta-suave">La misma en cada visita y en cada equipo. Marque cada punto y agregue una nota si hace falta.</p>
              <ol className="mt-3 divide-y divide-linea/60">
                {PAUTA.map((p, i) => {
                  const it = ot.items[p.id] ?? {};
                  const mal = errores?.some((x) => x.id === `it-${p.id}`);
                  return (
                    <li key={p.id} id={`it-${p.id}`} className={cn("scroll-mt-28 py-4", mal && "rounded-[3px] bg-falla/5 px-2 -mx-2")}>
                      <fieldset>
                        <legend className="flex gap-2.5">
                          <span className="wdth-87 mt-px w-5 shrink-0 text-right font-bold text-tinta-suave tabular-nums">{i + 1}</span>
                          <span>
                            <b className="block leading-snug">{p.t}</b>
                            <span className="block text-[0.85rem] text-tinta-suave">{p.d}</span>
                          </span>
                        </legend>
                        <div className="mt-2.5 pl-7.5">
                          {p.id === "horometro" && (
                            <label className="mb-2.5 flex flex-wrap items-center gap-2 text-[0.88rem]">
                              <span className="relative w-36">
                                <input
                                  className="campo py-2 pr-8 tabular-nums"
                                  type="number"
                                  inputMode="numeric"
                                  min={anterior}
                                  value={ot.horometro ?? ""}
                                  aria-label="Lectura de horómetro, en horas"
                                  onChange={(ev) => set({ horometro: ev.target.value === "" ? undefined : Number(ev.target.value) })}
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-tinta-suave">h</span>
                              </span>
                              <span className="text-tinta-suave">Lectura anterior: {miles(anterior)} h</span>
                            </label>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {(Object.keys(RESULTADO) as Resultado[]).map((r) => (
                              <label
                                key={r}
                                className={cn(
                                  "cursor-pointer rounded-[3px] px-3 py-1.5 text-[0.86rem] font-semibold ring-1 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-energia",
                                  it.r === r
                                    ? r === "ok"
                                      ? "bg-tierra text-blanco ring-tierra"
                                      : r === "atencion"
                                        ? "bg-energia text-grafito ring-energia-osc/40"
                                        : "bg-tinta-suave text-blanco ring-tinta-suave"
                                    : "bg-blanco text-tinta-suave ring-linea hover:text-tinta",
                                )}
                              >
                                <input type="radio" className="sr-only" name={`r-${p.id}`} checked={it.r === r} onChange={() => setItem(p.id, { r })} />
                                {RESULTADO[r]}
                              </label>
                            ))}
                          </div>
                          <input
                            className="campo mt-2 py-2 text-[0.9rem]"
                            placeholder={it.r === "atencion" ? "Qué requiere atención (obligatorio)" : "Nota (opcional)"}
                            aria-label={`Nota sobre ${p.t.toLowerCase()}`}
                            value={it.nota ?? ""}
                            onChange={(ev) => setItem(p.id, { nota: ev.target.value })}
                          />
                        </div>
                      </fieldset>
                    </li>
                  );
                })}
                <li className="py-4">
                  <label className="grid gap-1.5">
                    <span className="flex gap-2.5">
                      <span className="wdth-87 w-5 shrink-0 text-right font-bold text-tinta-suave tabular-nums">{PAUTA.length + 1}</span>
                      <b>Observaciones</b>
                    </span>
                    <textarea
                      className="campo ml-7.5 min-h-28 w-[calc(100%-1.875rem)]"
                      value={ot.observaciones}
                      onChange={(ev) => set({ observaciones: ev.target.value })}
                      placeholder="Estado general, trabajos hechos, repuestos cambiados y recomendaciones."
                    />
                  </label>
                </li>
              </ol>
            </Panel>

            <div className="grid gap-4">
              <Panel titulo={`Fotos (${ot.fotos.length})`}>
                <ul className="mt-3 grid grid-cols-3 gap-2">
                  <AnimatePresence initial={false}>
                    {ot.fotos.map((f, i) => (
                      <motion.li key={(f.tipo === "demo" ? f.clave : f.url.slice(-24)) + i} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="group relative">
                        <img src={srcFoto(f)} alt={f.tipo === "demo" ? "Foto de ejemplo de la visita" : `Foto ${f.nombre}`} className="aspect-square w-full rounded-[3px] object-cover" />
                        <button
                          type="button"
                          onClick={() => set({ fotos: ot.fotos.filter((_, k) => k !== i) })}
                          className="absolute top-1 right-1 grid size-7 place-items-center rounded bg-grafito/75 text-blanco hover:bg-grafito"
                          aria-label="Quitar foto"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-linea px-3 py-2 text-[0.85rem] text-tinta" aria-expanded={galeria} onClick={() => setGaleria((v) => !v)}>
                    <ImagePlus className="size-4" aria-hidden="true" />
                    Foto de ejemplo
                  </button>
                  <label className="btn btn-linea cursor-pointer px-3 py-2 text-[0.85rem] text-tinta has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-energia">
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={subir} />
                    <Camera className="size-4" aria-hidden="true" />
                    Desde este equipo
                  </label>
                </div>
                {galeria && (
                  <ul className="mt-3 grid grid-cols-4 gap-1.5" aria-label="Fotos de ejemplo">
                    {FOTOS_DEMO.map((k) => (
                      <li key={k}>
                        <button
                          type="button"
                          onClick={() => {
                            set({ fotos: [...ot.fotos, { tipo: "demo", clave: k }] });
                            setGaleria(false);
                          }}
                          className="block w-full overflow-hidden rounded-[3px] ring-1 ring-linea hover:ring-cianotipo"
                          aria-label="Agregar esta foto de ejemplo"
                        >
                          <img src={IMG[k]} alt="" className="aspect-square w-full object-cover" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-[0.78rem] text-tinta-suave">Demo: las fotos de su equipo se ven solo en este navegador; no se suben a ningún lado.</p>
              </Panel>

              <Panel titulo="Firmas" id="firmas" className="scroll-mt-28">
                <div className="mt-3 grid gap-5">
                  <FirmaPad etiqueta={`Técnico: ${ot.tecnico}`} nombre={ot.tecnico} valor={ot.firmaTecnico} onCambio={(f) => set({ firmaTecnico: f })} disabled={!editable} />
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <label className="grid min-w-0 gap-1.5">
                      <span className="text-[0.92rem] font-semibold">Recibe conforme</span>
                      <input className="campo py-2" value={ot.recibe.nombre} placeholder="Nombre" onChange={(ev) => set({ recibe: { ...ot.recibe, nombre: ev.target.value } })} />
                    </label>
                    <label className="grid min-w-0 gap-1.5">
                      <span className="text-[0.92rem] font-semibold">Cargo o empresa</span>
                      <input className="campo py-2" value={ot.recibe.cargo} placeholder="Ej.: Jefe de mantención" onChange={(ev) => set({ recibe: { ...ot.recibe, cargo: ev.target.value } })} />
                    </label>
                  </div>
                  <FirmaPad etiqueta="Firma de quien recibe" nombre={ot.recibe.nombre} valor={ot.firmaRecibe} onCambio={(f) => set({ firmaRecibe: f })} disabled={!editable} />
                </div>
              </Panel>

              <div className="rounded-md bg-grafito p-5 text-papel">
                <AnimatePresence>
                  {errores && errores.length > 0 && (
                    <motion.div
                      ref={resumen}
                      tabIndex={-1}
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden rounded-[3px] bg-falla/20 text-[0.88rem] ring-1 ring-falla/50 outline-none"
                    >
                      <p className="flex items-center gap-2 px-3 pt-3 font-semibold text-blanco">
                        <AlertTriangle className="size-4 shrink-0 text-energia" aria-hidden="true" />
                        Falta completar {errores.length === 1 ? "un punto" : `${errores.length} puntos`}
                      </p>
                      <ul className="grid gap-1 px-3 pt-1.5 pb-3 pl-9">
                        {errores.map((x, k) => (
                          <li key={k}>
                            <a href={`#${x.id}`} onClick={(ev) => { ev.preventDefault(); document.getElementById(x.id)?.scrollIntoView({ block: "start" }); }} className="text-papel/90 underline underline-offset-2 hover:text-blanco">
                              {x.t}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[0.9rem] text-papel/80">Al cerrar, el informe queda listo y se envía a {para.join(" y ")}.</p>
                <button type="button" className="btn btn-energia mt-3 w-full py-3.5" onClick={cerrar}>
                  <Send className="size-4" aria-hidden="true" />
                  Cerrar OT y enviar informe
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {ot.estado === "programada" && (
        <Panel titulo="Pauta que se completará en terreno" className="mt-4">
          <ol className="mt-3 grid gap-x-8 gap-y-2 text-[0.92rem] sm:grid-cols-2">
            {PAUTA.map((p, i) => (
              <li key={p.id} className="flex gap-2.5">
                <span className="wdth-87 w-5 shrink-0 text-right font-bold text-tinta-suave tabular-nums">{i + 1}</span>
                <span className="flex items-center gap-1.5">
                  <ClipboardCheck className="size-4 text-tinta-suave" aria-hidden="true" />
                  {p.t}
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      )}
      <p className="mt-6 text-[0.82rem] text-tinta-suave">Orden de trabajo, equipo y técnicos de ejemplo.</p>
    </PortalShell>
  );
}
