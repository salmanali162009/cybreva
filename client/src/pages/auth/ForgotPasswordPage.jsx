// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail } from 'react-icons/fi';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data);
      setSent(true);
      toast.success('Check your email for instructions.');
    } catch (err) {
      toast.error(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0B1220' }}>
      <SEO
        title="Reset Password — Cybreva Account Recovery"
        description="Request account recovery and password reset instructions for your Cybreva online security account."
        canonical="https://cybreva.vercel.app/forgot-password"
        noindex={true}
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group" title="Return to Cybreva Home">
            <img
              src="/logo.png"
              alt="Cybreva Logo"
              className="w-14 h-14 object-contain transition-transform group-hover:scale-105 mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your email to receive reset instructions</p>
        </div>
        <div className="glass rounded-2xl p-7">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.15)' }}>
                <FiMail className="text-emerald-400" size={22} />
              </div>
              <h3 className="text-white font-semibold mb-2">Check your inbox</h3>
              <p className="text-slate-400 text-sm">
                If an account with that email exists, we've sent reset instructions.
              </p>
              <Link to="/login" className="inline-block mt-4 text-emerald-400 text-sm hover:text-emerald-300">
                ← Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input type="email" placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-colors"
                    {...register('email', { required: 'Email is required' })} />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              <Link to="/login" className="block text-center text-sm text-slate-400 hover:text-slate-300">← Back to login</Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
