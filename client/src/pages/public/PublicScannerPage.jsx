// client/src/pages/public/PublicScannerPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMessageSquare,
  FiMail,
  FiGlobe,
  FiCpu,
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowRight,
  FiHelpCircle,
  FiExternalLink,
  FiChevronDown,
  FiSearch,
  FiZap,
  FiLock,
  FiRefreshCw
} from 'react-icons/fi';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';

const SCANNER_CONFIGS = {
  message: {
    type: 'message',
    title: 'AI Message Scam Checker | Free SMS & Smishing Detector',
    description: 'Scan SMS, WhatsApp, and chat messages for smishing, fake bank alerts, impersonation, and fraudulent links with Cybreva real-time AI security scanner.',
    keywords: 'message scam checker, smishing detector, fake sms detector, whatsapp scam checker, text message fraud, ai scam detection',
    canonical: 'https://cybreva.com/scanners/message',
    heading: 'AI Message Scam & Smishing Checker',
    badge: 'SMS & Instant Message Protection',
    badgeColor: '#10B981',
    icon: FiMessageSquare,
    dashboardRoute: '/dashboard/message',
    subtitle: 'Paste any text, SMS, or direct message to instantly analyze deceptive urgency, spoofed company claims, and fraudulent link patterns.',
    features: [
      { title: 'Deceptive Urgency Detection', desc: 'Identifies artificial pressure tactics designed to force quick impulsive clicks before critical thinking.' },
      { title: 'Impersonation Heuristics', desc: 'Scrutinizes claims of being banks, logistics carriers, government tax bodies, or subscription services.' },
      { title: 'Obfuscated Link Auditing', desc: 'Flags shortened URLs, hidden redirect parameters, and lookalike brand domains embedded in messages.' },
      { title: 'Sensitive Data Solicitations', desc: 'Alerts you whenever a sender demands PINs, CVV codes, login credentials, or one-time verification passwords.' }
    ],
    sampleDemos: [
      {
        label: 'Bank Urgent Alert (Phishing)',
        input: 'URGENT: Your Chase checking account has been temporarily restricted due to unauthorized login activity. Verify your identity immediately at https://chase-security-verify.net/login within 24 hours to prevent permanent suspension.',
        risk: 'High Risk (92/100)',
        verdict: 'High likelihood of brand impersonation, urgent coercion, and credential harvesting domain.'
      },
      {
        label: 'Package Delivery Reschedule',
        input: 'USPS Notice: Your package #US928120 cannot be delivered due to an incorrect postal address. Please update your details and pay a $1.95 processing fee at https://usps-redelivery-support.xyz',
        risk: 'High Risk (95/100)',
        verdict: 'Classic delivery fee scam utilizing a deceptive .xyz typosquatted domain.'
      },
      {
        label: 'Legitimate Two-Factor Code',
        input: 'Your 6-digit GitHub authentication code is 482910. This code expires in 10 minutes. Cybreva and GitHub staff will never call or ask you for this code.',
        risk: 'Low Risk (5/100)',
        verdict: 'Standard authentication protocol with clear safety disclaimers and no outbound suspicious links.'
      }
    ],
    faq: [
      { q: 'What is smishing and how does Cybreva detect it?', a: 'Smishing is SMS phishing where cybercriminals send deceptive text messages to steal personal credentials or install malware. Cybreva uses Groq-powered natural language processing and threat databases to evaluate tone, urgency, sender credibility, and embedded URLs.' },
      { q: 'Is it safe to paste personal text messages into Cybreva?', a: 'Yes. Cybreva processes submissions securely over encrypted TLS connections. We recommend redacting personal identifiers such as full names or phone numbers prior to submission.' },
      { q: 'Can Cybreva block messages directly on my phone?', a: 'Cybreva is a web-based intelligence platform. You copy and inspect suspicious content on our platform before interacting with it. We do not require invasive phone permissions or telecom profile installations.' }
    ]
  },
  email: {
    type: 'email',
    title: 'Phishing Email Checker | AI Email Scam Detector — Cybreva',
    description: 'Detect phishing emails, spoofed sender domains, malicious attachments, and credential harvesting schemes with Cybreva AI-powered email threat analyzer.',
    keywords: 'phishing email checker, email scam detector, spoofed email analyzer, credential harvesting, business email compromise, ai email security',
    canonical: 'https://cybreva.com/scanners/email',
    heading: 'AI Phishing Email Analyzer & Detector',
    badge: 'Email Threat & BEC Defense',
    badgeColor: '#06B6D4',
    icon: FiMail,
    dashboardRoute: '/dashboard/email',
    subtitle: 'Inspect suspicious email headers, body copy, and embedded call-to-actions to uncover credential harvesters and Business Email Compromise (BEC).',
    features: [
      { title: 'Header & Domain Discrepancies', desc: 'Detects sender address mismatches, forged display names, and unregistered sending mail servers.' },
      { title: 'Credential Harvesting Traps', desc: 'Scans for deceptive Microsoft 365, Google Workspace, or banking sign-in lures intended to capture credentials.' },
      { title: 'Payment Diversion Alerts', desc: 'Flags subtle requests to change wire transfer details, purchase gift cards, or route corporate payroll.' },
      { title: 'Malware Lure Identification', desc: 'Evaluates requests to open attached password-protected archives, macros, or fake PDF invoices.' }
    ],
    sampleDemos: [
      {
        label: 'Executive Wire Transfer Request (BEC)',
        input: 'From: CEO <ceo-corporate-update@gmail.com>\nSubject: Quick wire transfer needed\nHey, I am currently boarding a flight. We need to settle invoice #9921 for the vendor right away to prevent service termination. Please process $4,850 to the account details attached immediately.',
        risk: 'High Risk (94/100)',
        verdict: 'Business Email Compromise (BEC) indicator: Free email service spoofing executive identity with urgent financial demand.'
      },
      {
        label: 'Password Expiration Warning',
        input: 'From: IT Security Helpdesk <admin@support-microsoft-securityportal.com>\nSubject: Security Alert: Your mailbox password expires in 2 hours\nYour corporate email access will be terminated unless you confirm your existing credentials at https://auth-verify-user.cc/portal',
        risk: 'High Risk (96/100)',
        verdict: 'Credential harvesting trap with synthetic deadline and typosquatted fake login portal.'
      }
    ],
    faq: [
      { q: 'How does Cybreva evaluate email headers and sender fields?', a: 'Cybreva analyzes the relationship between the sender display name and the underlying domain, flagging free webmail services impersonating corporate or financial institutions.' },
      { q: 'Does Cybreva store the contents of my corporate emails?', a: 'Scans are saved to your private authenticated scan history so you can review findings. You can permanently delete any scan record at any time with a single click in your dashboard.' },
      { q: 'Can Cybreva catch Business Email Compromise (BEC)?', a: 'Yes. Our Groq AI engine is specifically trained on linguistic patterns of executive impersonation, urgent invoice re-routing, and pressure-based protocol circumvention.' }
    ]
  },
  website: {
    type: 'website',
    title: 'Website Safety Checker | Malicious URL & Scam Scanner',
    description: 'Verify website safety and detect malware, typosquatting, fraudulent e-commerce stores, and phishing domains with real-time Google Web Risk and AI scanning.',
    keywords: 'website safety checker, check url safety, scam website scanner, phishing link detector, malware website check, safe browsing scanner',
    canonical: 'https://cybreva.com/scanners/website',
    heading: 'Website Safety & Malicious URL Scanner',
    badge: 'Real-Time Threat Intelligence',
    badgeColor: '#8B5CF6',
    icon: FiGlobe,
    dashboardRoute: '/dashboard/website',
    subtitle: 'Check any web URL against Google Web Risk API, VirusTotal threat intelligence, and AI heuristics to confirm authenticity before visiting.',
    features: [
      { title: 'Google Web Risk Threat Lookup', desc: 'Cross-checks target URLs against Google global database of confirmed malware, social engineering, and unwanted software.' },
      { title: 'Typosquatting & Lookalike Domains', desc: 'Flags subtle character substitutions (e.g., using 0 for O or rn for m) engineered to clone legitimate websites.' },
      { title: 'Fake E-Commerce & Payment Portals', desc: 'Detects newly registered storefronts offering impossible discounts designed to steal card details.' },
      { title: 'Deceptive Redirect Chains', desc: 'Traces link redirects that bounce victims through multiple intermediary servers to evade automated security filters.' }
    ],
    sampleDemos: [
      {
        label: 'Discount Luxury Storefront (Clone)',
        input: 'https://super-cheap-apple-store-official-discounts.shop/iphone16-deal',
        risk: 'High Risk (97/100)',
        verdict: 'Fake e-commerce domain using trademark keywords on a newly registered high-risk TLD.'
      },
      {
        label: 'Official Government Portal',
        input: 'https://www.irs.gov/payments',
        risk: 'Low Risk (0/100)',
        verdict: 'Authentic government top-level domain (.gov) with verified DNS infrastructure.'
      }
    ],
    faq: [
      { q: 'What threat intelligence databases does Cybreva integrate with?', a: 'Cybreva utilizes Google Web Risk API for real-time detection of known malicious URLs, social engineering pages, and malware hosts, supplemented by optional VirusTotal intelligence and our proprietary AI heuristic layer.' },
      { q: 'Can a brand-new scam website bypass traditional blocklists?', a: 'Yes, newly registered phishing sites often evade static blocklists for the first 24 to 48 hours. Cybreva bridges this gap by combining database lookups with Groq AI heuristics that analyze lexical domain construction, TLD reputation, and contextual indicators.' },
      { q: 'Is it completely safe to scan a link on Cybreva?', a: 'Yes. Cybreva conducts server-side analysis without triggering client-side script execution on your personal machine or exposing your local IP address to the target host.' }
    ]
  },
  ai: {
    type: 'ai',
    title: 'AI Security Assistant | Interactive Cyber Threat Advice',
    description: 'Ask Cybreva AI anything about online scams, suspicious files, credential safety, and incident recovery with real-time security guidance and best practices.',
    keywords: 'ai security assistant, cyber threat advisor, online scam questions, incident recovery ai, cybersecurity consultation, fraud detection assistant',
    canonical: 'https://cybreva.com/ai-assistant',
    heading: 'Cybreva AI Security Assistant',
    badge: 'Interactive Threat Guidance',
    badgeColor: '#F59E0B',
    icon: FiCpu,
    dashboardRoute: '/dashboard/ai',
    subtitle: 'Conversational cybersecurity intelligence. Ask detailed questions about suspicious scenarios, verify verification codes, or obtain incident response playbooks.',
    features: [
      { title: 'Plain-English Incident Response', desc: 'Received immediate step-by-step guidance on what to do if you clicked a suspicious link or disclosed a password.' },
      { title: 'Tactic Deconstruction', desc: 'Understand the underlying social engineering psychology and attack vectors behind evolving cybercrime trends.' },
      { title: 'Credential & Device Sanitization', desc: 'Learn how to secure compromised accounts, revoke malicious session tokens, and run reputable local diagnostics.' },
      { title: 'Unbiased Safety Clarifications', desc: 'Receive objective, non-sponsored advice on passwords, two-factor authentication methods, and secure web hygiene.' }
    ],
    sampleDemos: [
      {
        label: 'Accidental Password Disclosure',
        input: 'I just entered my password on a suspicious site claiming to be PayPal. What exact steps should I take in the next 15 minutes?',
        risk: 'Incident Response Protocol',
        verdict: 'Immediately navigate to PayPal via a clean browser tab, change your credentials, terminate all active login sessions, and contact your linked financial institution.'
      },
      {
        label: 'Caller Claiming to be Tech Support',
        input: 'A caller claiming to be from Microsoft said my IP was compromised and asked me to install AnyDesk. Is this genuine?',
        risk: 'High Threat Advisory',
        verdict: 'Never grant remote desktop access. Microsoft never initiates unsolicited outbound calls regarding compromised computers.'
      }
    ],
    faq: [
      { q: 'What AI model powers the Cybreva Security Assistant?', a: 'Cybreva utilizes ultra-low-latency Groq LPUs running state-of-the-art open large language models, specifically fine-tuned with cybersecurity prompt engineering guidelines and defensive principles.' },
      { q: 'Can the AI Assistant help me write malicious code or hack accounts?', a: 'No. Cybreva AI operates strictly within defensive safety boundaries. It categorically rejects requests for malicious payload generation, exploit construction, or unauthorized intrusion techniques.' },
      { q: 'Does the AI Assistant replace human cybersecurity professionals?', a: 'Cybreva provides rapid first-line educational guidance and risk triaging. For legal reporting, commercial regulatory compliance, or law enforcement reporting, always consult licensed authorities.' }
    ]
  }
};

