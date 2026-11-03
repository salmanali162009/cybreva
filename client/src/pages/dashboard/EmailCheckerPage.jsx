// src/pages/dashboard/EmailCheckerPage.jsx
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import ScanResult from '../../components/common/ScanResult';
import { FiMail, FiSend, FiTrash2 } from 'react-icons/fi';
import { scanApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function EmailCheckerPage() {
  const [form, setForm] = useState({ subject: '', sender: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleScan = async () => {
    if (form.body.trim().length < 5) { toast.error('Email body is required (min 5 chars)'); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = { body: form.body.trim() };
      if (form.subject.trim()) payload.subject = form.subject.trim();
      if (form.sender.trim()) payload.sender = form.sender.trim();
      const res = await scanApi.scanEmail(payload);
      setResult(res.data.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Scan failed');
    } finally { setLoading(false); }
  };

  const handleClear = () => { setForm({ subject: '', sender: '', body: '' }); setResult(null); };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-colors";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
              <FiMail className="text-cyan-400" size={16} />
            </div>
            <h1 className="text-xl font-bold text-white">Email Scam Checker</h1>
          </div>
          <p className="text-slate-400 text-sm ml-10">Analyze suspicious email content for phishing and scam indicators.</p>
        </div>

        <GlassCard>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Subject (optional)</label>
                <input type="text" placeholder="e.g. You've been selected!" value={form.subject} onChange={set('subject')} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Sender (optional)</label>
                <input type="text" placeholder="e.g. support@paypal-alert.xyz" value={form.sender} onChange={set('sender')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email Body <span className="text-red-400">*</span></label>
              <textarea value={form.body} onChange={set('body')} rows={8}
                placeholder="Paste the full email body text here…"
                className={`${inputClass} resize-none leading-relaxed`} />
              <span className="text-slate-600 text-xs">{form.body.length}/10000</span>
            </div>
            <div className="flex justify-end gap-2">
              {(form.body || form.subject || form.sender) && (
                <button onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <FiTrash2 size={13} /> Clear
                </button>
              )}
              <button onClick={handleScan} disabled={loading || !form.body.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing…</>
                ) : (<><FiSend size={14} />Analyze Email</>)}
              </button>
            </div>
          </div>
        </GlassCard>

        {loading && (
          <div className="glass rounded-2xl p-5 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-medium">Analyzing email…</p>
              <p className="text-slate-500 text-xs">Checking sender, content, and phishing indicators</p>
            </div>
          </div>
        )}
        {error && !loading && (
          <div className="glass rounded-2xl p-4 text-red-400 text-sm">{error}</div>
        )}
        {result && !loading && <ScanResult result={result} type="email" />}

        <div className="glass rounded-2xl p-4">
          <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wide">Disclaimer</p>
          <p className="text-slate-600 text-xs leading-relaxed">
            This tool cannot verify the true origin or identity of an email sender based on text alone.
            Results are informational and should not be treated as definitive verification.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
