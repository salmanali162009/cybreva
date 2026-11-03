// src/pages/public/PricingPage.jsx
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { FiCheck } from 'react-icons/fi';

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Simple, Honest Pricing</h1>
          <p className="text-slate-400">No hidden fees. No fake statistics. Start free.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-7">
            <h3 className="text-white font-bold text-xl mb-1">Free</h3>
            <p className="text-4xl font-black text-white mb-1">$0</p>
            <p className="text-slate-400 text-sm mb-5">Forever free. No credit card required.</p>
            <ul className="space-y-2.5 mb-7">
              {['Message scam detection','Email phishing analysis','Website safety checks','AI security assistant','Scan history (30 days)','30 scans per 15 minutes'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <FiCheck className="text-emerald-400 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link to="/register"
              className="block text-center py-3 rounded-xl text-white font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
              Get Started Free
            </Link>
          </div>
          <div className="rounded-2xl p-7 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.07))', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="absolute top-5 right-5 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
              Coming Soon
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Pro</h3>
            <p className="text-4xl font-black text-white mb-1">$9 <span className="text-slate-400 text-lg font-normal">/mo</span></p>
            <p className="text-slate-400 text-sm mb-5">Planned — not yet available.</p>
            <ul className="space-y-2.5 mb-7">
              {['Everything in Free','Unlimited scan history','Higher rate limits (planned)','Priority AI responses','Export scan reports (PDF)','API access (planned)','Dedicated support'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <FiCheck className="text-cyan-400 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button disabled className="w-full py-3 rounded-xl text-slate-400 font-semibold cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Not Yet Available
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