export default function PublicScannerPage({ type = 'message' }) {
  const config = SCANNER_CONFIGS[type] || SCANNER_CONFIGS.message;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeDemo, setActiveDemo] = useState(config.sampleDemos[0]);
  const [openFaq, setOpenFaq] = useState(null);

  const Icon = config.icon;

  // JSON-LD SoftwareApplication & FAQPage Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.heading,
    operatingSystem: 'All (Web-based)',
    applicationCategory: 'SecurityApplication',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD'
    },
    description: config.description,
    url: config.canonical,
    publisher: {
      '@type': 'Organization',
      name: 'Cybreva',
      url: 'https://cybreva.com'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Scanners', to: '/features' },
    { label: config.heading }
  ];

  return (
    <MainLayout>
      <SEO
        title={config.title}
        description={config.description}
        canonical={config.canonical}
        keywords={config.keywords}
        schema={[softwareSchema, faqSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-12">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm"
            style={{
              background: `${config.badgeColor}15`,
              border: `1px solid ${config.badgeColor}35`,
              color: config.badgeColor
            }}
          >
            <Icon size={14} />
            <span>{config.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            {config.heading}
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
            {config.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? config.dashboardRoute : `/register?redirect=${config.dashboardRoute}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              <FiZap />
              <span>{user ? 'Open Scanner in Dashboard' : 'Launch Full Scanner Free'}</span>
              <FiArrowRight />
            </Link>

            <Link
              to="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white glass border border-white/10 transition-colors"
            >
              <span>Explore All Capabilities</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Sample Preview */}
        <section className="mb-20">
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                  <FiSearch size={13} /> Interactive Analysis Sample
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  See How Cybreva Evaluates Indicators
                </h2>
              </div>

              {/* Sample Preset Selector */}
              <div className="flex flex-wrap gap-2">
                {config.sampleDemos.map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDemo(demo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeDemo.label === demo.label
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
              {/* Simulated Input */}
              <div className="lg:col-span-7 bg-[#0B1220]/80 rounded-xl p-5 border border-white/5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap min-h-[160px]">
                {activeDemo.input}
              </div>

              {/* Simulated Verdict Card */}
              <div className="lg:col-span-5 bg-[#111C2E] rounded-xl p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Analysis Verdict</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      activeDemo.risk.includes('Low')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {activeDemo.risk.includes('Low') ? <FiCheckCircle /> : <FiAlertTriangle />}
                    {activeDemo.risk}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {activeDemo.verdict}
                </p>

                <div className="pt-2">
                  <Link
                    to={user ? config.dashboardRoute : `/register?redirect=${config.dashboardRoute}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                  >
                    <span>Analyze Your Own Text in Live Scanner</span>
                    <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Detection Section */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Core Detection Capabilities
            </h2>
            <p className="text-slate-400 text-sm">
              Our multi-layered inspection engine screens every submitted artifact against rigorous cyber threat indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.features.map((feat, i) => (
              <div
                key={i}
                className="glass rounded-xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                  <FiCheckCircle size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works 3-Step Process */}
        <section className="mb-20 glass rounded-2xl p-8 sm:p-12 border border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              How the Verification Workflow Works
            </h2>
            <p className="text-slate-400 text-sm">
              From raw input to deterministic intelligence in under 2 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Input Submission</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Provide text, headers, or URL through our secured, TLS-encrypted interface.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-cyan-400 font-mono font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Multi-Source Verification</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rules, heuristic scoring, and real-time threat intelligence feeds cross-examine the content.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Score & Recommendations</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive an explicit risk score (0-100), detected red flags, and safe next-step actions.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (GEO / Search optimized) */}
        <section className="mb-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">
              Everything you need to know about this scanner and cyber threat verification.
            </p>
          </div>

          <div className="space-y-3">
            {config.faq.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass rounded-xl border border-white/5 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white text-sm sm:text-base font-semibold">
                      {item.q}
                    </span>
                    <FiChevronDown
                      className={`text-slate-400 flex-shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 text-slate-300 text-sm leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="glass rounded-2xl p-8 sm:p-12 border border-emerald-500/20 text-center relative overflow-hidden mb-12">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Check Before You Trust
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              Join thousands of internet users who verify suspicious digital messages, emails, and links before falling victim to fraud.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? config.dashboardRoute : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                <span>{user ? 'Go to Scanner Dashboard' : 'Get Started Free'}</span>
                <FiArrowRight />
              </Link>
              <Link
                to="/blog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white glass border border-white/10 transition-colors"
              >
                <span>Read Educational Guides</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
