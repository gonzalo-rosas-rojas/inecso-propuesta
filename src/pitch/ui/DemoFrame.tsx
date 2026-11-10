import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { demoUrl } from "./demoUrl";

export type DemoFrameHandle = {
  /** go to a demo route (#/obras …) without reloading */
  go: (hash: string) => void;
  /** scroll the demo page to a fraction (0..1) of its height */
  scrollTo: (frac: number) => void;
  /** scroll the demo page to an element id (if the route has it), returns false when it does not exist */
  scrollToId: (id: string, frac?: number) => boolean;
};

type Props = {
  /** the width the demo is laid out at (1280 = computer, 390 = phone) */
  layoutWidth: number;
  /** layout height; when omitted the frame's aspect decides */
  layoutHeight?: number;
  hash: string;
  interactive?: boolean;
  title: string;
  className?: string;
  onReady?: () => void;
};

/** The real demo in an iframe, laid out at its true width and scaled to fit the frame (so nothing reflows). */
export const DemoFrame = forwardRef<DemoFrameHandle, Props>(function DemoFrame(
  { layoutWidth, layoutHeight, hash, interactive = false, title, className, onReady },
  ref,
) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.5);
  const [h, setH] = useState(layoutHeight ?? 800);
  const [src] = useState(() => demoUrl(hash));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const s = el.clientWidth / layoutWidth;
      setScale(s);
      setH(layoutHeight ?? el.clientHeight / s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [layoutWidth, layoutHeight]);

  const win = () => {
    try {
      return frame.current?.contentWindow ?? null;
    } catch {
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    go(next) {
      const w = win();
      if (!w) return;
      if (w.location.hash !== next) w.location.hash = next;
    },
    scrollTo(frac) {
      const w = win();
      const doc = w?.document.documentElement; // null while the iframe is still loading its page
      if (!w || !doc) return;
      const max = Math.max(0, doc.scrollHeight - w.innerHeight);
      w.scrollTo({ top: max * frac, behavior: "instant" as ScrollBehavior });
    },
    scrollToId(id, frac = 0) {
      const w = win();
      const el = w?.document.getElementById(id);
      if (!w || !el) return false;
      const top = el.getBoundingClientRect().top + w.scrollY - 70 + el.offsetHeight * frac;
      w.scrollTo({ top, behavior: "instant" as ScrollBehavior });
      return true;
    },
  }));

  useEffect(() => {
    const w = win();
    if (w && w.location.hash !== hash) w.location.hash = hash;
  }, [hash]);

  return (
    <div ref={box} className={cn("relative overflow-hidden bg-blanco", className)}>
      <iframe
        ref={frame}
        src={src}
        title={title}
        tabIndex={interactive ? 0 : -1}
        aria-hidden={interactive ? undefined : true}
        className={cn("vista-demo", !interactive && "pointer-events-none")}
        style={{ width: layoutWidth, height: h, transform: `scale(${scale})` }}
        onLoad={onReady}
      />
    </div>
  );
});
