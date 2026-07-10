import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Droplets, Sun, AlertTriangle, CheckCircle2, Leaf } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Plant } from "@/data/plants";

const DIFF_COLOR: Record<string, string> = {
  Easy:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Moderate: "bg-amber-50  text-amber-700  border-amber-200",
  Expert:   "bg-red-50    text-red-700    border-red-200",
};

export default function PlantDetailModal({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus close button on open; restore focus on close
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-white shadow-2xl"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1   }}
        exit={{   opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Coloured header */}
        <div className={`relative overflow-hidden p-6 ${plant.color}`}>
          {/* Decorative ring */}
          <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/20" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-12 -left-4 size-32 rounded-full bg-white/10" aria-hidden="true" />

          <div className="relative flex items-start justify-between">
            <div>
              <motion.div
                className="mb-3 text-6xl leading-none"
                aria-hidden="true"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              >
                {plant.emoji}
              </motion.div>
              <motion.h2
                id="modal-title"
                className="text-2xl font-bold text-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                {plant.name}
              </motion.h2>
              <p className="mt-0.5 text-sm italic text-muted-foreground">{plant.scientific}</p>
            </div>

            <motion.button
              ref={closeRef}
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
              aria-label="Close plant detail"
            >
              <X className="size-5" />
            </motion.button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-5">

          {/* Badges */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${DIFF_COLOR[plant.difficulty]}`}>
              {plant.difficulty}
            </span>
            {plant.petSafe ? (
              <span className="flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                <CheckCircle2 className="size-3" /> Pet Safe 🐾
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                <AlertTriangle className="size-3" /> Not Pet Safe
              </span>
            )}
          </motion.div>

          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
              <div className="flex items-center gap-1.5 text-sky-600 mb-1.5">
                <Sun className="size-4" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Light</span>
              </div>
              <p className="text-base font-bold text-foreground">{plant.light}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {plant.light === "Low" ? "Shade tolerant" :
                 plant.light === "Medium" ? "Indirect sunlight" :
                 plant.light === "Bright" ? "Near a window" : "Full sun"}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-1.5 text-blue-600 mb-1.5">
                <Droplets className="size-4" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Water</span>
              </div>
              <p className="text-base font-bold text-foreground">{plant.water}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {plant.water === "Low" ? "Every 2–3 weeks" :
                 plant.water === "Medium" ? "Weekly or so" : "Every few days"}
              </p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-sm leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {plant.description}
          </motion.p>

          <Separator />

          {/* Care tips */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="size-4 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Care Tips
              </h3>
            </div>
            <ul className="space-y-3" role="list">
              {plant.tips.map((tip, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-sm text-foreground"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                    {i + 1}
                  </span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {plant.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
