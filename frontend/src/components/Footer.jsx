import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">CareerConnect</span>
          <span>·</span>
          <span>Student Networking & Internship Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link to="/internships" className="hover:text-slate-900 transition-colors">Internships</Link>
          <Link to="/login" className="hover:text-slate-900 transition-colors">Login</Link>
          <Link to="/register" className="hover:text-slate-900 transition-colors">Register</Link>
        </div>

        <p className="text-slate-400">
          Powered by Java Spring Boot REST API (Port 1234)
        </p>
      </div>
    </footer>
  );
}
