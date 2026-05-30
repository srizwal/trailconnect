import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './store/AuthContext';
import Layout from './components/layout/Layout';
import './styles/global.css';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const TrekDetail = lazy(() => import('./pages/TrekDetail'));
const CreateTrek = lazy(() => import('./pages/CreateTrek'));
const GuidesMarketplace = lazy(() => import('./pages/GuidesMarketplace'));
const GuideProfile = lazy(() => import('./pages/GuideProfile'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
    <div className="loading-ring" />
  </div>
);

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const PublicOnly = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: 'Outfit, sans-serif', borderRadius: '10px' } }} />
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public layout routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/treks/:id" element={<TrekDetail />} />
              <Route path="/guides" element={<GuidesMarketplace />} />
              <Route path="/guides/:id" element={<GuideProfile />} />
              <Route path="/users/:id" element={<ProfilePage />} />

              {/* Auth-only */}
              <Route path="/create-trek" element={<ProtectedRoute><CreateTrek /></ProtectedRoute>} />
              <Route path="/bookings/:type/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/messages/:roomId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            </Route>

            {/* Auth pages (no nav) */}
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
