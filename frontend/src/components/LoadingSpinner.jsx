import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-slate-500 ${className}`} role="status">
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size] || sizeClasses.md}`} />
      {message && <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
