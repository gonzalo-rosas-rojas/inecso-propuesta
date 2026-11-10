import { useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { go, useHashRoute, type Route } from "./router";
import { StoreProvider } from "./store";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Ribbon } from "./components/Ribbon";
import { Toast } from "./components/Toast";
import { InicioB } from "./pages/InicioB";
import { Servicios } from "./pages/Servicios";
import { Obras } from "./pages/Obras";
import { Empresa } from "./pages/Empresa";
import { Contacto } from "./pages/Contacto";
import { PortalLogin } from "./pages/portal/Login";
import { PortalLista } from "./pages/portal/Lista";
import { PortalObra } from "./pages/portal/Obra";
import { PortalTablero } from "./pages/portal/Tablero";
import { PortalMantenciones } from "./pages/portal/Mantenciones";
import { PortalOT } from "./pages/portal/OT";
import { PortalInforme } from "./pages/portal/Informe";
import { PortalInformes } from "./pages/portal/Informes";
import { PortalGestion } from "./pages/portal/Gestion";
import { PortalProvider } from "./pages/portal/estado";

declare global {
  interface Window {
    __demo?: { go: (hash: string) => void };
  }
}
window.__demo = { go };

const TITULOS: Record<string, string> = {
  inicio: "INECSO Ingeniería: grupos electrógenos y obras eléctricas",
  servicios: "Servicios",
  obras: "Obras",
  empresa: "Empresa",
  contacto: "Cotizar",
  portal: "Entrar al portal",
  "portal-obras": "Obras",
  "portal-obra": "Obra",
  "portal-tablero": "Resumen del portal",
  "portal-mantenciones": "Mantenciones",
  "portal-informes": "Informes",
  "portal-ot": "Orden de trabajo",
  "portal-informe": "Informe",
  "portal-gestion": "Resumen de gestión",
};

function PageFor({ route }: { route: Route }) {
  switch (route.page) {
    case "servicios":
      return <Servicios />;
    case "obras":
      return <Obras />;
    case "empresa":
      return <Empresa />;
    case "contacto":
      return <Contacto />;
    case "portal":
      return <PortalLogin />;
    case "portal-obras":
      return <PortalLista />;
    case "portal-obra":
      return <PortalObra id={route.id ?? "1"} />;
    case "portal-tablero":
      return <PortalTablero />;
    case "portal-mantenciones":
      return <PortalMantenciones />;
    case "portal-informes":
      return <PortalInformes />;
    case "portal-ot":
      return <PortalOT id={route.id ?? ""} />;
    case "portal-informe":
      return <PortalInforme id={route.id ?? ""} />;
    case "portal-gestion":
      return <PortalGestion />;
    default:
      return <InicioB />;
  }
}

export function App() {
  const route = useHashRoute();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const t = TITULOS[route.page];
    document.title = (route.page === "inicio" ? t : `${t}: INECSO Ingeniería`) + " (demo)";
    window.scrollTo(0, 0);
    if (!first.current) main.current?.focus({ preventScroll: true });
    first.current = false;
  }, [route.key, route.page]);

  const portal = route.page.startsWith("portal");

  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <PortalProvider>
        <a href="#contenido" className="skip-link print:hidden" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>
          Saltar al contenido
        </a>
        <Ribbon />
        <Header route={route} />
        <main id="contenido" ref={main} tabIndex={-1} className={portal ? "bg-papel-2 outline-none print:bg-transparent" : "outline-none"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={route.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <PageFor route={route} />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <Toast />
        </PortalProvider>
      </StoreProvider>
    </MotionConfig>
  );
}
