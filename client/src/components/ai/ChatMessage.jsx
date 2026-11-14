// src/components/ai/ChatMessage.jsx
import { useState } from 'react';
import { FiCpu, FiUser, FiCopy, FiCheck } from 'react-icons/fi';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatMessage({ role, content, timestamp }) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className={`group flex gap-3.5 my-3 animate-fade-in ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
          isUser
            ? 'bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 border border-emerald-500/30'
            : 'bg-gradient-to-br from-purple-500/25 to-cyan-500/25 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
        }`}
      >
        {isUser ? (
          <FiUser className="text-emerald-400" size={15} />
        ) : (
          <FiCpu className="text-purple-300" size={15} />
        )}
      </div>

      {/* Message Bubble Container */}
      <div className={`max-w-[92%] sm:max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'text-white rounded-tr-xs shadow-md border border-emerald-500/25'
              : 'text-slate-200 rounded-tl-xs glass-2 border border-white/10 shadow-lg'
          }`}
          style={
            isUser
              ? {
                  background:
                    'linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(6,182,212,0.18) 100%)',
                }
              : {
                  background: 'rgba(17, 28, 46, 0.78)',
                }
          }
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words text-sm text-slate-100 leading-relaxed">
              {content}
            </p>
          ) : (
            <MarkdownRenderer content={content} />
          )}
        </div>

        {/* Action Toolbar for AI message */}
        {!isUser && (
          <div className="flex items-center gap-3 mt-1.5 px-1 text-[11px] text-slate-500 opacity-80 group-hover:opacity-100 transition-opacity">
            {formattedTime && <span>{formattedTime}</span>}
            <button
              onClick={handleCopyMessage}
              type="button"
              className="inline-flex items-center gap-1 hover:text-slate-300 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <>
                  <FiCheck className="text-emerald-400" size={11} />
                  <span className="text-emerald-400 font-medium">Copied response</span>
                </>
              ) : (
                <>
                  <FiCopy size={11} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
