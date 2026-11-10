import { useEffect, useRef, type PointerEvent } from "react";
import { Eraser, Type } from "lucide-react";
import type { Firma } from "@/data/portal-demo";

const W = 1000;
const H = 300;
const TINTA = "#22292f";

export const hayFirma = (f?: Firma) => !!f && (!!f.texto || (f.trazos?.length ?? 0) > 0);

/** A stored signature, drawn as SVG (on screen and on paper). */
export function FirmaVista({ firma, className }: { firma?: Firma; className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={hayFirma(firma) ? "Firma" : "Sin firma"}>
      {firma?.texto ? (
        <text x={50} y={190} fontSize={Math.min(110, Math.round(1500 / Math.max(1, firma.texto.length)))} fontStyle="italic" fontWeight={500} className="fill-tinta">
          {firma.texto}
        </text>
      ) : (
        firma?.trazos?.map((t, i) => (
          <polyline key={i} points={t.join(" ")} fill="none" stroke={TINTA} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        ))
      )}
    </svg>
  );
}

function dibujar(cv: HTMLCanvasElement | null, f?: Firma) {
  const ctx = cv?.getContext("2d");
  if (!cv || !ctx) return;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = TINTA;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const t of f?.trazos ?? []) {
    ctx.beginPath();
    for (let i = 0; i < t.length; i += 2) (i ? ctx.lineTo : ctx.moveTo).call(ctx, t[i], t[i + 1]);
    if (t.length === 2) ctx.lineTo(t[0] + 0.5, t[1] + 0.5);
    ctx.stroke();
  }
}

/** Signature pad: draw with a finger, a pen or the mouse. Keyboard users can sign with the typed name instead. */
export function FirmaPad({ valor, onCambio, etiqueta, nombre, disabled }: { valor?: Firma; onCambio: (f?: Firma) => void; etiqueta: string; nombre: string; disabled?: boolean }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const trazo = useRef<number[] | null>(null);

  useEffect(() => dibujar(cv.current, valor), [valor]);

  const punto = (ev: PointerEvent<HTMLCanvasElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    return [Math.round(((ev.clientX - r.left) / r.width) * W), Math.round(((ev.clientY - r.top) / r.height) * H)];
  };

  const fin = () => {
    const t = trazo.current;
    trazo.current = null;
    if (t) onCambio({ trazos: [...(valor?.trazos ?? []), t] });
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[0.92rem] font-semibold">{etiqueta}</span>
        <span className="flex gap-1">
          <button
            type="button"
            disabled={disabled || !nombre.trim()}
            onClick={() => onCambio({ texto: nombre.trim() })}
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[0.82rem] font-semibold text-cianotipo hover:bg-papel disabled:opacity-40"
          >
            <Type className="size-3.5" aria-hidden="true" />
            Firmar con el nombre
          </button>
          <button
            type="button"
            disabled={disabled || !hayFirma(valor)}
            onClick={() => onCambio(undefined)}
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[0.82rem] font-semibold text-tinta-suave hover:bg-papel disabled:opacity-40"
          >
            <Eraser className="size-3.5" aria-hidden="true" />
            Borrar
          </button>
        </span>
      </div>
      <div className="relative mt-1.5 overflow-hidden rounded-[3px] border border-linea bg-blanco">
        {valor?.texto ? (
          <FirmaVista firma={valor} className="aspect-[10/3] w-full" />
        ) : (
          <canvas
            ref={cv}
            width={W}
            height={H}
            role="img"
            aria-label={`${etiqueta}: dibuje la firma aquí con el dedo o el mouse`}
            className="block aspect-[10/3] w-full cursor-crosshair touch-none"
            onPointerDown={(ev) => {
              if (disabled) return;
              ev.currentTarget.setPointerCapture(ev.pointerId);
              trazo.current = punto(ev);
            }}
            onPointerMove={(ev) => {
              const t = trazo.current;
              const ctx = ev.currentTarget.getContext("2d");
              if (!t || !ctx) return;
              const [x, y] = punto(ev);
              ctx.strokeStyle = TINTA;
              ctx.lineWidth = 7;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(t[t.length - 2], t[t.length - 1]);
              ctx.lineTo(x, y);
              ctx.stroke();
              t.push(x, y);
            }}
            onPointerUp={fin}
            onPointerCancel={fin}
          />
        )}
        <span className="pointer-events-none absolute inset-x-6 bottom-[22%] border-t border-dashed border-linea" aria-hidden="true" />
        {!hayFirma(valor) && <span className="pointer-events-none absolute bottom-2 left-3 text-[0.75rem] text-tinta-suave/70">Firme sobre la línea</span>}
      </div>
    </div>
  );
}
