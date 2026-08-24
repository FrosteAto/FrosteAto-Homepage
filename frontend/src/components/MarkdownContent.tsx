import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-6 font-[family-name:var(--font-heading)] text-3xl first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-6 font-[family-name:var(--font-heading)] text-2xl first:mt-0">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-4 font-[family-name:var(--font-heading)] text-xl first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className="text-link">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-6">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent-soft pl-4 text-fg/80 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-fg/8 px-1.5 py-0.5 font-[family-name:var(--font-plex-mono)] text-[0.9em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-md bg-fg/8 p-4 font-[family-name:var(--font-plex-mono)] text-sm">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-fg/12" />,
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-4 text-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
