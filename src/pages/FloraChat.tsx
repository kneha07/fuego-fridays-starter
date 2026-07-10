import { useState, useRef, useEffect } from "react";
import { Send, Leaf, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Message, MessageAvatar, MessageContent, MessageHeader,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  MessageScroller, MessageScrollerViewport, MessageScrollerContent,
  MessageScrollerItem, MessageScrollerButton, MessageScrollerProvider,
} from "@/components/ui/message-scroller";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMsg { id: string; role: "flora" | "user"; text: string; }

const STARTERS = [
  { text: "How often should I water my Monstera?", emoji: "💧" },
  { text: "Which plants are safe for cats?",        emoji: "🐾" },
  { text: "Best plants for a dark apartment?",       emoji: "🌑" },
  { text: "Why are my leaves turning yellow?",       emoji: "🍂" },
  { text: "How do I propagate Pothos?",              emoji: "✂️" },
  { text: "What's the easiest plant for beginners?", emoji: "🌱" },
];

const FLORA_RESPONSES: Record<string, string> = {
  default:    "Great question! The most important thing is to observe your plant regularly — each one has unique needs based on its environment. Would you like specific advice on watering, light, or soil?",
  water:      "Watering is the most common cause of plant problems! The golden rule: most houseplants prefer to dry out slightly between waterings. Stick your finger 1–2 inches into soil — if dry, water until it drains from the bottom. Always empty the saucer after 30 minutes to prevent root rot. 💧",
  yellow:     "Yellow leaves usually signal one of three things: overwatering (most common 😬), underwatering, or too little light. Check the soil first — if soggy, let it dry completely. If bone dry, give it a deep water. If watering seems fine, try moving it closer to a window. 🍂",
  cat:        "Great news for cat owners! 🐾 These are 100% cat-safe: Spider Plant, Boston Fern, Calathea, Peperomia, and Air Plants. Avoid Pothos, Monstera, Peace Lily, and Snake Plant — they can cause digestive upset in cats and dogs.",
  dark:       "Low-light champions to the rescue! 🌑 Snake Plant thrives on neglect, Pothos adapts to almost anything, Peace Lily will even flower in shade, and ZZ Plant stores water in its roots. All four handle north-facing windows or office lighting beautifully.",
  monstera:   "Monsteras love consistency! 🌿 Water when the top 2 inches of soil are dry — typically every 1–2 weeks. They adore humidity, bright indirect light, and a moss pole to climb. That iconic leaf splitting (fenestration) happens when the plant matures and gets enough light.",
  propagate:  "Pothos propagation is one of the easiest! ✂️ Snip a cutting just below a node (the little bump on the stem), remove the lower leaves, and place in a glass of water on a bright windowsill. Roots appear in 2–4 weeks. Once they're 2–3 inches long, pot in soil and watch it thrive.",
  beginner:   "For absolute beginners, I always recommend the Snake Plant 🗡️ — it tolerates low light, infrequent watering (every 2–6 weeks!), and almost any condition. Pothos is a close second: you can pretty much ignore it and it'll still trail beautifully. Both are virtually indestructible! 💪",
};

function getFloraResponse(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("water") || m.includes("often") || m.includes("how much"))         return FLORA_RESPONSES.water;
  if (m.includes("yellow") || m.includes("brown") || m.includes("dying"))            return FLORA_RESPONSES.yellow;
  if (m.includes("cat") || m.includes("dog") || m.includes("pet") || m.includes("safe")) return FLORA_RESPONSES.cat;
  if (m.includes("dark") || m.includes("low light") || m.includes("no light") || m.includes("apartment")) return FLORA_RESPONSES.dark;
  if (m.includes("monstera"))                                                          return FLORA_RESPONSES.monstera;
  if (m.includes("propagat") || m.includes("cutting") || m.includes("pothos"))       return FLORA_RESPONSES.propagate;
  if (m.includes("beginner") || m.includes("easiest") || m.includes("easy"))         return FLORA_RESPONSES.beginner;
  return FLORA_RESPONSES.default;
}

