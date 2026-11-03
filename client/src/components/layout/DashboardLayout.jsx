// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import { FiMenu, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B1220' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex h-full">
            <Sidebar collapsed={false} setCollapsed={() => {}} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="flex md:hidden items-center justify-between h-14 px-4 glass-2 border-b border-white/5">
          <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white">
            <FiMenu size={20} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}>
              <FiShield className="text-white text-xs" />
            </div>
            <span className="font-bold text-white text-sm">Cybreva</span>
          </Link>
          <div className="w-8" />
        </div>

        {/* Collapse toggle for desktop (collapsed state) */}
        {collapsed && (
          <div className="hidden md:flex items-center px-2 py-3 border-b border-white/5">
            <button onClick={() => setCollapsed(false)}
              className="text-slate-500 hover:text-white transition-colors p-1">
              <FiMenu size={18} />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
