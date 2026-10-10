import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connectionService } from '../api/connectionService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import { Users, GraduationCap, Mail } from 'lucide-react';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectionService.getConnections();
      setConnections(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            My Connections
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Fellow students and alumni in your verified academic network ({connections.length}).
          </p>
        </div>
        <Link
          to="/student/network"
          className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          Find More Peers
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchConnections} />}

      {loading ? (
        <LoadingSpinner message="Loading your connections..." size="lg" className="py-20" />
      ) : connections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {connections.map((conn) => {
            const id = conn.id || conn.studentId || conn.userId;
            const name = conn.name || conn.studentName || conn.user?.name || 'Student Connection';
            const email = conn.email || conn.user?.email;
            const education = conn.education || conn.profile?.education || 'University Student';
            const rawSkills = conn.skills || conn.profile?.skills;
            const skills = Array.isArray(rawSkills)
              ? rawSkills
              : typeof rawSkills === 'string'
              ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <div key={id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold text-sm">
                    {name[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
<Link
  to={`/student/network/${id}`}
  className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline truncate block"
>
  {name}
</Link>                    <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{education}</span>
                    </p>
                    {email && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {skills.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                    {skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 3 && (
                      <span className="text-[11px] text-slate-400 self-center">
                        +{skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No connections yet"
          description="You haven't connected with any peers yet. Search for students by programming skill to start building your network."
          actionLabel="Discover Students"
          onAction={() => (window.location.href = '/student/network')}
        />
      )}
    </div>
  );
}
