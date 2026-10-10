import React from 'react';
import { UserPlus, Check, Clock, GraduationCap } from 'lucide-react';

export default function StudentCard({
  student,
  onConnect,
  isConnecting = false,
  connectionStatus = null, // null, 'PENDING', 'ACCEPTED'
}) {
  if (!student) return null;

  // Handle skills array or comma string
  const rawSkills = student.skills || student.profile?.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === 'string'
    ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const name = student.name || student.fullName || student.user?.name || 'Student';
  const education = student.education || student.profile?.education;
  const bio = student.bio || student.profile?.bio;
  const interests = student.interests || student.profile?.interests;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-start gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-base shadow-xs">
          {name ? name[0].toUpperCase() : 'S'}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900 truncate">{name}</h4>
          {education ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 truncate">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{education}</span>
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-slate-400 italic">Student at University</p>
          )}
        </div>
      </div>

      {bio && (
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {bio}
        </p>
      )}

      {/* Skills display */}
      <div className="mt-3 flex-1">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 text-xs">
            {skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          {interests ? `Interests: ${interests}` : 'Open to connect'}
        </span>

        {connectionStatus === 'ACCEPTED' ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <Check className="h-3.5 w-3.5" /> Connected
          </span>
        ) : connectionStatus === 'PENDING' ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
            <Clock className="h-3.5 w-3.5" /> Request Sent
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onConnect(student.id || student.studentId)}
            disabled={isConnecting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors shadow-xs disabled:opacity-50"
          >
            <UserPlus className="h-3.5 w-3.5" />
            {isConnecting ? 'Sending...' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
}
