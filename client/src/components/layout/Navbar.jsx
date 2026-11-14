// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShield, FiMenu, FiX, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-2 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <img
              src="/logo.png"
              alt="Cybreva Logo"
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-lg text-white tracking-tight">Cybreva</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-sm text-slate-400 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                  <FiUser className="text-emerald-400" />
                  <span>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout}
                  className="text-sm px-4 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-1.5">
                  Login
                </Link>
                <Link to="/register"
                  className="text-sm px-4 py-2 rounded-lg font-medium text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden text-slate-400 hover:text-white transition-colors">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-2 border-t border-white/5 px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white py-2 text-sm transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}
                  className="text-sm text-emerald-400">Dashboard</Link>
                <button onClick={handleLogout} className="text-sm text-slate-400 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="text-sm text-slate-300">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)}
                  className="text-sm text-white font-medium px-4 py-2 rounded-lg text-center"
                  style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
