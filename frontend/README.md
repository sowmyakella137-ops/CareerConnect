# CareerConnect — React Frontend

A modern, responsive, light-themed React frontend for **CareerConnect**, a student networking and internship platform inspired by LinkedIn.

This standalone frontend is built with **React**, **Vite**, **JavaScript (ES6+)**, **React Router**, and **Axios**, designed to integrate directly with an existing **Java 17 + Spring Boot + MySQL** backend running on port `1234`.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- Your **Spring Boot backend** running locally on port `1234` (`http://localhost:1234`)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Ensure the backend base URL matches your local Spring Boot REST API:
```env
VITE_API_BASE_URL="http://localhost:1234"
```

### 4. Run Development Server
```bash
npm run dev
```
The React frontend will be available at:
`http://localhost:3000`

---

## ☕ Spring Boot Backend Connectivity & CORS

If the frontend cannot communicate with your Spring Boot backend on `http://localhost:1234`, verify:

1. **Port Configuration** in `application.properties`:
   ```properties
   server.port=1234
   ```

2. **CORS Configuration**:
   Add a WebMvcConfigurer in your Spring Boot application to allow browser requests from your React client (`http://localhost:3000`):
   ```java
   package com.careerconnect.config;

   import org.springframework.context.annotation.Configuration;
   import org.springframework.web.servlet.config.annotation.CorsRegistry;
   import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

   @Configuration
   public class CorsConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/api/**")
               .allowedOrigins("http://localhost:3000", "http://localhost:5173")
               .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
               .allowedHeaders("*")
               .allowCredentials(true);
       }
   }
   ```

---

## 👥 Supported Roles & Features

### 🎓 1. Student (`STUDENT`)
- **Dashboard**: Profile completion meter, profile overview, recommended internships, connection requests, and quick links.
- **Profile Management**: View and edit education, career interests, bio, resume URL, and skills tags (`GET /api/profiles/me`, `POST /api/profiles`).
- **Resume Upload**: Upload PDF resumes up to 5 MB (`POST /api/resume/upload` multipart/form-data) where Spring Boot's PDFBox extracts detected technical skills.
- **Recommended Internships**: Ranked recommendations with match percentage progress bar, matched vs. missing skills breakdown (`GET /api/recommendations/internships`).
- **Skill Matching**: Detail view comparing required job skills vs. student profile skills (`GET /api/skill-matching/internships/{id}`).
- **Internship Applications**: One-click apply and status tracking (`GET /api/applications/me`).
- **Student Discovery & Networking**: Search peers by skill (e.g., `Java`) or name (`GET /api/connections/students?query=...`), send connection requests, accept/reject invitations, and view active connections.
- **Community Feed**: Post updates, like posts, and engage in comments.

### 🏢 2. Employer (`COMPANY`)
- **Dashboard**: Active listings count, total applicants count, and pending review metric.
- **Manage Internships**: Post new internships with title, description, location, stipend, and required skills (`POST /api/internships`, `GET /api/internships/company`).
- **Review Applicants**: View candidate applications and update status (`PATCH /api/applications/{id}/status`) between `APPLIED`, `UNDER_REVIEW`, `ACCEPTED`, and `REJECTED`.

### 🛡️ 3. Administrator (`ADMIN`)
- **Dashboard**: Platform overview statistics (`GET /api/admin/dashboard`): `totalUsers`, `totalStudents`, `totalCompanies`, `totalInternships`, `totalApplications`.
- **Users Directory**: Read-only directory of all registered accounts with role tags (`GET /api/admin/users`).
- **Internships Directory**: Read-only audit of all published company internships (`GET /api/admin/internships`).
- **Applications Audit**: Read-only table of all submitted student applications (`GET /api/admin/applications`).

---

## 📁 Project Structure

