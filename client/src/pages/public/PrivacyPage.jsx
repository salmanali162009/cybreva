// src/pages/public/PrivacyPage.jsx
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export default function PrivacyPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Privacy Policy' }
  ];

  return (
    <MainLayout>
      <SEO
        title="Privacy Policy — Cybreva Data Handling & Protection"
        description="Read Cybreva privacy policy: transparent data practices, TLS encryption, HTTP-only authentication, and our strict zero-data-selling guarantee."
        canonical="https://cybreva.vercel.app/privacy"
        keywords="cybreva privacy policy, data protection, secure scam scanning, user privacy cybersecurity"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="max-w-3xl mx-auto pt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Effective Date: November 14, 2026 | Last Updated: November 2026
          </p>

          <div className="glass rounded-2xl p-6 sm:p-8 space-y-7 text-slate-300 text-sm leading-relaxed border border-white/10">
            {[
              {
                title: '1. Information We Collect & Process',
                body: 'When you create an account, we collect your name, email address, and an encrypted password hash. When you utilize our threat scanners, we collect the text, email body, or target URL you supply strictly to perform the requested security evaluation and populate your private dashboard history.'
              },
              {
                title: '2. How Information Is Used',
                body: 'Your information is used exclusively to deliver security diagnostics, maintain your authenticated session, prevent denial-of-service abuse, and display historical scan assessments. We do not sell, rent, license, or exchange your personal information or submitted content with advertising exchanges or data brokers.'
              },
              {
                title: '3. Third-Party Threat Verification Services',
                body: 'To perform threat intelligence correlation, URLs may be queried against Google Web Risk API or VirusTotal threat indices. Text strings and message structures are processed through Groq LPU computing clusters running defensive security models. All transit is conducted via encrypted TLS protocols.'
              },
              {
                title: '4. Session & Credential Security',
                body: 'We implement industry-standard security practices: authentication tokens are transmitted via secure, SameSite, HTTP-only browser cookies. JWT tokens are never exposed to browser localStorage or sessionStorage where they could be vulnerable to Cross-Site Scripting (XSS).'
              },
              {
                title: '5. User Control & Data Deletion',
                body: 'You maintain absolute control over your scan records. You may permanently delete individual scan entries from your dashboard at any time. If you wish to delete your entire account and associated historical scans, contact privacy@cybreva.com.'
              },
              {
                title: '6. Storage & Infrastructure Hardening',
                body: 'All passwords are cryptographically salted and hashed using bcrypt before database persistence. Server-side secrets and threat intelligence API keys are protected in isolated environment variables and never exposed to the client.'
              },
              {
                title: '7. Privacy Contact & Data Protection Officer',
                body: 'If you have questions regarding this Privacy Policy or our threat intelligence handling practices, please email our privacy team at privacy@cybreva.com.'
              }
            ].map(({ title, body }) => (
              <div key={title} className="border-b border-white/5 pb-5 last:border-b-0 last:pb-0">
                <h2 className="text-white font-semibold text-base mb-2">{title}</h2>
                <p className="text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
