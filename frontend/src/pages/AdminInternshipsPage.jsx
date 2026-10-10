import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import { Briefcase, Search, RefreshCw, Building } from 'lucide-react';

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getInternships();
      setInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const filtered = internships.filter((item) => {
    const titleMatch = !search || item.title?.toLowerCase().includes(search.toLowerCase());
    const rawSkills = item.requiredSkills || item.skills;
    const skillsText = Array.isArray(rawSkills) ? rawSkills.join(' ') : String(rawSkills || '');
    const skillMatch = !search || skillsText.toLowerCase().includes(search.toLowerCase());
    return titleMatch || skillMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Platform Internships Directory
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Read-only audit of all employer listings and required skill sets ({internships.length}).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInternships}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title or required skill..."
          className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchInternships} />}

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Loading all platform internships..." size="lg" className="py-20" />
      ) : filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-3">Internship ID</th>
                  <th className="px-4 py-3">Role Title</th>
                  <th className="px-4 py-3">Company Name</th>
                  <th className="px-4 py-3">Required Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const rawSkills = item.requiredSkills || item.skills;
                  const skills = Array.isArray(rawSkills)
                    ? rawSkills
                    : typeof rawSkills === 'string'
                    ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
                    : [];

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-500">
                        #{item.id}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.title}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
  {item.companyName || 'Company name unavailable'}
</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {skills.length > 0 ? (
                            skills.map((s, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">None specified</span>
                          )}
                        </div>
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
          icon={Briefcase}
          title="No internships found"
          description={
            search
              ? `No internships matched "${search}".`
              : "No internships are currently registered in the database."
          }
          actionLabel={search ? "Clear Search" : undefined}
          onAction={search ? () => setSearch('') : undefined}
        />
      )}
    </div>
  );
}
