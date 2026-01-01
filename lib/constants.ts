export const DEFAULT_CATEGORIES = [
  {
    name: "Type",
    type: "text" as const,
    options: [
      "UI",
      "Illustration",
      "Typography",
      "Photography",
      "Brand",
      "Motion",
    ],
    sort_order: 0,
  },
  {
    name: "Style",
    type: "text" as const,
    options: [
      "Minimal",
      "Bold",
      "Playful",
      "Corporate",
      "Retro",
      "Futuristic",
    ],
    sort_order: 1,
  },
  {
    name: "Platform",
    type: "text" as const,
    options: ["Web", "Mobile", "Print", "Social", "Email"],
    sort_order: 2,
  },
  {
    name: "Color Palette",
    type: "color" as const,
    options: [],
    sort_order: 3,
  },
]

export const APP_NAME = "Shufflboard"
export const APP_DESCRIPTION = "Turn your saved inspiration into real design fuel"
