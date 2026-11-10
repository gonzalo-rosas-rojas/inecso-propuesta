import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

// rounded to the thousand: an estimate should not look more precise than it is
const fmt = (n: number) => "$" + (Math.round(n / 1000) * 1000).toLocaleString("es-CL");

/** A peso amount that rolls to its new value when it changes. */
export function AnimatedClp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  // React renders the first value only; later values are written by the animation, so React never fights it for the text
  const first = useRef(fmt(value));
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = fmt(value);
      from.current = value;
      return;
    }
    const c = animate(from.current, value, {
      duration: 0.45,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    from.current = value;
    return () => c.stop();
  }, [value, reduce]);

  return <span ref={ref}>{first.current}</span>;
}
