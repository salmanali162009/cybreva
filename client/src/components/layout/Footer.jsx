// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}>
                <FiShield className="text-white text-xs" />
              </div>
              <span className="font-bold text-white">Cybreva</span>
            </div>
            <p className="text-slate-500 text-sm">Check Before You Trust.</p>
            <p className="text-slate-600 text-xs mt-2">
              AI-powered scam detection for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/pricing', 'Pricing'], ['/about', 'About']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Scanners</h4>
            <ul className="space-y-2">
              {[['/dashboard/message', 'Message Checker'], ['/dashboard/email', 'Email Checker'], ['/dashboard/website', 'Website Checker'], ['/dashboard/ai', 'AI Assistant']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              {[['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Service']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600 text-xs">© 2026 Cybreva. All rights reserved.</p>
          <p className="text-slate-700 text-xs">
            AI assessments are for informational purposes only and do not guarantee safety.
          </p>
        </div>
      </div>
    </footer>
  );
}
