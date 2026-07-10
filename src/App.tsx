import { useState } from "react";
import { Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import PlantGallery from "@/pages/PlantGallery";
import FloraChat from "@/pages/FloraChat";
import MyPlants from "@/pages/MyPlants";
import PlantFinder from "@/pages/PlantFinder";

export type Page = "gallery" | "my-plants" | "chat" | "finder";

const NAV: { id: Page; label: string; emoji: string; desc: string }[] = [
  { id: "gallery",    label: "Plants",        emoji: "🌿", desc: "Browse plant gallery" },
  { id: "finder",     label: "Plant Finder",  emoji: "🔍", desc: "Find your perfect plant" },
  { id: "my-plants",  label: "My Collection", emoji: "🪴", desc: "Track your plants" },
  { id: "chat",       label: "Flora AI",      emoji: "🤖", desc: "Chat with plant AI" },
];

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

export default function App() {
  const [page, setPage] = useState<Page>("gallery");

  return (
    <div className="flex min-h-dvh flex-col bg-[#f7f9f5] text-foreground">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-white/95 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
              <Leaf className="size-4.5 text-white" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-400" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <span className="font-display text-base font-bold tracking-tight text-foreground">Plantopia</span>
              <span className="ml-2 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                AI
              </span>
            </div>
          </motion.div>

          {/* Nav */}
          <nav className="flex items-center gap-0.5" aria-label="Main navigation" role="navigation">
            {NAV.map((n, i) => (
              <motion.button
                key={n.id}
                onClick={() => setPage(n.id)}
                aria-current={page === n.id ? "page" : undefined}
                aria-label={n.desc}
                title={n.desc}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                  page === n.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                )}
              >
                <span aria-hidden="true" className="text-base leading-none">{n.emoji}</span>
                <span className="hidden sm:inline">{n.label}</span>
                {page === n.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl bg-emerald-600 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content with animated transitions */}
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {page === "gallery"   && <PlantGallery onNavigate={setPage} />}
            {page === "finder"    && <PlantFinder />}
            {page === "my-plants" && <MyPlants />}
            {page === "chat"      && <FloraChat />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/50 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="text-[11px] text-muted-foreground">© 2026 Plantopia · AI-powered plant care</p>
          <p className="text-[11px] text-muted-foreground">All data is simulated · No backend</p>
        </div>
      </footer>
    </div>
  );
}
