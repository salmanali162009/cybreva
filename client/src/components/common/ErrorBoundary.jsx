// src/components/common/ErrorBoundary.jsx
// React Error Boundary — catches uncaught render-time errors
import { Component } from 'react';
import { RiShieldLine, RiRefreshLine } from 'react-icons/ri';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development; swap for a real error tracking service in production
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0B1220',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            textAlign: 'center',
            background: 'rgba(17,28,46,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '3rem 2rem',
            backdropFilter: 'blur(12px)',
          }}
        >
          <RiShieldLine
            style={{ fontSize: 56, color: '#EF4444', marginBottom: 16 }}
          />
          <h2 style={{ color: '#F8FAFC', fontSize: 22, marginBottom: 8 }}>
            Something went wrong
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 24 }}>
            An unexpected error occurred. Your data is safe. Please return to
            the home page.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre
              style={{
                background: '#0B1220',
                color: '#EF4444',
                borderRadius: 8,
                padding: 12,
                fontSize: 11,
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: 20,
                maxHeight: 120,
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RiRefreshLine />
            Return to Home
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
