// src/components/ai/MarkdownRenderer.jsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FiCopy,
  FiCheck,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiExternalLink,
} from 'react-icons/fi';

/**
 * Custom Code component with syntax header and one-click copy.
 */
function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  if (inline || !match && !codeContent.includes('\n') && codeContent.length < 50) {
    return (
      <code
        className="px-1.5 py-0.5 rounded text-xs font-mono text-emerald-300 bg-white/10 border border-white/10 mx-0.5 align-middle"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#0B1220]/95 shadow-md">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/5 border-b border-white/10 text-xs">
        <span className="font-mono text-slate-400 font-medium">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors text-[11px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <FiCheck className="text-emerald-400" size={12} />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed scrollbar-thin">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/**
 * Safe link component enforcing secure attributes.
 */
function SafeLink({ href, children, ...props }) {
  const safeHref = href && /^(https?:|mailto:)/i.test(href) ? href : '#';
  const isExternal = safeHref.startsWith('http');

  return (
    <a
      href={safeHref}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors font-medium break-words"
      onClick={(e) => {
        if (safeHref === '#') e.preventDefault();
      }}
      {...props}
    >
      <span>{children}</span>
      {isExternal && <FiExternalLink size={11} className="opacity-70 inline" />}
    </a>
  );
}

/**
 * Specialized Callout / Blockquote styling.
 * Automatically decorates warnings, recommendations, and notes.
 */
function CalloutBlockquote({ children, ...props }) {
  // Extract text content to detect callout intent
  const extractText = (nodes) => {
    if (!nodes) return '';
    if (typeof nodes === 'string') return nodes;
    if (Array.isArray(nodes)) return nodes.map(extractText).join(' ');
    if (nodes.props && nodes.props.children) return extractText(nodes.props.children);
    return '';
  };

  const rawText = extractText(children).toLowerCase();

  const isWarning =
    rawText.includes('warning') ||
    rawText.includes('caution') ||
    rawText.includes('danger') ||
    rawText.includes('alert') ||
    rawText.includes('never ');

  const isTip =
    rawText.includes('recommendation') ||
    rawText.includes('tip') ||
    rawText.includes('takeaway') ||
    rawText.includes('action step');

  const isNote =
    rawText.includes('note:') ||
    rawText.includes('important:') ||
    rawText.includes('remember:');

  if (isWarning) {
    return (
      <div className="my-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200 leading-relaxed">
        <FiAlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={15} />
        <div className="flex-1 space-y-1">{children}</div>
      </div>
    );
  }

  if (isTip) {
    return (
      <div className="my-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200 leading-relaxed">
        <FiCheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={15} />
        <div className="flex-1 space-y-1">{children}</div>
      </div>
    );
  }

  if (isNote) {
    return (
      <div className="my-3 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5 text-xs text-cyan-200 leading-relaxed">
        <FiInfo className="text-cyan-400 flex-shrink-0 mt-0.5" size={15} />
        <div className="flex-1 space-y-1">{children}</div>
      </div>
    );
  }

  // Standard blockquote
  return (
    <blockquote
      className="my-3 pl-3.5 py-1.5 border-l-2 border-emerald-500/50 bg-white/[0.02] rounded-r-lg text-xs text-slate-300 italic leading-relaxed"
      {...props}
    >
      {children}
    </blockquote>
  );
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-content text-sm leading-relaxed text-slate-200 space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1
              className="text-base sm:text-lg font-bold text-white mt-4 mb-2 pb-1.5 border-b border-white/10 flex items-center gap-2"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-sm sm:text-base font-semibold text-emerald-400 mt-3.5 mb-1.5"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-xs sm:text-sm font-semibold text-cyan-300 mt-3 mb-1"
              {...props}
            />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-sm leading-relaxed text-slate-300 mb-2.5 last:mb-0" {...props} />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 space-y-1.5 my-2.5 text-slate-300 marker:text-emerald-400 text-sm" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 space-y-1.5 my-2.5 text-slate-300 marker:text-cyan-400 text-sm" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed pl-1" {...props} />
          ),

          // Code
          code: CodeBlock,

          // Links
          a: SafeLink,

          // Blockquotes
          blockquote: CalloutBlockquote,

          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-white/5 border-b border-white/10" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3.5 py-2.5 font-semibold text-slate-300" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3.5 py-2 border-b border-white/5 text-slate-300 last:border-b-0" {...props} />
          ),

          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-white/10" {...props} />
          ),

          // Text formatting
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-slate-200" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
