
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function StudentPublicProfilePage() {
  const { studentId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(
          `/api/connections/students/${studentId}`
        );

        if (active) {
          setProfile(response.data);
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      active = false;
    };
  }, [studentId]);

  if (loading) {
    return <LoadingSpinner message="Loading student profile..." size="lg" />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <Link to="/student/connections" className="text-blue-700 hover:underline">
          Back to My Connections
        </Link>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-slate-600">Student profile not found.</p>;
  }

  // The endpoint may return a profile directly or a user with a nested profile.
  const user = profile.user || profile;
  const details = profile.profile || profile;

  const name = user.name || user.fullName || 'Student';
  const email = user.email;
  const education = details.education;
  const bio = details.bio;
  const interests = details.interests;

  const rawSkills = details.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === 'string'
      ? rawSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/student/connections"
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        ← Back to My Connections
      </Link>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-700">
            {name[0]?.toUpperCase() || 'S'}
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">{name}</h1>
            {education && (
              <p className="mt-1 text-sm text-slate-600">{education}</p>
            )}
            {email && (
              <p className="mt-1 text-sm text-slate-500">{email}</p>
            )}
          </div>
        </div>

        {bio && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="font-semibold text-slate-900">About</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
              {bio}
            </p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="font-semibold text-slate-900">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {interests && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="font-semibold text-slate-900">Interests</h2>
            <p className="mt-2 text-sm text-slate-600">{interests}</p>
          </div>
        )}
      </section>
    </div>
  );
}
