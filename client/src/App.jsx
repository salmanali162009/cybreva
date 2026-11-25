// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public pages
import HomePage from './pages/public/HomePage';
import FeaturesPage from './pages/public/FeaturesPage';
import ContactPage from './pages/public/ContactPage';
import BlogListingPage from './pages/public/BlogListingPage';
import BlogPostPage from './pages/public/BlogPostPage';
import PublicScannerPage from './pages/public/PublicScannerPage';
import AboutPage from './pages/public/AboutPage';
import PricingPage from './pages/public/PricingPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import MessageCheckerPage from './pages/dashboard/MessageCheckerPage';
import EmailCheckerPage from './pages/dashboard/EmailCheckerPage';
import WebsiteCheckerPage from './pages/dashboard/WebsiteCheckerPage';
import AIAssistantPage from './pages/dashboard/AIAssistantPage';
import ScanHistoryPage from './pages/dashboard/ScanHistoryPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';

export function AppRoutes() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111C2E',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* Public Scanner Landing Pages (SEO & GEO) */}
        <Route path="/scanners/message" element={<PublicScannerPage type="message" />} />
        <Route path="/scanners/email" element={<PublicScannerPage type="email" />} />
        <Route path="/scanners/website" element={<PublicScannerPage type="website" />} />
        <Route path="/ai-assistant" element={<PublicScannerPage type="ai" />} />

        {/* Legal */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/message" element={<ProtectedRoute><MessageCheckerPage /></ProtectedRoute>} />
        <Route path="/dashboard/email" element={<ProtectedRoute><EmailCheckerPage /></ProtectedRoute>} />
        <Route path="/dashboard/website" element={<ProtectedRoute><WebsiteCheckerPage /></ProtectedRoute>} />
        <Route path="/dashboard/ai" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
        <Route path="/dashboard/history" element={<ProtectedRoute><ScanHistoryPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
