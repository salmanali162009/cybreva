// src/pages/public/HomePage.jsx
import { Link } from 'react-router-dom';
import {
  FiShield,
  FiMessageSquare,
  FiMail,
  FiGlobe,
  FiCpu,
  FiCheck,
  FiArrowRight,
  FiChevronDown,
  FiSearch,
  FiLayers,
} from 'react-icons/fi';
import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  { icon: FiMessageSquare, title: 'Message Scanner', color: '#10B981', desc: 'Detect phishing language, urgency tactics, and scam patterns in any text message.' },
  { icon: FiMail, title: 'Email Analyzer', color: '#06B6D4', desc: 'Analyze email content, sender information, and suspicious indicators.' },
  { icon: FiGlobe, title: 'Website Checker', color: '#8B5CF6', desc: 'Check URLs against Google Safe Browsing and VirusTotal threat intelligence.' },
  { icon: FiCpu, title: 'AI Security Assistant', color: '#F59E0B', desc: 'Ask our AI assistant about online safety, scams, and secure browsing practices.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Content', desc: 'Paste a suspicious message, email, or URL into the appropriate scanner.' },
  { step: '02', title: 'AI + Intelligence Analysis', desc: 'Our system applies rule-based detection and AI analysis with real threat intelligence.' },
  { step: '03', title: 'Review Results', desc: 'Get a structured risk assessment with indicators, explanations, and recommendations.' },
];

