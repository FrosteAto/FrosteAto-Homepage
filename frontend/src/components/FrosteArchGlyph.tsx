// A miniature version of the FrosteArch mark - a mountain with an arch cut
// into it - standing in for the ASCII-art logo real fetch tools print.
export default function FrosteArchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M50 8 L92 92 L60 92 Q60 55 50 55 Q40 55 40 92 L8 92 Z"
      />
    </svg>
  );
}
