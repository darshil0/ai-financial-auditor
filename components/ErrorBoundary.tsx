import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-8">
          <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl text-center max-w-md animate-in zoom-in-95 duration-300">
            <div className="bg-rose-50 dark:bg-rose-900/30 w-20 h-20 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-lg shadow-rose-500/10">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Something went wrong
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
              {this.state.errorMessage ||
                "An unexpected error occurred in the intelligence engine. Please reload the workspace."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <RefreshCw size={20} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
