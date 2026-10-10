import React, { useState, useEffect } from 'react';
import { applicationService } from '../api/applicationService.js';
import { getErrorMessage } from '../api/api.js';
import { Link } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import {
  FileCheck2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Check,
} from 'lucide-react';

const VALID_STATUSES = ['APPLIED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'];

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Updating state
  const [updatingId, setUpdatingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getCompanyApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    setActionSuccess(null);
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => ((app.id || app.applicationId) === appId ? { ...app, status: newStatus } : app))
      );
      setActionSuccess(`Application #${appId} status updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert(`Could not update application status: ${getErrorMessage(err)}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return String(app.status).toUpperCase() === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Review Candidate Applications
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Review student applicants and advance candidates through the hiring pipeline ({applications.length}).
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses ({applications.length})</option>
            <option value="APPLIED">Submitted / Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchApplications} />}

      {actionSuccess && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <LoadingSpinner message="Loading candidate applications..." size="lg" className="py-20" />
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((app) => {
            const appId = app.id || app.applicationId;
            const studentName = app.studentName || app.student?.name || `Student Candidate #${app.studentUserId || '—'}`;
            const studentEmail = app.studentEmail || app.student?.email;
            const internshipTitle = app.internshipTitle || app.internship?.title || `Internship #${app.internshipId || '—'}`;
            const currentStatus = String(app.status || 'APPLIED').toUpperCase();
            const dateStr = app.appliedAt || app.createdAt
              ? new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : null;

            return (
              <div
                key={appId}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{studentName}</h3>
                    <span className="text-xs text-slate-400">for</span>
                    <span className="text-xs font-medium text-blue-700 truncate">{internshipTitle}</span>
                  </div>
                  {app.studentUserId && (
  <Link
    to={`/student/network/${app.studentUserId}`}
    className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:text-blue-800"
  >
    View Profile
  </Link>
)}

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    {studentEmail && <span>{studentEmail}</span>}
                    {dateStr && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Received {dateStr}
                        </span>
                      </>
                    )}
                    {app.notes && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="italic text-slate-600 truncate max-w-xs">
                          "{app.notes}"
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Update Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Application Status:</span>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(appId, e.target.value)}
                      disabled={updatingId === appId}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none transition-colors ${
                        currentStatus === 'ACCEPTED'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : currentStatus === 'REJECTED'
                          ? 'border-rose-300 bg-rose-50 text-rose-800'
                          : currentStatus === 'UNDER_REVIEW'
                          ? 'border-blue-300 bg-blue-50 text-blue-800'
                          : 'border-amber-300 bg-amber-50 text-amber-800'
                      }`}
                    >
                      <option value="APPLIED">APPLIED</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No applications match criteria"
          description={
            statusFilter !== 'ALL'
              ? `There are no applications with status "${statusFilter}".`
              : "No candidate applications have been received for your company yet."
          }
          actionLabel={statusFilter !== 'ALL' ? 'Show All Applications' : undefined}
          onAction={statusFilter !== 'ALL' ? () => setStatusFilter('ALL') : undefined}
        />
      )}
    </div>
  );
}
