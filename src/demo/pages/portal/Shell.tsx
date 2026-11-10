import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Building2, Eye, HardHat, LogOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENTES_PORTAL, MANDANTE, type Rol } from "./datos";
import { useHashRoute, go } from "../../router";
import { useStore } from "../../store";
import { usePortal } from "./estado";
import { Dialogo } from "./ui";

const ICONO: Record<Rol, typeof Eye> = { inecso: HardHat, mandante: Eye, cliente: Building2 };

/** The portal's frame: who is looking (and a switcher to look as someone else), the sections and the demo controls. */
export function PortalShell({ children }: { children: ReactNode }) {
  const { sesion, entrar, reiniciar } = usePortal();
  const { toast } = useStore();
  const route = useHashRoute();
  const [confirmar, setConfirmar] = useState(false);
  const Icono = ICONO[sesion.rol];
  const valor = sesion.rol === "cliente" ? `cliente:${sesion.clienteId}` : sesion.rol;

  const actual =
    route.page === "portal-obra" ? "portal-obras" : route.page === "portal-ot" ? "portal-mantenciones" : route.page === "portal-informe" ? "portal-informes" : route.page;
  const nav = [
    { id: "portal-tablero", t: "Resumen", href: "#/portal/tablero" },
    { id: "portal-obras", t: sesion.rol === "cliente" ? "Sus obras" : "Obras", href: "#/portal/obras" },
    { id: "portal-mantenciones", t: "Mantenciones", href: "#/portal/mantenciones" },
    { id: "portal-informes", t: "Informes", href: "#/portal/informes" },
    ...(sesion.rol === "cliente" ? [] : [{ id: "portal-gestion", t: "Resumen de gestión", href: "#/portal/gestion" }]),
  ];

  return (
    <div className="min-h-[70svh]">
      <div className="border-b border-linea/70 bg-blanco print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 pb-2">
            <label className="flex w-full min-w-0 items-center gap-2.5 sm:w-auto sm:flex-1">
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", sesion.rol === "inecso" ? "bg-energia/30 text-grafito" : "bg-cianotipo/10 text-cianotipo")}>
                <Icono className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden text-[0.85rem] text-tinta-suave sm:inline">Ver como</span>
              <span className="sr-only sm:hidden">Ver el portal como</span>
              <select
                value={valor}
                onChange={(ev) => {
                  const v = ev.target.value;
                  const s = v.startsWith("cliente:") ? { rol: "cliente" as Rol, clienteId: v.slice(8) } : { rol: v as Rol, clienteId: sesion.clienteId };
                  entrar(s);
                }}
                className="min-w-0 flex-1 truncate rounded-[3px] border border-linea bg-blanco py-1.5 pr-2 pl-2.5 text-[0.92rem] font-semibold sm:max-w-xs sm:flex-none"
              >
                <option value="inecso">INECSO (administrador)</option>
                <option value="mandante">{MANDANTE}</option>
                <optgroup label="Cliente">
                  {CLIENTES_PORTAL.map((c) => (
                    <option key={c.id} value={`cliente:${c.id}`}>
                      {c.nombre}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
              <span className="rounded-full bg-energia/25 px-2.5 py-0.5 text-[0.78rem] font-semibold text-energia-osc">Datos de ejemplo</span>
              <button
                type="button"
                onClick={() => setConfirmar(true)}
                className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-[0.85rem] font-semibold text-tinta-suave hover:bg-papel hover:text-tinta"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reiniciar demo
              </button>
            </div>
          </div>
          <nav aria-label="Portal" className="sin-barra -mx-4 flex items-center overflow-x-auto px-2 sm:-mx-6 sm:px-4">
            {nav.map((n) => (
              <a
                key={n.id}
                href={n.href}
                aria-current={actual === n.id ? "page" : undefined}
                className={cn(
                  "relative shrink-0 rounded-t px-2.5 py-2.5 text-[0.92rem] sm:px-3 font-semibold whitespace-nowrap transition-colors",
                  actual === n.id ? "text-tinta" : "text-tinta-suave hover:text-tinta",
                )}
              >
                {n.t}
                {actual === n.id && <motion.span layoutId="portal-nav" className="absolute inset-x-3 bottom-0 h-0.5 bg-energia" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              </a>
            ))}
            <a href="#/portal" className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded px-2.5 py-2.5 sm:px-3 text-[0.92rem] font-semibold text-tinta-suave hover:text-tinta">
              <LogOut className="size-4" aria-hidden="true" />
              Salir
            </a>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10 print:max-w-none print:p-0">{children}</div>

      <Dialogo abierto={confirmar} onCerrar={() => setConfirmar(false)} titulo="¿Reiniciar la demo?">
        <p className="text-tinta-suave">Se borran las obras, órdenes de trabajo, informes, publicaciones en la web y accesos que creó o cambió, y vuelven los datos de ejemplo del inicio.</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-linea text-tinta" onClick={() => setConfirmar(false)}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-azul"
            onClick={() => {
              reiniciar();
              setConfirmar(false);
              toast("Demo reiniciada: volvieron los datos de ejemplo.");
              go("#/portal/tablero");
            }}
          >
            Reiniciar
          </button>
        </div>
      </Dialogo>
    </div>
  );
}

/** Page title with an optional line above it and actions to the right. */
export function Encabezado({ antes, titulo, children }: { antes?: ReactNode; titulo: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {antes && <p className="text-[0.88rem] text-tinta-suave">{antes}</p>}
        <h1 className="wdth-125 mt-0.5 text-[clamp(1.7rem,1.2rem+1.8vw,2.5rem)] leading-tight font-extrabold text-balance">{titulo}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