const FAQS = [
  { q: 'Is Cybreva free to use?', a: 'Yes, our core scanning features are available to all registered users. An account is required to save and review your scan history.' },
  { q: 'Does Cybreva guarantee that a scan result is accurate?', a: 'No. Cybreva uses AI analysis and threat intelligence databases to provide assessments, not guarantees. Always use independent judgment for important decisions.' },
  { q: 'Do you share my scanned content with third parties?', a: 'Website URLs may be checked against Google Safe Browsing and VirusTotal APIs. Message and email content is processed by our AI service (Groq). We do not sell your data.' },
  { q: 'How is the risk score calculated?', a: 'Risk scores are calculated from detected scam indicators using deterministic rules, then supplemented by AI analysis and external threat intelligence data.' },
  { q: 'Can I delete my scan history?', a: 'Yes. You can delete individual scans from your history at any time from your dashboard.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
        <span className="text-white text-sm font-medium">{q}</span>
        <FiChevronDown className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-white/5">
          <p className="text-slate-400 text-sm leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cybreva',
    alternateName: 'Cybreva AI',
    url: 'https://cybreva.vercel.app',
    logo: 'https://cybreva.vercel.app/logo.png',
    description: 'Global AI-powered scam, phishing, and malicious threat detection platform.',
    sameAs: [
      'https://twitter.com/cybreva',
      'https://github.com/cybreva'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@cybreva.com',
      contactType: 'Customer Support'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cybreva',
    url: 'https://cybreva.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cybreva.vercel.app/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  };

  return (
    <MainLayout>
      <SEO
        title="Cybreva — AI-Powered Online Safety & Scam Detection"
        description="Verify suspicious text messages, emails, and website links before you trust. Real-time scam detection powered by AI and global threat intelligence."
        canonical="https://cybreva.vercel.app/"
        keywords="scam checker, phishing detector, safe browsing, url safety check, sms scam detection, ai security, online threat intelligence"
        schema={[orgSchema, websiteSchema, faqSchema]}
      />
      {/* ── Premium Cybersecurity Hero Section ──────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-10 pb-20">
        {/* Subtle Cyber Grid & Ambient Lighting Background */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Digital Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* Glowing Radial Gradients */}
          <div
            className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #0DB07B 0%, rgba(6,182,212,0.4) 60%, transparent 80%)' }}
          />
          <div
            className="absolute top-1/3 right-10 w-[450px] h-[450px] rounded-full opacity-15 blur-[130px]"
            style={{ background: 'radial-gradient(circle, #06B6D4 0%, rgba(139,92,246,0.3) 60%, transparent 80%)' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column — Content & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left z-10">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm tracking-wide"
                style={{
                  background: 'rgba(13,176,123,0.1)',
                  border: '1px solid rgba(13,176,123,0.3)',
                  color: '#0DB07B',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#0DB07B] animate-pulse" />
                <FiShield size={13} className="text-[#0DB07B]" />
                <span className="tracking-wider uppercase">AI-POWERED ONLINE SECURITY</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.14] mb-6">
                Stay One Step Ahead of{' '}
                <span className="bg-gradient-to-r from-[#0DB07B] via-[#10B981] to-[#06B6D4] bg-clip-text text-transparent">
                  Online Scams.
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-300 sm:text-lg text-base max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal">
                Analyze suspicious messages, phishing emails, and website links with Cybreva AI.
                Identify potential warning signs and make safer decisions before you click, share, or trust.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0DB07B 0%, #059669 100%)' }}
                >
                  <FiSearch size={17} />
                  <span>Check for Scams</span>
                  <FiArrowRight size={16} />
                </Link>

                <Link
                  to="/features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white glass border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07]"
                >
                  <FiLayers size={16} className="text-cyan-400" />
                  <span>Explore Security Tools</span>
                </Link>
              </div>

              {/* Trust & Value Indicators */}
              <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 sm:gap-x-8 text-xs sm:text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#0DB07B]">
                    <FiCheck size={13} />
                  </div>
                  <span className="text-slate-300">AI-Powered Analysis</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <FiCheck size={13} />
                  </div>
                  <span className="text-slate-300">Multiple Security Checks</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <FiCheck size={13} />
                  </div>
                  <span className="text-slate-300">Clear Risk Insights</span>
                </div>
              </div>
            </div>

            {/* Right Column — Cybersecurity Visual Composition */}
            <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0">
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] h-[420px] sm:h-[460px] flex items-center justify-center">
                {/* Outer Radar / Orbit Ring */}
                <div className="absolute inset-4 rounded-full border border-dashed border-emerald-500/20 pointer-events-none" />

                {/* Secondary Orbit Ring */}
                <div className="absolute inset-14 rounded-full border border-white/5 pointer-events-none" />

                {/* Soft Glowing Pulsing Ambient Sphere */}
                <div
                  className="absolute w-52 h-52 rounded-full opacity-40 blur-3xl animate-pulse-glow pointer-events-none"
                  style={{ background: 'radial-gradient(circle, #0DB07B, #06B6D4 70%, transparent)' }}
                />

                {/* Central Shield Core */}
                <div className="relative z-20 flex flex-col items-center">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl glass-2 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 flex items-center justify-center p-5 group transition-transform hover:scale-105">
                    {/* Corner Tech Accents */}
                    <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-sm" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-emerald-400/60 rounded-tr-sm" />
                    <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-sm" />
                    <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-emerald-400/60 rounded-br-sm" />

                    {/* Official Cybreva Shield Logo */}
                    <img
                      src="/logo.png"
                      alt="Cybreva AI Shield Emblem"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_16px_rgba(13,176,123,0.45)]"
                    />
                  </div>

                  {/* Core Status Tag */}
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111C2E]/90 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 shadow-md backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active Scam Defense</span>
                  </div>
                </div>

                {/* Floating Glass Telemetry Cards */}

                {/* Card 1: Message Scam Detection (Top-Left) */}
                <div className="absolute -top-1 left-0 sm:-left-3 z-30 animate-float-1">
                  <div className="glass rounded-xl p-3 sm:p-3.5 border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-3 hover:border-emerald-500/40 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-[#0DB07B] flex-shrink-0">
                      <FiMessageSquare size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-bold">Message Scam</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400">SMS & Chat</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Urgency & Phishing Heuristics</p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Email Security Analysis (Top-Right) */}
                <div className="absolute top-10 -right-2 sm:-right-4 z-30 animate-float-2">
                  <div className="glass rounded-xl p-3 sm:p-3.5 border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-3 hover:border-cyan-500/40 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <FiMail size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-bold">Email Security</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-400">BEC Audit</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Spoofing & Lure Detection</p>
                    </div>
                  </div>
                </div>

                {/* Card 3: Website Safety Check (Bottom-Left) */}
                <div className="absolute bottom-12 -left-2 sm:-left-4 z-30 animate-float-3">
                  <div className="glass rounded-xl p-3 sm:p-3.5 border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-3 hover:border-purple-500/40 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <FiGlobe size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-bold">Website Safety</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-purple-500/20 text-purple-400">Threat Intel</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Google Web Risk & Malware</p>
                    </div>
                  </div>
                </div>

                {/* Card 4: AI Security Assistant (Bottom-Right) */}
                <div className="absolute -bottom-2 right-0 sm:-right-2 z-30 animate-float-4">
                  <div className="glass rounded-xl p-3 sm:p-3.5 border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-3 hover:border-amber-500/40 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <FiCpu size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-bold">AI Assistant</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400">Advisory</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Guided Threat Clarifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Four Ways to Stay Safe</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Comprehensive tools to verify messages, emails, websites, and get expert AI guidance.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15` }}>
                  <Icon style={{ color: f.color }} size={22} />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20" style={{ background: 'rgba(17,28,46,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Three simple steps to get an informed security assessment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl font-black gradient-text mb-4">{step.step}</div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}>
              Security by Design
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Built With Security as the Priority
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Cybreva uses HTTP-only cookies for authentication, never exposes API keys to the browser,
              validates all inputs, and clearly distinguishes AI assessments from verified threat intelligence.
            </p>
            <ul className="space-y-2">
              {[
                'No JWT in localStorage or sessionStorage',
                'API keys kept exclusively on the server',
                'Threat intelligence from Google Safe Browsing',
                'All AI results include clear disclaimers',
                'Private IPs and localhost blocked from scanning',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <FiCheck className="text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Message Scanner', sub: 'Detects 18+ scam patterns', color: '#10B981' },
              { label: 'Email Analyzer', sub: 'Sender & content analysis', color: '#06B6D4' },
              { label: 'Website Checker', sub: 'Real threat intelligence', color: '#8B5CF6' },
              { label: 'AI Assistant', sub: 'Security education & guidance', color: '#F59E0B' },
            ].map((card) => (
              <div key={card.label} className="glass-2 rounded-xl p-4">
                <div className="w-2 h-2 rounded-full mb-3" style={{ background: card.color }} />
                <p className="text-white text-sm font-medium">{card.label}</p>
                <p className="text-slate-500 text-xs mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20" style={{ background: 'rgba(17,28,46,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Simple Pricing</h2>
            <p className="text-slate-400">Start for free, upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-bold text-xl mb-1">Free</h3>
              <p className="text-3xl font-black text-white mb-1">$0 <span className="text-slate-500 text-sm font-normal">/month</span></p>
              <p className="text-slate-400 text-sm mb-5">Everything you need to get started.</p>
              <ul className="space-y-2 mb-6">
                {['Message, email & website scanning','AI security assistant','Scan history (last 30 days)','30 scans per 15 minutes'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <FiCheck className="text-emerald-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/register"
                className="block text-center py-2.5 rounded-xl text-white font-medium transition-all"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                Get Started Free
              </Link>
            </div>
            {/* Pro (planned) */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(6,182,212,0.08))', border: '1px solid rgba(16,185,129,0.25)' }}>
              <div className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                Coming Soon
              </div>
              <h3 className="text-white font-bold text-xl mb-1">Pro</h3>
              <p className="text-3xl font-black text-white mb-1">$9 <span className="text-slate-400 text-sm font-normal">/month</span></p>
              <p className="text-slate-400 text-sm mb-5">Planned features for power users.</p>
              <ul className="space-y-2 mb-6">
                {['Everything in Free','Unlimited scan history','Higher rate limits','Priority AI responses','Export scan reports','API access (planned)'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <FiCheck className="text-cyan-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button disabled
                className="block w-full text-center py-2.5 rounded-xl text-slate-400 font-medium cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Notify Me When Available
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="glass rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Check Before You Trust?</h2>
          <p className="text-slate-400 mb-6">Create a free account and start scanning in seconds.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            Create Free Account <FiArrowRight />
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
