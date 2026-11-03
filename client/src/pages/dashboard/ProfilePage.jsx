// src/pages/dashboard/ProfilePage.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import { useForm } from 'react-hook-form';
import { FiUser, FiSave, FiLock } from 'react-icons/fi';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-colors";

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: pErr } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  });

  const { register: regPw, handleSubmit: handlePw, formState: { errors: pwErr }, reset: resetPw, setError: setPwError } = useForm();

  const onProfileSave = async (data) => {
    setProfileLoading(true);
    try {
      const res = await authApi.updateProfile(data);
      updateUser(res.data.data.user);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.message || 'Update failed'); }
    finally { setProfileLoading(false); }
  };

  const onPasswordChange = async (data) => {
    setPwLoading(true);
    try {
      await authApi.changePassword(data);
      toast.success('Password changed successfully');
      resetPw();
    } catch (err) {
      setPwError('root', { message: err.message });
      toast.error(err.message || 'Failed to change password');
    } finally { setPwLoading(false); }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <h1 className="text-xl font-bold text-white">Profile</h1>

        {/* Avatar */}
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}>
              {initials}
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full capitalize"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                {user?.role || 'user'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Profile form */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <FiUser className="text-emerald-400" size={16} />
            <h2 className="text-white font-semibold">Account Details</h2>
          </div>
          <form onSubmit={handleProfile(onProfileSave)} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
              <input type="text" className={inputClass}
                {...regProfile('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })} />
              {pErr.name && <p className="text-red-400 text-xs mt-1">{pErr.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email</label>
              <input type="email" className={inputClass}
                {...regProfile('email', { required: 'Email is required' })} />
              {pErr.email && <p className="text-red-400 text-xs mt-1">{pErr.email.message}</p>}
            </div>
            <button type="submit" disabled={profileLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
              <FiSave size={14} />
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </GlassCard>

        {/* Change password */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <FiLock className="text-cyan-400" size={16} />
            <h2 className="text-white font-semibold">Change Password</h2>
          </div>
          <form onSubmit={handlePw(onPasswordChange)} className="space-y-4">
            {pwErr.root && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {pwErr.root.message}
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Current Password</label>
              <input type="password" className={inputClass}
                {...regPw('currentPassword', { required: 'Required' })} />
              {pwErr.currentPassword && <p className="text-red-400 text-xs mt-1">{pwErr.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">New Password</label>
              <input type="password" placeholder="Min 8 chars, upper, lower, number" className={inputClass}
                {...regPw('newPassword', {
                  required: 'Required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                  pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must contain uppercase, lowercase, and number' }
                })} />
              {pwErr.newPassword && <p className="text-red-400 text-xs mt-1">{pwErr.newPassword.message}</p>}
            </div>
            <button type="submit" disabled={pwLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg,#06B6D4,#0891B2)' }}>
              <FiLock size={14} />
              {pwLoading ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
