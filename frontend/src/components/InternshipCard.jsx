import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Sparkles, ArrowRight, Building } from 'lucide-react';

export default function InternshipCard({ internship, onApply, hasApplied = false, matchInfo = null }) {
  if (!internship) return null;

  // Handle skills as either array or comma-separated string
  const rawSkills = internship.requiredSkills || internship.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === 'string'
    ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const matchPercentage = matchInfo?.matchPercentage ?? internship.matchPercentage;
  const matchedSkills = matchInfo?.matchedSkills || [];
  const missingSkills = matchInfo?.missingSkills || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 truncate">
              {internship.title || 'Software Engineering Intern'}
            </h3>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-slate-400" />
              {internship.companyName || `Company #${internship.companyUserId || '—'}`}
            </span>
            {internship.location && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {internship.location}
                </span>
              </>
            )}
            {internship.stipend && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  {internship.stipend}
                </span>
              </>
            )}
          </div>
        </div>

        {matchPercentage !== undefined && matchPercentage !== null && (
          <div className="shrink-0 flex items-center gap-2 sm:flex-col sm:items-end">
            <div className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              <Sparkles className="h-3 w-3" />
              <span className="font-mono tabular-nums">{Math.round(matchPercentage)}%</span> Match
            </div>
            {/* Progress bar */}
            <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, matchPercentage))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {internship.description && (
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {internship.description}
        </p>
      )}

      {/* Skills display */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-medium text-slate-500 mr-1">Skills:</span>
          {skills.length > 0 ? (
            skills.map((skill, index) => {
              const isMatched = matchedSkills.some(
                (ms) => ms.toLowerCase() === skill.toLowerCase()
              );
              const isMissing = missingSkills.some(
                (ms) => ms.toLowerCase() === skill.toLowerCase()
              );

              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
              if (isMatched) {
                badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
              } else if (isMissing) {
                badgeStyle = 'bg-slate-50 text-slate-500 border-dashed border-slate-200';
              }

              return (
                <span
                  key={index}
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] ${badgeStyle}`}
                >
                  {skill}
                  {isMatched && <span className="ml-1 text-[10px] text-emerald-600">✓</span>}
                </span>
              );
            })
          ) : (
            <span className="text-slate-400 text-xs italic">No specific skills listed</span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 flex items-center justify-between pt-2">
        <Link
          to={`/internships/${internship.id || internship.internshipId}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View Full Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {onApply && (
          <button
            type="button"
            onClick={() => onApply(internship)}
            disabled={hasApplied}
            className={`inline-flex items-center rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-xs ${
              hasApplied
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
}
