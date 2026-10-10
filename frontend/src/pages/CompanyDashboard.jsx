import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { internshipService } from '../api/internshipService.js';
import { applicationService } from '../api/applicationService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import {
  Briefcase,
  Users,
  PlusCircle,
  FileCheck2,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function CompanyDashboard() {
  const { user } = useAuth();

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ints, apps] = await Promise.all([
        internshipService.getCompanyInternships().catch(() => []),
        applicationService.getCompanyApplications().catch(() => []),
      ]);

      setInternships(Array.isArray(ints) ? ints : []);
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingCount = applications.filter(
    (a) => String(a.status).toUpperCase() === 'APPLIED' || String(a.status).toUpperCase() === 'UNDER_REVIEW'
  ).length;

  const acceptedCount = applications.filter(
    (a) => String(a.status).toUpperCase() === 'ACCEPTED'
  ).length;

  if (loading) {
    return <LoadingSpinner message="Loading employer dashboard..." size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {user?.name || 'Company'} Recruiter Portal
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage your company's internship listings and evaluate university applicants.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/company/internships"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              Post New Internship
            </Link>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Active Listings</span>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {internships.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Internship positions published</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Total Applicants</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {applications.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Applications received</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Pending Review</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Require evaluation</p>
        </div>
      </div>

      {/* Two Column Grid: Recent Applications & Posted Internships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Candidate Applications</h2>
            </div>
            <Link
              to="/company/applications"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({applications.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => {
                const appId = app.id || app.applicationId;
                const studentName = app.studentName || app.student?.name || `Student #${app.studentUserId || '—'}`;
                const internshipTitle = app.internshipTitle || app.internship?.title || `Internship #${app.internshipId || '—'}`;

                return (
                  <div key={appId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">{studentName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{internshipTitle}</p>
                    </div>
                    <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 uppercase font-mono">
                      {app.status || 'APPLIED'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No applications yet"
              description="Candidates will appear here as soon as students apply to your postings."
            />
          )}
        </div>

        {/* Posted Internships */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Your Posted Positions</h2>
            </div>
            <Link
              to="/company/internships"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage ({internships.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {internships.length > 0 ? (
            <div className="space-y-3">
              {internships.slice(0, 4).map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-slate-50 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                    <span className="text-[11px] text-slate-400">ID #{item.id}</span>
                  </div>
                  {item.requiredSkills && (
                    <p className="mt-1 text-[11px] text-slate-500 truncate">
                      Skills: {Array.isArray(item.requiredSkills) ? item.requiredSkills.join(', ') : item.requiredSkills}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No internships posted"
              description="Publish your first internship posting to begin receiving student applicants."
              actionLabel="Create First Listing"
              onAction={() => (window.location.href = '/company/internships')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
