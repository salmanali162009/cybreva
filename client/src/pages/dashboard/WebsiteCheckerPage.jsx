// src/pages/dashboard/WebsiteCheckerPage.jsx
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import ScanResult from '../../components/common/ScanResult';
import { FiGlobe, FiSearch, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { scanApi } from '../../services/api';
import toast from 'react-hot-toast';

const SCAN_STEPS = ['Validating URL…', 'Querying Google Safe Browsing…', 'Checking VirusTotal…', 'Generating AI explanation…', 'Compiling results…'];

export default function WebsiteCheckerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isValidUrl = (u) => { try { const p = new URL(u); return ['http:', 'https:'].includes(p.protocol); } catch { return false; } };

  const handleScan = async () => {
    if (!isValidUrl(url)) { toast.error('Please enter a valid http:// or https:// URL'); return; }
    setLoading(true); setError(null); setResult(null); setStep(0);

    // Simulate step progression
    const stepInterval = setInterval(() => setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1)), 1500);

    try {
      const res = await scanApi.scanWebsite({ url: url.trim() });
      setResult(res.data.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Scan failed');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <FiGlobe className="text-purple-400" size={16} />
            </div>
            <h1 className="text-xl font-bold text-white">Website Safety Checker</h1>
          </div>
          <p className="text-slate-400 text-sm ml-10">Check a URL against Google Safe Browsing and VirusTotal threat intelligence.</p>
        </div>

        <GlassCard>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Website URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleScan()}
                    placeholder="https://example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-purple-400/50 transition-colors" />
                </div>
                {url && !loading && (
                  <button onClick={() => { setUrl(''); setResult(null); }}
                    className="px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <FiTrash2 size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <FiAlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={14} />
              <p className="text-amber-300/80 text-xs leading-relaxed">
                Only public URLs are submitted to external threat intelligence services. Do not submit URLs containing personal or sensitive information.
              </p>
            </div>

            <button onClick={handleScan} disabled={loading || !url.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' }}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Scanning…</>
              ) : (<><FiSearch size={14} />Scan Website</>)}
            </button>
          </div>
        </GlassCard>

        {/* Progress steps */}
        {loading && (
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin flex-shrink-0" />
              <p className="text-white text-sm font-medium">Scanning in progress</p>
            </div>
            <div className="space-y-2">
              {SCAN_STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${i <= step ? 'bg-purple-400' : 'bg-white/10'}`} />
                  <span className={`text-xs transition-colors ${i <= step ? 'text-slate-300' : 'text-slate-600'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="glass rounded-2xl p-4 text-red-400 text-sm">{error}</div>
        )}
        {result && !loading && <ScanResult result={result} type="website" />}

        <div className="glass rounded-2xl p-4">
          <p className="text-slate-500 text-xs font-semibold mb-1.5 uppercase tracking-wide">Important Limitations</p>
          <ul className="space-y-1">
            {['A clean result does not guarantee a website is safe.',
              'Threat intelligence databases may not include all malicious sites.',
              'New or recently activated malicious domains may not yet be listed.',
              'Always verify domain spelling and look for HTTPS before entering credentials.',
            ].map((l) => (
              <li key={l} className="text-slate-600 text-xs flex items-start gap-1.5">
                <span className="text-slate-700 mt-0.5">•</span>{l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
