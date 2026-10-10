import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { profileService } from '../api/profileService.js';
import { recommendationService } from '../api/recommendationService.js';
import { connectionService } from '../api/connectionService.js';
import { applicationService } from '../api/applicationService.js';
import { postService } from '../api/postService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import InternshipCard from '../components/InternshipCard.jsx';
import PostCard from '../components/PostCard.jsx';

import {
  FileText,
  Briefcase,
  Users,
  Sparkles,
  ClipboardList,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  UserCheck,
  Rss,
  GraduationCap,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch user profile
      const prof = await profileService.getMyProfile().catch(() => null);
      setProfile(prof);

      // Fetch recommendations
      const recs = await recommendationService.getRecommendations().catch(() => null);
      if (recs && recs.recommendations) {
        setRecommendations(recs.recommendations.slice(0, 3));
      } else if (Array.isArray(recs)) {
        setRecommendations(recs.slice(0, 3));
      }

      // Fetch connection requests
      const reqs = await connectionService.getReceivedRequests().catch(() => []);
      if (Array.isArray(reqs)) {
        setReceivedRequests(reqs.slice(0, 3));
      }

      // Fetch applications
      const apps = await applicationService.getMyApplications().catch(() => []);
      if (Array.isArray(apps)) {
        setApplications(apps.slice(0, 3));
      }

      // Fetch recent posts
      const posts = await postService.getPosts().catch(() => []);
      if (Array.isArray(posts)) {
        setRecentPosts(posts.slice(0, 2));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute profile completion percentage
  const skillsList = Array.isArray(profile?.skills)
    ? profile.skills
    : typeof profile?.skills === 'string'
    ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const profileScore = [
    Boolean(user?.name),
    Boolean(profile?.education),
    skillsList.length > 0,
    Boolean(profile?.bio),
    Boolean(profile?.resumeUrl),
  ].filter(Boolean).length;

  const completionPercent = Math.round((profileScore / 5) * 100);

  if (loading) {
    return <LoadingSpinner message="Loading your student overview..." size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-8">
      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {/* Welcome & Profile Summary Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Track your profile strength, recommended internships, and networking requests.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                {profile?.education || 'Education not yet set'}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{skillsList.length} skills listed</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{applications.length} active applications</span>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 min-w-[240px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Profile Completion</span>
              <span className="font-mono font-bold text-blue-600">{completionPercent}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            {completionPercent < 100 && (
              <Link
                to="/student/profile"
                className="mt-2.5 inline-block text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Complete profile details →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Action Hub */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/student/resume"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Upload Resume</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Extract skills</span>
          </Link>

          <Link
            to="/student/recommendations"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Matched Roles</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Skill ranking</span>
          </Link>

          <Link
            to="/internships"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Browse Jobs</span>
            <span className="text-[10px] text-slate-500 mt-0.5">All internships</span>
          </Link>

          <Link
            to="/student/applications"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
              <ClipboardList className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Applications</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Track status</span>
          </Link>

          <Link
            to="/student/network"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Find Peers</span>
            <span className="text-[10px] text-slate-500 mt-0.5">By skills</span>
          </Link>

          <Link
            to="/feed"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
              <Rss className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Social Feed</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Discussions</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recommended Internships & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Internships (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">Recommended for Your Skills</h2>
            </div>
            <Link
              to="/student/recommendations"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({recommendations.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <InternshipCard
                  key={rec.internshipId || rec.id}
                  internship={rec}
                  matchInfo={rec}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recommendations yet"
              description="Upload your resume to extract skills or manually add your skills in your profile to see ranked matches."
              actionLabel="Upload PDF Resume"
              onAction={() => (window.location.href = '/student/resume')}
            />
          )}
        </div>

        {/* Right Sidebar: Connection Requests & Skills Summary (1 col) */}
        <div className="space-y-6">
          {/* Skills Overview */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Your Profile Skills
              </h3>
              <Link to="/student/profile" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                Edit
              </Link>
            </div>

            <div className="mt-3">
              {skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No skills listed yet. Add skills or upload a resume.
                </p>
              )}
            </div>
          </div>

          {/* Connection Requests snippet */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Connection Requests
              </h3>
              <Link to="/student/requests" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>

            <div className="mt-3">
              {receivedRequests.length > 0 ? (
                <div className="space-y-3">
                  {receivedRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 truncate">
                          {req.senderName || req.sender?.name || 'Student Peer'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {req.sender?.education || 'Student'}
                        </p>
                      </div>
                      <Link
                        to="/student/requests"
                        className="rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700"
                      >
                        Respond
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No pending connection requests.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
