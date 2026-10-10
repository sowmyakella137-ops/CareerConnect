import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-2xl font-mono">
        404
      </div>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-sm text-xs text-slate-500 leading-relaxed">
        The requested path does not exist on CareerConnect or you may not have sufficient role permissions to view it.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Home className="h-4 w-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
