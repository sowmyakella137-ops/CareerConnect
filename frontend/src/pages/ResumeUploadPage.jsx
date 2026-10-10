import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeService, MAX_RESUME_SIZE_BYTES } from '../api/resumeService.js';
import { profileService } from '../api/profileService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import {
  FileUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCode,
} from 'lucide-react';

export default function ResumeUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (file) => {
    setError(null);
    setSuccess(false);
    setExtractedSkills(null);

    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file format. Only PDF resumes are accepted by the backend parser.');
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || uploading) return;

    setUploading(true);
    setUploadProgress(10);
    setError(null);
    setSuccess(false);
    setExtractedSkills(null);

    try {
      const response = await resumeService.uploadResume(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setSuccess(true);

      // Normalizing response:
      // Backend may return: { skills: [...] } or { extractedSkills: [...] } or array of skills [...]
      let skills = [];
      if (Array.isArray(response)) {
        skills = response;
      } else if (response?.extractedSkills && Array.isArray(response.extractedSkills)) {
        skills = response.extractedSkills;
      } else if (response?.skills && Array.isArray(response.skills)) {
        skills = response.skills;
      } else if (typeof response?.skills === 'string') {
        skills = response.skills.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (typeof response?.message === 'string') {
        // Message with extracted info
        skills = [];
      }

      setExtractedSkills(skills);

      // Refresh profile skills in the background
      await profileService.getMyProfile().catch(() => null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          PDF Resume Upload & Skill Extraction
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Upload your resume in PDF format. The backend Apache PDFBox parser extracts detected technical skills and automatically links them to your student profile.
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      {/* Main Upload Box */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            selectedFile ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="text-sm font-semibold text-slate-800">
            {selectedFile ? selectedFile.name : 'Drag and drop your PDF resume here'}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {selectedFile
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for upload`
              : 'Accepts PDF files only up to 5 MB'}
          </p>

          <div className="mt-4">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors">
              <FileUp className="h-4 w-4 text-slate-500" />
              <span>{selectedFile ? 'Choose Different File' : 'Browse Files'}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Parsing PDF text with PDFBox...</span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Action Button */}
        {selectedFile && !uploading && !success && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Upload & Extract Skills
            </button>
          </div>
        )}
      </div>

      {/* Success & Extracted Skills Card */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Resume Processed Successfully!
              </h3>
              <p className="mt-0.5 text-xs text-slate-600">
                The Spring Boot backend extracted text from your resume and updated your profile skills.
              </p>
            </div>
          </div>

          {/* Extracted Skills List */}
          <div className="mt-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-2.5">
              Extracted Skills Detected:
            </h4>
            {extractedSkills && extractedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                  >
                    <span>✓</span>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                Skills extracted by the backend have been saved to your student profile. If your PDF is a scanned image or doesn't have selectable text, you can also add skills manually in your profile.
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setSuccess(false);
                setExtractedSkills(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Upload another resume
            </button>

            <Link
              to="/student/profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Review Updated Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
