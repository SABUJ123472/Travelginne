import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0e1a12] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="max-w-md p-8 rounded-3xl bg-[#152019] border border-[#c85a44]/40 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#c85a44]/20 border border-[#c85a44]/50 flex items-center justify-center mx-auto text-[#c85a44]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Something went wrong</h2>
            <p className="text-xs text-[#a8c4ad]/70 leading-relaxed">
              We encountered an unexpected rendering error in the travel interface.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white text-xs font-bold shadow-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
