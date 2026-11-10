import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EMPRESA } from "@/data/inecso";

const FILAS = [
  { k: "Empresa", v: EMPRESA.nombre },
  { k: "Especialidad", v: "Grupos electrógenos, BT y MT" },
  { k: "Registro", v: EMPRESA.sec },
  { k: "Cobertura", v: EMPRESA.cobertura },
  { k: "Normativa", v: "DS 8/2019 y pliegos RIC" },
];

/** INECSO's "placa de características": the plate every generator and transformer carries, here for the company. */
export function Placa({ className }: { className?: string }) {
  return (
    <motion.figure
      className={cn("placa relative w-full max-w-[22rem] rounded-[5px] px-6 pt-6 pb-5 text-grafito", className)}
      initial={{ opacity: 0, y: 18, rotate: -1.2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.35, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <span className="placa-remache top-2 left-2" />
      <span className="placa-remache top-2 right-2" />
      <span className="placa-remache bottom-2 left-2" />
      <span className="placa-remache right-2 bottom-2" />
      <figcaption className="wdth-125 flex items-baseline justify-between border-b-2 border-grafito/80 pb-2 text-[0.98rem] font-extrabold">
        <span>INECSO</span>
        <span className="wdth-75 text-[0.72rem] font-semibold text-grafito/70">Placa de características</span>
      </figcaption>
      <dl className="mt-1">
        {FILAS.map((f, i) => (
          <motion.div
            key={f.k}
            className="grid grid-cols-[6.2rem_1fr] gap-3 border-b border-grafito/20 py-[0.45rem] text-[0.84rem] last:border-b-0"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 + i * 0.09, duration: 0.4 }}
          >
            <dt className="wdth-75 font-medium text-grafito/65">{f.k}</dt>
            <dd className="font-semibold">{f.v}</dd>
          </motion.div>
        ))}
      </dl>
    </motion.figure>
  );
}
