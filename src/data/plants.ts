export type Difficulty = "Easy" | "Moderate" | "Expert";
export type Light = "Low" | "Medium" | "Bright" | "Direct";
export type Water = "Low" | "Medium" | "High";

export interface Plant {
  id: string;
  name: string;
  scientific: string;
  emoji: string;
  difficulty: Difficulty;
  light: Light;
  water: Water;
  petSafe: boolean;
  description: string;
  tips: string[];
  tags: string[];
  color: string; // tailwind bg class
}

export const plants: Plant[] = [
  {
    id: "p1", name: "Monstera", scientific: "Monstera deliciosa",
    emoji: "🌿", difficulty: "Moderate", light: "Medium", water: "Medium", petSafe: false,
    description: "Iconic split leaves that make any space feel like a tropical jungle. Fast grower with the right light.",
    tips: ["Water when top 2 inches of soil are dry", "Wipe leaves monthly to keep them glossy", "Provide a moss pole for support as it grows"],
    tags: ["tropical", "statement", "fast-growing"], color: "bg-emerald-50",
  },
  {
    id: "p2", name: "Snake Plant", scientific: "Sansevieria trifasciata",
    emoji: "🗡️", difficulty: "Easy", light: "Low", water: "Low", petSafe: false,
    description: "Nearly indestructible. Tolerates low light and infrequent watering — perfect for beginners.",
    tips: ["Water only every 2–6 weeks", "Thrives in neglect — less is more", "One of the best air-purifying plants"],
    tags: ["beginner", "low-light", "air-purifier"], color: "bg-yellow-50",
  },
  {
    id: "p3", name: "Pothos", scientific: "Epipremnum aureum",
    emoji: "🍃", difficulty: "Easy", light: "Low", water: "Low", petSafe: false,
    description: "Cascading vines with heart-shaped leaves. Trails beautifully from shelves or hanging baskets.",
    tips: ["Tolerates low light but grows faster in bright indirect", "Propagates easily in water", "Yellow leaves = overwatering"],
    tags: ["trailing", "beginner", "low-light"], color: "bg-lime-50",
  },
  {
    id: "p4", name: "Peace Lily", scientific: "Spathiphyllum",
    emoji: "🤍", difficulty: "Easy", light: "Low", water: "Medium", petSafe: false,
    description: "Elegant white blooms that thrive in low light. Droops dramatically when thirsty — easy to read.",
    tips: ["Water when leaves start to droop slightly", "Keep away from cold drafts", "Wipe dusty leaves to help it breathe"],
    tags: ["flowering", "low-light", "air-purifier"], color: "bg-slate-50",
  },
  {
    id: "p5", name: "Spider Plant", scientific: "Chlorophytum comosum",
    emoji: "🕷️", difficulty: "Easy", light: "Medium", water: "Medium", petSafe: true,
    description: "Pet-safe and prolific. Sends out 'spiderettes' you can propagate and share with friends.",
    tips: ["Produces babies when slightly root-bound", "Tolerates irregular watering", "Great for hanging baskets"],
    tags: ["pet-safe", "beginner", "trailing"], color: "bg-green-50",
  },
  {
    id: "p6", name: "Fiddle Leaf Fig", scientific: "Ficus lyrata",
    emoji: "🎻", difficulty: "Expert", light: "Bright", water: "Medium", petSafe: false,
    description: "A design icon with large, dramatic leaves. Rewards patience and consistency with stunning growth.",
    tips: ["Hates being moved — find its spot and leave it", "Water consistently, never let it sit in water", "Needs bright indirect light for at least 6 hours"],
    tags: ["statement", "designer", "dramatic"], color: "bg-amber-50",
  },
  {
    id: "p7", name: "Calathea", scientific: "Calathea orbifolia",
    emoji: "🎨", difficulty: "Expert", light: "Medium", water: "High", petSafe: true,
    description: "Stunning patterned leaves that fold up at night. A living piece of art — but demanding.",
    tips: ["Use filtered or distilled water — sensitive to fluoride", "High humidity is essential", "Keep away from direct sun or cold air"],
    tags: ["pet-safe", "patterned", "humidity-lover"], color: "bg-teal-50",
  },
  {
    id: "p8", name: "Aloe Vera", scientific: "Aloe barbadensis miller",
    emoji: "🌵", difficulty: "Easy", light: "Bright", water: "Low", petSafe: false,
    description: "A practical beauty — soothing gel inside, architectural form outside. Nearly thrives on neglect.",
    tips: ["Water deeply but infrequently (every 3 weeks)", "Plant in fast-draining cactus mix", "Gel soothes minor burns and skin irritation"],
    tags: ["succulent", "medicinal", "beginner"], color: "bg-green-50",
  },
  {
    id: "p9", name: "Boston Fern", scientific: "Nephrolepis exaltata",
    emoji: "🌱", difficulty: "Moderate", light: "Medium", water: "High", petSafe: true,
    description: "Lush, feathery fronds that love humidity. A classic for bathrooms and shaded porches.",
    tips: ["Mist daily or use a pebble tray with water", "Keep soil consistently moist but not soggy", "Yellowing fronds = too dry or too much sun"],
    tags: ["pet-safe", "fern", "humidity-lover"], color: "bg-emerald-50",
  },
  {
    id: "p10", name: "Rubber Plant", scientific: "Ficus elastica",
    emoji: "🔴", difficulty: "Moderate", light: "Bright", water: "Medium", petSafe: false,
    description: "Bold burgundy or dark green leaves with a glossy finish. Makes a dramatic floor plant.",
    tips: ["Wipe leaves to keep the gloss", "Water when top inch is dry", "Prune in spring to encourage bushier growth"],
    tags: ["statement", "bold", "floor-plant"], color: "bg-red-50",
  },
  {
    id: "p11", name: "Peperomia", scientific: "Peperomia obtusifolia",
    emoji: "💚", difficulty: "Easy", light: "Medium", water: "Low", petSafe: true,
    description: "Compact, cheerful, and forgiving. Hundreds of varieties — endlessly collectible.",
    tips: ["Drought-tolerant — underwater rather than over", "Perfect for desks and small spaces", "Propagates easily from a single leaf"],
    tags: ["pet-safe", "compact", "beginner"], color: "bg-lime-50",
  },
  {
    id: "p12", name: "Bird of Paradise", scientific: "Strelitzia reginae",
    emoji: "🦅", difficulty: "Moderate", light: "Direct", water: "Medium", petSafe: false,
    description: "Grand, paddle-shaped leaves that split naturally. A showstopper that can grow ceiling-high.",
    tips: ["Needs several hours of direct sun to thrive", "Grows slowly but lives for decades", "Dust leaves to maximize photosynthesis"],
    tags: ["statement", "tropical", "floor-plant"], color: "bg-orange-50",
  },
];