const INITIAL_MSG: ChatMsg = {
  id: "flora-0",
  role: "flora",
  text: "Hi! I'm Flora 🌿 — your AI plant care expert. Ask me anything about plant care, identification, or finding the perfect plant for your space.",
};

export default function FloraChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MSG]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  // Focus input on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `f-${Date.now()}`, role: "flora", text: getFloraResponse(trimmed) },
      ]);
    }, 900 + Math.random() * 700);
  }

  function clearChat() {
    setMessages([INITIAL_MSG]);
    setInput("");
    textareaRef.current?.focus();
  }

  const charCount = input.length;

  return (
    <div className="mx-auto flex h-[calc(100dvh-65px)] max-w-2xl flex-col gap-3 px-4 py-5">

      {/* Flora header */}
      <motion.div
        className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 px-5 py-3.5 shadow-sm"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
        >
          <Leaf className="size-5 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-foreground">Flora AI</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="size-2.5" /> AI
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Plant care expert · Always available</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <motion.span
              className="size-2 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Online
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearChat}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/60 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Clear chat history"
            title="Clear chat"
          >
            <RefreshCw className="size-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Chat messages */}
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <MessageScrollerViewport>
            <MessageScrollerContent className="px-4 py-5">
              {messages.map((msg, i) => (
                <MessageScrollerItem key={msg.id} scrollAnchor={i === messages.length - 1}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {msg.role === "flora" ? (
                      <Message className="mb-5">
                        <MessageAvatar>
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-[10px] font-bold">FL</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                          <MessageHeader className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Flora · Plant AI
                          </MessageHeader>
                          <Bubble variant="secondary">
                            <BubbleContent className="text-sm leading-relaxed">{msg.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    ) : (
                      <Message align="end" className="mb-5">
                        <MessageAvatar>
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-secondary text-[10px] font-semibold text-muted-foreground">YOU</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble variant="default" align="end">
                            <BubbleContent className="text-sm leading-relaxed">{msg.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    )}
                  </motion.div>
                </MessageScrollerItem>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <MessageScrollerItem scrollAnchor>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      <Message className="mb-4">
                        <MessageAvatar>
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-[10px] font-bold">FL</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble variant="secondary">
                            <BubbleContent className="flex items-center gap-1.5 py-3 px-4">
                              {[0, 150, 300].map((delay, i) => (
                                <motion.span
                                  key={i}
                                  className="size-2 rounded-full bg-emerald-400"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                                />
                              ))}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </motion.div>
                  </MessageScrollerItem>
                )}
              </AnimatePresence>
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      {/* Starter chips */}
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Suggested questions"
      >
        {STARTERS.map((s) => (
          <motion.button
            key={s.text}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => send(s.text)}
            disabled={typing}
            className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={s.text}
          >
            <span aria-hidden="true">{s.emoji}</span>
            <span className="hidden sm:inline">{s.text}</span>
            <span className="sm:hidden">{s.text.split(" ").slice(0, 3).join(" ")}…</span>
          </motion.button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Ask Flora anything about plant care…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-2xl border-border bg-white pr-12 text-sm shadow-sm transition-shadow focus-visible:shadow-md focus-visible:ring-emerald-500/30"
            aria-label="Message Flora"
            aria-describedby="char-count"
            disabled={typing}
          />
          {charCount > 0 && (
            <span
              id="char-count"
              className="absolute bottom-2 right-2 text-[10px] text-muted-foreground"
              aria-live="polite"
            >
              {charCount}/500
            </span>
          )}
        </div>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="mb-0.5 size-11 shrink-0 rounded-2xl bg-emerald-600 p-0 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 focus-visible:ring-emerald-500"
            aria-label="Send message to Flora"
          >
            <Send className="size-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
