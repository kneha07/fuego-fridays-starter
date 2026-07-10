import { useState } from "react";
import { Search, SlidersHorizontal, X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { plants, type Plant, type Difficulty, type Light } from "@/data/plants";
import { Input } from "@/components/ui/input";
import PlantDetailModal from "@/components/PlantDetailModal";
import type { Page } from "@/App";

const DIFFICULTIES: Difficulty[] = ["Easy", "Moderate", "Expert"];
const LIGHTS: Light[] = ["Low", "Medium", "Bright", "Direct"];

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  Expert:   "bg-red-50 text-red-700 border-red-200",
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as number[] } },
  exit:   { opacity: 0, scale: 0.94, transition: { duration: 0.15 } },
};

export default function PlantGallery({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [query, setQuery]       = useState("");
  const [diff, setDiff]         = useState<Difficulty | null>(null);
  const [light, setLight]       = useState<Light | null>(null);
  const [petOnly, setPetOnly]   = useState(false);
  const [selected, setSelected] = useState<Plant | null>(null);

  const filtered = plants.filter((p) => {
    if (
      query &&
      !p.name.toLowerCase().includes(query.toLowerCase()) &&
      !p.scientific.toLowerCase().includes(query.toLowerCase()) &&
      !p.tags.some((t) => t.includes(query.toLowerCase()))
    ) return false;
    if (diff && p.difficulty !== diff) return false;
    if (light && p.light !== light) return false;
    if (petOnly && !p.petSafe) return false;
    return true;
  });

  const hasFilters = !!diff || !!light || petOnly;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">

      {/* Hero */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200"
          animate={{ rotate: [0, -6, 6, -3, 0] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 5 }}
        >
          <span className="text-3xl" aria-hidden="true">🌿</span>
        </motion.div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Discover Your Perfect Plant
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          {plants.length} plants with AI-powered care guides
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search by name, type, or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-10 pr-10 rounded-2xl border-border bg-white text-sm shadow-sm transition-shadow focus-visible:shadow-md focus-visible:ring-emerald-500/30"
            aria-label="Search plants"
            aria-controls="plant-grid"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="mb-6 flex flex-wrap items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        role="group"
        aria-label="Filter plants"
      >
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Filter:
        </span>

        {DIFFICULTIES.map((d) => (
          <FilterPill
            key={d}
            label={d}
            active={diff === d}
            activeClass={DIFF_COLOR[d]}
            onClick={() => setDiff(diff === d ? null : d)}
          />
        ))}

        {LIGHTS.map((l) => (
          <FilterPill
            key={l}
            label={`${l} Light`}
            active={light === l}
            activeClass="bg-sky-50 text-sky-700 border-sky-300"
            onClick={() => setLight(light === l ? null : l)}
          />
        ))}

        <FilterPill
          label="🐾 Pet-safe"
          active={petOnly}
          activeClass="bg-teal-50 text-teal-700 border-teal-300"
          onClick={() => setPetOnly(!petOnly)}
        />

        <AnimatePresence>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={() => { setDiff(null); setLight(null); setPetOnly(false); }}
              className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition-colors"
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results count */}
      <p className="mb-4 text-xs font-medium text-muted-foreground" aria-live="polite" aria-atomic="true">
        {filtered.length} plant{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <motion.div
        id="plant-grid"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        role="list"
        aria-label="Plant gallery"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((plant) => (
            <motion.div
              key={plant.id}
              variants={cardVariants}
              exit="exit"
              layout
              role="listitem"
            >
              <PlantCard plant={plant} onClick={() => setSelected(plant)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            className="col-span-full py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-base font-semibold text-foreground">No plants match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or clearing filters</p>
          </motion.div>
        )}
      </motion.div>

      {/* CTA Banner */}
      <motion.div
        className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white shadow-xl shadow-emerald-200"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-4 text-emerald-200" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">AI-Powered</span>
            </div>
            <h2 className="text-xl font-bold">Not sure which plant fits your space?</h2>
            <p className="mt-1 text-sm text-emerald-100">
              Answer 4 questions and get a personalized match, or chat with Flora AI.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("finder")}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Take the Quiz <ArrowRight className="size-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("chat")}
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Chat with Flora
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && <PlantDetailModal plant={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Filter Pill ── */
function FilterPill({
  label, active, activeClass, onClick,
}: {
  label: string; active: boolean; activeClass: string; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
        active
          ? `${activeClass} ring-2 ring-offset-1 ring-emerald-400`
          : "border-border bg-white text-muted-foreground hover:border-foreground/20 hover:text-foreground"
      }`}
    >
      {label}
    </motion.button>
  );
}

/* ── Plant Card ── */
function PlantCard({ plant, onClick }: { plant: Plant; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
      whileTap={{ scale: 0.97 }}
      className={`group w-full rounded-2xl border border-border/60 ${plant.color} p-5 text-left shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`}
      aria-label={`View ${plant.name} care guide`}
    >
      <motion.div
        className="mb-3 text-4xl"
        aria-hidden="true"
        whileHover={{ rotate: [-2, 4, -2, 0], transition: { duration: 0.4 } }}
      >
        {plant.emoji}
      </motion.div>

      <h3 className="text-sm font-bold leading-tight text-foreground">{plant.name}</h3>
      <p className="mt-0.5 text-[11px] italic text-muted-foreground line-clamp-1">{plant.scientific}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${DIFF_COLOR[plant.difficulty]}`}>
          {plant.difficulty}
        </span>
        {plant.petSafe && (
          <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
            🐾 Safe
          </span>
        )}
      </div>

      <div className="mt-2.5 flex gap-3 text-[10px] text-muted-foreground">
        <span>💧 {plant.water}</span>
        <span>☀️ {plant.light}</span>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
        View care guide <ArrowRight className="size-3" />
      </div>
    </motion.button>
  );
}
