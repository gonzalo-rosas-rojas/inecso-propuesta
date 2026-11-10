import { useState, type FormEvent } from "react";
import { ETAPAS } from "@/data/inecso";
import { CLIENTES_PORTAL, MANDANTE, QUIENES, TECNICOS, clienteNombre, codigoOT, fecha, modeloEquipo, nombreEquipo, sumarDias, vencimiento } from "./datos";
import { useStore } from "../../store";
import { go } from "../../router";
import { agregarBitacora, crearObra, crearOT, siguienteObraId, usePortal } from "./estado";
import { Campo, Dialogo } from "./ui";

function Botones({ enviar, onCerrar }: { enviar: string; onCerrar: () => void }) {
  return (
    <div className="mt-6 flex flex-wrap justify-end gap-2">
      <button type="button" className="btn btn-linea text-tinta" onClick={onCerrar}>
        Cancelar
      </button>
      <button type="submit" className="btn btn-azul">
        {enviar}
      </button>
    </div>
  );
}

export function NuevaObraDialog({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo="Nueva obra">
      <NuevaObraForm onCerrar={onCerrar} />
    </Dialogo>
  );
}

function NuevaObraForm({ onCerrar }: { onCerrar: () => void }) {
  const { e, hoy, hacer } = usePortal();
  const { toast } = useStore();
  const [titulo, setTitulo] = useState("");
  const [clienteId, setClienteId] = useState(CLIENTES_PORTAL[0].id);
  const [lugar, setLugar] = useState("");
  const [entrega, setEntrega] = useState(sumarDias(hoy, 42));
  const [mandante, setMandante] = useState(true);

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const id = siguienteObraId(e);
    const codigo = `OB-${e.sig.obra}`;
    hacer((s) => crearObra(s, { titulo: titulo.trim(), clienteId, lugar: lugar.trim(), entrega, mandante }, hoy));
    onCerrar();
    toast(`Obra ${codigo} creada en etapa ${ETAPAS[0]}. Ya la ve ${clienteNombre(clienteId)}${mandante ? ` y la ${MANDANTE}` : ""}.`);
    go(`#/portal/obra/${id}`);
  };

  return (
    <form onSubmit={enviar} className="grid gap-4">
      <Campo label="Nombre de la obra">
        <input className="campo" required value={titulo} onChange={(ev) => setTitulo(ev.target.value)} placeholder="Ej.: Instalación de grupo electrógeno de 300 kVA" />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Cliente">
          <select className="campo" value={clienteId} onChange={(ev) => setClienteId(ev.target.value)}>
            {CLIENTES_PORTAL.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Lugar">
          <input className="campo" required value={lugar} onChange={(ev) => setLugar(ev.target.value)} placeholder="Ej.: Planta Buin" />
        </Campo>
      </div>
      <Campo label="Entrega estimada">
        <input className="campo" type="date" required min={sumarDias(hoy, 7)} value={entrega} onChange={(ev) => setEntrega(ev.target.value)} />
      </Campo>
      <label className="flex items-start gap-3 rounded-[3px] bg-papel px-3.5 py-3">
        <input type="checkbox" className="mt-1 size-4 accent-cianotipo" checked={mandante} onChange={(ev) => setMandante(ev.target.checked)} />
        <span>
          <b className="block text-[0.92rem]">Subcontratada por la {MANDANTE}</b>
          <span className="text-[0.85rem] text-tinta-suave">La {MANDANTE} verá la obra, su bitácora y sus documentos, igual que el cliente.</span>
        </span>
      </label>
      <Botones enviar="Crear obra" onCerrar={onCerrar} />
    </form>
  );
}

export function BitacoraDialog({ abierto, onCerrar, obraId }: { abierto: boolean; onCerrar: () => void; obraId?: string }) {
  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo="Agregar a la bitácora">
      <BitacoraForm onCerrar={onCerrar} obraId={obraId} />
    </Dialogo>
  );
}

function BitacoraForm({ onCerrar, obraId }: { onCerrar: () => void; obraId?: string }) {
  const { e, hoy, hacer } = usePortal();
  const { toast } = useStore();
  const activas = e.obras.filter((o) => o.avance < 100);
  const [id, setId] = useState(obraId ?? activas[0]?.id ?? "");
  const obra = e.obras.find((o) => o.id === id);
  const [q, setQ] = useState(QUIENES[1]);
  const [t, setT] = useState("");
  const [avance, setAvance] = useState("");

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    if (!obra) return;
    const a = avance.trim() === "" ? undefined : Math.max(0, Math.min(100, Math.round(Number(avance))));
    hacer((s) => agregarBitacora(s, obra.id, { q, t: t.trim(), avance: a }, hoy));
    onCerrar();
    toast(`Entrada agregada a la bitácora de ${obra.codigo}. La ve ${clienteNombre(obra.clienteId)}${obra.mandante ? ` y la ${MANDANTE}` : ""}.`);
    if (!obraId) go(`#/portal/obra/${obra.id}`);
  };

  return (
    <form onSubmit={enviar} className="grid gap-4">
      {!obraId && (
        <Campo label="Obra">
          <select className="campo" value={id} onChange={(ev) => setId(ev.target.value)}>
            {activas.map((o) => (
              <option key={o.id} value={o.id}>
                {o.codigo}. {o.titulo}
              </option>
            ))}
          </select>
        </Campo>
      )}
      <Campo label="Quién informa">
        <select className="campo" value={q} onChange={(ev) => setQ(ev.target.value)}>
          {QUIENES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </Campo>
      <Campo label="Qué pasó en terreno">
        <textarea className="campo min-h-28" required value={t} onChange={(ev) => setT(ev.target.value)} placeholder="Ej.: Terminado el tendido del alimentador. Mañana hay corte programado de 40 minutos a las 07:30." />
      </Campo>
      <Campo label="Avance de la obra (opcional)" ayuda={obra ? `Hoy va en ${obra.avance} %. Si lo deja en blanco, no cambia.` : undefined}>
        <span className="relative">
          <input className="campo pr-10" type="number" inputMode="numeric" min={obra?.avance ?? 0} max={100} value={avance} onChange={(ev) => setAvance(ev.target.value)} />
          <span className="pointer-events-none absolute inset-y-0 right-3.5 grid place-items-center text-tinta-suave">%</span>
        </span>
      </Campo>
      <Botones enviar="Agregar entrada" onCerrar={onCerrar} />
    </form>
  );
}

