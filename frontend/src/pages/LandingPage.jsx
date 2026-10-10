import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Sparkles,
  FileText,
  ShieldCheck,
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import heroImage from '../assets/images/careerconnect_hero_1791608724925.jpg';

export default function LandingPage() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                University Networking & Internship Hub
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
                Connecting students, recruiters, and opportunities in one place.
              </h1>

              <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-xl">
                CareerConnect empowers university students to build professional profiles, extract verified skills from PDF resumes, discover peers, and match with verified company internships.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Join as Student
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register/company"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <Building2 className="h-4 w-4 text-slate-500" />
                  Post as Company
                </Link>
                <Link
                  to="/internships"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  Browse Openings
                </Link>
              </div>

              {/* Trust markers */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Spring Boot REST API
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  PDFBox Skill Extraction
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  JWT Secured
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                <img
                  src={heroImage}
                  alt="Students networking in modern university career center"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Engineered for Every University Stakeholder
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Three specialized roles working in unison through a secure, structured platform.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Student Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">For Students</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Upload your PDF resume to extract skills automatically. Match with top internships based on verified compatibility, expand your collegiate network, and submit applications.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Automated PDF skill extraction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Match percentage ranking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Peer discovery & connections
                </li>
              </ul>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Create Student Account →
              </Link>
            </div>

            {/* Company Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">For Employers</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Publish targeted internship listings with exact required skills. Review applicants with transparent match rankings and advance candidates through the hiring pipeline.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Targeted skill-based postings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Instant applicant review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Direct pipeline management
                </li>
              </ul>
              <Link
                to="/register/company"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Register Company Profile →
              </Link>
            </div>

            {/* Admin Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">For Administrators</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Centralized oversight over university platform metrics, registered students, participating employers, active internship postings, and application volumes.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Platform-wide statistics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> User directory review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Audit active applications
                </li>
              </ul>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Admin Portal Access →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Ready to jumpstart your career network?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Log in with your existing account or create a new student or recruiter profile to get started today.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              Sign In Now
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