```text
careerconnect-frontend/
├── .env.example              # Environment variables template (VITE_API_BASE_URL)
├── index.html                # Entry HTML with Plus Jakarta Sans typography
├── package.json              # Project dependencies & scripts
├── vite.config.js            # Vite configuration in standard JavaScript
├── README.md                 # Complete documentation
└── src/
    ├── api/
    │   ├── api.js                   # Central Axios client with JWT interceptor & error parser
    │   ├── authService.js           # Student & company registration, login
    │   ├── profileService.js        # View & edit student profile
    │   ├── resumeService.js         # PDF resume upload & PDFBox skill extraction
    │   ├── connectionService.js     # Peer discovery, requests, and connections
    │   ├── postService.js           # Social feed posts, likes, comments
    │   ├── internshipService.js     # Public & company internship listings
    │   ├── recommendationService.js # Match recommendations & skill comparison
    │   ├── applicationService.js    # Student application submission & company status update
    │   └── adminService.js          # Admin dashboard, users, internships, applications
    ├── assets/
    │   └── images/                  # High-fidelity photography assets
    ├── components/
    │   ├── BackendStatusNotice.jsx  # Unobtrusive Spring Boot port 1234 connectivity test banner
    │   ├── EmptyState.jsx           # Clean, accessible empty states
    │   ├── ErrorMessage.jsx         # Error banner with retry & backend diagnosis
    │   ├── Footer.jsx               # Light-themed clean footer
    │   ├── InternshipCard.jsx       # Internship card with skill badges & match score
    │   ├── LoadingSpinner.jsx       # Accessible loading indicator
    │   ├── Navbar.jsx               # Role-aware top navigation bar
    │   ├── PostCard.jsx             # Feed post with author, likes, and comments
    │   ├── ProtectedRoute.jsx       # Route guard for STUDENT, COMPANY, ADMIN
    │   ├── Sidebar.jsx              # Role-specific dashboard navigation sidebar
    │   └── StudentCard.jsx          # Student peer card with skills & connect action
    ├── context/
    │   └── AuthContext.jsx          # JWT token persistence, role state, login/logout
    ├── layouts/
    │   ├── AdminLayout.jsx          # Admin dashboard wrapper
    │   ├── CompanyLayout.jsx        # Company recruiter wrapper
    │   ├── MainLayout.jsx           # Public & browsing page wrapper
    │   └── StudentLayout.jsx        # Student portal wrapper
    ├── pages/
    │   ├── AdminApplicationsPage.jsx
    │   ├── AdminDashboard.jsx
    │   ├── AdminInternshipsPage.jsx
    │   ├── AdminUsersPage.jsx
    │   ├── CompanyApplicationsPage.jsx
    │   ├── CompanyDashboard.jsx
    │   ├── CompanyInternshipsPage.jsx
    │   ├── CompanyRegisterPage.jsx
    │   ├── ConnectionRequestsPage.jsx
    │   ├── ConnectionsPage.jsx
    │   ├── FeedPage.jsx
    │   ├── InternshipDetailsPage.jsx
    │   ├── InternshipsPage.jsx
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── MyApplicationsPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── RecommendationsPage.jsx
    │   ├── ResumeUploadPage.jsx
    │   ├── StudentDashboard.jsx
    │   ├── StudentDiscoveryPage.jsx
    │   ├── StudentProfilePage.jsx
    │   └── StudentRegisterPage.jsx
    ├── App.jsx                      # React Router configuration
    ├── index.css                    # Tailwind CSS v4 directives & light theme styles
    └── main.jsx                     # Application entry point
```

---

## 🔒 Security Best Practices
- Passwords are never stored in browser storage (`localStorage` or `sessionStorage`).
- The JWT returned upon login is stored in `localStorage` under `careerconnect_token` and attached as `Authorization: Bearer <token>` on all subsequent requests.
- When the backend returns HTTP 401, the session is cleared automatically and redirects the user to log in again.
- Role-based route protection guards client routes, while the backend independently enforces authorization on every endpoint.
