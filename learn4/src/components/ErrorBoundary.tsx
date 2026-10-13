import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#F7FFF4', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐛</div>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 22, color: '#1F1F1F', marginBottom: 8 }}>
            Oops! Something went wrong
          </h2>
          <p style={{ fontFamily: 'Nunito, sans-serif', color: '#777', fontSize: 14, marginBottom: 24, maxWidth: 280 }}>
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="btn-duo btn-green"
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
