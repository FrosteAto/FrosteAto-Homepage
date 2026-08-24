export function stripMarkdown(text: string): string {
  return text
    // fenced code blocks: strip the fence lines (with any language info string), keep content
    .replace(/^```.*$/gm, "")
    // images: ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    // reference-style links: [text][ref] -> text
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    // links: [text](url) -> text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // reference-link / footnote definitions (whole line): [1]: url or [^1]: text -> drop
    .replace(/^\[\^?[^\]]+\]:\s*.*$/gm, "")
    // footnote inline markers: [^1] -> drop
    .replace(/\[\^[^\]]+\]/g, "")
    // table rows: drop full pipe-delimited lines (header, delimiter, data)
    .replace(/^\|.*\|\s*$/gm, "")
    // thematic breaks: a line that's only -/*/_ repeated 3+ times
    .replace(/^\s*([-*_])\1{2,}\s*$/gm, "")
    // headers: leading #'s
    .replace(/^#{1,6}\s+/gm, "")
    // blockquote markers
    .replace(/^>\s?/gm, "")
    // bullet list markers
    .replace(/^[ \t]*[-*+]\s+/gm, "")
    // task-list checkboxes: leftover marker after the bullet strip above
    .replace(/^\[[ xX]\]\s*/gm, "")
    // numbered list markers
    .replace(/^[ \t]*\d+\.\s+/gm, "")
    // bold/italic/strikethrough markers
    .replace(/(\*\*\*|\*\*|\*|___|__|_|~~)/g, "")
    // inline code backticks
    .replace(/`+/g, "");
}
