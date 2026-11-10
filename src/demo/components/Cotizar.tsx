import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Gauge, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIPOS_TRABAJO, type TipoTrabajo } from "@/data/inecso";
import { useStore } from "../store";

type Urgencia = "falla" | "semanas" | "plan";

interface Datos {
  tipo?: TipoTrabajo;
  comuna: string;
  urgencia: Urgencia;
  kva: string;
  mensaje: string;
  archivos: string[];
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
}

const PASOS = ["Qué necesita", "Detalles", "Contacto"];
const URG: { id: Urgencia; t: string }[] = [
  { id: "falla", t: "Es una falla: lo antes posible" },
  { id: "semanas", t: "En las próximas semanas" },
  { id: "plan", t: "Estoy planificando" },
];

const correoOk = (s: string) => /^\S+@\S+\.\S+$/.test(s.trim());

export function Cotizar() {
  const { borrador, setBorrador } = useStore();
  const [paso, setPaso] = useState(0);
  const [dir, setDir] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [intento, setIntento] = useState(false);
  const [d, setD] = useState<Datos>(() => ({
    tipo: borrador.tipo,
    comuna: "",
    urgencia: "semanas",
    kva: borrador.kva ? String(borrador.kva) : "",
    mensaje: borrador.mensaje ?? "",
    archivos: [],
    nombre: "",
    empresa: "",
    correo: "",
    telefono: "",
  }));
  const deEstimacion = useRef(Boolean(borrador.kva));
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // the draft is consumed once
    if (borrador.tipo || borrador.mensaje) setBorrador({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => setD((x) => ({ ...x, [k]: v }));

  const errores = (p: number): string[] => {
    const e: string[] = [];
    if (p === 0 && !d.tipo) e.push("tipo");
    if (p === 1) {
      if (!d.comuna.trim()) e.push("comuna");
      if (d.mensaje.trim().length < 10) e.push("mensaje");
    }
    if (p === 2) {
      if (!d.nombre.trim()) e.push("nombre");
      if (!correoOk(d.correo)) e.push("correo");
    }
    return e;
  };
  const err = intento ? errores(paso) : [];
  const bad = (k: string) => err.includes(k);

  const siguiente = () => {
    const e = errores(paso);
    if (e.length) {
      setIntento(true);
      requestAnimationFrame(() => caja.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setIntento(false);
    if (paso === 2) {
      setEnviado(true);
      return;
    }
    navego.current = true;
    setDir(1);
    setPaso(paso + 1);
  };
  const atras = () => {
    navego.current = true;
    setIntento(false);
    setDir(-1);
    setPaso(Math.max(0, paso - 1));
  };

  // after the user moves between steps, focus goes to the new step's heading (once it has animated in)
  const navego = useRef(false);
  const pasoActual = useRef(0);
  pasoActual.current = paso;
  const enfocarPaso = (p: number) => {
    if (!navego.current || p !== pasoActual.current) return;
    caja.current?.querySelector<HTMLElement>(`[data-paso="${p}"] h3`)?.focus({ preventScroll: true });
    navego.current = false;
  };

  const tipoT = TIPOS_TRABAJO.find((t) => t.id === d.tipo)?.t;

  if (enviado) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-md bg-blanco p-6 ring-1 ring-linea/70 sm:p-8" role="status">
        <motion.span
          className="grid size-12 place-items-center rounded-full bg-tierra text-blanco"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.1 }}
        >
          <Check className="size-6" aria-hidden="true" />
        </motion.span>
        <h3 className="wdth-112 mt-5 text-[1.6rem] font-extrabold">Solicitud lista, {d.nombre.split(" ")[0]}.</h3>
        <p className="mt-2 text-tinta-suave">
          En la web real llega al correo de INECSO y le responde quien corresponda, dentro del día hábil. <b className="text-tinta">Esta demo no envía nada.</b>
        </p>
        <dl className="mt-6 grid gap-x-6 gap-y-3 rounded-md bg-papel p-5 text-[0.92rem] sm:grid-cols-2">
          <div><dt className="text-tinta-suave">Trabajo</dt><dd className="font-semibold">{tipoT}</dd></div>
          <div><dt className="text-tinta-suave">Lugar</dt><dd className="font-semibold">{d.comuna}</dd></div>
          <div><dt className="text-tinta-suave">Plazo</dt><dd className="font-semibold">{URG.find((u) => u.id === d.urgencia)?.t}</dd></div>
          {d.kva && <div><dt className="text-tinta-suave">Potencia estimada</dt><dd className="font-semibold">{d.kva} kVA</dd></div>}
          <div className="sm:col-span-2"><dt className="text-tinta-suave">Contacto</dt><dd className="font-semibold">{[d.nombre, d.empresa, d.correo, d.telefono].filter(Boolean).join(", ")}</dd></div>
        </dl>
        <button
          type="button"
          className="btn btn-linea mt-6 text-tinta"
          onClick={() => {
            setEnviado(false);
            setPaso(0);
            setD((x) => ({ ...x, tipo: undefined, mensaje: "", kva: "", archivos: [] }));
          }}
        >
          Hacer otra solicitud
        </button>
      </motion.div>
    );
  }

  return (
    <div ref={caja} className="overflow-hidden rounded-md bg-blanco ring-1 ring-linea/70">
      {/* progress */}
      <div className="border-b border-linea/60 px-5 pt-5 pb-4 sm:px-7">
        <ol className="flex items-center gap-2 text-[0.85rem]">
          {PASOS.map((p, i) => (
            <li key={p} className="flex flex-1 items-center gap-2" aria-current={i === paso ? "step" : undefined}>
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-[0.75rem] font-bold transition-colors",
                  i < paso ? "bg-tierra text-blanco" : i === paso ? "bg-cianotipo text-blanco" : "bg-papel-2 text-tinta-suave",
                )}
              >
                {i < paso ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span className={cn("hidden font-semibold sm:inline", i === paso ? "text-tinta" : "text-tinta-suave")}>{p}</span>
              {i < PASOS.length - 1 && (
                <span className="relative h-0.5 flex-1 overflow-hidden rounded bg-papel-2" aria-hidden="true">
                  <motion.span className="absolute inset-0 origin-left bg-tierra" initial={false} animate={{ scaleX: i < paso ? 1 : 0 }} transition={{ duration: 0.4 }} />
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[0.8rem] text-tinta-suave sm:hidden">
          Paso {paso + 1} de 3: {PASOS[paso]}
        </p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          siguiente();
        }}
        className="px-5 py-6 sm:px-7 sm:py-7"
      >
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={paso}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -20 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            onAnimationComplete={() => enfocarPaso(paso)}
            data-paso={paso}
          >
            {paso === 0 && (
              <fieldset>
                <legend className="contents">
                  <h3 tabIndex={-1} className="wdth-112 text-[1.35rem] font-extrabold outline-none">¿Qué necesita?</h3>
                </legend>
                {deEstimacion.current && d.kva && (
                  <p className="mt-3 flex items-center gap-2 rounded-[3px] bg-energia/20 px-3 py-2 text-[0.88rem]">
                    <Gauge className="size-4 text-energia-osc" aria-hidden="true" />
                    Viene de la estimación: grupo de <b>{d.kva} kVA</b>.
                  </p>
                )}
                <div className="mt-4 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-invalid={bad("tipo")}>
                  {TIPOS_TRABAJO.map((t) => (
                    <label
                      key={t.id}
                      className={cn(
                        "relative flex cursor-pointer flex-col rounded-[4px] p-4 ring-1 transition-[background-color,box-shadow]",
                        d.tipo === t.id ? "bg-cianotipo/[0.06] ring-2 ring-cianotipo" : "ring-linea hover:bg-papel",
                        bad("tipo") && "ring-falla",
                      )}
                    >
                      <input type="radio" name="tipo" value={t.id} checked={d.tipo === t.id} onChange={() => set("tipo", t.id)} className="sr-only" aria-invalid={bad("tipo")} />
                      <span className="font-semibold">{t.t}</span>
                      <span className="text-[0.85rem] text-tinta-suave">{t.d}</span>
                      {d.tipo === t.id && (
                        <motion.span layoutId="tipo-ok" className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-cianotipo text-blanco">
                          <Check className="size-3" aria-hidden="true" />
                        </motion.span>
                      )}
                    </label>
                  ))}
                </div>
                {bad("tipo") && <Error>Elija el tipo de trabajo.</Error>}
              </fieldset>
            )}

            {paso === 1 && (
              <div className="grid gap-5">
                <h3 tabIndex={-1} className="wdth-112 text-[1.35rem] font-extrabold outline-none">Cuéntenos de la obra</h3>
                <Campo label="Comuna o ciudad de la obra" error={bad("comuna") ? "Indique dónde es la obra." : undefined}>
                  <input className="campo" value={d.comuna} onChange={(e) => set("comuna", e.target.value)} aria-invalid={bad("comuna")} autoComplete="address-level2" placeholder="Por ejemplo, Quilicura" />
                </Campo>
                <fieldset>
                  <legend className="mb-2 text-[0.92rem] font-semibold">¿Para cuándo?</legend>
                  <div className="flex flex-wrap gap-2">
                    {URG.map((u) => (
                      <label key={u.id} className={cn("cursor-pointer rounded-full px-3.5 py-2 text-[0.88rem] ring-1 transition-colors", d.urgencia === u.id ? "bg-grafito text-blanco ring-grafito" : "ring-linea hover:bg-papel")}>
                        <input type="radio" name="urgencia" className="sr-only" checked={d.urgencia === u.id} onChange={() => set("urgencia", u.id)} />
                        {u.t}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {(d.tipo === "grupo" || d.tipo === "mantencion") && (
                  <Campo label="Potencia del grupo (kVA), si la sabe">
                    <input className="campo max-w-[12rem]" inputMode="numeric" value={d.kva} onChange={(e) => set("kva", e.target.value.replace(/[^\d]/g, ""))} placeholder="Por ejemplo, 60" />
                  </Campo>
                )}
                <Campo label="¿Qué necesita?" error={bad("mensaje") ? "Cuéntenos un poco más (al menos 10 caracteres)." : undefined}>
                  <textarea className="campo min-h-[8rem] resize-y" value={d.mensaje} onChange={(e) => set("mensaje", e.target.value)} aria-invalid={bad("mensaje")} placeholder="Qué equipo, qué falla o qué obra, y cualquier dato que ayude." />
                </Campo>
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] px-3 py-2 text-[0.9rem] font-semibold text-cianotipo ring-1 ring-linea hover:bg-papel">
                    <Paperclip className="size-4" aria-hidden="true" />
                    Adjuntar planos o fotos
                    <input type="file" multiple className="sr-only" onChange={(e) => set("archivos", Array.from(e.target.files ?? []).map((f) => f.name))} />
                  </label>
                  <p className="mt-1.5 text-[0.8rem] text-tinta-suave">{d.archivos.length ? d.archivos.join(", ") : "Opcional. En la demo los archivos no salen de su equipo."}</p>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <h3 tabIndex={-1} className="wdth-112 text-[1.35rem] font-extrabold outline-none sm:col-span-2">¿A quién le respondemos?</h3>
                <Campo label="Nombre" error={bad("nombre") ? "Falta su nombre." : undefined}>
                  <input className="campo" value={d.nombre} onChange={(e) => set("nombre", e.target.value)} aria-invalid={bad("nombre")} autoComplete="name" />
                </Campo>
                <Campo label="Empresa (opcional)">
                  <input className="campo" value={d.empresa} onChange={(e) => set("empresa", e.target.value)} autoComplete="organization" />
                </Campo>
                <Campo label="Correo" error={bad("correo") ? "Revise el correo: debe tener la forma nombre@empresa.cl." : undefined}>
                  <input className="campo" type="email" value={d.correo} onChange={(e) => set("correo", e.target.value)} aria-invalid={bad("correo")} autoComplete="email" />
                </Campo>
                <Campo label="Teléfono (opcional)">
                  <input className="campo" type="tel" value={d.telefono} onChange={(e) => set("telefono", e.target.value)} autoComplete="tel" placeholder="+56 9" />
                </Campo>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-linea/60 pt-5">
          {paso > 0 ? (
            <button type="button" onClick={atras} className="btn btn-linea text-tinta">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Atrás
            </button>
          ) : (
            <span className="text-[0.8rem] text-tinta-suave">3 pasos, menos de un minuto.</span>
          )}
          <button type="submit" className="btn btn-energia px-6">
            {paso === 2 ? "Enviar solicitud" : "Continuar"}
            {paso < 2 && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </form>
    </div>
  );
}

function Campo({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.92rem] font-semibold">{label}</span>
      {children}
      {error && <Error>{error}</Error>}
    </label>
  );
}

function Error({ children }: { children: React.ReactNode }) {
  return (
    <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 flex items-center gap-1.5 text-[0.85rem] font-medium text-falla">
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </motion.span>
  );
}
