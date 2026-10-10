import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import { ClipboardList, Search, RefreshCw, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getApplications();
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

  const getStatusBadge = (status) => {
    const s = String(status || 'APPLIED').toUpperCase();
    if (s === 'ACCEPTED') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
          <CheckCircle2 className="h-3 w-3" /> ACCEPTED
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
          <XCircle className="h-3 w-3" /> REJECTED
        </span>
      );
    }
    if (s === 'UNDER_REVIEW') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
          <Clock className="h-3 w-3" /> UNDER_REVIEW
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
        <Clock className="h-3 w-3" /> APPLIED
      </span>
    );
  };

  const filtered = applications.filter((app) => {
    const s = search.toLowerCase();
    const idMatch = !search || String(app.id).includes(s) || String(app.internshipId).includes(s) || String(app.studentUserId).includes(s);
    const statusMatch = statusFilter === 'ALL' || String(app.status).toUpperCase() === statusFilter;
    return idMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Platform Applications Audit
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Read-only registry of candidate submissions and company recruitment status ({applications.length}).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by application, internship, or student ID..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
        >
          <option value="ALL">All Statuses ({applications.length})</option>
          <option value="APPLIED">Applied</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchApplications} />}

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Auditing platform applications..." size="lg" className="py-20" />
      ) : filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-3">Application ID</th>
                  <th className="px-4 py-3">Internship ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => {
                  const dateStr = app.appliedAt || app.createdAt
                    ? new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-500">
                        #{app.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
  {app.internshipTitle || `Internship #${app.internshipId}`}
</td>
                      <td className="px-4 py-3 text-slate-800">
  {app.studentName || `Student #${app.studentUserId}`}
</td>
                      <td className="px-4 py-3">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications found"
          description={
            search || statusFilter !== 'ALL'
              ? "No applications match your search query."
              : "No applications have been recorded in the platform database yet."
          }
          actionLabel={search || statusFilter !== 'ALL' ? "Reset Filters" : undefined}
          onAction={search || statusFilter !== 'ALL' ? () => { setSearch(''); setStatusFilter('ALL'); } : undefined}
        />
      )}
    </div>
  );
}
