export type Accent = "purple" | "blue" | "yellow" | "green";

export const accentText: Record<Accent, string> = {
  purple: "text-khione-purple",
  blue: "text-khione-blue",
  yellow: "text-khione-yellow",
  green: "text-khione-green",
};

export const accentBorder: Record<Accent, string> = {
  purple: "border-t-khione-purple",
  blue: "border-t-khione-blue",
  yellow: "border-t-khione-yellow",
  green: "border-t-khione-green",
};

export const accentBg: Record<Accent, string> = {
  purple: "bg-khione-purple",
  blue: "bg-khione-blue",
  yellow: "bg-khione-yellow",
  green: "bg-khione-green",
};

export const accentHoverBorder: Record<Accent, string> = {
  purple: "hover:border-khione-purple/70",
  blue: "hover:border-khione-blue/70",
  yellow: "hover:border-khione-yellow/70",
  green: "hover:border-khione-green/70",
};
