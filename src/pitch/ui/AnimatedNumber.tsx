import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { usePrefersReducedMotion } from "../hooks";

/**
 * A figure that rolls to its new value whenever it changes (and the first time it scrolls into view).
 * It always animates from what is on screen, re-runs only when the value changes (not on every parent render, since
 * callers pass inline format functions), and always paints the final value, so a stopped animation can't leave a
 * stale number behind.
 */
export function AnimatedNumber({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const fmt = useRef(format);
  fmt.current = format;
  // React renders the first text only; after that the effect owns the text, so React never fights it.
  const first = useRef(format(value));
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const rm = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paint = (v: number) => {
      shown.current = v;
      el.textContent = fmt.current(v);
    };
    if (rm || shown.current === value) {
      paint(value);
      return;
    }
    if (!inView) {
      paint(0);
      return;
    }
    const c = animate(shown.current, value, { duration: 0.9, ease: [0.2, 0.7, 0.2, 1], onUpdate: paint, onComplete: () => paint(value) });
    return () => {
      c.stop();
    };
  }, [value, inView, rm]);

  // Repaint when only the format changes (for example a unit that depends on another input), without animating.
  useEffect(() => {
    const el = ref.current;
    if (el && shown.current === value) el.textContent = format(value);
  }, [format, value]);

  return (
    <span ref={ref} className={className}>
      {first.current}
    </span>
  );
}
