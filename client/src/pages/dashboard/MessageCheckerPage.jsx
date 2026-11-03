// src/pages/dashboard/MessageCheckerPage.jsx
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import ScanResult from '../../components/common/ScanResult';
import { FiMessageSquare, FiSend, FiTrash2 } from 'react-icons/fi';
import { scanApi } from '../../services/api';
import toast from 'react-hot-toast';

const MAX_CHARS = 5000;

export default function MessageCheckerPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (message.trim().length < 5) {
      toast.error('Please enter at least 5 characters');
      return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await scanApi.scanMessage({ message: message.trim() });
      setResult(res.data.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <FiMessageSquare className="text-emerald-400" size={16} />
            </div>
            <h1 className="text-xl font-bold text-white">Message Scam Checker</h1>
          </div>
          <p className="text-slate-400 text-sm ml-10">Paste any suspicious message to check for scam indicators.</p>
        </div>

        <GlassCard>
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste the suspicious message here…&#10;&#10;e.g. 'Urgent! Your account will be suspended. Verify your details immediately by clicking the link below.'"
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm placeholder-slate-600 resize-none focus:outline-none focus:border-emerald-400/50 transition-colors leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-xs">{message.length}/{MAX_CHARS}</span>
              <div className="flex gap-2">
                {message && (
                  <button onClick={() => { setMessage(''); setResult(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <FiTrash2 size={13} /> Clear
                  </button>
                )}
                <button onClick={handleScan} disabled={loading || !message.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing…</>
                  ) : (
                    <><FiSend size={14} />Analyze</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {loading && (
          <div className="glass rounded-2xl p-6 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-medium">Analyzing message…</p>
              <p className="text-slate-500 text-xs">Applying rule-based checks and AI analysis</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="glass rounded-2xl p-4 text-red-400 text-sm" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {result && !loading && <ScanResult result={result} type="message" />}

        {/* Tips */}
        <div className="glass rounded-2xl p-4">
          <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wide">Common Scam Patterns We Detect</p>
          <div className="grid grid-cols-2 gap-1.5">
            {['Urgency & pressure tactics','Credential requests','Unsolicited prize claims','Gift card payment requests','Authority impersonation','Suspicious shortened URLs','Bank account requests','OTP/PIN solicitation'].map((tip) => (
              <div key={tip} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="text-emerald-500">•</span>{tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
