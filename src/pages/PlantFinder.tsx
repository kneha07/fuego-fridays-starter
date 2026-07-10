import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Leaf, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plants, type Plant } from "@/data/plants";

interface Question {
  id: string;
  text: string;
  icon: string;
  options: { label: string; value: string; emoji: string; desc: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "light",
    icon: "☀️",
    text: "How much natural light does your space get?",
    options: [
      { label: "Very little",       value: "Low",    emoji: "🌑", desc: "North-facing or no windows" },
      { label: "Some indirect",     value: "Medium", emoji: "🌤", desc: "East or filtered light" },
      { label: "Bright indirect",   value: "Bright", emoji: "☀️", desc: "Near a south/west window" },
      { label: "Direct sunlight",   value: "Direct", emoji: "🌞", desc: "Full sun most of the day" },
    ],
  },
  {
    id: "experience",
    icon: "🌱",
    text: "How experienced are you with plants?",
    options: [
      { label: "Total beginner",      value: "Easy",     emoji: "🌱", desc: "Never had a plant before" },
      { label: "Some experience",     value: "Moderate", emoji: "🌿", desc: "Kept a few alive" },
      { label: "Plant parent pro",    value: "Expert",   emoji: "🪴", desc: "I have a jungle at home" },
    ],
  },
  {
    id: "pets",
    icon: "🐾",
    text: "Do you have pets at home?",
    options: [
      { label: "Yes — safety first", value: "yes", emoji: "🐾", desc: "Cats, dogs, or other animals" },
      { label: "No pets",            value: "no",  emoji: "✅", desc: "No animals in the house" },
    ],
  },
  {
    id: "style",
    icon: "🎨",
    text: "What vibe are you going for?",
    options: [
      { label: "Statement piece", value: "statement", emoji: "🎭", desc: "Bold, dramatic focal point" },
      { label: "Lush & trailing", value: "trailing",  emoji: "🌊", desc: "Cascading, flowing greenery" },
      { label: "Compact & tidy",  value: "compact",   emoji: "📐", desc: "Small, neat, desk-friendly" },
      { label: "Tropical feel",   value: "tropical",  emoji: "🌴", desc: "Vacation vibes year-round" },
    ],
  },
];

type Answers = Record<string, string>;

function getRecommendations(answers: Answers): Plant[] {
  return plants
    .map((p) => {
      let score = 0;
      if (answers.light === p.light) score += 3;
      else if (
        (answers.light === "Medium" && p.light === "Low") ||
        (answers.light === "Bright" && p.light === "Medium")
      ) score += 1;
      if (answers.experience === p.difficulty) score += 3;
      else if (answers.experience === "Expert") score += 1;
      if (answers.pets === "yes" && p.petSafe) score += 2;
      if (answers.pets === "no") score += 1;
      if (answers.style && p.tags.includes(answers.style)) score += 2;
      return { plant: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.plant);
}

const DIFF_STYLE: Record<string, string> = {
  Easy:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Moderate: "bg-amber-50  text-amber-700  border-amber-200",
  Expert:   "bg-red-50    text-red-700    border-red-200",
};

export default function PlantFinder() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Plant[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  function answer(value: string) {
    setSelected(value);
    const q = QUESTIONS[step];
    const newAnswers = { ...answers, [q.id]: value };

    setTimeout(() => {
      setSelected(null);
      setAnswers(newAnswers);
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setResults(getRecommendations(newAnswers));
      }
    }, 320);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResults(null);
    setSelected(null);
  }

  const progressPct = (step / QUESTIONS.length) * 100;

  return (
    <div className="mx-auto max-w-lg px-6 py-10">

      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200"
          animate={{ rotate: [0, -4, 4, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
        >
          <Leaf className="size-8 text-white" />
        </motion.div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Plant Finder</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Answer {QUESTIONS.length} questions to find your perfect match
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Progress bar */}
            <div className="mb-6" aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                <span className="font-medium">
                  {QUESTIONS[step].icon} Question {step + 1} of {QUESTIONS.length}
                </span>
                <span>{Math.round(progressPct)}% complete</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary" role="progressbar"
                aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              {/* Step dots */}
              <div className="mt-3 flex justify-center gap-2" aria-hidden="true">
                {QUESTIONS.map((_, i) => (
                  <motion.span
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i < step ? "size-2 bg-emerald-500" :
                      i === step ? "h-2 w-5 bg-emerald-500" :
                      "size-2 bg-secondary"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question card */}
            <div className="rounded-3xl border border-border bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-6 text-center leading-snug">
                {QUESTIONS[step].text}
              </h2>
              <div
                className={`grid gap-3 ${QUESTIONS[step].options.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}
                role="group"
                aria-label={QUESTIONS[step].text}
              >
                {QUESTIONS[step].options.map((opt) => (
                  <motion.button
                    key={opt.value}
                    onClick={() => answer(opt.value)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    animate={selected === opt.value ? { scale: [1, 0.95, 1.02, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                      selected === opt.value
                        ? "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100"
                        : "border-border bg-secondary hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm"
                    }`}
                    aria-label={`${opt.label}: ${opt.desc}`}
                  >
                    <span className="text-2xl" aria-hidden="true">{opt.emoji}</span>
                    <span className="text-sm font-semibold text-foreground leading-tight">{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{opt.desc}</span>
                    {selected === opt.value && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 text-center">
              <motion.p
                className="text-4xl mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              >
                🌟
              </motion.p>
              <h2 className="text-2xl font-bold text-foreground">Your Perfect Plants</h2>
              <p className="text-sm text-muted-foreground mt-1">Matched to your space and experience</p>
            </div>

            <div className="space-y-4">
              {results.map((plant, i) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.3 }}
                  className={`relative overflow-hidden rounded-2xl border border-border/60 ${plant.color} p-5 shadow-sm`}
                >
                  {i === 0 && (
                    <motion.div
                      className="absolute right-0 top-0"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      <div className="rounded-bl-2xl bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        Best Match ✨
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-start gap-4">
                    <motion.span
                      className="text-4xl shrink-0"
                      aria-hidden="true"
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 0 }}
                      transition={{ delay: 0.1 + i * 0.12, type: "spring" }}
                    >
                      {plant.emoji}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground">{plant.name}</h3>
                      <p className="text-[11px] italic text-muted-foreground mb-2">{plant.scientific}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{plant.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${DIFF_STYLE[plant.difficulty]}`}>
                          {plant.difficulty}
                        </span>
                        <span className="rounded-full border border-border bg-white/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          💧 {plant.water}
                        </span>
                        <span className="rounded-full border border-border bg-white/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          ☀️ {plant.light}
                        </span>
                        {plant.petSafe && (
                          <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                            🐾 Pet safe
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                className="flex-1 gap-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl h-11"
                onClick={reset}
              >
                <RotateCcw className="size-4" /> Try Again
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl h-11"
                onClick={reset}
              >
                Save Results <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
