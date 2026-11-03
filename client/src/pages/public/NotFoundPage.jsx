// src/pages/public/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { FiShield } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-7xl font-black gradient-text mb-4">404</p>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-slate-400 mb-6 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium"
            style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            <FiShield size={15} /> Back to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
