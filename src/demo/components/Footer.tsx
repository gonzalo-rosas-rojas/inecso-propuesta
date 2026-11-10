import { EMPRESA } from "@/data/inecso";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-grafito text-papel/80 print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo claro />
          <p className="mt-4 max-w-xs text-[0.92rem] leading-relaxed text-papel/65">
            Grupos electrógenos, baja y media tensión y obras civiles asociadas. {EMPRESA.sec}.
          </p>
        </div>
        <div>
          <h2 className="wdth-87 mb-3 text-[0.85rem] font-semibold text-papel">Servicios</h2>
          <ul className="space-y-2 text-[0.92rem]">
            <li><a className="hover:text-blanco" href="#/servicios">Grupos electrógenos</a></li>
            <li><a className="hover:text-blanco" href="#/servicios">Ingeniería eléctrica</a></li>
            <li><a className="hover:text-blanco" href="#/servicios">Obras civiles y estructuras</a></li>
          </ul>
        </div>
        <div>
          <h2 className="wdth-87 mb-3 text-[0.85rem] font-semibold text-papel">Empresa</h2>
          <ul className="space-y-2 text-[0.92rem]">
            <li><a className="hover:text-blanco" href="#/obras">Obras</a></li>
            <li><a className="hover:text-blanco" href="#/empresa">Certificación y normas</a></li>
            <li><a className="hover:text-blanco" href="#/portal">Acceso clientes</a></li>
          </ul>
        </div>
        <div>
          <h2 className="wdth-87 mb-3 text-[0.85rem] font-semibold text-papel">Contacto</h2>
          <address className="space-y-2 text-[0.92rem] not-italic">
            <p>{EMPRESA.domicilio}</p>
            <p><a className="tabular-nums hover:text-blanco" href={EMPRESA.telefonoHref}>{EMPRESA.telefono}</a></p>
            <p><a className="font-semibold text-energia hover:underline" href="#/contacto">Pedir cotización</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-blanco/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-[0.8rem] text-papel/50 sm:px-6">
          INECSO Ingeniería. Demo preparada por Gonzalo Rosas para INECSO, noviembre de 2026.
        </p>
      </div>
    </footer>
  );
}
