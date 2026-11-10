import { Phone } from "lucide-react";
import { EMPRESA, IMG } from "@/data/inecso";

export function CtaBanda({
  titulo = "¿Tiene una obra o una falla que resolver?",
  texto = "Cuéntenos qué necesita y le respondemos con una visita técnica o una cotización.",
}: { titulo?: string; texto?: string } = {}) {
  return (
    <section className="relative isolate overflow-hidden bg-cianotipo-osc text-blanco" aria-labelledby="cta-h">
      <img src={IMG.grupoMovil} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-25 mix-blend-luminosity" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cianotipo-osc via-cianotipo-osc/90 to-cianotipo-osc/40" />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 id="cta-h" className="wdth-125 text-[clamp(1.8rem,1.2rem+2.2vw,2.8rem)] leading-[1.04] font-extrabold text-balance">
            {titulo}
          </h2>
          <p className="mt-3 text-[1.05rem] text-blanco/80">{texto}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#/contacto" className="btn btn-energia px-6 py-3.5 text-[1rem]">
            Pedir cotización
          </a>
          <a href={EMPRESA.telefonoHref} className="btn btn-linea-claro px-6 py-3.5 text-[1rem] tabular-nums">
            <Phone className="size-4" aria-hidden="true" />
            {EMPRESA.telefono}
          </a>
        </div>
      </div>
    </section>
  );
}
