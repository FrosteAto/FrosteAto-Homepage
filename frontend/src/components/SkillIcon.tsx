// Inline replacements for the fa-brands/fa-solid icons the Competencies
// list used to pull from the Font Awesome kit script - same reliability
// issue as the social icons (see SocialIcon.tsx). A few of these are
// faithful to the real mark (React's geometry is trivial to reproduce
// exactly; "code brackets" and "server" were already generic FA glyphs,
// not brand marks). The rest are too detailed to hand-reproduce reliably
// from a brand's actual logo, so they're a plain lettermark badge instead
// - safer than risking a garbled path for something nobody would recognise
// as broken at a glance.
export type SkillName =
  | "unity"
  | "html"
  | "css"
  | "sass"
  | "javascript"
  | "react"
  | "php"
  | "sql"
  | "python"
  | "figma";

const letterBadges: Partial<Record<SkillName, string>> = {
  unity: "U",
  sass: "Sa",
  javascript: "JS",
  php: "Ph",
  python: "Py",
  figma: "Fi",
};

export default function SkillIcon({
  name,
  color,
  className = "h-5 w-5",
}: {
  name: SkillName;
  color: string;
  className?: string;
}) {
  const letter = letterBadges[name];
  if (letter) {
    return (
      <span
        className={`${className} inline-flex shrink-0 items-center justify-center rounded border text-[9px] font-bold leading-none`}
        style={{ color, borderColor: color }}
      >
        {letter}
      </span>
    );
  }

  if (name === "html") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} shrink-0`}
        aria-hidden
      >
        <polyline points="8 4 2 12 8 20" />
        <polyline points="16 4 22 12 16 20" />
      </svg>
    );
  }

  if (name === "css") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill={color}
        className={`${className} shrink-0`}
        aria-hidden
      >
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.437L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.351l5.373-1.53L18.59 4.414z" />
      </svg>
    );
  }

  if (name === "sql") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} shrink-0`}
        aria-hidden
      >
        <rect x="2" y="3" width="20" height="7" rx="1.5" />
        <rect x="2" y="14" width="20" height="7" rx="1.5" />
        <circle cx="6" cy="6.5" r="0.5" fill={color} stroke="none" />
        <circle cx="6" cy="17.5" r="0.5" fill={color} stroke="none" />
      </svg>
    );
  }

  // react
  return (
    <svg
      viewBox="-11.5 -10.23 23 20.46"
      className={`${className} shrink-0`}
      aria-hidden
    >
      <circle r="2.05" fill={color} />
      <g fill="none" stroke={color}>
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}
