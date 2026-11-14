// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import {
  FiShield, FiMessageSquare, FiMail, FiGlobe, FiCpu,
  FiClock, FiUser, FiSettings, FiLogOut, FiGrid, FiChevronLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid, exact: true },
  { to: '/dashboard/message', label: 'Message Checker', icon: FiMessageSquare },
  { to: '/dashboard/email', label: 'Email Checker', icon: FiMail },
  { to: '/dashboard/website', label: 'Website Checker', icon: FiGlobe },
  { to: '/dashboard/ai', label: 'AI Assistant', icon: FiCpu },
  { to: '/dashboard/history', label: 'Scan History', icon: FiClock },
  { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
  { to: '/dashboard/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <aside
      className={clsx(
        'glass-2 border-r border-white/5 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
        'h-full'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center h-16 border-b border-white/5 px-4',
        collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Cybreva Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-white text-sm tracking-tight">Cybreva</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" title="Cybreva Dashboard" className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Cybreva Logo"
              className="w-8 h-8 object-contain"
            />
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className={clsx('text-slate-500 hover:text-white transition-colors', collapsed && 'hidden')}>
          <FiChevronLeft size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link key={item.to} to={item.to}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group',
                active
                  ? 'text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
                collapsed && 'justify-center'
              )}
              style={active ? { background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,182,212,0.1))', border: '1px solid rgba(16,185,129,0.2)' } : {}}
            >
              <Icon className={clsx('flex-shrink-0', active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300')} size={17} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/5 p-3 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-white text-xs font-medium truncate">{user.name}</p>
            <p className="text-slate-500 text-xs truncate">{user.email}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className={clsx(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full',
            collapsed && 'justify-center'
          )}>
          <FiLogOut size={16} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
