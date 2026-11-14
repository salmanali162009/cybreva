// src/pages/dashboard/AIAssistantPage.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatMessage from '../../components/ai/ChatMessage';
import {
  FiCpu,
  FiSend,
  FiTrash2,
  FiAlertCircle,
  FiShield,
  FiGlobe,
  FiAlertTriangle,
  FiLock,
  FiArrowDown,
  FiZap,
} from 'react-icons/fi';
import { aiApi } from '../../services/api';
import toast from 'react-hot-toast';

const STARTER_PROMPTS = [
  {
    icon: FiShield,
    tag: 'Phishing',
    title: 'Common Phishing Indicators',
    prompt: 'What are the most common red flags of a modern phishing email?',
  },
  {
    icon: FiGlobe,
    tag: 'Verification',
    title: 'Website Legitimacy Checks',
    prompt: 'How can I verify if an online store or login portal is legitimate before entering my details?',
  },
  {
    icon: FiAlertTriangle,
    tag: 'Incident Response',
    title: 'Clicked Suspicious Link',
    prompt: 'I accidentally clicked an unknown link in a text message. What immediate emergency steps should I take?',
  },
  {
    icon: FiLock,
    tag: 'Account Defense',
    title: 'OTP & 2FA Theft Tactics',
    prompt: 'How do scam callers trick people into sharing their one-time passwords (OTP), and how do I prevent it?',
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Monitor scroll position to show/hide "jump to bottom" button
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceFromBottom > 150);
  }, []);

  const scrollToBottom = (behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  // Scroll to bottom when user sends a message or response completes
  useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom('smooth');
    }
  }, [messages.length, loading, showScrollBottom]);

  // Adjust textarea height dynamically
  const handleInputChange = (e) => {
    setInput(e.target.value.slice(0, 2000));
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 140)}px`;
  };

  const sendMessage = async (text = input.trim()) => {
    if (!text || loading) return;
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);
    setError(null);

    // Ensure we scroll down for the user's new question
    setTimeout(() => scrollToBottom('smooth'), 50);

    try {
      const res = await aiApi.chat({
        message: text,
        ...(sessionId ? { sessionId } : {}),
      });

      const { reply, sessionId: sid } = res.data.data;
      if (!sessionId && sid) setSessionId(sid);

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err.message || 'AI assistant is currently unavailable.');
      toast.error(err.message || 'AI assistant unavailable');
      // Remove optimistic message if request failed
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-7.5rem)] min-h-[500px]">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background:
                  'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(6,182,212,0.15) 100%)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              <FiCpu className="text-purple-400" size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AI Security Assistant
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Online
                </span>
              </div>
              <p className="text-slate-400 text-xs hidden sm:block">
                Clear, evidence-based guidance on scams, fraud prevention, and account safety
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 rounded-lg transition-all border border-white/5 hover:border-red-400/20"
              style={{ background: 'rgba(255,255,255,0.03)' }}
              title="Clear conversation history"
            >
              <FiTrash2 size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Safety Disclaimer Banner */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl mb-2 text-xs"
          style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.18)',
          }}
        >
          <FiAlertCircle className="text-amber-400 flex-shrink-0" size={14} />
          <p className="text-amber-200/80 leading-normal text-[11px] sm:text-xs">
            <span className="font-semibold text-amber-300">Safety Notice: </span>
            Educational advisory only. Never paste passwords or sensitive API keys.
          </p>
        </div>

        {/* Chat Messages Viewport */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto space-y-1 pr-1.5 sm:pr-2 scrollbar-thin"
        >
          {/* Welcome Screen when Empty */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto py-8 text-center animate-fade-in">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <FiZap className="text-cyan-400" size={26} />
              </div>
              <h2 className="text-lg font-bold text-white mb-1.5">
                How can I assist your online safety today?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-sm leading-relaxed">
                Ask about suspicious communications, inspect tactics used by cybercriminals, or get step-by-step account recovery advice.
              </p>

              {/* Starter Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                {STARTER_PROMPTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => sendMessage(item.prompt)}
                      className="p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all text-left group"
                      style={{ background: 'rgba(17, 28, 46, 0.6)' }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="text-emerald-400 group-hover:text-cyan-300 transition-colors" size={14} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-300">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-white text-xs font-medium mb-0.5 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} {...msg} />
          ))}

          {/* AI Thinking Indicator */}
          {loading && (
            <div className="flex gap-3.5 my-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500/25 to-cyan-500/25 border border-purple-500/30">
                <FiCpu className="text-purple-300" size={15} />
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-xs glass-2 border border-white/10 flex items-center gap-2.5"
                style={{ background: 'rgba(17, 28, 46, 0.78)' }}
              >
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      style={{
                        animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Cybreva AI is analyzing...
                </span>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div className="glass rounded-xl p-3.5 text-red-400 text-xs border border-red-500/20 my-2 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-slate-400 hover:text-white text-xs ml-3"
              >
                Dismiss
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Floating Jump to Bottom Button */}
        {showScrollBottom && (
          <div className="relative">
            <button
              onClick={() => scrollToBottom('smooth')}
              className="absolute -top-10 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(17, 28, 46, 0.95)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <FiArrowDown size={13} className="text-cyan-400" />
              <span>Latest</span>
            </button>
          </div>
        )}

        {/* Input Composer */}
        <div className="mt-2 glass-2 rounded-2xl p-2.5 sm:p-3 border border-white/10 shadow-lg flex gap-2.5 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about suspicious emails, scam calls, or online defense… (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 resize-none focus:outline-none leading-relaxed max-h-[140px] py-1 px-1.5 scrollbar-thin"
          />

          <div className="flex items-center gap-2 flex-shrink-0 mb-0.5">
            <span className="text-[10px] text-slate-600 hidden md:inline">
              {input.length}/2000
            </span>
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:shadow-md"
              style={{
                background: input.trim()
                  ? 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)'
                  : 'rgba(255,255,255,0.06)',
              }}
              title="Send message"
            >
              <FiSend
                className={input.trim() ? 'text-white' : 'text-slate-500'}
                size={14}
              />
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] sm:text-xs mt-1.5">
          Cybreva AI Security Assistant • Check Before You Trust
        </p>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </DashboardLayout>
  );
}
