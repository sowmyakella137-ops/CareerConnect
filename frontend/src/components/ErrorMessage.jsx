import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../api/api.js';

export default function ErrorMessage({ message, onRetry, className = '' }) {
  if (!message) return null;

  const isNetworkError = message.toLowerCase().includes('cannot connect') || 
                         message.toLowerCase().includes('network') ||
                         message.toLowerCase().includes('cors');

  return (
    <div className={`rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-rose-900 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
        <div className="flex-1 text-sm">
          <p className="font-semibold text-rose-950">Unable to complete request</p>
          <p className="mt-1 text-rose-800 leading-relaxed">{message}</p>
          
          {isNetworkError && (
            <div className="mt-3 rounded-lg border border-rose-200/60 bg-white/80 p-3 text-xs text-slate-700">
              <p className="font-semibold text-slate-800">Spring Boot Backend Checklist:</p>
              <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-600">
                <li>Verify your Spring Boot app is running on port 1234: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">{API_BASE_URL}</code></li>
                <li>Ensure CORS allows <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">http://localhost:3000</code> or your frontend origin.</li>
                <li>Check your terminal logs in your Java IDE / terminal for any unhandled exceptions.</li>
              </ul>
            </div>
          )}

          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-50 transition-colors shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
