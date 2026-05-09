import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full w-full animate-in fade-in duration-700 relative z-50">
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm -z-10 rounded-[inherit]"></div>
          
          <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-100 dark:border-red-500/20 shadow-inner">
            <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">Oops! Something went wrong.</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
            We're sorry, but this page encountered an unexpected rendering error. You can try refreshing the view.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl text-left w-full max-w-lg mb-8 overflow-auto border border-slate-200 dark:border-slate-700">
            <code className="text-[12px] text-red-600 dark:text-red-400 font-mono break-all">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              // Force a clean reload if the user clicks reload
              window.location.reload();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 group"
          >
            <RefreshCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
