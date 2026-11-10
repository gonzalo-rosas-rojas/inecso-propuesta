import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS: { t: string; d: string[] }[] = [
  {
    t: "Anticipo y pagos",
    d: [
      "Un anticipo al firmar (40 % en la web) y el resto al cumplir cada hito.",
      "Montos en pesos, fijos durante el proyecto; la mantención se reajusta por IPC una vez al año.",
    ],
  },
  {
    t: "Un error no es un cambio",
    d: [
      "Error: no cumple lo acordado por escrito. Se corrige sin costo.",
      "Cambio: algo fuera del alcance. Se cotiza por escrito con precio cerrado y ustedes lo aprueban antes.",
    ],
  },
  {
    t: "Lo que necesito de ustedes",
    d: [
      "Fotos, textos, logo, certificado SEC vigente y accesos al dominio, en las fechas acordadas.",
      "Si algo llega tarde, la entrega se corre los mismos días.",
    ],
  },
  { t: "Garantía", d: ["60 días en la web y 90 en el portal, desde la publicación. Cubre errores, no cambios."] },
  {
    t: "De quién es cada cosa",
    d: [
      "De INECSO: dominio, servidor, contenidos, datos y el código de su web y su portal.",
      "Yo puedo reutilizar piezas genéricas, nunca sus datos. En arriendo, el código del portal es mío hasta la opción de compra.",
    ],
  },
  {
    t: "Datos personales",
    d: ["Antes de construir el portal firmamos un acuerdo de tratamiento de datos (Ley 21.719): INECSO es la responsable y yo el encargado."],
  },
  {
    t: "Documento tributario",
    d: ["Boleta de honorarios electrónica, sin IVA: el costo para INECSO es el monto bruto. INECSO retiene el 15,25 % (2026) y lo paga al SII."],
  },
  {
    t: "Forma de trabajo y término",
    d: [
      "Por entregables y plazos acordados, con una reunión de avance a la semana.",
      "Cualquiera puede terminar avisando por escrito: se paga lo entregado y se traspasa todo lo hecho.",
    ],
  },
];

/** Act 8: the conditions, as an accordion of plain answers. */
export function Condiciones() {
  const [open, setOpen] = useState<number | null>(1);
  return (
    <section id="condiciones" aria-labelledby="h-cond" className="bg-papel px-5 py-24 sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.8fr_1.4fr]">
        <div>
          <p className="wdth-87 font-semibold text-cianotipo">Condiciones</p>
          <h2 id="h-cond" className="mt-2 max-w-[16ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
            Todo por escrito, como con cualquier proveedor.
          </h2>
          <p className="mt-4 max-w-[44ch] text-tinta-suave">
            Ustedes saben qué reciben y cuánto pagan; yo sé qué entregar.
          </p>
        </div>
        <ul className="divide-y divide-linea border-y border-linea">
          {ITEMS.map((it, i) => {
            const on = open === i;
            return (
              <li key={it.t}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`cond-${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left wdth-100 text-[1.08rem] font-bold hover:text-cianotipo"
                  >
                    {it.t}
                    <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 26 }} className={cn("grid size-8 shrink-0 place-items-center rounded-full", on ? "bg-energia text-grafito" : "bg-blanco")}>
                      <Plus className="size-4" aria-hidden="true" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`cond-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="max-w-[70ch] space-y-2 pb-5 text-tinta-suave">
                        {it.d.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
