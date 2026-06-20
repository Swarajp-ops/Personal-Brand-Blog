import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split content into blocks by code segments to handle code styling separately
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-body text-slate-700 dark:text-slate-300">
      {parts.map((part, partIdx) => {
        // Handle fully fenced code blocks
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "code";
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div key={partIdx} className="my-6 relative overflow-hidden rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-950">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <span className="text-xs font-mono font-medium text-slate-400 capitalize">{lang}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code.trim());
                    // Briefly change text or alert could be added
                  }}
                  className="px-2 py-1 text-xs font-mono rounded bg-slate-800 text-slate-300 hover:text-white transition hover:bg-slate-700"
                  title="Copy code"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-100 leading-relaxed">
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }

        // Handle text block (contains paragraphs, lists, headers, etc)
        const lines = part.split("\n");
        let inList = false;
        let listItems: string[] = [];
        const renderedBlocks: React.ReactNode[] = [];

        const commitList = (key: string) => {
          if (listItems.length > 0) {
            renderedBlocks.push(
              <ul key={`ul-${key}`} className="list-disc pl-6 mb-5 space-y-2">
                {listItems.map((item, itemIdx) => (
                  <li key={itemIdx}>{parseInline(item)}</li>
                ))}
              </ul>
            );
            listItems = [];
          }
        };

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Title / Headers
          if (line.startsWith("### ")) {
            commitList(`${partIdx}-${i}`);
            inList = false;
            renderedBlocks.push(
              <h3 key={`${partIdx}-${i}`} className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">
                {parseInline(line.slice(4))}
              </h3>
            );
          } else if (line.startsWith("#### ")) {
            commitList(`${partIdx}-${i}`);
            inList = false;
            renderedBlocks.push(
              <h4 key={`${partIdx}-${i}`} className="text-lg font-heading font-bold text-slate-900 dark:text-white mt-6 mb-3 tracking-tight">
                {parseInline(line.slice(5))}
              </h4>
            );
          } else if (line.startsWith("## ")) {
            commitList(`${partIdx}-${i}`);
            inList = false;
            renderedBlocks.push(
              <h2 key={`${partIdx}-${i}`} className="text-2xl font-heading font-bold text-slate-900 dark:text-white mt-9 mb-4 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-2">
                {parseInline(line.slice(3))}
              </h2>
            );
          } else if (line.startsWith("- ") || line.startsWith("* ")) {
            inList = true;
            listItems.push(line.slice(2));
          } else if (line.trim() === "") {
            commitList(`${partIdx}-${i}`);
            inList = false;
          } else {
            if (inList) {
              // Continued bullet text, append or commit list
              commitList(`${partIdx}-${i}`);
              inList = false;
            }
            // Standard paragraph line
            renderedBlocks.push(
              <p key={`${partIdx}-${i}`} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                {parseInline(line)}
              </p>
            );
          }
        }

        // Final commit if list remained active
        commitList(`${partIdx}-final`);

        return <React.Fragment key={partIdx}>{renderedBlocks}</React.Fragment>;
      })}
    </div>
  );
};

// Parse bolding, inline code blocks, etc.
function parseInline(text: string): React.ReactNode {
  // Regex mapping for inline elements pathing
  // 1. Double stars/underscores: bold **text**
  // 2. Single tick: code `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="font-mono bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded text-sm font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
