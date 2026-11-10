import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOTO_WEB_DEFAULT, IMG, clienteSector, fecha, obraWeb, pubDe, type ObraP, type PubWeb } from "./datos";
import { useStore } from "../../store";
import { publicarWeb, usePortal } from "./estado";
import { Panel } from "./ui";

const MAX_TEXTO = 240;

/** INECSO only: put this job on the public website from here, so the website stays current by itself. */
export function PublicarWeb({ o }: { o: ObraP }) {
  const { e, hoy, hacer } = usePortal();
  const { toast } = useStore();
  const h = useId();
  const p = pubDe(e, o);
  const set = (patch: Partial<PubWeb>) => hacer((s) => publicarWeb(s, o.id, patch, hoy));
  const fotos = o.fotos?.length ? o.fotos : null;
  const tarjeta = obraWeb(e, o);

  // The description is typed into a local draft and saved a moment after typing stops (and on leaving the field), so
  // each keystroke does not rewrite the whole demo state.
  const [borrador, setBorrador] = useState(p.texto);
  const campo = useRef<HTMLTextAreaElement>(null);
  const guardado = p.texto;
  useEffect(() => {
    if (document.activeElement !== campo.current) setBorrador(guardado);
  }, [guardado]);
  useEffect(() => {
    if (borrador === guardado) return;
    const t = setTimeout(() => set({ texto: borrador }), 300);
    return () => clearTimeout(t);
  }, [borrador]);

  const interruptor = (
    <button
      type="button"
      role="switch"
      aria-checked={p.on}
      aria-labelledby={`${h}-sw`}
      onClick={() => {
        set({ on: !p.on });
        toast(p.on ? `${o.codigo} ya no aparece en la web.` : `${o.codigo} publicada: ya aparece en Obras de inecso.cl, sin que nadie edite la web.`);
      }}
      className="inline-flex items-center gap-2.5 rounded-full py-1 pr-1 pl-3 text-[0.88rem] font-semibold hover:bg-papel"
    >
      <span id={`${h}-sw`}>{p.on ? "Publicada" : "No publicada"}</span>
      <span className={cn("flex h-6 w-11 items-center rounded-full p-0.5 transition-colors", p.on ? "justify-end bg-tierra" : "justify-start bg-linea")}>
        <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 36 }} className="grid size-5 place-items-center rounded-full bg-blanco shadow-sm">
          {p.on && <Check className="size-3 text-tierra" aria-hidden="true" />}
        </motion.span>
      </span>
    </button>
  );

  return (
    <Panel
      className="mt-4"
      titulo={
        <span className="inline-flex items-center gap-2">
          <Globe className="size-4 text-cianotipo" aria-hidden="true" />
          Publicar en inecso.cl
        </span>
      }
      accion={interruptor}
    >
      <p className="mt-1 max-w-3xl text-[0.88rem] text-tinta-suave">
        El equipo actualiza la obra una vez, aquí, y la página de obras de la web se pone al día sola. Solo INECSO ve este panel.
        {p.on && p.desde && ` En la web desde el ${fecha(p.desde)}.`}
      </p>

      <div className="mt-4 grid items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-[0.92rem] font-semibold">Descripción para la web</span>
            <textarea
              className="campo min-h-24 py-2.5 leading-relaxed"
              maxLength={MAX_TEXTO}
              rows={3}
              ref={campo}
              value={borrador}
              onChange={(ev) => setBorrador(ev.target.value)}
              onBlur={() => borrador !== guardado && set({ texto: borrador })}
            />
            <span className="text-[0.8rem] text-tinta-suave tabular-nums">
              {borrador.length} de {MAX_TEXTO} caracteres. La leen los visitantes de la web: sin datos internos.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" className="mt-1 size-4 accent-cianotipo" checked={p.conNombre} onChange={(ev) => set({ conNombre: ev.target.checked })} />
            <span>
              <span className="block text-[0.92rem] font-semibold">Mostrar el nombre del cliente</span>
              <span className="block text-[0.8rem] text-tinta-suave">
                {p.conNombre ? "Solo si el cliente lo autorizó." : `Sin marcar, la web dice: «${clienteSector(o.clienteId)}».`}
              </span>
            </span>
          </label>

          <fieldset>
            <legend className="text-[0.92rem] font-semibold">Foto</legend>
            {fotos ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {fotos.map((k, i) => {
                  const on = p.foto === k;
                  return (
                    <label
                      key={k}
                      className={cn(
                        "relative block size-20 cursor-pointer overflow-hidden rounded-[3px] ring-2 transition-shadow has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-energia",
                        on ? "ring-cianotipo" : "ring-transparent hover:ring-linea",
                      )}
                    >
                      <input type="radio" name={`${h}-foto`} className="sr-only" checked={on} onChange={() => set({ foto: k })} />
                      <img src={IMG[k]} alt={`Foto ${i + 1} de la obra`} className="size-full object-cover" />
                      {on && (
                        <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-cianotipo text-blanco">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-3">
                <img src={IMG[FOTO_WEB_DEFAULT]} alt="" className="size-20 rounded-[3px] object-cover" />
                <p className="text-[0.82rem] text-tinta-suave">La obra todavía no tiene fotos. La web usa una foto de referencia de INECSO hasta que el equipo suba una desde terreno.</p>
              </div>
            )}
          </fieldset>
        </div>

        <div>
          <p className="text-[0.82rem] font-semibold text-tinta-suave">Así se ve en la web</p>
          <div className={cn("mt-2 overflow-hidden rounded-md bg-blanco ring-1 ring-linea/70 transition-opacity", !p.on && "opacity-60")}>
            <span className="relative block aspect-[4/3] bg-grafito">
              <img src={tarjeta.img} alt="" className="size-full object-cover" />
              <span className="absolute top-3 left-3 rounded-sm bg-grafito/80 px-2 py-1 text-[0.75rem] font-semibold text-blanco tabular-nums">{tarjeta.cod}</span>
            </span>
            <span className="flex flex-col gap-1.5 p-4">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-energia/25 px-2.5 py-0.5 text-[0.75rem] font-semibold text-energia-osc">
                <span className="size-1.5 rounded-full bg-energia-osc" aria-hidden="true" />
                {tarjeta.portal}
              </span>
              <span className="wdth-75 text-[0.8rem] font-semibold text-cianotipo">{tarjeta.tipo}</span>
              <span className="text-[1.02rem] leading-snug font-bold">{tarjeta.t}</span>
              <span className="text-[0.88rem] text-tinta-suave">{tarjeta.c}</span>
            </span>
          </div>
          {p.on ? (
            <a href="#/obras" className="mt-3 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-cianotipo hover:underline">
              Ver en la web
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : (
            <p className="mt-3 text-[0.82rem] text-tinta-suave">Vista previa: se publica al encender el interruptor.</p>
          )}
        </div>
      </div>
    </Panel>
  );
}
