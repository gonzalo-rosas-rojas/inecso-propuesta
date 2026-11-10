import { Clock, MapPin, Phone } from "lucide-react";
import { EMPRESA } from "@/data/inecso";
import { PageHead } from "../components/PageHead";
import { Cotizar } from "../components/Cotizar";

export function Contacto() {
  return (
    <>
      <PageHead titulo="Pedir cotización">Cuéntenos qué necesita. Le respondemos dentro del día hábil con una visita técnica o una cotización.</PageHead>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:py-16">
        <Cotizar />
        <aside className="grid content-start gap-4">
          <div className="rounded-md bg-grafito p-6 text-papel">
            <h2 className="wdth-112 text-[1.2rem] font-extrabold text-blanco">¿Es una urgencia?</h2>
            <p className="mt-2 text-[0.92rem] text-papel/70">Si un grupo no parte o hay una falla en su instalación, llame directo.</p>
            <a href={EMPRESA.telefonoHref} className="btn btn-energia mt-4 w-full text-[1.05rem] tabular-nums">
              <Phone className="size-4" aria-hidden="true" />
              {EMPRESA.telefono}
            </a>
          </div>
          <dl className="grid gap-4 rounded-md bg-blanco p-6 ring-1 ring-linea/70 text-[0.95rem]">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-cianotipo" aria-hidden="true" />
              <div>
                <dt className="font-semibold">Oficina</dt>
                <dd className="text-tinta-suave">{EMPRESA.domicilio}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-cianotipo" aria-hidden="true" />
              <div>
                <dt className="font-semibold">Horario</dt>
                <dd className="text-tinta-suave">Lunes a viernes, por confirmar</dd>
              </div>
            </div>
          </dl>
          <p className="px-1 text-[0.8rem] text-tinta-suave">Dirección y teléfono de la última web de INECSO (2025); se confirman antes de publicar.</p>
        </aside>
      </section>
    </>
  );
}
