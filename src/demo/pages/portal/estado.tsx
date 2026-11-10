import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ETAPAS } from "@/data/inecso";
import {
  CLIENTES_PORTAL,
  MANDANTE,
  PISO_ETAPA,
  clienteNombre,
  codigoOT,
  curvaPlan,
  diasEntre,
  horaAhora,
  hoyIso,
  semilla,
  pubDe,
  type Acceso,
  type Dispositivo,
  type Equipo,
  type EstadoPortal,
  type ObraP,
  type OT,
  type PubWeb,
  type Rol,
} from "@/data/portal-demo";

// Demo state lives in localStorage. Every access is wrapped: with storage blocked (private mode, sandboxed frame)
// the portal still works, it just forgets on reload.

const KEY = "inecso-portal-demo-v1";
const KEY_SESION = "inecso-portal-sesion-v1";

function leer<T>(key: string): T | null {
  try {
    const s = window.localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}

function escribir(key: string, valor: string) {
  try {
    window.localStorage.setItem(key, valor);
    return true;
  } catch {
    return false;
  }
}

function serializar(e: EstadoPortal, sinFotosLocales = false) {
  if (!sinFotosLocales) return JSON.stringify(e);
  return JSON.stringify({ ...e, ots: e.ots.map((o) => ({ ...o, fotos: o.fotos.filter((f) => f.tipo === "demo") })) });
}

function valido(e: unknown): e is EstadoPortal {
  const x = e as EstadoPortal | null;
  return (
    !!x &&
    x.v === 2 &&
    Array.isArray(x.obras) &&
    Array.isArray(x.equipos) &&
    Array.isArray(x.ots) &&
    !!x.sig &&
    !!x.web &&
    typeof x.web === "object" &&
    !Array.isArray(x.web) &&
    Array.isArray(x.accesos)
  );
}

/**
 * A saved state from before the website publications and the access log (v1) keeps its jobs, equipment and work
 * orders, and gets the new parts from the seed. Anything else unreadable falls back to the seed.
 */
function cargar(g: unknown, hoy: string): EstadoPortal | null {
  if (valido(g)) return g;
  const x = g as { v?: number; obras?: unknown; equipos?: unknown; ots?: unknown; sig?: unknown } | null;
  if (!x || x.v !== 1 || !Array.isArray(x.obras) || !Array.isArray(x.equipos) || !Array.isArray(x.ots) || !x.sig) return null;
  const s = semilla(hoy);
  const obras = (x.obras as ObraP[]).map((o) => (o.fotos ? o : { ...o, fotos: s.obras.find((k) => k.id === o.id && k.codigo === o.codigo)?.fotos }));
  const m = { ...(x as unknown as EstadoPortal), v: 2 as const, obras, web: {}, accesos: s.accesos };
  return valido(m) ? m : null;
}

/** Phone or computer, from the screen: only to label the access log. */
function dispositivo(): Dispositivo {
  try {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches ? "Celular" : "Computador";
  } catch {
    return "Computador";
  }
}

const MAX_ACCESOS = 40;

export interface Sesion {
  rol: Rol;
  clienteId: string;
}

const SESION_INICIAL: Sesion = { rol: "cliente", clienteId: "maipo" };

// Inside an iframe (the proposal's phone preview or its full-screen demo) the portal always starts as the first client,
// so the proposal shows what a client sees regardless of the role last used in the demo tab.
const embebida = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

/** In an embedded preview, "#/portal/gestion?como=inecso" shows the page as that role (the proposal steps through roles). */
function rolPedido(): Rol | null {
  if (!embebida) return null;
  const m = /[?&]como=(inecso|mandante|cliente)\b/.exec(window.location.hash);
  return m ? (m[1] as Rol) : null;
}

export const ROL_NOMBRE: Record<Rol, string> = { inecso: "INECSO", mandante: MANDANTE, cliente: "Cliente" };

interface Ctx {
  e: EstadoPortal;
  hoy: string;
  sesion: Sesion;
  entrar: (s: Sesion) => void;
  hacer: (fn: (e: EstadoPortal) => EstadoPortal) => void;
  reiniciar: () => void;
  /** who is looking, as a name: INECSO, Empresa mandante or the client's name */
  quien: string;
}

const C = createContext<Ctx | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const hoy = useMemo(hoyIso, []);
  const [e, setE] = useState<EstadoPortal>(() => {
    return cargar(leer<unknown>(KEY), hoy) ?? semilla(hoy);
  });
  const [sesion, setSesion] = useState<Sesion>(() => {
    if (embebida) {
      const r = rolPedido();
      return r ? { ...SESION_INICIAL, rol: r } : SESION_INICIAL;
    }
    const s = leer<Sesion>(KEY_SESION);
    return s && (s.rol === "inecso" || s.rol === "mandante" || s.rol === "cliente") && CLIENTES_PORTAL.some((c) => c.id === s.clienteId) ? s : SESION_INICIAL;
  });
  const ultimo = useRef<string | null>(null);

  useEffect(() => {
    const s = serializar(e);
    if (s === ultimo.current) return;
    ultimo.current = s;
    // If the quota is full (photos from the device are large), keep everything but those photos.
    if (!escribir(KEY, s)) escribir(KEY, serializar(e, true));
  }, [e]);

  // Keep other tabs and the proposal's previews in step with changes made here.
  useEffect(() => {
    const on = (ev: StorageEvent) => {
      if (ev.key !== KEY) return;
      const g = cargar(leer<unknown>(KEY), hoyIso());
      if (g) {
        ultimo.current = ev.newValue;
        setE(g);
      }
    };
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);

  useEffect(() => {
    if (!embebida) return;
    const on = () => {
      const r = rolPedido();
      if (r) setSesion((s) => (s.rol === r ? s : { ...s, rol: r }));
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  // Every entry (the login, or switching profile at the top of the portal) is written to the access log.
  const entrar = useCallback((s: Sesion) => {
    setSesion(s);
    if (!embebida) escribir(KEY_SESION, JSON.stringify(s));
    const a: Acceso = {
      quien: "Usted, en esta demo",
      entidad: s.rol === "cliente" ? clienteNombre(s.clienteId) : ROL_NOMBRE[s.rol],
      rol: s.rol,
      fecha: hoyIso(),
      hora: horaAhora(),
      disp: dispositivo(),
      demo: true,
    };
    setE((prev) => ({ ...prev, accesos: [a, ...prev.accesos].slice(0, MAX_ACCESOS) }));
  }, []);

  const hacer = useCallback((fn: (e: EstadoPortal) => EstadoPortal) => setE((prev) => fn(prev)), []);
  const reiniciar = useCallback(() => setE(semilla(hoyIso())), []);

  const quien = sesion.rol === "cliente" ? clienteNombre(sesion.clienteId) : ROL_NOMBRE[sesion.rol];

  return <C.Provider value={{ e, hoy, sesion, entrar, hacer, reiniciar, quien }}>{children}</C.Provider>;
}

export function usePortal() {
  const c = useContext(C);
  if (!c) throw new Error("usePortal outside PortalProvider");
  return c;
}

// ---------- who sees what ----------

export function ve(s: Sesion, x: { clienteId: string; mandante: boolean }) {
  return s.rol === "inecso" || (s.rol === "mandante" && x.mandante) || (s.rol === "cliente" && x.clienteId === s.clienteId);
}

/** Everything the current role may see. */
export function useVisible() {
  const { e, sesion } = usePortal();
  return useMemo(() => {
    const obras = e.obras.filter((o) => ve(sesion, o));
    const equipos = e.equipos.filter((q) => ve(sesion, q));
    const ids = new Set(equipos.map((q) => q.id));
    const ots = e.ots.filter((o) => ids.has(o.equipoId));
    return { obras, equipos, ots };
  }, [e, sesion]);
}

export const equipoDe = (e: EstadoPortal, ot: OT) => e.equipos.find((q) => q.id === ot.equipoId);

/** Who a closed report goes to: the client always, and the main contractor when it subcontracted the equipment. */
export const destinatarios = (q: Equipo) => (q.mandante ? [MANDANTE, clienteNombre(q.clienteId)] : [clienteNombre(q.clienteId)]);

// ---------- actions (pure: state in, state out) ----------

const conObra = (e: EstadoPortal, id: string, fn: (o: ObraP) => ObraP): EstadoPortal => ({ ...e, obras: e.obras.map((o) => (o.id === id ? fn(o) : o)) });
const conOT = (e: EstadoPortal, id: string, fn: (o: OT) => OT): EstadoPortal => ({ ...e, ots: e.ots.map((o) => (o.id === id ? fn(o) : o)) });

/** Set the current week's real progress. */
function conAvance(o: ObraP, avance: number): ObraP {
  const real = o.real.length ? [...o.real] : [0];
  real[real.length - 1] = Math.max(real[real.length - 1], avance);
  return { ...o, avance, real };
}

export interface NuevaObra {
  titulo: string;
  clienteId: string;
  lugar: string;
  entrega: string;
  mandante: boolean;
}

export function crearObra(e: EstadoPortal, n: NuevaObra, hoy: string): EstadoPortal {
  const semanas = Math.max(2, Math.ceil(diasEntre(hoy, n.entrega) / 7));
  const o: ObraP = {
    id: siguienteObraId(e),
    clienteId: n.clienteId,
    mandante: n.mandante,
    titulo: n.titulo,
    lugar: n.lugar,
    codigo: `OB-${e.sig.obra}`,
    etapa: 0,
    avance: 0,
    inicio: hoy,
    entrega: n.entrega,
    plan: curvaPlan(semanas),
    real: [0],
    bitacora: [{ d: hoy, q: "INECSO", t: n.mandante ? "Obra creada en el portal. La ven el cliente y la Empresa mandante." : "Obra creada en el portal. La ve el cliente." }],
    docs: [],
    equipo: [{ n: "Jefe de proyecto", r: "Responde sus consultas técnicas y de plazos", ini: "JP" }],
  };
  return { ...e, obras: [o, ...e.obras], sig: { ...e.sig, obra: e.sig.obra + 1 } };
}

export const siguienteObraId = (e: EstadoPortal) => String(Math.max(0, ...e.obras.map((x) => Number(x.id) || 0)) + 1);

/** The label of what advancing does next, or null when the job is delivered. */
export function siguienteEtapa(o: ObraP) {
  if (o.avance >= 100) return null;
  return o.etapa < ETAPAS.length - 1 ? ETAPAS[o.etapa + 1] : "Entregada";
}

export function avanzarEtapa(e: EstadoPortal, id: string, hoy: string): EstadoPortal {
  return conObra(e, id, (o) => {
    if (o.avance >= 100) return o;
    if (o.etapa < ETAPAS.length - 1) {
      const etapa = o.etapa + 1;
      const n = conAvance({ ...o, etapa }, Math.max(o.avance, PISO_ETAPA[etapa]));
      return { ...n, bitacora: [{ d: hoy, q: "INECSO", t: `La obra pasa a la etapa ${ETAPAS[etapa]}.` }, ...o.bitacora] };
    }
    const n = conAvance(o, 100);
    return { ...n, entrega: hoy, bitacora: [{ d: hoy, q: "INECSO", t: "Obra entregada." }, ...o.bitacora] };
  });
}

export function agregarBitacora(e: EstadoPortal, id: string, b: { q: string; t: string; avance?: number }, hoy: string): EstadoPortal {
  return conObra(e, id, (o) => {
    const n = b.avance !== undefined && b.avance > o.avance ? conAvance(o, Math.min(b.avance, o.etapa === ETAPAS.length - 1 ? 100 : 99)) : o;
    return { ...n, bitacora: [{ d: hoy, q: b.q, t: b.t }, ...o.bitacora] };
  });
}

export interface NuevaOT {
  equipoId: string;
  tipo: OT["tipo"];
  fecha: string;
  tecnico: string;
  estado: "programada" | "abierta";
}

export function crearOT(e: EstadoPortal, n: NuevaOT): EstadoPortal {
  const q = e.equipos.find((x) => x.id === n.equipoId);
  const ot: OT = {
    id: codigoOT(e.sig.ot),
    equipoId: n.equipoId,
    tipo: n.tipo,
    estado: n.estado,
    fecha: n.fecha,
    tecnico: n.tecnico,
    items: {},
    observaciones: "",
    fotos: [],
    recibe: { nombre: "", cargo: q ? clienteNombre(q.clienteId) : "" },
    comentarios: [],
  };
  return { ...e, ots: [...e.ots, ot], sig: { ...e.sig, ot: e.sig.ot + 1 } };
}

export const iniciarOT = (e: EstadoPortal, id: string, hoy: string) => conOT(e, id, (o) => ({ ...o, estado: "abierta", fecha: hoy }));

export const editarOT = (e: EstadoPortal, id: string, patch: Partial<OT>) => conOT(e, id, (o) => (o.estado === "cerrada" ? o : { ...o, ...patch }));

export function cerrarOT(e: EstadoPortal, id: string, hoy: string): EstadoPortal {
  const ot = e.ots.find((o) => o.id === id);
  const q = ot && equipoDe(e, ot);
  if (!ot || !q) return e;
  const lectura = ot.horometro ?? q.horometro;
  const n = conOT(e, id, (o) => ({ ...o, estado: "cerrada", fecha: hoy, cierre: { fecha: hoy, hora: horaAhora(), enviadoA: destinatarios(q) } }));
  return {
    ...n,
    equipos: n.equipos.map((x) =>
      x.id !== q.id ? x : { ...x, horometro: Math.max(x.horometro, lectura), ultima: ot.tipo === "preventiva" ? { fecha: hoy, horometro: lectura, ot: id } : x.ultima },
    ),
  };
}

export const revisarInforme = (e: EstadoPortal, id: string, hoy: string) => ({ ...e, ots: e.ots.map((o) => (o.id === id ? { ...o, revision: { fecha: hoy } } : o)) });

export const comentarInforme = (e: EstadoPortal, id: string, autor: Rol, texto: string, hoy: string) => ({
  ...e,
  ots: e.ots.map((o) => (o.id === id ? { ...o, comentarios: [...o.comentarios, { fecha: hoy, autor, texto }] } : o)),
});

/** Publish, unpublish or edit how a job appears on the public website. */
export function publicarWeb(e: EstadoPortal, id: string, patch: Partial<PubWeb>, hoy: string): EstadoPortal {
  const o = e.obras.find((x) => x.id === id);
  if (!o) return e;
  const actual = pubDe(e, o);
  const n: PubWeb = { ...actual, ...patch };
  if (n.on && !n.desde) n.desde = hoy;
  return { ...e, web: { ...e.web, [id]: n } };
}
