// src/pages/public/TermsPage.jsx
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export default function TermsPage() {
  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Terms of Service' }
  ];

  return (
    <MainLayout>
      <SEO
        title="Terms of Service — Cybreva Online Safety Platform"
        description="Review Cybreva terms of service: acceptable use policies, disclaimer of warranties, non-guarantee notices, and user responsibilities."
        canonical="https://cybreva.com/terms"
        keywords="cybreva terms of service, user agreement, acceptable use policy, security disclaimer"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="max-w-3xl mx-auto pt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Effective Date: November 14, 2026 | Last Updated: November 2026
          </p>

          <div className="glass rounded-2xl p-6 sm:p-8 space-y-7 text-slate-300 text-sm leading-relaxed border border-white/10">
            {[
              {
                title: '1. Agreement to Terms',
                body: 'By accessing or using Cybreva ("the Service"), you enter into a binding legal agreement with Cybreva. If you do not accept these terms in their entirety, you must immediately discontinue use of the platform.'
              },
              {
                title: '2. Informational Scope & Non-Guarantee Disclaimer',
                body: 'Cybreva provides AI-assisted threat assessments and risk indicators. These evaluations are strictly informational and do not represent formal legal, financial, or cyber defense certifications. No software system can guarantee 100% prevention against malicious attacks, phishing, or social engineering fraud.'
              },
              {
                title: '3. Limitation of Liability',
                body: 'To the maximum extent permitted by applicable law, Cybreva and its operators shall not be held liable for any damages, financial losses, data compromises, or adverse consequences resulting from decisions made based upon scan scores or AI recommendations.'
              },
              {
                title: '4. Acceptable Use Policy',
                body: 'You agree to utilize Cybreva solely for defensive, educational, and fraud-verification objectives. You are strictly prohibited from attempting to bypass rate limits, probe internal network ranges (such as localhost or private RFC1918 subnets), conduct denial-of-service attacks, or reverse-engineer our proprietary heuristic algorithms.'
              },
              {
                title: '5. Account Security & Credential Protection',
                body: 'You are responsible for maintaining the confidentiality of your login credentials. You agree to notify Cybreva immediately upon becoming aware of any unauthorized use or security compromise regarding your account.'
              },
              {
                title: '6. External API Integrations',
                body: 'Cybreva integrates with Google Web Risk API, VirusTotal, and Groq cloud infrastructure. These integrations are subject to the operational uptime and policy frameworks of respective third-party providers.'
              },
              {
                title: '7. Revisions to Terms',
                body: 'Cybreva reserves the right to amend these Terms of Service periodically to reflect evolving legal standards or platform capabilities. Continued interaction with the platform following posted revisions constitutes acceptance.'
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
