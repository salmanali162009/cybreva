// src/pages/public/AboutPage.jsx
import { Link } from 'react-router-dom';
import {
  FiShield,
  FiTarget,
  FiLock,
  FiEye,
  FiAward,
  FiUsers,
  FiCpu,
  FiDatabase,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Cybreva — AI-Powered Online Safety Platform',
    url: 'https://cybreva.vercel.app/about',
    description: 'Learn about Cybreva mission to protect internet users from scams, phishing, and online fraud through transparent AI analysis and global threat feeds.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Cybreva',
      url: 'https://cybreva.vercel.app',
      logo: 'https://cybreva.vercel.app/logo.png',
      foundingDate: '2026',
      slogan: 'Check Before You Trust'
    }
  };

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'About Cybreva' }
  ];

  return (
    <MainLayout>
      <SEO
        title="About Cybreva — AI Online Safety & Threat Intelligence"
        description="Learn about Cybreva mission to protect internet users from scams, phishing, and online fraud through transparent AI analysis and global threat feeds."
        canonical="https://cybreva.vercel.app/about"
        keywords="about cybreva, online safety company, cyber scam prevention, ai threat intelligence, safe browsing organization"
        schema={[aboutSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FiShield size={14} />
            <span>Our Mission & Technology</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            Democratizing Enterprise-Grade Scam Defense
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Cybreva was founded with a singular purpose: empower everyday internet users with the same threat intelligence and machine learning heuristics historically reserved for Fortune 500 security teams.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: FiShield,
              title: 'Accessibility First',
              color: '#10B981',
              desc: 'Making sophisticated cyber threat analysis understandable in plain language, without confusing technical jargon.'
            },
            {
              icon: FiTarget,
              title: 'Multi-Source Intelligence',
              color: '#06B6D4',
              desc: 'Combining deterministic rule sets, real-time Google Web Risk lookups, and Groq AI natural language parsing.'
            },
            {
              icon: FiLock,
              title: 'Zero Data Selling',
              color: '#8B5CF6',
              desc: 'Strict privacy controls. We never monetize, package, or sell user scan queries, email artifacts, or contact data.'
            }
          ].map(({ icon: Icon, title, color, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-white/10 transition-colors">
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon style={{ color }} size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Methodology Section (E-E-A-T) */}
        <section className="glass rounded-2xl p-8 sm:p-10 border border-white/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2.5">
            <FiCpu className="text-cyan-400" />
            Our Multi-Tiered Verification Architecture
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 text-slate-300 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400" /> Layer 1: Deterministic Heuristic Rules
              </h3>
              <p className="text-slate-400">
                Fast-path algorithms check submitted content for known threat indicators: urgent action verbs, suspicious shortened domains, fake courier tracking schemas, and unmasked international routing prefixes.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <FiDatabase className="text-cyan-400" /> Layer 2: Global Threat Intelligence
              </h3>
              <p className="text-slate-400">
                Target URLs are queried against live threat databases including Google Web Risk API to check against actively reported social engineering portals, credential harvesting servers, and malware repositories.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <FiEye className="text-indigo-400" /> Layer 3: Contextual Groq LLM Reasoning
              </h3>
              <p className="text-slate-400">
                Ultra-low latency inference via Groq analyzes subtle social engineering subtexts, brand spoofing discrepancies, and conversational manipulation cues that evade static signature tables.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <FiAward className="text-amber-400" /> Layer 4: Transparent Risk Scoring
              </h3>
              <p className="text-slate-400">
                Rather than giving an opaque boolean verdict, Cybreva yields a 0–100 composite risk score with granular explanations, highlighting specific red flags and safe actionable mitigation advice.
              </p>
            </div>
          </div>
        </section>

        {/* E-E-A-T Transparency & Honest Assessment */}
        <section className="glass rounded-2xl p-8 border border-white/10 mb-16 bg-[#111C2E]/60">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FiLock className="text-emerald-400" /> Our Commitment to Honest Cybersecurity
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            At Cybreva, we do not believe in artificial guarantees. Threat actors develop novel evasion strategies daily. No automated security tool—regardless of marketing claims—can provide 100% prevention against all cyber threats.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Cybreva serves as an assistive defense layer to elevate your vigilance before clicking or sharing information. We encourage users to combine Cybreva intelligence with verified out-of-band communication, strong multi-factor authentication, and healthy digital skepticism.
          </p>
        </section>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            to="/features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            <span>Explore Platform Features</span>
            <FiArrowRight />
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white glass border border-white/10 transition-colors"
          >
            <span>Contact Security Team</span>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
