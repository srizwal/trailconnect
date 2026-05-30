import React from 'react';
import { Mountain } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <Mountain size={56} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ marginBottom: '1.5rem', maxWidth: 360 }}>Don't worry — your adventure isn't over. Try refreshing the page.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ marginTop: '1rem', fontSize: '0.75rem', textAlign: 'left', background: 'var(--mist)', padding: '1rem', borderRadius: 8, maxWidth: 500, overflow: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
