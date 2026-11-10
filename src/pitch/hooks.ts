import { useEffect, useState } from "react";
import Lenis from "lenis";

const RM = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  const [rm, setRm] = useState(() => typeof window !== "undefined" && window.matchMedia(RM).matches);
  useEffect(() => {
    const m = window.matchMedia(RM);
    const on = () => setRm(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return rm;
}

/** Smooth wheel scrolling on top of native scroll (sticky, anchors and find-in-page keep working). Off with reduced motion. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -8 } });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);
}

/** Window width, for the few layout decisions JS has to make (iframe scale, phone vs desktop). */
export function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

/** Which act is under the 45 % line of the viewport, and how far down the page we are (0..1). */
export function useActiveAct(ids: string[]) {
  const [state, setState] = useState({ active: ids[0], progress: 0, closed: false });
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      let active = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < vh * 0.45) active = id;
      }
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      const closed = window.scrollY > vh * 0.18;
      setState((s) => (s.active === active && Math.abs(s.progress - progress) < 0.002 && s.closed === closed ? s : { active, progress, closed }));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [ids]);
  return state;
}
