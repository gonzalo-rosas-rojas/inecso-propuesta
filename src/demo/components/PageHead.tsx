import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Header of an inner page: a blueprint band with the title, and optionally a photo on the right. */
export function PageHead({ titulo, children, img, className }: { titulo: string; children?: ReactNode; img?: string; className?: string }) {
  return (
    <section className={cn("plano relative overflow-hidden text-blanco", className)}>
      {img && (
        <motion.img
          src={img}
          alt=""
          className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-cover opacity-70 md:block [mask-image:linear-gradient(90deg,transparent,#000_45%)]"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-14 sm:px-6 lg:pt-20 lg:pb-20">
        <motion.h1
          className="wdth-125 max-w-3xl text-[clamp(2.2rem,1.3rem+3.6vw,4.2rem)] leading-[0.98] font-extrabold text-balance"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {titulo}
        </motion.h1>
        {children && (
          <motion.div className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-papel/78" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}>
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
