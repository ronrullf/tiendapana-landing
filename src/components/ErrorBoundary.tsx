import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#FEF3E2',
          fontFamily: 'Inter, sans-serif',
          gap: '16px',
        }}>
          <img src="/logo.png" alt="Tienda Pana" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0A0A0A', margin: 0 }}>
            Algo salió mal
          </h2>
          <pre style={{
            background: '#fff',
            border: '1px solid #FFD0A8',
            borderRadius: 12,
            padding: '16px 20px',
            fontSize: 13,
            color: '#B84600',
            maxWidth: 480,
            width: '100%',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack?.split('\n').slice(0, 6).join('\n')}
          </pre>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#FF6B00',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Volver al inicio
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
