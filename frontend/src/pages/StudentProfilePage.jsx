import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { profileService } from '../api/profileService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import {
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
  Save,
  Plus,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    education: '',
    skills: [],
    interests: '',
    bio: '',
    resumeUrl: '',
  });

  const [newSkill, setNewSkill] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await profileService.getMyProfile();
      if (data) {
        // Parse skills: can be an array or comma-separated string
        let skillsArray = [];
        if (Array.isArray(data.skills)) {
          skillsArray = data.skills;
        } else if (typeof data.skills === 'string') {
          skillsArray = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
        }

        setFormData({
          education: data.education || '',
          skills: skillsArray,
          interests: data.interests || '',
          bio: data.bio || '',
          resumeUrl: data.resumeUrl || '',
        });
      }
    } catch (err) {
      // 404 might just mean profile has not been created yet
      if (err.response && err.response.status === 404) {
        // Fresh empty profile
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (successMessage) setSuccessMessage(null);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const trimmed = newSkill.trim();
    if (!formData.skills.includes(trimmed)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed],
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Format payload for backend: send skills either as comma-separated or array
      const payload = {
        education: formData.education.trim(),
        skills: formData.skills.join(', '), // send as comma-separated string
        interests: formData.interests.trim(),
        bio: formData.bio.trim(),
        resumeUrl: formData.resumeUrl.trim(),
      };

      const updated = await profileService.updateProfile(payload);
      setSuccessMessage('Profile updated successfully!');
      if (updateUser) {
        updateUser({ education: payload.education });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-bold text-2xl">
            {user?.name ? user.name[0].toUpperCase() : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{user?.name || 'Student Profile'}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="mt-3 flex items-center gap-2">
              <Link
                to="/student/resume"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                Upload PDF Resume to Auto-Extract Skills
              </Link>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchProfile} />}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Academic & Personal Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            This information is used by CareerConnect to recommend relevant internships.
          </p>
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block text-xs font-semibold text-slate-700">
            Education / Major / Degree *
          </label>
          <div className="mt-1.5 relative">
            <input
              id="education"
              name="education"
              type="text"
              value={formData.education}
              onChange={handleChange}
              placeholder="B.S. in Computer Science, University of Technology (Class of 2026)"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-xs font-semibold text-slate-700">
            Professional Summary / Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Aspiring backend engineer passionate about Java, Spring Boot, and scalable distributed systems..."
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Interests */}
        <div>
          <label htmlFor="interests" className="block text-xs font-semibold text-slate-700">
            Career Interests & Industry Goals
          </label>
          <input
            id="interests"
            name="interests"
            type="text"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Cloud Computing, Full-Stack Development, FinTech Systems"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Skills Tag Manager */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Technical & Professional Skills
            </label>
            <Link
              to="/student/resume"
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
            >
              Or extract from PDF resume →
            </Link>
          </div>

          {/* Add skill input */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g., Java, Spring Boot, MySQL, React)"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          {/* Current Skills Chips */}
          <div className="mt-3 flex flex-wrap gap-2 min-h-[36px] p-2.5 rounded-lg border border-dashed border-slate-200 bg-slate-50">
            {formData.skills.length > 0 ? (
              formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-500 hover:text-rose-600"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                No skills entered yet. Type above to add skills.
              </span>
            )}
          </div>
        </div>

        {/* Resume URL */}
        <div>
          <label htmlFor="resumeUrl" className="block text-xs font-semibold text-slate-700">
            Resume URL (Optional Link)
          </label>
          <input
            id="resumeUrl"
            name="resumeUrl"
            type="url"
            value={formData.resumeUrl}
            onChange={handleChange}
            placeholder="https://drive.google.com/... or portfolio link"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
