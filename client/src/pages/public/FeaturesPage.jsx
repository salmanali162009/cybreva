// src/pages/public/FeaturesPage.jsx
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import {
  FiMessageSquare,
  FiMail,
  FiGlobe,
  FiCpu,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
  FiLock,
  FiZap,
} from 'react-icons/fi';

export default function FeaturesPage() {
  const featuresList = [
    {
      id: 'message-checker',
      icon: FiMessageSquare,
      title: 'Message Scam Checker',
      tag: 'Text & Chat Protection',
      color: '#10B981',
      description:
        'Analyzes SMS, WhatsApp, Telegram, and social media direct messages for high-risk manipulation markers including urgency pressure, advance-fee promises, authority impersonation, and OTP solicitation.',
      benefits: [
        'Heuristic regex pattern detection for 18+ scam classes',
        'Direct identification of OTP and 2FA interception schemes',
        'Automatic parsing of embedded short URLs (bit.ly, tinyurl)',
        'Calibrated mathematical risk scoring from 0 to 100',
      ],
      link: '/scanners/message',
      buttonText: 'Try Message Scanner',
    },
    {
      id: 'email-analyzer',
      icon: FiMail,
      title: 'Email Scam & Phishing Analyzer',
      tag: 'Inbox & Header Defense',
      color: '#06B6D4',
      description:
        'Evaluates sender address integrity, display name spoofing, suspicious top-level domains, and fraudulent credential collection attempts in incoming correspondence.',
      benefits: [
        'Display name vs. true domain mismatch detection',
        'Abused TLD scrutiny (.xyz, .top, .click, .buzz)',
        'Extraction and deep scanning of all hyperlinks in email body',
        'Transparent limitations on unauthenticated headers',
      ],
      link: '/scanners/email',
      buttonText: 'Try Email Scanner',
    },
    {
      id: 'website-checker',
      icon: FiGlobe,
      title: 'Website Safety & URL Checker',
      tag: 'Real-Time Threat Intelligence',
      color: '#8B5CF6',
      description:
        'Verifies hyperlinks against Google Safe Browsing, Google Web Risk, and multi-vendor VirusTotal threat databases combined with strict lexical and homoglyph heuristic evaluation.',
      benefits: [
        'Multi-engine consensus lookup from leading security feeds',
        'Punycode and lookalike brand impersonation discovery',
        'Protection against raw IP addresses and private loopback SSRF',
        'Clear distinction between clean database results and zero-day risks',
      ],
      link: '/scanners/website',
      buttonText: 'Check a Website',
    },
    {
      id: 'ai-assistant',
      icon: FiCpu,
      title: 'AI Security Assistant',
      tag: 'Educational & Conversational Advisor',
      color: '#F59E0B',
      description:
        'A dedicated security guidance companion powered by Groq and customized system prompts. Ask questions regarding scam tactics, incident recovery, and safe online practices.',
      benefits: [
        'Context-bound advisory that never contradicts scanner findings',
        'Step-by-step account recovery advice if compromised',
        'Formatted markdown with security warnings, tables, and code snippets',
        'Educational explanations tailored for non-technical users',
      ],
      link: '/ai-assistant',
      buttonText: 'Consult AI Assistant',
    },
  ];

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cybreva Security Suite',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All web browsers',
    url: 'https://cybreva.vercel.app/features',
    description: 'Cloud-based scam detection and threat intelligence platform featuring Message, Email, Website scanners and an AI Security Assistant.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cybreva',
      url: 'https://cybreva.vercel.app',
    },
  };

  return (
    <MainLayout>
      <SEO
        title="Cybreva Security Features — Message, Email & Website Scanners"
        description="Explore Cybreva's suite of AI and threat intelligence tools: Message Scam Checker, Email Phishing Analyzer, Website Safety Checker, and AI Security Assistant."
        canonical="https://cybreva.vercel.app/features"
        keywords="scam detection tools, website safety checker, phishing email analyzer, message scam detection, ai security assistant"
        schema={softwareSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs items={[{ label: 'Security Features' }]} />

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <FiShield size={13} />
            Four-Pillar Threat Detection
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Comprehensive Digital Defense Tools
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Engineered to bridge the gap between complex enterprise threat intelligence feeds and everyday internet safety.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-10">
          {featuresList.map((f, idx) => {
            const Icon = f.icon;
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={f.id}
                id={f.id}
                className="glass-2 rounded-3xl p-6 sm:p-10 border border-white/10 shadow-xl"
              >
                <div
                  className={`flex flex-col lg:flex-row items-start lg:items-center gap-8 ${
                    isReversed ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${f.color}20`, border: `1px solid ${f.color}35` }}
                      >
                        <Icon style={{ color: f.color }} size={22} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {f.tag}
                        </span>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{f.title}</h2>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {f.description}
                    </p>

                    <ul className="space-y-2 pt-2">
                      {f.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <FiCheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={15} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4">
                      <Link
                        to={f.link}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)' }}
                      >
                        <span>{f.buttonText}</span>
                        <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  <div className="w-full lg:w-80 glass rounded-2xl p-6 border border-white/5 space-y-3 text-xs text-slate-400 self-stretch flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <FiLock className="text-cyan-400" />
                      <span>Security & Privacy Guarantee</span>
                    </div>
                    <p className="leading-relaxed">
                      Input submitted to Cybreva is evaluated ephemerally and never sold to third-party ad brokers. Scans are tied only to your authenticated profile if you choose to save history.
                    </p>
                    <div className="pt-2 text-[11px] text-slate-500 border-t border-white/5 flex items-center gap-1.5">
                      <FiZap className="text-emerald-400" />
                      <span>Sub-second heuristic execution</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
