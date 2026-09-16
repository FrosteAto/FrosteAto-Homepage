export type Accent = "purple" | "blue" | "yellow";

export const accentText: Record<Accent, string> = {
  purple: "text-khione-purple",
  blue: "text-khione-blue",
  yellow: "text-khione-yellow",
};

export const accentBorder: Record<Accent, string> = {
  purple: "border-t-khione-purple",
  blue: "border-t-khione-blue",
  yellow: "border-t-khione-yellow",
};

export const accentBg: Record<Accent, string> = {
  purple: "bg-khione-purple",
  blue: "bg-khione-blue",
  yellow: "bg-khione-yellow",
};

export const accentHoverBorder: Record<Accent, string> = {
  purple: "hover:border-khione-purple/70",
  blue: "hover:border-khione-blue/70",
  yellow: "hover:border-khione-yellow/70",
};
