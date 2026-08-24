export function stripMarkdown(text: string): string {
  return text
    // images: ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    // links: [text](url) -> text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // headers: leading #'s
    .replace(/^#{1,6}\s+/gm, "")
    // blockquote markers
    .replace(/^>\s?/gm, "")
    // bullet list markers
    .replace(/^[ \t]*[-*+]\s+/gm, "")
    // numbered list markers
    .replace(/^[ \t]*\d+\.\s+/gm, "")
    // bold/italic/strikethrough markers
    .replace(/(\*\*\*|\*\*|\*|___|__|_|~~)/g, "")
    // inline code backticks
    .replace(/`+/g, "");
}
