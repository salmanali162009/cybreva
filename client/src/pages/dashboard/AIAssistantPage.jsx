// src/pages/dashboard/AIAssistantPage.jsx
import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiCpu, FiSend, FiUser, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { aiApi } from '../../services/api';
import toast from 'react-hot-toast';

const STARTER_PROMPTS = [
  'What are common signs of a phishing email?',
  'How can I tell if a website is legitimate?',
  'What should I do if I clicked a suspicious link?',
  'How do gift card scams work?',
];

function Message({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-emerald-500/20' : 'bg-purple-500/20'}`}>
        {isUser
          ? <FiUser className="text-emerald-400" size={14} />
          : <FiCpu className="text-purple-400" size={14} />
        }
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'text-white rounded-tr-sm'
          : 'text-slate-300 rounded-tl-sm'
      }`}
        style={isUser
          ? { background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.15))', border: '1px solid rgba(16,185,129,0.2)' }
          : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {content}
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendMessage = async (text = input.trim()) => {
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await aiApi.chat({ message: text, ...(sessionId ? { sessionId } : {}) });
      const { reply, sessionId: sid, disclaimer } = res.data.data;
      if (!sessionId && sid) setSessionId(sid);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => { setMessages([]); setSessionId(null); setError(null); };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <FiCpu className="text-purple-400" size={16} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Security Assistant</h1>
              <p className="text-slate-500 text-xs">Ask about scams, phishing, and online safety</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <FiTrash2 size={12} /> Clear
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-xl mb-3" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.12)' }}>
          <FiAlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={13} />
          <p className="text-amber-300/70 text-xs leading-relaxed">
            This AI assistant provides educational guidance only. It cannot verify URLs or scan results in real time.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <FiCpu className="text-purple-400" size={24} />
              </div>
              <div className="text-center">
                <p className="text-white font-medium mb-1">Ask Me About Online Safety</p>
                <p className="text-slate-500 text-sm">Get guidance on scams, phishing, and safe browsing practices.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {STARTER_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="text-left px-4 py-3 rounded-xl text-slate-400 text-xs hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => <Message key={i} {...msg} />)}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/20 flex-shrink-0">
                <FiCpu className="text-purple-400" size={14} />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex gap-1.5 items-center">
                  {[0,1,2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
                      style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="glass rounded-xl p-3 text-red-400 text-sm">{error}</div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="mt-3 glass rounded-2xl p-3 flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 2000))}
            onKeyDown={handleKeyDown}
            placeholder="Ask about phishing, scams, safe browsing… (Enter to send)"
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
            style={{ maxHeight: '120px' }}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' }}>
            <FiSend className="text-white" size={15} />
          </button>
        </div>
        <p className="text-center text-slate-700 text-xs mt-2">AI responses are for educational purposes only.</p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </DashboardLayout>
  );
}
