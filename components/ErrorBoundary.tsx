import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      const isDev = Boolean(import.meta.env?.DEV);

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-red-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Une erreur est survenue</h1>
                <p className="text-sm text-gray-500">L'application a rencontré un problème inattendu.</p>
              </div>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
              <p className="font-medium">{this.state.error?.message || 'Erreur inconnue'}</p>
            </div>

            {/* Dev mode details */}
            {isDev && this.state.error && (
              <details className="text-xs bg-gray-900 text-gray-100 rounded-xl p-4 overflow-auto max-h-60">
                <summary className="cursor-pointer font-mono font-semibold text-yellow-400 mb-2">
                  Détails techniques (Mode Développement)
                </summary>
                <div className="space-y-2 font-mono whitespace-pre-wrap break-words">
                  <p className="text-red-300 font-bold">{this.state.error.stack}</p>
                  {this.state.errorInfo?.componentStack && (
                    <div className="mt-2 text-gray-400 border-t border-gray-800 pt-2">
                      <p className="text-gray-300 font-semibold mb-1">Component Stack:</p>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recharger la page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
