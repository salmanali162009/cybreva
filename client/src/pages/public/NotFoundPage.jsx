// src/pages/public/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import { FiShield, FiHome, FiSearch, FiBookOpen, FiArrowRight } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <SEO
        title="404 — Page Not Found | Cybreva"
        description="The requested page could not be located on Cybreva. Explore our scam detection tools or educational cybersecurity blog."
        noindex={true}
      />
      <div className="min-h-[75vh] flex items-center justify-center text-center px-4 py-16">
        <div className="max-w-md mx-auto">
          <p className="text-8xl font-black gradient-text mb-3 tracking-tighter">404</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            The resource you requested may have been relocated, removed, or does not exist. Use the links below to return to safe territory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              <FiHome size={16} />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-300 hover:text-white glass border border-white/10 transition-colors"
            >
              <FiBookOpen size={16} />
              <span>Explore Blog</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-white/5">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
              Popular Security Tools
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link to="/scanners/message" className="px-3 py-1.5 rounded-lg glass text-slate-400 hover:text-white hover:border-emerald-500/30">
                Message Checker
              </Link>
              <Link to="/scanners/email" className="px-3 py-1.5 rounded-lg glass text-slate-400 hover:text-white hover:border-cyan-500/30">
                Email Analyzer
              </Link>
              <Link to="/scanners/website" className="px-3 py-1.5 rounded-lg glass text-slate-400 hover:text-white hover:border-purple-500/30">
                Website Safety
              </Link>
              <Link to="/ai-assistant" className="px-3 py-1.5 rounded-lg glass text-slate-400 hover:text-white hover:border-amber-500/30">
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
