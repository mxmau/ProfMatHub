import React, {StrictMode, Component, ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 max-w-lg w-full">
            <h1 className="text-xl font-bold text-red-600 mb-2">Ops! Algo deu errado.</h1>
            <p className="text-slate-600 mb-4">
              O aplicativo encontrou um erro inesperado e não pôde ser carregado corretamente.
            </p>
            <pre className="bg-slate-100 p-4 rounded-lg text-xs text-slate-800 overflow-auto max-h-48 whitespace-pre-wrap">
              {this.state.error?.message || 'Erro desconhecido'}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
