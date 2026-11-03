// src/pages/public/TermsPage.jsx
import MainLayout from '../../components/layout/MainLayout';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: November 2026</p>
        <div className="glass rounded-2xl p-7 space-y-6 text-slate-400 text-sm leading-relaxed">
          {[
            { title: '1. Acceptance', body: 'By using Cybreva, you agree to these terms. If you do not agree, please do not use the service.' },
            { title: '2. Service Description', body: 'Cybreva provides AI-assisted scam detection and online safety tools. Our assessments are informational and do not constitute professional security advice or guaranteed detection.' },
            { title: '3. Limitations of Liability', body: 'Cybreva does not guarantee that any scan result is accurate or complete. You agree that Cybreva is not liable for any decisions made based on scan results. Always use independent judgment.' },
            { title: '4. Acceptable Use', body: 'You may not use Cybreva to scan private or internal IP addresses (this is technically blocked), to probe internal systems, or for any illegal purpose. Do not submit content that violates applicable laws.' },
            { title: '5. Account Responsibility', body: 'You are responsible for maintaining the security of your account credentials. Do not share your password. Report any suspected unauthorized access immediately.' },
            { title: '6. Third-Party Services', body: 'Cybreva integrates with Google Safe Browsing, VirusTotal, and Groq AI. Use of these services is subject to their respective terms. We are not responsible for third-party service availability or accuracy.' },
            { title: '7. Modifications', body: 'We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.' },
            { title: '8. Termination', body: 'We reserve the right to terminate or suspend accounts that violate these terms without prior notice.' },
          ].map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-white font-semibold mb-1.5">{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
