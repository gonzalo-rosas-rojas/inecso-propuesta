import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Building2, Eye, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENTES_PORTAL, IMG, MANDANTE, type Rol } from "./datos";
import { go } from "../../router";
import { usePortal } from "./estado";

const ROLES: { id: Rol; t: string; d: string; Icon: typeof Eye }[] = [
  { id: "inecso", t: "INECSO", d: "Administra obras, mantenciones y órdenes de trabajo, y cierra los informes.", Icon: HardHat },
  { id: "mandante", t: MANDANTE, d: "Sigue todo lo que subcontrató a INECSO, de todos sus clientes, y revisa los informes.", Icon: Eye },
  { id: "cliente", t: "Cliente", d: "Ve solo sus obras, sus equipos y sus informes.", Icon: Building2 },
];

/** Demo entry: pick who you are. No passwords; in the real portal each person signs in with their own account. */
export function PortalLogin() {
  const { sesion, entrar } = usePortal();
  const [rol, setRol] = useState<Rol>(sesion.rol);
  const [clienteId, setClienteId] = useState(sesion.clienteId);

  return (
    <section className="grid min-h-[78svh] lg:grid-cols-2">
      <div className="relative isolate hidden overflow-hidden bg-grafito text-blanco lg:block">
        <motion.img src={IMG.grupoJaula} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-60" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-grafito via-grafito/60 to-grafito/20" />
        <div className="flex h-full flex-col justify-end p-12">
          <h2 className="wdth-125 max-w-md text-[2.6rem] leading-[1] font-extrabold">Un solo proceso, y la información llega a todos.</h2>
          <ul className="mt-6 grid max-w-md gap-2 text-blanco/80">
            <li>La misma pauta de mantención en cada visita, con firma en terreno</li>
            <li>El informe sale al cerrar la orden, para el cliente y la {MANDANTE}</li>
            <li>Cada uno ve solo lo suyo: obras, equipos, bitácora e informes</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center bg-papel-2 px-4 py-10 sm:px-6 sm:py-14">
        <motion.form
          className="w-full max-w-md rounded-md bg-blanco p-5 ring-1 ring-linea/70 sm:p-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            entrar({ rol, clienteId });
            go("#/portal/tablero");
          }}
        >
          <h1 className="wdth-112 text-[1.8rem] font-extrabold">Entrar como…</h1>
          <p className="mt-1.5 text-tinta-suave">Elija un perfil para recorrer el portal. Cada uno ve lo que le corresponde.</p>

          <fieldset className="mt-5 grid gap-2.5">
            <legend className="sr-only">Perfil</legend>
            {ROLES.map((r) => {
              const on = rol === r.id;
              return (
                <label
                  key={r.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3.5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-energia",
                    on ? "border-cianotipo bg-cianotipo/5" : "border-linea hover:bg-papel/60",
                  )}
                >
                  <input type="radio" name="rol" value={r.id} checked={on} onChange={() => setRol(r.id)} className="sr-only" />
                  <span className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-full", on ? "bg-cianotipo text-blanco" : "bg-papel text-tinta-suave")}>
                    <r.Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block">{r.t}</b>
                    <span className="block text-[0.88rem] leading-snug text-tinta-suave">{r.d}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <label className={cn("mt-4 grid gap-1.5 transition-opacity", rol !== "cliente" && "opacity-50")}>
            <span className="text-[0.92rem] font-semibold">Cliente</span>
            <select className="campo py-2.5" value={clienteId} onChange={(e) => setClienteId(e.target.value)} onFocus={() => setRol("cliente")}>
              {CLIENTES_PORTAL.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn btn-azul mt-6 w-full py-3.5">
            Entrar
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <p className="mt-4 rounded-[3px] bg-papel px-3 py-2 text-[0.82rem] text-tinta-suave">
            Demo sin contraseñas: empresas, obras y equipos de ejemplo. En el portal real cada persona entra con su usuario y verificación en dos pasos, e INECSO decide quién ve qué.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
