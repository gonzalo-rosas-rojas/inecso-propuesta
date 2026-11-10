import { motion } from "motion/react";
import { HardHat, ShieldCheck } from "lucide-react";
import { IMG, NORMAS, RECURSOS } from "@/data/inecso";
import { PageHead } from "../components/PageHead";
import { CtaBanda } from "../components/CtaBanda";

const enVista = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] as const },
};

export function Empresa() {
  return (
    <>
      <PageHead titulo="Ingeniería eléctrica con infraestructura propia." img={IMG.desarmeSala}>
        Con décadas de trayectoria en ingeniería eléctrica y grupos electrógenos, INECSO da una solución inmediata y profesional, con el equipo técnico y humano para
        respaldarla.
      </PageHead>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <motion.p {...enVista} className="wdth-112 text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] leading-snug font-bold text-balance">
          Un servicio vital para el desarrollo de las empresas de nuestros clientes: ágil, responsable y comprometido con lo que de verdad necesitan.
        </motion.p>
        <div className="grid gap-8">
          <motion.div {...enVista}>
            <h2 className="text-[1.1rem] font-bold">Misión</h2>
            <p className="mt-2 leading-relaxed text-tinta-suave">
              Entregar a nuestros clientes un servicio vital para el desarrollo de sus empresas, con una cultura orientada al cliente, ágil, responsable y comprometida.
              Superar sus expectativas con propuestas innovadoras que respondan fielmente a lo que necesitan.
            </p>
          </motion.div>
          <motion.div {...enVista}>
            <h2 className="text-[1.1rem] font-bold">Visión</h2>
            <p className="mt-2 leading-relaxed text-tinta-suave">
              Ser una empresa líder en nuestro rubro, reconocida y valorada por clientes y trabajadores, con una rentabilidad sostenida por un actuar ético, visión de
              futuro y las mejores prácticas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="plano py-16 text-papel lg:py-20" aria-labelledby="rc-h">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="rc-h" className="wdth-125 text-[clamp(1.6rem,1.1rem+1.8vw,2.4rem)] font-extrabold text-blanco">
              Recursos propios
            </h2>
            <p className="text-[0.82rem] text-papel/50">Según su web de 2017. Se actualiza con INECSO.</p>
          </div>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-md bg-blanco/10 md:grid-cols-3">
            {RECURSOS.map((r, i) => (
              <motion.li key={r.t} {...enVista} transition={{ ...enVista.transition, delay: i * 0.08 }} className="bg-grafito/90 p-6 sm:p-8">
                <p className="wdth-125 text-[2.6rem] leading-none font-extrabold text-energia tabular-nums">{r.n}</p>
                <h3 className="mt-4 font-bold text-blanco">{r.t}</h3>
                <p className="mt-1 text-[0.92rem] text-papel/65">{r.d}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <motion.div {...enVista} className="overflow-hidden rounded-md">
          <img src={IMG.ducto} alt="Ductos de escape fabricados por INECSO, con revestimiento térmico." className="aspect-[4/3] w-full object-cover" loading="lazy" />
        </motion.div>
        <motion.div {...enVista}>
          <HardHat className="size-9 text-cianotipo" aria-hidden="true" />
          <h2 className="wdth-112 mt-4 text-[1.8rem] leading-tight font-extrabold">Seguridad y medio ambiente</h2>
          <p className="mt-4 leading-relaxed text-tinta-suave">
            Trabajo seguro y libre de accidentes. Un experto profesional en prevención de riesgos desarrolla los procedimientos, las charlas y la capacitación del
            personal en el uso correcto de herramientas e instrumentos, y cuida el cumplimiento de la legislación ambiental.
          </p>
        </motion.div>
      </section>

      <section className="bg-blanco py-16 lg:py-24" aria-labelledby="sec-h">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div {...enVista}>
            <ShieldCheck className="size-9 text-cianotipo" aria-hidden="true" />
            <h2 id="sec-h" className="wdth-112 mt-4 text-[1.8rem] leading-tight font-extrabold">
              Instalador SEC clase A
            </h2>
            <p className="mt-4 leading-relaxed text-tinta-suave">
              Registro ante la Superintendencia de Electricidad y Combustibles como instalador clase A, la categoría que habilita para proyectar y ejecutar
              instalaciones de cualquier potencia. La vigencia se actualiza con el certificado actual de INECSO.
            </p>
          </motion.div>
          <div>
            <h3 className="font-bold">Normas con que trabajamos</h3>
            <ul className="mt-4 divide-y divide-linea/70 border-y border-linea/70">
              {NORMAS.map((n, i) => (
                <motion.li key={n.c} {...enVista} transition={{ ...enVista.transition, delay: i * 0.05 }} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5 sm:grid-cols-[9rem_1fr]">
                  <span className="wdth-87 font-bold text-cianotipo">{n.c}</span>
                  <span className="text-[0.95rem]">{n.t}</span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-4 text-[0.82rem] text-tinta-suave">Actualizado a la normativa SEC vigente; la web anterior citaba normas NCh Elec. ya reemplazadas. INECSO confirma la lista final.</p>
          </div>
        </div>
      </section>
      <CtaBanda />
    </>
  );
}
