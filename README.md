# 🎓 Campus Sarthi — Placement Portal

A full-stack college placement management system built with **Django REST Framework** (backend) and **React + TypeScript** (frontend). It enables college placement teams to manage company data, study resources, news, and student information through a structured multi-role workflow.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Roles & Permissions](#roles--permissions)
- [Features (Implemented)](#features-implemented)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
- [Cloudinary Setup](#cloudinary-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Production Deployment](#production-deployment)
- [Future Features Roadmap](#future-features-roadmap)
- [Contributing](#contributing)

---

## Overview

Campus Sarthi is a centralized platform for college placement cells (TPO teams). It solves the problem of placement information being scattered across WhatsApp groups, PDFs, and emails. Instead, all company data, preparation resources, news, and student interactions are managed in one place.

**Core Workflow:**
```
Admin uploads company via wizard form
         ↓
Company saved as "pending"
         ↓
Admin reviews and approves
         ↓
Students can view company details
         ↓
Crew members attach documents to company tabs
         ↓
Admin approves documents
         ↓
Students can view & download documents
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.13 | Runtime |
| Django 5.0 | Web framework |
| Django REST Framework 3.15 | REST API layer |
| SimpleJWT | JWT Authentication |
| Cloudinary + django-cloudinary-storage | Remote file storage (CDN) |
| SQLite (dev) / PostgreSQL (prod) | Database |
| python-dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + TypeScript | UI framework |
| Vite 8 | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icon library |
| CSS Variables (custom design system) | Styling |

---

## Architecture

```
CampusSarthi/
├── campus_sarthi_backend/        # Django project
│   ├── campus_sarthi/            # Core settings, URLs
│   ├── accounts/                 # User auth, roles, profiles
│   ├── companies/                # Company CRUD + documents
│   ├── study_materials/          # Upload/download PDFs & docs
│   ├── news/                     # News articles management
│   ├── resources/                # External learning resources
│   ├── crew/                     # Crew member profiles & ratings
│   └── bookmarks/                # Student bookmarks
│
└── campus_sarthi_frontend/       # React app
    └── src/
        ├── pages/                # Full page components
        ├── components/           # Reusable UI components
        ├── services/             # Axios API service layer
        ├── context/              # React context (Auth, Toast, Bookmarks)
        ├── types/                # TypeScript interfaces
        └── utils/                # Helper functions
```

---

## Roles & Permissions

| Role | Access |
|------|--------|
| **Student** | View approved companies, materials, news, resources. Download files. Bookmark content. |
| **Crew** | All student access + upload documents to companies + upload study materials. Can only see own uploads in "My Uploads". |
| **Admin** | Full access. Approve/reject users, companies, documents, materials. Manage news, resources, crew. Change user roles. View/download all files. |

### Role Upgrade Flow
```
New Registration → Student (inactive) → Admin approves → Student (active)
Admin can promote: Student → Crew → Admin
```

---

## Features (Implemented)

### 🔐 Authentication & User Management
- Email-based login (JWT tokens with refresh)
- Role-based access control (student / crew / admin)
- Student self-registration with admin approval gate
- Admin Panel: view all users, change roles, activate/deactivate, delete users
- Profile page with photo upload (Cloudinary), branch/year/phone fields
- Superuser protection (cannot be modified or deleted)

### 🏢 Company Management
- **Multi-step wizard form** for admin to create companies (5 steps):
  - Step 1: Basic Info (name, domain, role, salary)
  - Step 2: About & Culture
  - Step 3: Technical Requirements
  - Step 4: GD & Interview Questions
  - Step 5: Selection Process & Requirements
- Draft saving (resume wizard from where you left off)
- Pending → Approved → Rejected workflow
- Company detail page with tabs: About, GD, Interview, Requirements, Process
- Domain-based color coding (CS, Cyber, Product, Sales)
- Company logo upload via Cloudinary

### 📎 Company Document System
- Crew members can attach documents to any tab of a company page
- Sections: About, GD Questions, Interview Questions, Requirements, Selection Process
- Pending → Admin review → Approved → Visible to students
- Admin can view and download before approving (for authenticity check)
- Students and crew can view + download approved documents
- Download counter per document
- Cloudinary CDN delivery (no server disk usage)

### 📚 Study Materials
- Admin/crew upload study materials (PDF, DOC, DOCX, PPT, PPTX)
- Categories: Aptitude, Technical, HR Interview, GD Preparation, Resume, Domain Specific
- Pending → Admin approval → Visible to all students
- Category filter tabs
- View (opens in browser) + Download (forced download via `fl_attachment` Cloudinary flag)
- Download counter
- My Uploads page: crew sees their own submission statuses with rejection reasons

### 📰 News Management
- Admin creates news articles with tags (Placements, Tech, Industry, Campus)
- Draft → Published workflow
- External URL linking
- Source attribution

### 🔗 Resources Management
- Admin curates external learning resources (DSA, Python, Interview Prep, Aptitude)
- Difficulty levels: Beginner, Intermediate, Advanced
- Activate/deactivate toggle (inactive resources hidden from students)

### ⭐ Crew Rating System
- Students rate crew members (1–5 stars)
- Average rating shown in admin stats

### 🔖 Bookmark System
- Students bookmark companies and interview questions
- Persisted per user (backend database)
- Accessible from the sidebar

### 🖼️ Cloudinary File Storage
- All file uploads routed to Cloudinary (NOT local disk)
- Organized folders: `campus_sarthi/profiles/`, `campus_sarthi/study_materials/`, `campus_sarthi/company_docs/`
- File size computed pre-upload in serializer (not after remote upload)
- Download view returns Cloudinary CDN URL
- Delete view calls `cloudinary.uploader.destroy()` for remote file cleanup

### 🎨 Design System
- Custom CSS variable design system (no Tailwind — pure CSS)
- Dark/light surface colors, primary/danger/success/warning color tokens
- Google Fonts (Inter)
- Smooth animations, hover effects, micro-interactions
- Glassmorphism card design
- Responsive sidebar navigation
- Toast notification system (success/error/info)
- Skeleton loading states

---

## Project Structure

### Backend Apps

```
accounts/         → CustomUser model, JWT auth, role management views
companies/        → Company & CompanyDocument models, wizard API, approval flow
study_materials/  → StudyMaterial model, upload/download/delete views
news/             → NewsArticle model, publish/unpublish API
resources/        → Resource model, activate/deactivate API
crew/             → CrewMember model, ratings
bookmarks/        → UserBookmark model
```

### Frontend Pages

```
/                     → Landing page
/login                → Login form
/request-access       → Student registration form
/dashboard            → Dashboard with stats and quick access
/companies            → Company listing with search & domain filter
/companies/:id        → Company detail page with tabs + documents
/study-materials      → Study materials library with category tabs
/news                 → News articles feed
/resources            → Curated external resources
/bookmarks            → Saved bookmarks
/profile              → User profile edit
/my-uploads           → Crew: track own submissions
/crew-ratings         → Rate crew members (students)
/admin                → Full admin panel (admin only)
```

---

## Setup Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free [Cloudinary account](https://cloudinary.com)

### Backend Setup

```bash
cd campus_sarthi_backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate           # Windows
# source venv/bin/activate      # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Cloudinary credentials and a strong SECRET_KEY

# Run migrations
python manage.py migrate

# Create superuser (this will be your admin account)
python manage.py createsuperuser

# (Optional) Seed demo data
python manage.py seed_companies
python manage.py seed_resources
python manage.py seed_news
python manage.py seed_crew

# Start the development server
python manage.py runserver
```

### Frontend Setup

```bash
cd campus_sarthi_frontend

# Configure environment
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:8000

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit: **http://localhost:5173**

---

## Cloudinary Setup

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard → API Keys
3. Copy: **Cloud Name**, **API Key**, **API Secret**
4. Paste them into `campus_sarthi_backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

All file uploads (profile photos, study materials, company documents, company logos) will now be automatically stored on Cloudinary's CDN.

**Free tier limits:** 25 GB storage + 25 GB bandwidth/month (more than enough for a college).

---

## Environment Variables

### Backend `.env`

```env
# Cloudinary (required for file storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Django
SECRET_KEY=your-strong-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/auth/register/` | None | Student registration |
| POST | `/api/auth/login/` | None | Login (returns JWT) |
| GET | `/api/auth/me/` | Any | Get current user |
| PUT | `/api/auth/profile/update/` | Any | Update profile |

### Companies
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/companies/` | Student+ | List approved companies |
| GET | `/api/companies/:id/` | Student+ | Company detail |
| GET | `/api/admin/companies/` | Admin | List all companies |
| POST | `/api/admin/companies/` | Admin | Create company |
| POST | `/api/admin/companies/:id/approve/` | Admin | Approve company |
| POST | `/api/admin/companies/:id/reject/` | Admin | Reject company |

### Company Documents
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/companies/:id/documents/` | Student+ | Approved documents for company |
| POST | `/api/companies/:id/documents/upload/` | Crew+ | Upload document |
| GET | `/api/companies/:company_id/documents/:id/download/` | Student+ | Get CDN URL |
| GET | `/api/admin/company-documents/` | Admin | All documents |
| POST | `/api/admin/company-documents/:id/approve/` | Admin | Approve document |
| POST | `/api/admin/company-documents/:id/reject/` | Admin | Reject with reason |
| DELETE | `/api/admin/company-documents/:id/` | Admin | Delete + remove from Cloudinary |

### Study Materials
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/study-materials/` | Student+ | List approved materials |
| GET | `/api/study-materials/:id/download/` | Student+ | Get CDN URL |
| GET | `/api/study-materials/my-materials/` | Crew+ | Own uploaded materials |
| GET | `/api/admin/study-materials/` | Admin | All materials |
| POST | `/api/admin/study-materials/` | Admin | Upload material |
| POST | `/api/admin/study-materials/:id/approve/` | Admin | Approve material |
| DELETE | `/api/admin/study-materials/:id/` | Admin | Delete + Cloudinary cleanup |

### Users (Admin)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/admin/users/pending/` | Admin | Pending student registrations |
| POST | `/api/admin/users/:id/approve/` | Admin | Approve student |
| DELETE | `/api/admin/users/:id/reject/` | Admin | Reject and remove student |
| GET | `/api/admin/users/` | Admin | All users (supports `?role=` and `?include_admin=true`) |
| PATCH | `/api/admin/users/:id/role/` | Admin | Change user role |
| POST | `/api/admin/users/:id/toggle-active/` | Admin | Activate/deactivate user |
| DELETE | `/api/admin/users/:id/delete/` | Admin | Permanently delete user |

---

## Production Deployment

### Backend (Railway / Render)

1. Push code to GitHub
2. Connect repo to Railway or Render
3. Set all environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   SECRET_KEY=...
   DEBUG=False
   ALLOWED_HOSTS=your-backend-domain.com
   ```
4. Add a PostgreSQL plugin (both platforms offer free PostgreSQL)
5. Set start command: `python manage.py migrate && gunicorn campus_sarthi.wsgi`
6. Install gunicorn: add `gunicorn` to `requirements.txt`

### Frontend (Vercel / Netlify)

1. Connect the `campus_sarthi_frontend/` folder to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.com
   ```

---

## Future Features Roadmap

### 🔴 Phase 1 — Core Placement Features (Coming Next)

#### 1. Placement Drive Calendar
- Admin posts upcoming placement drives with date, eligibility criteria, and time
- Students see drives in a calendar view with countdown timers
- "Register Interest" button for students
- Drive status: Upcoming / Ongoing / Completed

#### 2. Student Placement Tracker + Hall of Fame
- Admin marks students as "Placed" with company, package, and date
- A public **Placements Wall** celebrates placed students
- Dashboard shows: Total Placed, Average Package, Highest Package
- Motivates juniors preparing for placements

#### 3. Interview Experience Submissions
- Students who got placed submit their interview experience
- Written per-round (HR Round, Technical Round, GD, etc.)
- Admin approves before visible to others
- Appears inside the Company detail page as a new **"Experiences"** tab

#### 4. Student Application Tracker
- Students track their own status for each company
- Pipeline stages: Shortlisted → Written Test → GD → Interview → Offer → Rejected
- Admin/crew updates each student's stage
- Students see a "My Applications" page with a visual progress tracker

---

### 🟡 Phase 2 — Engagement & Utility

#### 5. Announcement Bell Notifications
- Admin posts announcements (urgent / general)
- Bell icon in header shows unread count badge
- Announcements appear as toast notifications on login
- Mark all as read

#### 6. Smart Eligibility Matcher
- Student fills CGPA, branch, backlogs in their profile
- Companies page shows 🟢 (Eligible) / 🔴 (Not Eligible) badge per company
- Dashboard shows: "You are eligible for 8 out of 12 companies"
- Helps students focus on relevant opportunities

#### 7. Mock Tests / Quiz Module
- Crew/Admin creates MCQ quizzes (Aptitude, Verbal, Technical, Coding)
- Students attempt with a timer
- Results shown immediately with correct answer explanations
- Quiz leaderboard per test

#### 8. Email Notifications
- Auto-email to student when account is approved
- Auto-email when uploaded document/material is approved or rejected (with reason)
- Auto-email when a new placement drive is posted
- Powered by Django's email system with Gmail SMTP or SendGrid

#### 9. Discussion Forum / Q&A per Company
- Students ask questions under any company page
- Crew/Admin can answer
- Other students upvote helpful answers
- Similar to a mini Stack Overflow inside Campus Sarthi

---

### 🟢 Phase 3 — Admin Power & Polish

#### 10. Advanced Analytics Dashboard
- Bar charts: placed students per month, company domain distribution
- Line chart: active users trend
- Top downloaded study materials
- Most visited companies
- Crew contribution leaderboard (who uploaded the most)
- Powered by Recharts or Chart.js

#### 11. Company Comparison Tool
- Students select 2–3 companies to compare side-by-side
- Table view: Salary, Domain, Bond, Eligibility, Selection Rounds
- Helps students decide which company to prioritize

#### 12. Global Search
- Single search bar in the header
- Searches across Companies, Study Materials, News, Resources simultaneously
- Results grouped by type in a dropdown
- Keyboard navigable (↑↓ Enter)

#### 13. Dark Mode
- CSS variable–based dark mode toggle in the header
- User preference saved in localStorage
- Instant toggle without page reload

#### 14. Crew Application System
- Students apply to become crew members from their profile
- Admin sees "Crew Applications" tab in admin panel
- Approve/reject crew applications
- Approved students automatically get crew role

#### 15. Resume Bank
- Students upload their resume PDF (visibility toggle: public/private)
- Crew/Admin can browse the resume bank for shortlisting
- Students add profile links (LinkedIn, GitHub, Portfolio)

#### 16. Export & Report Generation
- Admin exports:
  - Placed students list (CSV / PDF)
  - Company-wise placed count report
  - Study materials usage stats
- Useful for TPO reporting to college management

---

## Contributing

This project follows a **feature branch workflow**:

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit: `git commit -m "feat: add your feature"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

### Branch Naming Convention
- `feature/` — new features
- `fix/` — bug fixes
- `docs/` — documentation updates
- `refactor/` — code restructuring

### Commit Message Convention
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `style:` — UI/CSS only changes
- `refactor:` — code refactoring

---

## License

MIT License — feel free to use this project for your college or fork it for your own institution.

---

*Built with ❤️ for college placement cells across India.*
