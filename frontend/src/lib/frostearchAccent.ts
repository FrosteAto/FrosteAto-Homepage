export type Accent = "purple" | "blue" | "yellow";

export const accentText: Record<Accent, string> = {
  purple: "text-frostearch-purple",
  blue: "text-frostearch-blue",
  yellow: "text-frostearch-yellow",
};

export const accentBorder: Record<Accent, string> = {
  purple: "border-t-frostearch-purple",
  blue: "border-t-frostearch-blue",
  yellow: "border-t-frostearch-yellow",
};

export const accentBg: Record<Accent, string> = {
  purple: "bg-frostearch-purple",
  blue: "bg-frostearch-blue",
  yellow: "bg-frostearch-yellow",
};

export const accentHoverBorder: Record<Accent, string> = {
  purple: "hover:border-frostearch-purple/70",
  blue: "hover:border-frostearch-blue/70",
  yellow: "hover:border-frostearch-yellow/70",
};
