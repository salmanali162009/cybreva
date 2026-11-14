// src/pages/public/PricingPage.jsx
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { FiCheck, FiShield, FiHelpCircle, FiArrowRight } from 'react-icons/fi';

export default function PricingPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Cybreva Online Scam Detection Platform',
    description: 'Real-time AI message, email, and website safety verification plan.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://cybreva.com/pricing'
    }
  };

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Pricing Plans' }
  ];

  return (
    <MainLayout>
      <SEO
        title="Cybreva Pricing — Transparent & Free Online Safety Plans"
        description="Explore Cybreva pricing. Start free with full message, email, and website scam detection tools. No credit card required, no artificial hidden fees."
        canonical="https://cybreva.com/pricing"
        keywords="cybreva pricing, free scam checker, free phishing scanner, safe browsing tools pricing, free cybersecurity tools"
        schema={[productSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center max-w-2xl mx-auto mb-14 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FiShield size={13} />
            <span>Transparent Pricing Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Simple, Honest Scam Protection
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            No forced credit cards, no artificial paywalls, and no hidden subscriptions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Tier */}
          <div className="glass rounded-2xl p-8 border border-emerald-500/30 flex flex-col justify-between shadow-xl relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-2xl">Community Free</h2>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  Active
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-slate-400 text-sm">/ forever</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">
                Full core protection for individuals, families, and everyday internet users.
              </p>

              <ul className="space-y-3.5 mb-8">
                {[
                  'Full Message & SMS scam detection',
                  'Phishing email & header analysis',
                  'Website safety with Google Web Risk lookups',
                  'AI Cybersecurity Assistant guidance',
                  'Personal scan history (30 days)',
                  'Up to 30 scans per 15 minutes limit',
                  'Safe link preview & threat breakdown'
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <FiCheck className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full text-center py-3.5 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              Start Free Account
            </Link>
          </div>

          {/* Pro Tier (Planned) */}
          <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between glass border border-white/10 opacity-90">
            <div className="absolute top-5 right-5 text-xs px-3 py-1 rounded-full font-semibold bg-white/10 text-slate-300 border border-white/10">
              In Development
            </div>

            <div>
              <h2 className="text-white font-bold text-2xl mb-4">Pro & Team</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">$9</span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">
                Advanced tooling for small businesses and power users (planned roadmap).
              </p>

              <ul className="space-y-3.5 mb-8">
                {[
                  'Everything included in Community Free',
                  'Unlimited perpetual scan history',
                  'Expanded rate limits (150 scans / 15 min)',
                  'Priority Groq AI inference latency',
                  'Downloadable audit report PDFs',
                  'REST API token access for custom workflows',
                  'Priority email security advisory support'
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <FiCheck className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled
              className="w-full py-3.5 rounded-xl text-slate-400 font-semibold cursor-not-allowed bg-white/5 border border-white/10"
            >
              Planned Roadmap
            </button>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="glass rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FiHelpCircle className="text-emerald-400" /> Pricing Questions
          </h2>
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white mb-1">Why is Cybreva free?</p>
              <p className="text-slate-400 leading-relaxed">
                We believe basic scam defense and phishing awareness should be accessible to all internet users regardless of income. Our core infrastructure is engineered for cost-efficiency.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Will free features ever be locked behind a paywall?</p>
              <p className="text-slate-400 leading-relaxed">
                No. Our commitment is that core consumer scanning across text messages, emails, and URLs will remain free forever. Future premium tiers are strictly designed for high-volume commercial needs and API integrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
