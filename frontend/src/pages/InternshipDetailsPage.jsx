import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { internshipService } from '../api/internshipService.js';
import { recommendationService } from '../api/recommendationService.js';
import { applicationService } from '../api/applicationService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export default function InternshipDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [internship, setInternship] = useState(null);
  const [skillMatch, setSkillMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await internshipService.getInternshipById(id);
      setInternship(data);

      // If user is logged in student, fetch skill matching
      if (isAuthenticated && role === 'STUDENT') {
        const matchData = await recommendationService.getSkillMatching(id).catch(() => null);
        if (matchData) {
          setSkillMatch(matchData);
        }

        // Check if student already applied
        const myApps = await applicationService.getMyApplications().catch(() => []);
        if (Array.isArray(myApps)) {
          const applied = myApps.some(
            (a) => String(a.internshipId || a.internship?.id) === String(id)
          );
          setHasApplied(applied);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, isAuthenticated, role]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'STUDENT') {
      alert('Only student accounts can apply.');
      return;
    }

    setApplying(true);
    try {
      await applicationService.applyToInternship(id);
      setHasApplied(true);
      setApplySuccess(true);
    } catch (err) {
      alert(`Could not submit application: ${getErrorMessage(err)}`);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading internship details..." size="lg" className="py-20" />;
  }

  if (error || !internship) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link to="/internships" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to internships
        </Link>
        <ErrorMessage message={error || 'Internship not found'} onRetry={fetchDetails} />
      </div>
    );
  }

  const rawSkills = internship.requiredSkills || internship.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === 'string'
    ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const matchedSkills = skillMatch?.matchedSkills || [];
  const missingSkills = skillMatch?.missingSkills || [];
  const matchPercentage = skillMatch?.matchPercentage;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/internships"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all internships
      </Link>

      {/* Main Internship Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {internship.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Building className="h-3.5 w-3.5 text-slate-400" />
                {internship.companyName || `Company User #${internship.companyUserId || '—'}`}
              </span>
              {internship.location && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {internship.location}
                  </span>
                </>
              )}
              {internship.stipend && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                    {internship.stipend}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action */}
          <div>
            {role === 'STUDENT' && (
              <button
                type="button"
                onClick={handleApply}
                disabled={hasApplied || applying}
                className={`rounded-lg px-5 py-2.5 text-xs font-semibold transition-colors shadow-xs ${
                  hasApplied
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {hasApplied ? 'Already Applied' : applying ? 'Submitting...' : 'Apply for Internship'}
              </button>
            )}
          </div>
        </div>

        {applySuccess && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Your application was submitted successfully!</span>
          </div>
        )}

        {/* Skill Matching Section (if student is logged in) */}
        {skillMatch && matchPercentage !== undefined && matchPercentage !== null && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/40 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 font-mono">
                  Your Skill Compatibility Match
                </h3>
              </div>
              <span className="font-mono text-sm font-bold text-blue-700 tabular-nums">
                {Math.round(matchPercentage)}%
              </span>
            </div>

            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-blue-600 transition-all rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, matchPercentage))}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Matched skills */}
              <div>
                <span className="font-semibold text-emerald-800 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Matched Skills ({matchedSkills.length})
                </span>
                {matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {matchedSkills.map((s, i) => (
                      <span key={i} className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-[11px]">No matching profile skills</span>
                )}
              </div>

              {/* Missing skills */}
              <div>
                <span className="font-semibold text-slate-700 flex items-center gap-1 mb-1.5">
                  <XCircle className="h-3.5 w-3.5 text-slate-400" />
                  Skills to Learn ({missingSkills.length})
                </span>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {missingSkills.map((s, i) => (
                      <span key={i} className="rounded-md bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-emerald-700 italic text-[11px]">All required skills matched!</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Role Overview & Responsibilities</h2>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {internship.description || 'No description provided for this role.'}
          </div>
        </div>

        {/* Required Skills */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Required Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
