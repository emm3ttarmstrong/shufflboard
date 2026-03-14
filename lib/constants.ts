export const DEFAULT_CATEGORIES = [
  {
    name: "Color Palette",
    type: "text" as const,
    options: [
      "Warm Earth Tones",
      "Cool Ocean Blues",
      "Neon & Vibrant",
      "Monochrome",
      "Pastel Soft",
      "Dark & Moody",
      "Sunset Gradient",
      "Forest Greens",
    ],
    sort_order: 0,
  },
  {
    name: "Typography",
    type: "text" as const,
    options: [
      "Bold Sans-Serif",
      "Elegant Serif",
      "Handwritten Script",
      "Monospaced Technical",
      "Mixed Type Pairing",
      "Oversized Display",
      "Minimal Grotesque",
      "Retro Slab",
    ],
    sort_order: 1,
  },
  {
    name: "Layout Style",
    type: "text" as const,
    options: [
      "Asymmetric Grid",
      "Clean Whitespace",
      "Full-Bleed Imagery",
      "Card-Based",
      "Split Screen",
      "Layered Overlap",
      "Single Column",
      "Bento Grid",
    ],
    sort_order: 2,
  },
  {
    name: "Visual Mood",
    type: "text" as const,
    options: [
      "Calm & Serene",
      "Energetic & Bold",
      "Luxurious & Premium",
      "Playful & Fun",
      "Professional & Clean",
      "Organic & Natural",
      "Futuristic & Tech",
      "Nostalgic & Warm",
    ],
    sort_order: 3,
  },
  {
    name: "Design Era",
    type: "text" as const,
    options: [
      "Y2K Revival",
      "Mid-Century Modern",
      "Swiss International",
      "Art Deco",
      "90s Grunge",
      "Bauhaus",
      "Contemporary Minimal",
      "Brutalist",
    ],
    sort_order: 4,
  },
  {
    name: "Industry Context",
    type: "text" as const,
    options: [
      "SaaS / Tech",
      "E-Commerce / Retail",
      "Health & Wellness",
      "Finance / Fintech",
      "Creative Agency",
      "Food & Beverage",
      "Education / EdTech",
      "Travel & Hospitality",
    ],
    sort_order: 5,
  },
]

export const PROMPT_TEMPLATE = (selections: Record<string, string>) => {
  const parts: string[] = []

  const industry = selections["Industry Context"]
  const color = selections["Color Palette"]
  const typography = selections["Typography"]
  const layout = selections["Layout Style"]
  const mood = selections["Visual Mood"]
  const era = selections["Design Era"]

  if (industry) {
    parts.push(`Design a ${industry} landing page`)
  } else {
    parts.push("Design a landing page")
  }

  if (color) parts.push(`with a ${color} color palette`)
  if (typography) parts.push(`${typography} typography`)
  if (layout) parts.push(`a ${layout} layout`)
  if (mood) parts.push(`The visual mood should be ${mood}`)
  if (era) parts.push(`with ${era} aesthetic influences`)

  return parts.join(". ").replace(/\.\./g, ".") + "."
}

export const APP_NAME = "Shufflboard"
export const APP_DESCRIPTION = "Shuffle your way to design inspiration"
