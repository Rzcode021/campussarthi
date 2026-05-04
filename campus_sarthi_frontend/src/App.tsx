import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { BookmarkProvider } from './context/BookmarkContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Critical path — eager load
import LandingPage from './pages/LandingPage';

// Lazy-loaded routes
const LoginPage          = lazy(() => import('./pages/LoginPage'));
const RequestAccessPage  = lazy(() => import('./pages/RequestAccessPage'));
const DashboardPage      = lazy(() => import('./pages/DashboardPage'));
const CompaniesPage      = lazy(() => import('./pages/CompaniesPage'));
const CompanyDetailPage  = lazy(() => import('./pages/CompanyDetailPage'));
const StudyMaterialsPage = lazy(() => import('./pages/StudyMaterialsPage'));
const ResourcesPage      = lazy(() => import('./pages/ResourcesPage'));
const AttirePage         = lazy(() => import('./pages/AttirePage'));
const NewsPage           = lazy(() => import('./pages/NewsPage'));
const ProfilePage        = lazy(() => import('./pages/ProfilePage'));
const CrewRatingPage     = lazy(() => import('./pages/CrewRatingPage'));
const MyUploadsPage      = lazy(() => import('./pages/MyUploadsPage'));
const AdminPage          = lazy(() => import('./pages/AdminPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#6366F1', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <BookmarkProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/crew-rating" element={<CrewRatingPage />} />
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/request-access" element={<RequestAccessPage />} />
                </Route>

                {/* Protected */}
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/companies" element={<CompaniesPage />} />
                  <Route path="/companies/:id" element={<CompanyDetailPage />} />
                  <Route path="/study-materials" element={<StudyMaterialsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/attire" element={<AttirePage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/my-uploads" element={<MyUploadsPage />} />
                </Route>

                {/* Admin */}
                <Route path="/admin" element={<AdminRoute><MainLayout /></AdminRoute>}>
                  <Route index element={<AdminPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BookmarkProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
