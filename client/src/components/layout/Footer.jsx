// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/logo.png"
                alt="Cybreva Logo"
                className="w-7 h-7 object-contain"
              />
              <span className="font-bold text-white tracking-tight">Cybreva</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Check Before You Trust.</p>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Global AI-powered scam and malicious threat detection platform.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                ['/', 'Home'],
                ['/features', 'Features'],
                ['/pricing', 'Pricing'],
                ['/about', 'About Cybreva'],
                ['/contact', 'Contact & Support']
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-slate-400 text-sm hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Threat Scanners</h4>
            <ul className="space-y-2">
              {[
                ['/scanners/message', 'Message Checker'],
                ['/scanners/email', 'Email Checker'],
                ['/scanners/website', 'Website Safety'],
                ['/ai-assistant', 'AI Assistant'],
                ['/dashboard', 'User Dashboard']
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-slate-400 text-sm hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Resources & GEO</h4>
            <ul className="space-y-2">
              {[
                ['/blog', 'Security Blog'],
                ['/blog/how-to-identify-a-scam-website', 'Scam Website Guide'],
                ['/blog/how-to-recognize-phishing-emails', 'Phishing Identification'],
                ['/sitemap.xml', 'XML Sitemap'],
                ['/llms.txt', 'LLMs Reference']
              ].map(([to, label]) => (
                <li key={to}>
                  {to.endsWith('.xml') || to.endsWith('.txt') ? (
                    <a href={to} target="_blank" rel="noopener noreferrer" className="text-slate-400 text-sm hover:text-white transition-colors">{label}</a>
                  ) : (
                    <Link to={to} className="text-slate-400 text-sm hover:text-white transition-colors">{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Legal & Trust</h4>
            <ul className="space-y-2">
              {[
                ['/privacy', 'Privacy Policy'],
                ['/terms', 'Terms of Service']
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-slate-400 text-sm hover:text-white transition-colors">{label}</Link></li>
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
