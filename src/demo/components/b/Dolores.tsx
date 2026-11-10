import { BatteryWarning, Building2, FileWarning, PowerOff, Users } from "lucide-react";
import { DOLORES } from "@/data/inecso";

const ICONOS = { corte: PowerOff, falla: BatteryWarning, sec: FileWarning, proveedores: Users, lugar: Building2 } as const;

/** Version B, after the vision: the concrete obstacles between the visitor and that future. Quiet on purpose. */
export function Dolores() {
  return (
    <section className="bg-papel py-20 lg:py-28" aria-labelledby="do-h">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="do-h" className="wdth-125 text-[clamp(1.9rem,1.2rem+2.6vw,3.2rem)] leading-[1.02] font-extrabold text-balance">
            Lo que hoy deja a una operación a oscuras.
          </h2>
          <p className="mt-4 max-w-md text-tinta-suave">
            Ninguna de estas cosas avisa. Aparecen el día del corte, cuando ya es tarde para resolverlas.
          </p>
        </div>
        <ul className="divide-y divide-linea border-y border-linea">
          {DOLORES.map((d) => {
            const Icon = ICONOS[d.id];
            return (
              <li key={d.id} className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 py-6">
                <span className="row-span-2 grid size-11 place-items-center rounded-full bg-grafito text-energia">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="wdth-100 text-[1.15rem] font-bold leading-snug">{d.t}</h3>
                <p className="max-w-[56ch] text-tinta-suave">{d.d}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
