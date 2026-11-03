// src/pages/public/PrivacyPage.jsx
import MainLayout from '../../components/layout/MainLayout';

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: November 2026</p>
        <div className="glass rounded-2xl p-7 space-y-6 text-slate-400 text-sm leading-relaxed">
          {[
            { title: '1. Data We Collect', body: 'We collect your name, email, and hashed password when you register. We store scan records (content you submit and results) associated with your account to provide scan history.' },
            { title: '2. How We Use Your Data', body: 'Your data is used to provide the Cybreva service: running scans, displaying history, and enabling authentication. We do not sell or share your personal information with advertisers.' },
            { title: '3. External Services', body: 'Scan content may be submitted to third-party services: website URLs are checked via Google Safe Browsing and VirusTotal APIs. Message and email text is analyzed by Groq AI. These services have their own privacy policies.' },
            { title: '4. Authentication', body: 'We use HTTP-only cookies for authentication. JWTs are never stored in localStorage or sessionStorage. Cookies expire according to your session settings.' },
            { title: '5. Data Retention', body: 'Scan history is retained until you delete it. Account data is retained until you request account deletion. Contact us to request data deletion.' },
            { title: '6. Security', body: 'Passwords are hashed with bcrypt. API keys are stored server-side only and never exposed to the browser. We implement rate limiting and input validation on all endpoints.' },
            { title: '7. Contact', body: 'For privacy-related requests, contact us at privacy@cybreva.com. This is a demo contact address for illustrative purposes.' },
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
