import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { internshipService } from '../api/internshipService.js';
import { applicationService } from '../api/applicationService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import InternshipCard from '../components/InternshipCard.jsx';

import { Search, Briefcase, Filter, CheckCircle2, X } from 'lucide-react';

export default function InternshipsPage() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Application Modal state
  const [applyingInternship, setApplyingInternship] = useState(null);
  const [notes, setNotes] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState(null);
  const [appSuccess, setAppSuccess] = useState(false);
  const [appliedIds, setAppliedIds] = useState(new Set());

  const fetchInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await internshipService.getInternships();
      setInternships(Array.isArray(data) ? data : []);

      // If user is a student, fetch already applied internships
      if (isAuthenticated && role === 'STUDENT') {
        const myApps = await applicationService.getMyApplications().catch(() => []);
        if (Array.isArray(myApps)) {
          const applied = new Set(
            myApps.map((a) => a.internshipId || a.internship?.id || a.id)
          );
          setAppliedIds(applied);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [isAuthenticated, role]);

  const handleOpenApply = (internship) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'STUDENT') {
      alert('Only registered students can apply for internships.');
      return;
    }
    setApplyingInternship(internship);
    setNotes('');
    setAppError(null);
    setAppSuccess(false);
  };

  const handleConfirmApply = async (e) => {
    e.preventDefault();
    if (!applyingInternship || submittingApp) return;

    setSubmittingApp(true);
    setAppError(null);

    const intId = applyingInternship.id || applyingInternship.internshipId;

    try {
      await applicationService.applyToInternship(intId, { notes: notes.trim() });
      setAppSuccess(true);
      setAppliedIds((prev) => new Set([...prev, intId]));
      setTimeout(() => {
        setApplyingInternship(null);
        setAppSuccess(false);
      }, 1500);
    } catch (err) {
      setAppError(getErrorMessage(err));
    } finally {
      setSubmittingApp(false);
    }
  };

  // Client-side filtering
  const filteredInternships = internships.filter((item) => {
    const titleMatch = !search || item.title?.toLowerCase().includes(search.toLowerCase());
    const descMatch = !search || item.description?.toLowerCase().includes(search.toLowerCase());

    const rawSkills = item.requiredSkills || item.skills;
    const skillsText = Array.isArray(rawSkills) ? rawSkills.join(' ') : String(rawSkills || '');
    const skillMatch =
      !selectedSkill || skillsText.toLowerCase().includes(selectedSkill.toLowerCase());

    return (titleMatch || descMatch) && skillMatch;
  });

  return (
<div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Browse Internship Opportunities
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Explore student internships posted by partnering companies.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, keyword, or company..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <input
            type="text"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            placeholder="Filter by skill (e.g. Java)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchInternships} />}

      {/* List */}
      {loading ? (
        <LoadingSpinner message="Loading open internships..." size="lg" className="py-20" />
      ) : filteredInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInternships.map((internship) => {
            const intId = internship.id || internship.internshipId;
            const hasApplied = appliedIds.has(intId);
            return (
              <InternshipCard
                key={intId}
                internship={internship}
                hasApplied={hasApplied}
                onApply={role === 'STUDENT' ? handleOpenApply : undefined}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No internships found"
          description={
            search || selectedSkill
              ? "No internship postings match your current search filters. Try adjusting your query."
              : "There are currently no internship postings registered in the system."
          }
          actionLabel={search || selectedSkill ? "Clear Filters" : undefined}
          onAction={search || selectedSkill ? () => { setSearch(''); setSelectedSkill(''); } : undefined}
        />
      )}

      {/* Apply Modal */}
      {applyingInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Apply for {applyingInternship.title}
              </h3>
              <button
                type="button"
                onClick={() => setApplyingInternship(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {appError && <ErrorMessage message={appError} className="my-3" />}

            {appSuccess ? (
              <div className="my-4 rounded-lg bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Application submitted successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmApply} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="notes" className="block text-xs font-semibold text-slate-700">
                    Cover Note / Message to Recruiter (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly state your interest and relevant projects..."
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyingInternship(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {submittingApp ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
