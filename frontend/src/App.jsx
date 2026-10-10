import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import CompanyLayout from './layouts/CompanyLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Route Guard
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StudentRegisterPage from './pages/StudentRegisterPage.jsx';
import CompanyRegisterPage from './pages/CompanyRegisterPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import InternshipsPage from './pages/InternshipsPage.jsx';
import InternshipDetailsPage from './pages/InternshipDetailsPage.jsx';

// Student Pages
import StudentDashboard from './pages/StudentDashboard.jsx';
import StudentProfilePage from './pages/StudentProfilePage.jsx';
import ResumeUploadPage from './pages/ResumeUploadPage.jsx';
import StudentDiscoveryPage from './pages/StudentDiscoveryPage.jsx';
import ConnectionRequestsPage from './pages/ConnectionRequestsPage.jsx';
import ConnectionsPage from './pages/ConnectionsPage.jsx';
import RecommendationsPage from './pages/RecommendationsPage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import StudentPublicProfilePage from './pages/StudentPublicProfilePage.jsx';

// Company Pages
import CompanyDashboard from './pages/CompanyDashboard.jsx';
import CompanyInternshipsPage from './pages/CompanyInternshipsPage.jsx';
import CompanyApplicationsPage from './pages/CompanyApplicationsPage.jsx';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminInternshipsPage from './pages/AdminInternshipsPage.jsx';
import AdminApplicationsPage from './pages/AdminApplicationsPage.jsx';

// Fallback Page
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public / Generic Routes under MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/internships/:id" element={<InternshipDetailsPage />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Auth Pages (standalone clean background) */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<StudentRegisterPage />} />
        <Route path="/register/company" element={<CompanyRegisterPage />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="resume" element={<ResumeUploadPage />} />
        <Route path="network" element={<StudentDiscoveryPage />} />
        
        <Route path="requests" element={<ConnectionRequestsPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="applications" element={<MyApplicationsPage />} />
      </Route>

      <Route
  path="/student/network/:studentId"
  element={
    <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY']}>
      <StudentPublicProfilePage />
    </ProtectedRoute>
  }
/>

      {/* Company Protected Routes */}
      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/company/dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="internships" element={<CompanyInternshipsPage />} />
        <Route path="applications" element={<CompanyApplicationsPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="internships" element={<AdminInternshipsPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
      </Route>

      

      {/* Catch-all 404 */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
