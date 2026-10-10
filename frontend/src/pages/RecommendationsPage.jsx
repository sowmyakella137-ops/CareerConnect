import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationService } from '../api/recommendationService.js';
import { applicationService } from '../api/applicationService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Briefcase,
  ArrowRight,
  FileText,
} from 'lucide-react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply state
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [applyingId, setApplyingId] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await recommendationService.getRecommendations();

      if (data && data.recommendations) {
        setRecommendations(data.recommendations);
        setStudentSkills(Array.isArray(data.studentSkills) ? data.studentSkills : []);
      } else if (Array.isArray(data)) {
        setRecommendations(data);
      } else {
        setRecommendations([]);
      }

      // Fetch user's existing applications
      const apps = await applicationService.getMyApplications().catch(() => []);
      if (Array.isArray(apps)) {
        const set = new Set(apps.map((a) => a.internshipId || a.internship?.id));
        setAppliedIds(set);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleApply = async (internshipId) => {
    setApplyingId(internshipId);
    try {
      await applicationService.applyToInternship(internshipId);
      setAppliedIds((prev) => new Set([...prev, internshipId]));
    } catch (err) {
      alert(`Could not submit application: ${getErrorMessage(err)}`);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Personalized Internship Recommendations
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Ranked by the backend skill-matching engine by comparing your extracted skills against employer requirements.
        </p>
      </div>

      {/* Student's Current Skills Badge Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs">
            <span className="font-semibold text-slate-700">Your Current Skills ({studentSkills.length}): </span>
            {studentSkills.length > 0 ? (
              <span className="text-slate-600">
                {studentSkills.join(', ')}
              </span>
            ) : (
              <span className="text-slate-400 italic">No skills registered yet</span>
            )}
          </div>
          <Link
            to="/student/resume"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0"
          >
            <FileText className="h-3.5 w-3.5" />
            Upload PDF Resume to refresh skills
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchRecommendations} />}

      {/* Recommendations List */}
      {loading ? (
        <LoadingSpinner message="Calculating skill compatibility matches..." size="lg" className="py-20" />
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const intId = rec.internshipId || rec.id;
            const matchPercentage = rec.matchPercentage ?? 0;
            const matchedSkills = rec.matchedSkills || [];
            const missingSkills = rec.missingSkills || [];
            const rawReqSkills = rec.requiredSkills || [];
            const requiredSkills = Array.isArray(rawReqSkills)
              ? rawReqSkills
              : typeof rawReqSkills === 'string'
              ? rawReqSkills.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            const isApplied = appliedIds.has(intId);

            return (
              <div
                key={intId}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {rec.title || 'Internship Position'}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Internship #{intId}
                    </p>
                  </div>

                  {/* Match Percentage Display */}
                  <div className="flex flex-col items-start sm:items-end min-w-[130px]">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-mono tabular-nums">{Math.round(matchPercentage)}%</span> Match
                    </div>
                    {/* Progress bar */}
                    <div className="mt-1.5 w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, matchPercentage))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills breakdown */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  {/* Matched Skills */}
                  <div>
                    <span className="font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Matched Skills ({matchedSkills.length})
                    </span>
                    {matchedSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {matchedSkills.map((s, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">None</span>
                    )}
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <span className="font-semibold text-slate-600 flex items-center gap-1 mb-1">
                      <XCircle className="h-3.5 w-3.5 text-slate-400" />
                      Missing Skills ({missingSkills.length})
                    </span>
                    {missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {missingSkills.map((s, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-700 italic font-medium">None! Full match</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/internships/${intId}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View Internship Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleApply(intId)}
                    disabled={isApplied || applyingId === intId}
                    className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors shadow-xs ${
                      isApplied
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isApplied ? 'Applied' : applyingId === intId ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No recommendations found"
          description="We couldn't generate skill-based recommendations yet. Upload your PDF resume or manually update your skills in your profile to trigger matches."
          actionLabel="Upload PDF Resume"
          onAction={() => (window.location.href = '/student/resume')}
        />
      )}
    </div>
  );
}
