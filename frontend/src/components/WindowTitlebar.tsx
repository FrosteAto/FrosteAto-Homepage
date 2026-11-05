function TitlebarButton({ variant }: { variant: "minimize" | "maximize" | "close" }) {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full text-fg/55 transition-colors duration-150 ${
        variant === "close" ? "hover:bg-red-500/20 hover:text-red-400" : "hover:bg-fg/10"
      }`}
    >
      {variant === "minimize" && (
        <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" aria-hidden>
          <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      {variant === "maximize" && (
        <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" aria-hidden>
          <rect x="3.5" y="3.5" width="9" height="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      )}
      {variant === "close" && (
        <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" aria-hidden>
          <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export function TitlebarButtons() {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      <TitlebarButton variant="minimize" />
      <TitlebarButton variant="maximize" />
      <TitlebarButton variant="close" />
    </div>
  );
}

export default function WindowTitlebar({ prompt }: { prompt: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-fg/10 bg-fg/[0.03] px-4 py-2.5">
      <p className="flex-1 font-[family-name:var(--font-plex-mono)] text-xs text-fg/45">
        {prompt}
      </p>
      <TitlebarButtons />
    </div>
  );
}
