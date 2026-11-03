// src/pages/public/AboutPage.jsx
import MainLayout from '../../components/layout/MainLayout';
import { FiShield, FiTarget, FiLock } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white mb-4">About Cybreva</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            An AI-powered platform built to help global internet users identify scams, phishing attacks, and unsafe websites before they cause harm.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: FiShield, title: 'Mission', color: '#10B981', desc: 'To make online safety accessible to everyone, not just security professionals.' },
            { icon: FiTarget, title: 'Focus', color: '#06B6D4', desc: 'Scam detection, phishing identification, and security education powered by AI.' },
            { icon: FiLock, title: 'Commitment', color: '#8B5CF6', desc: 'Privacy-first design. We do not sell user data or expose API keys to the browser.' },
          ].map(({ icon: Icon, title, color, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon style={{ color }} size={22} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-7">
          <h2 className="text-white font-bold text-xl mb-3">Honest Assessment</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Cybreva provides AI-assisted assessments to help users make better-informed decisions online. Our results are not guarantees.
            No automated system can detect every scam or malicious website with 100% accuracy.
          </p>
          <p className="text-slate-400 leading-relaxed">
            We use Google Safe Browsing, VirusTotal, and Groq AI to analyse content. Every result includes a clear disclaimer explaining
            the limitations of our analysis. We believe transparency is more trustworthy than false confidence.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
