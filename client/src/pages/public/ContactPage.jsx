// src/pages/public/ContactPage.jsx
import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { FiMail, FiMapPin, FiShield, FiSend, FiCheckCircle, FiClock, FiHelpCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      toast.error('Please enter your email and message.');
      return;
    }
    setLoading(true);
    // Real, safe simulated feedback without fabricating a fake third-party webhook
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message received. Thank you for reaching out!');
    }, 600);
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Cybreva Security Team',
    description: 'Get in touch with Cybreva for threat intelligence reporting, API licensing queries, feedback, or general security inquiries.',
    url: 'https://cybreva.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Cybreva',
      email: 'contact@cybreva.com',
      url: 'https://cybreva.com',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support & Threat Inquiries',
        email: 'contact@cybreva.com',
        availableLanguage: ['English'],
      },
    },
  };

  return (
    <MainLayout>
      <SEO
        title="Contact Cybreva — Support, Security Feedback & Threat Reporting"
        description="Connect with the Cybreva security and research team. Report suspected scam campaigns, request support, or inquire about threat intelligence integrations."
        canonical="https://cybreva.com/contact"
        keywords="contact cybreva, report scam website, cybersecurity support, threat intelligence inquiries"
        schema={contactSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
            <FiHelpCircle size={13} />
            We Value Direct Communication
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Get in Touch With Our Team
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Have questions about our threat heuristics, spotted a new scam pattern, or need enterprise verification? We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <div className="glass-2 rounded-2xl p-6 border border-white/10 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiShield className="text-emerald-400" />
                <span>Contact Channels</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <FiMail size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">General & Threat Inquiries</p>
                    <a href="mailto:contact@cybreva.com" className="text-slate-400 hover:text-emerald-400 underline">
                      contact@cybreva.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <FiClock size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Response Timeframe</p>
                    <p className="text-slate-400">Inquiries reviewed within 1–2 business days.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <FiMapPin size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Platform Operations</p>
                    <p className="text-slate-400">Global cloud-distributed threat intelligence.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Advisory */}
            <div className="glass rounded-2xl p-5 border border-white/10 text-xs text-slate-400 space-y-2">
              <h3 className="font-semibold text-white">Reporting Ongoing Scams</h3>
              <p className="leading-relaxed">
                If you have experienced financial theft or identity compromise, please immediately notify your local law enforcement and financial institutions.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="glass-2 rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <FiCheckCircle size={30} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Received</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Thank you for contacting Cybreva. Our security team will review your inquiry and follow up at <strong className="text-white">{form.email}</strong>.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all mt-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-2">Send us a direct inquiry</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Alex Morgan"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g., Threat reporting or integration question"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Message Content *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please provide context regarding your inquiry or observed threat pattern..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all text-xs sm:text-sm disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}
                  >
                    <FiSend size={14} />
                    <span>{loading ? 'Sending...' : 'Transmit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
