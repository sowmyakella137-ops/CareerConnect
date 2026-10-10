import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../api/adminService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  ClipboardList,
  ArrowRight,
  Shield,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading administrative metrics..." size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                CareerConnect Administration
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              System telemetry and read-only overview of platform users, internships, and student applications.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardStats}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Data
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboardStats} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Total Users</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats?.totalUsers ?? '0'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">All registered accounts</p>
        </div>

        {/* Total Students */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Students</span>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats?.totalStudents ?? '0'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Active university students</p>
        </div>

        {/* Total Companies */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Companies</span>
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats?.totalCompanies ?? '0'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Recruiting employers</p>
        </div>

        {/* Total Internships */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Internships</span>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats?.totalInternships ?? '0'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Published listings</p>
        </div>

        {/* Total Applications */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Applications</span>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats?.totalApplications ?? '0'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Candidate submissions</p>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">User Management</h3>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Inspect user records, email addresses, assigned security roles, and account identifiers across students and companies.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Inspect Registered Users
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Internship Directory</h3>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Browse all company positions, required technical competencies, and employer ownership IDs.
            </p>
          </div>
          <Link
            to="/admin/internships"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Inspect All Internships
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Application Pipeline</h3>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Audit candidate submission histories, link IDs, status transitions, and application timestamps.
            </p>
          </div>
          <Link
            to="/admin/applications"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Inspect All Applications
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
