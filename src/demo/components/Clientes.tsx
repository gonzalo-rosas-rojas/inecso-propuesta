import { Marquee } from "@/components/ui/marquee";
import { CLIENTES } from "@/data/inecso";

export function Clientes() {
  const mitad = Math.ceil(CLIENTES.length / 2);
  return (
    <section className="border-y border-linea/60 bg-papel py-14" aria-labelledby="cl-h">
      <div className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-3 px-4 sm:px-6">
        <h2 id="cl-h" className="wdth-112 text-[1.35rem] font-extrabold">Han confiado en INECSO</h2>
        <p className="text-[0.82rem] text-tinta-suave">Lista publicada en su web de 2012. Antes de publicar se confirma con los clientes actuales.</p>
      </div>
      <div className="relative mt-8 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Marquee pauseOnHover className="[--duration:55s] [--gap:3rem]">
          {CLIENTES.slice(0, mitad).map((c) => (
            <span key={c} className="wdth-87 text-[1.3rem] font-semibold whitespace-nowrap text-tinta/55">
              {c}
            </span>
          ))}
        </Marquee>
        <Marquee pauseOnHover reverse className="mt-2 [--duration:60s] [--gap:3rem]">
          {CLIENTES.slice(mitad).map((c) => (
            <span key={c} className="wdth-87 text-[1.3rem] font-semibold whitespace-nowrap text-tinta/55">
              {c}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
