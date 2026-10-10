import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../api/applicationService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import { ClipboardList, Calendar, Building, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getMyApplications();
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
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Accepted
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-800">
          <XCircle className="h-3.5 w-3.5 text-rose-600" />
          Rejected
        </span>
      );
    }
    if (s === 'UNDER_REVIEW') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-800">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          Under Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
        <Clock className="h-3.5 w-3.5 text-amber-600" />
        Submitted
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            My Internship Applications
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track real-time candidate status for positions you've applied to ({applications.length}).
          </p>
        </div>

        <Link
          to="/internships"
          className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          Browse Openings
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchApplications} />}

      {/* Applications List */}
      {loading ? (
        <LoadingSpinner message="Loading your submitted applications..." size="lg" className="py-20" />
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => {
            const appId = app.id || app.applicationId;
            const intId = app.internshipId || app.internship?.id;
            const title = app.internshipTitle || app.internship?.title || `Internship #${intId || appId}`;
            const company = app.companyName || app.internship?.companyName || `Company #${app.internship?.companyUserId || '—'}`;
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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{title}</h3>
                  </div>
                  
<div className="flex items-center gap-2">
  <h3 className="text-sm font-semibold text-slate-900 truncate">
    {title}
  </h3>
</div>

<p className="mt-1 text-sm text-slate-600">
  Company: {company}
</p>


                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      {company}
                    </span>
                    {dateStr && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Applied on {dateStr}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  {getStatusBadge(app.status)}

                  {intId && (
                    <Link
                      to={`/internships/${intId}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      View Role
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications submitted"
          description="You haven't submitted any internship applications yet. Browse active openings and submit your first application!"
          actionLabel="Browse Internships"
          onAction={() => (window.location.href = '/internships')}
        />
      )}
    </div>
  );
}
