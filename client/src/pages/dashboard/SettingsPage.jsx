// src/pages/dashboard/SettingsPage.jsx
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import { FiSettings, FiInfo } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <FiSettings className="text-emerald-400" size={16} />
            <h2 className="text-white font-semibold">Account Settings</h2>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <FiInfo className="text-emerald-400 flex-shrink-0 mt-0.5" size={15} />
            <p className="text-slate-400 text-sm leading-relaxed">
              Additional account settings such as notification preferences, data export, and account deletion are planned features.
              For profile and password changes, visit the <a href="/dashboard/profile" className="text-emerald-400 hover:text-emerald-300">Profile</a> page.
            </p>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
