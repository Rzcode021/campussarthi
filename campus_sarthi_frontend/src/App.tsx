import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { BookmarkProvider } from './context/BookmarkContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RequestAccessPage from './pages/RequestAccessPage';
import DashboardPage from './pages/DashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import ResourcesPage from './pages/ResourcesPage';
import AttirePage from './pages/AttirePage';
import NewsPage from './pages/NewsPage';
import ProfilePage from './pages/ProfilePage';
import CrewRatingPage from './pages/CrewRatingPage';
import MyUploadsPage from './pages/MyUploadsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <BookmarkProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/request-access" element={<RequestAccessPage />} />
              </Route>

              {/* Protected */}
              <Route element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/companies/:id" element={<CompanyDetailPage />} />
                <Route path="/study-materials" element={<StudyMaterialsPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/attire" element={<AttirePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/crew-rating" element={<CrewRatingPage />} />
                <Route path="/my-uploads" element={<MyUploadsPage />} />
              </Route>

              {/* Admin only */}
              <Route path="/admin" element={
                <AdminRoute>
                  <MainLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BookmarkProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
