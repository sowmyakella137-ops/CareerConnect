import React, { useState, useEffect } from 'react';
import { internshipService } from '../api/internshipService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import {
  Briefcase,
  Plus,
  MapPin,
  DollarSign,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function CompanyInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    location: '',
    stipend: '',
  });

  const fetchCompanyInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await internshipService.getCompanyInternships();
      setInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInternships();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError(null);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.requiredSkills.trim()) {
      setFormError('Please provide a title and at least one required skill.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      // Backend expects: title, description, requiredSkills (as array or string)
      const skillsArray = formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requiredSkills: skillsArray,
        location: formData.location.trim() || undefined,
        stipend: formData.stipend.trim() || undefined,
      };

      const created = await internshipService.createInternship(payload);
      setInternships([created || { ...payload, id: Date.now() }, ...internships]);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        requiredSkills: '',
        location: '',
        stipend: '',
      });
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Manage Company Internships
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Publish and manage job postings for university students ({internships.length}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Create New Position
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchCompanyInternships} />}

      {/* Internships List */}
      {loading ? (
        <LoadingSpinner message="Loading your company's postings..." size="lg" className="py-20" />
      ) : internships.length > 0 ? (
        <div className="space-y-4">
          {internships.map((item) => {
            const rawSkills = item.requiredSkills || item.skills;
            const skills = Array.isArray(rawSkills)
              ? rawSkills
              : typeof rawSkills === 'string'
              ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600">
                        ID #{item.id}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {item.location}
                        </span>
                      )}
                      {item.stipend && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                            {item.stipend}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500 mr-1 self-center">
                    Required Skills:
                  </span>
                  {skills.length > 0 ? (
                    skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None specified</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No internships posted yet"
          description="Create your company's first internship listing to start attracting university candidates."
          actionLabel="Create Internship"
          onAction={() => setShowModal(true)}
        />
      )}

      {/* Create Internship Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Post New Internship
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && <ErrorMessage message={formError} className="my-3" />}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-slate-700">
                  Internship Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Backend Software Engineer Intern (Spring Boot)"
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="requiredSkills" className="block text-xs font-semibold text-slate-700">
                  Required Skills (comma-separated) *
                </label>
                <input
                  id="requiredSkills"
                  name="requiredSkills"
                  type="text"
                  required
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="e.g. Java, Spring Boot, MySQL, REST"
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  The backend matching engine uses these skills to calculate match percentages for students.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="location" className="block text-xs font-semibold text-slate-700">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Remote / New York, NY"
                    className="mt-1 block w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="stipend" className="block text-xs font-semibold text-slate-700">
                    Stipend / Compensation
                  </label>
                  <input
                    id="stipend"
                    name="stipend"
                    type="text"
                    value={formData.stipend}
                    onChange={handleChange}
                    placeholder="$35/hr or $5,000/mo"
                    className="mt-1 block w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-slate-700">
                  Role Description & Expectations
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe day-to-day responsibilities, mentorship opportunities, and qualifications..."
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-xs"
                >
                  {submitting ? 'Publishing...' : 'Publish Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
