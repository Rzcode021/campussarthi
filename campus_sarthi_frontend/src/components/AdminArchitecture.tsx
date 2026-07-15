import { Database, Globe, Server, Shield } from 'lucide-react';

export default function AdminArchitecture() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="rounded-2xl p-6" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
        <h2 className="text-lg font-extrabold text-white mb-2">System Architecture & Tech Stack</h2>
        <p className="text-sm" style={{ color: '#94A3B8' }}>
          An overview of the technologies, libraries, APIs, and infrastructure powering Campus Sarthi.
          This page is strictly for administrators to understand how the platform operates under the hood.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Frontend Section */}
        <div className="rounded-2xl p-6" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
          <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Globe size={16} className="text-blue-400" />
            </div>
            <h3 className="font-bold text-white">Frontend Architecture</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">React + Vite:</strong>
                <p style={{ color: '#64748B' }}>Built as a Single Page Application (SPA) using React. Vite is used for lightning-fast HMR and optimized production builds.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">TypeScript:</strong>
                <p style={{ color: '#64748B' }}>Strict static typing ensures robustness and developer experience across the application.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Tailwind CSS:</strong>
                <p style={{ color: '#64748B' }}>Utility-first CSS framework used for rapid, responsive, and highly customizable UI design without leaving the HTML/JSX.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Framer Motion & Lucide React:</strong>
                <p style={{ color: '#64748B' }}>Framer Motion powers the smooth page transitions and micro-interactions. Lucide React provides the clean, consistent iconography.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Context API:</strong>
                <p style={{ color: '#64748B' }}>State management for User Authentication, Toast Notifications, and Bookmarks handles global state without heavy external libraries.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Backend Section */}
        <div className="rounded-2xl p-6" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
          <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <Server size={16} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-white">Backend Architecture</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Django + Django REST Framework (DRF):</strong>
                <p style={{ color: '#64748B' }}>The core backend is a Python Django application. DRF is used to expose robust, secure, and scalable RESTful APIs consumed by the React frontend.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">JWT Authentication:</strong>
                <p style={{ color: '#64748B' }}>Simple JWT handles secure, stateless authentication. Tokens are exchanged and verified for every protected API request.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">CORS Headers:</strong>
                <p style={{ color: '#64748B' }}>Django CORS headers are configured to allow secure communication between the frontend (running on a different port/domain) and the backend API.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Cloudinary Integration:</strong>
                <p style={{ color: '#64748B' }}>Used for robust media storage. User uploads, company logos, and document files are securely uploaded, stored, and served via Cloudinary's global CDN.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Database Section */}
        <div className="rounded-2xl p-6" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
          <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Database size={16} className="text-amber-400" />
            </div>
            <h3 className="font-bold text-white">Database & Models</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Relational Database (SQLite/PostgreSQL):</strong>
                <p style={{ color: '#64748B' }}>Django's ORM maps Python objects to relational database tables, ensuring data integrity and fast queries.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Custom User Model:</strong>
                <p style={{ color: '#64748B' }}>Extends Django's AbstractUser to include role-based access (Student, Crew, Admin), branch, year, and approval status.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Core Entities:</strong>
                <p style={{ color: '#64748B' }}>Companies, Events, Study Materials, News, Placement Family Crew, and Contributions are all modeled with strict relationships and validation.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Security & Data Flow Section */}
        <div className="rounded-2xl p-6" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
          <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.15)' }}>
              <Shield size={16} className="text-purple-400" />
            </div>
            <h3 className="font-bold text-white">Security & Data Flow</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Axios Interceptors:</strong>
                <p style={{ color: '#64748B' }}>All API calls from the frontend pass through an Axios interceptor that automatically attaches the JWT Bearer token.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Role-Based Access Control (RBAC):</strong>
                <p style={{ color: '#64748B' }}>Frontend routes and Backend views are protected by role checks. e.g., Only users with the 'admin' role can access this page or trigger admin API endpoints.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">•</span>
              <div>
                <strong className="text-gray-200">Approval Workflow:</strong>
                <p style={{ color: '#64748B' }}>New user accounts and student contributions are held in a 'pending' state until an Admin reviews and explicitly approves them, maintaining platform quality.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