/** Schedule a maintenance (a work order for a future date) or open one now. */
export function OTDialog({ abierto, onCerrar, modo, equipoId }: { abierto: boolean; onCerrar: () => void; modo: "programar" | "abrir"; equipoId?: string }) {
  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo={modo === "programar" ? "Programar mantención" : "Abrir orden de trabajo"}>
      <OTForm onCerrar={onCerrar} modo={modo} equipoId={equipoId} />
    </Dialogo>
  );
}

function OTForm({ onCerrar, modo, equipoId }: { onCerrar: () => void; modo: "programar" | "abrir"; equipoId?: string }) {
  const { e, hoy, hacer } = usePortal();
  const { toast } = useStore();
  const pendiente = (id: string) => e.ots.find((o) => o.equipoId === id && o.estado !== "cerrada");
  // default: the most urgent equipment that has no work order yet
  const libres = e.equipos.filter((x) => !pendiente(x.id)).sort((a, b) => vencimiento(a, hoy).dias - vencimiento(b, hoy).dias);
  const [eq, setEq] = useState(equipoId ?? libres[0]?.id ?? e.equipos[0]?.id ?? "");
  const [tipo, setTipo] = useState<"preventiva" | "correctiva">("preventiva");
  const [f, setF] = useState(modo === "programar" ? sumarDias(hoy, 7) : hoy);
  const [tecnico, setTecnico] = useState(TECNICOS[0]);
  const q = e.equipos.find((x) => x.id === eq);

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    if (!q) return;
    const id = codigoOT(e.sig.ot);
    hacer((s) => crearOT(s, { equipoId: eq, tipo, fecha: modo === "abrir" ? hoy : f, tecnico, estado: modo === "abrir" ? "abierta" : "programada" }));
    onCerrar();
    if (modo === "abrir") {
      toast(`${id} abierta. Complete la pauta en terreno y ciérrela para enviar el informe.`);
      go(`#/portal/ot/${id}`);
    } else {
      toast(`${id} programada para el ${fecha(f)}. ${clienteNombre(q.clienteId)}${q.mandante ? ` y la ${MANDANTE}` : ""} ya la ven en el portal.`);
    }
  };

  return (
    <form onSubmit={enviar} className="grid gap-4">
      <Campo label="Equipo">
        <select className="campo" value={eq} onChange={(ev) => setEq(ev.target.value)} disabled={!!equipoId}>
          {e.equipos.map((x) => (
            <option key={x.id} value={x.id}>
              {nombreEquipo(x)}, {modeloEquipo(x)}. {clienteNombre(x.clienteId)}
              {pendiente(x.id) ? ` (ya tiene ${pendiente(x.id)?.id})` : ""}
            </option>
          ))}
        </select>
      </Campo>
      {q && (
        <p className="-mt-2 text-[0.85rem] text-tinta-suave">
          {q.ubicacion}. Horómetro {q.horometro.toLocaleString("es-CL")} h.
        </p>
      )}
      <fieldset>
        <legend className="mb-1.5 text-[0.92rem] font-semibold">Tipo</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["preventiva", "Mantención preventiva", "Pauta estándar completa"],
              ["correctiva", "Visita correctiva", "Una falla o un aviso del cliente"],
            ] as const
          ).map(([v, t, d]) => (
            <label key={v} className="flex cursor-pointer items-start gap-2.5 rounded-[3px] border border-linea px-3 py-2.5 has-[:checked]:border-cianotipo has-[:checked]:bg-cianotipo/5">
              <input type="radio" name="tipo" className="mt-1 accent-cianotipo" checked={tipo === v} onChange={() => setTipo(v)} />
              <span>
                <b className="block text-[0.92rem]">{t}</b>
                <span className="text-[0.82rem] text-tinta-suave">{d}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        {modo === "programar" && (
          <Campo label="Fecha de la visita">
            <input className="campo" type="date" required min={hoy} value={f} onChange={(ev) => setF(ev.target.value)} />
          </Campo>
        )}
        <Campo label="Técnico a cargo">
          <select className="campo" value={tecnico} onChange={(ev) => setTecnico(ev.target.value)}>
            {TECNICOS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Campo>
      </div>
      <Botones enviar={modo === "programar" ? "Programar" : "Abrir y completar"} onCerrar={onCerrar} />
    </form>
  );
}
