import { MotionConfig } from "motion/react";
import { Rail, RailMovil, type Etapa } from "../Rail";
import { useActiveAct, useLenis, usePrefersReducedMotion } from "../hooks";
import { WebNueva } from "../acts/WebNueva";
import { Portal } from "../acts/Portal";
import { Modalidades } from "../acts/Modalidades";
import { Alcance } from "../acts/Alcance";
import { Plan } from "../acts/Plan";
import { PortalEtapas } from "../acts/PortalEtapas";
import { Postventa } from "../acts/Postventa";
import { Calidad } from "../acts/Calidad";
import { Condiciones } from "../acts/Condiciones";
import { Final } from "../acts/Final";
import { VisionB } from "./VisionB";
import { DoloresB } from "./DoloresB";
import { PuenteB } from "./PuenteB";
import { CrecimientoB } from "./CrecimientoB";

// Version B follows the copy framework: vision → pain points → solution → conservative growth, then the terms.
const ETAPAS: Etapa[] = [
  { id: "vision", nombre: "Hacia dónde vamos" },
  { id: "dolores", nombre: "Lo que lo impide" },
  { id: "solucion", nombre: "La solución" },
  { id: "web", nombre: "La web nueva" },
  { id: "portal", nombre: "Portal de clientes" },
  { id: "crecimiento", nombre: "El tiempo que vuelve" },
  { id: "alcance", nombre: "La web: alcance y precio" },
  { id: "etapas", nombre: "El portal: alcance y precio" },
  { id: "modalidades", nombre: "El portal: cómo se contrata" },
  { id: "plan", nombre: "Plan de trabajo" },
  { id: "postventa", nombre: "Postventa" },
  { id: "calidad", nombre: "Calidad y seguridad" },
  { id: "condiciones", nombre: "Condiciones" },
  { id: "servicio", nombre: "Puesta en servicio" },
];
const IDS = ETAPAS.map((e) => e.id);
const OSCUROS = new Set(["dolores", "portal", "calidad"]);

export function AppB() {
  const rm = usePrefersReducedMotion();
  useLenis(!rm);
  const { active, progress, closed } = useActiveAct(IDS);
  const dark = OSCUROS.has(active);
  return (
    <MotionConfig reducedMotion="user">
      <a href="#dolores" className="fixed left-4 top-4 z-50 -translate-y-24 rounded bg-energia px-4 py-2 font-semibold text-grafito focus:translate-y-0">
        Saltar al contenido
      </a>
      <Rail etapas={ETAPAS} active={active} closed={closed} dark={dark} />
      <RailMovil etapas={ETAPAS} active={active} progress={progress} dark={dark} />
      <main className="min-[1100px]:pl-[220px]">
        <VisionB />
        <DoloresB />
        <PuenteB />
        <WebNueva />
        <Portal />
        <CrecimientoB />
        <Alcance />
        <PortalEtapas />
        <Modalidades />
        <Plan />
        <Postventa />
        <Calidad />
        <Condiciones />
        <Final />
      </main>
    </MotionConfig>
  );
}
