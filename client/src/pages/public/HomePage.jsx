// src/pages/public/HomePage.jsx
import { Link } from 'react-router-dom';
import { FiShield, FiMessageSquare, FiMail, FiGlobe, FiCpu, FiCheck, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';

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
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cybreva',
    alternateName: 'Cybreva AI',
    url: 'https://cybreva.com',
    logo: 'https://cybreva.com/logo.png',
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
    url: 'https://cybreva.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cybreva.com/blog?q={search_term_string}',
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
        canonical="https://cybreva.com/"
        keywords="scam checker, phishing detector, safe browsing, url safety check, sms scam detection, ai security, online threat intelligence"
        schema={[orgSchema, websiteSchema, faqSchema]}
      />
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#10B981,transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}>
            <FiShield size={12} />
            AI-Powered Online Safety Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Check Before
            <br />
            <span className="gradient-text">You Trust.</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Cybreva uses AI and real-time threat intelligence to help you identify scams,
            phishing attempts, and malicious websites — before you click or respond.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
              Start Scanning Free
              <FiArrowRight />
            </Link>
            <Link to="/#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-300 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              See How It Works
            </Link>
          </div>

          {/* Scanner preview cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass rounded-xl p-4 text-center hover:border-white/10 transition-all">
                  <div className="w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center"
                    style={{ background: `${f.color}18` }}>
                    <Icon style={{ color: f.color }} size={18} />
                  </div>
                  <p className="text-white text-xs font-medium">{f.title}</p>
                </div>
              );
            })}
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
