import { useState } from "react";
import { Droplets, Plus, Trash2, AlertCircle, Leaf, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { plants, type Plant } from "@/data/plants";
import { cn } from "@/lib/utils";

interface MyPlant { id: string; plant: Plant; lastWatered: Date; nickname: string; }

function daysSince(d: Date) {
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function waterStatus(plant: Plant, lastWatered: Date) {
  const days = daysSince(lastWatered);
  const threshold = plant.water === "High" ? 2 : plant.water === "Medium" ? 5 : 10;
  if (days >= threshold)     return { label: `${days}d — needs water!`, color: "text-red-600",   ring: "ring-red-200",    bg: "bg-red-50",    urgent: true,  soon: false };
  if (days >= threshold - 1) return { label: `${days}d — water soon`,   color: "text-amber-600", ring: "ring-amber-200",  bg: "bg-amber-50",  urgent: false, soon: true  };
  return                            { label: `${days}d ago`,             color: "text-emerald-600",ring: "ring-emerald-100",bg: "bg-emerald-50",urgent: false, soon: false };
}

const SAMPLE_PLANTS = ["p1", "p2", "p5"];

export default function MyPlants() {
  const [collection, setCollection] = useState<MyPlant[]>(
    SAMPLE_PLANTS.map((id, i) => ({
      id: `my-${id}`,
      plant: plants.find((p) => p.id === id)!,
      lastWatered: new Date(Date.now() - [3, 8, 1][i] * 86400000),
      nickname: ["My Monstera", "Living Room Snake", "Shower Spider"][i],
    }))
  );
  const [adding, setAdding]   = useState(false);
  const [search, setSearch]   = useState("");
  const [watered, setWatered] = useState<string | null>(null); // for success animation

  const suggestions = plants.filter(
    (p) =>
      !collection.some((c) => c.plant.id === p.id) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  function addPlant(plant: Plant) {
    setCollection((c) => [
      ...c,
      { id: `my-${plant.id}-${Date.now()}`, plant, lastWatered: new Date(), nickname: plant.name },
    ]);
    setAdding(false);
    setSearch("");
  }

  function water(id: string) {
    setCollection((c) => c.map((p) => p.id === id ? { ...p, lastWatered: new Date() } : p));
    setWatered(id);
    setTimeout(() => setWatered(null), 1800);
  }

  function remove(id: string) {
    setCollection((c) => c.filter((p) => p.id !== id));
  }

  const urgent = collection.filter((p) => waterStatus(p.plant, p.lastWatered).urgent);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">

      {/* Header */}
      <motion.div
        className="mb-7 flex items-start justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">My Collection</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {collection.length} plant{collection.length !== 1 ? "s" : ""}
            {urgent.length > 0 && (
              <span className="ml-2 text-red-600 font-medium">· {urgent.length} need water 💧</span>
            )}
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-sm"
            onClick={() => setAdding(true)}
            aria-label="Add a new plant to your collection"
          >
            <Plus className="size-4" /> Add Plant
          </Button>
        </motion.div>
      </motion.div>

      {/* Urgent alert */}
      <AnimatePresence>
        {urgent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <AlertCircle className="size-4 text-red-600" />
              </motion.div>
              <span className="text-sm font-semibold text-red-700">
                {urgent.length} plant{urgent.length > 1 ? "s" : ""} need watering now
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {urgent.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => water(p.id)}
                  className="flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  aria-label={`Water ${p.nickname}`}
                >
                  <Droplets className="size-3" /> Water {p.nickname}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <motion.div
        className="mb-6 grid grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: "Total Plants", value: collection.length, emoji: "🪴" },
          { label: "Need Water",   value: urgent.length,     emoji: "💧", highlight: urgent.length > 0 },
          { label: "Healthy",      value: collection.length - urgent.length, emoji: "✅" },
        ].map(({ label, value, emoji, highlight }) => (
          <div
            key={label}
            className={`rounded-2xl border p-4 text-center transition-colors ${
              highlight ? "border-red-200 bg-red-50" : "border-border bg-white"
            } shadow-sm`}
          >
            <p className="text-xl" aria-hidden="true">{emoji}</p>
            <p className={`text-xl font-bold tabular-nums ${highlight ? "text-red-600" : "text-foreground"}`}>
              {value}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Plant list */}
      {collection.length === 0 ? (
        <motion.div
          className="rounded-3xl border border-dashed border-border bg-white py-20 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <motion.p
            className="text-5xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🪴
          </motion.p>
          <p className="text-base font-semibold text-foreground">No plants yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Add your first plant to start tracking care</p>
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700 gap-2" onClick={() => setAdding(true)}>
            <Plus className="size-4" /> Add your first plant
          </Button>
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <AnimatePresence initial={false}>
            {collection.map((item, idx) => {
              const status = waterStatus(item.plant, item.lastWatered);
              const isWatered = watered === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.22, delay: idx * 0.04 }}
                  className={idx > 0 ? "border-t border-border" : ""}
                >
                  <div className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30">
                    {/* Plant emoji */}
                    <motion.div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl ring-2 ${status.ring} ${item.plant.color} transition-all`}
                      whileHover={{ rotate: [-3, 3, 0], transition: { duration: 0.35 } }}
                      aria-hidden="true"
                    >
                      {item.plant.emoji}
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.nickname}</p>
                      <p className="text-[11px] italic text-muted-foreground">{item.plant.scientific}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Droplets className={cn("size-3 shrink-0", status.color)} aria-hidden="true" />
                        <span className={cn("text-[11px] font-medium", status.color)} aria-label={`Watering status: ${status.label}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {status.urgent && !isWatered && (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700"
                          aria-label="Needs water now"
                        >
                          Water now
                        </motion.span>
                      )}

                      <AnimatePresence mode="wait">
                        {isWatered ? (
                          <motion.div
                            key="done"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                          >
                            <CheckCircle2 className="size-3.5" /> Watered!
                          </motion.div>
                        ) : (
                          <motion.div key="btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1.5 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                              onClick={() => water(item.id)}
                              aria-label={`Log watering for ${item.nickname}`}
                            >
                              <Droplets className="size-3" /> Watered
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => remove(item.id)}
                        className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        aria-label={`Remove ${item.nickname} from collection`}
                      >
                        <Trash2 className="size-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add plant modal */}
      <AnimatePresence>
        {adding && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Add a plant to your collection"
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAdding(false)}
            />
            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-border bg-white shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 border-b border-border bg-emerald-50 px-5 py-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600">
                  <Leaf className="size-4 text-white" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Add a Plant</h2>
              </div>
              <div className="p-4">
                <input
                  placeholder="Search plants…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30"
                  aria-label="Search plants to add"
                  autoFocus
                />
                <ul className="mt-3 max-h-60 overflow-y-auto space-y-0.5" role="list" aria-label="Available plants">
                  <AnimatePresence>
                    {suggestions.slice(0, 8).map((p, i) => (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <motion.button
                          whileHover={{ x: 3 }}
                          onClick={() => addPlant(p)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                          aria-label={`Add ${p.name} — ${p.difficulty} difficulty, ${p.light} light`}
                        >
                          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ${p.color}`} aria-hidden="true">
                            {p.emoji}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground">{p.difficulty} · {p.light} light</p>
                          </div>
                          {p.petSafe && (
                            <span className="ml-auto shrink-0 rounded-full bg-teal-50 border border-teal-200 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">
                              🐾
                            </span>
                          )}
                        </motion.button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {suggestions.length === 0 && (
                    <li className="py-8 text-center text-xs text-muted-foreground">
                      <p className="text-2xl mb-2">🌱</p>
                      All plants are already in your collection!
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
