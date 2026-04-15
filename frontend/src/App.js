import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import LoadingScreen from './components/ui/LoadingScreen';
import './styles/globals.css';

// ── Lazy pages ────────────────────────────────────────────────────────────────
const Landing      = lazy(() => import('./pages/Landing'));
const Login        = lazy(() => import('./pages/auth/Login'));
const RegisterUser = lazy(() => import('./pages/auth/RegisterUser'));
const RegisterOrg  = lazy(() => import('./pages/auth/RegisterOrg'));
const Feed         = lazy(() => import('./pages/Feed'));
const Jobs         = lazy(() => import('./pages/Jobs'));
const JobDetail    = lazy(() => import('./pages/JobDetail'));
const PostJob      = lazy(() => import('./pages/PostJob'));
const Profile      = lazy(() => import('./pages/Profile'));
const OrgProfile   = lazy(() => import('./pages/OrgProfile'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const OrgDashboard = lazy(() => import('./pages/OrgDashboard'));
const Discover     = lazy(() => import('./pages/Discover'));
const Apply        = lazy(() => import('./pages/Apply'));
const EditProfile  = lazy(() => import('./pages/EditProfile'));
const NotFound     = lazy(() => import('./pages/NotFound'));

// ── Route guards ──────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const UserRoute = ({ children }) => {
  const { isUser, isOrg, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isUser) return children;
  if (isOrg)  return <Navigate to="/org/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

const OrgRoute = ({ children }) => {
  const { isOrg, isUser, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isOrg)  return children;
  if (isUser) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isOrg, isUser, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated) {
    if (isOrg) return <Navigate to="/org/dashboard" replace />;
    if (isUser) return <Navigate to="/feed" replace />;
    // If authenticated but role not confirmed yet, don't redirect yet to avoid loops
  }
  return children;
};

// ── App shell ─────────────────────────────────────────────────────────────────
const AppShell = () => {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<Landing />} />
          <Route path="/jobs"      element={<Jobs />} />
          <Route path="/jobs/:id"  element={<JobDetail />} />
          <Route path="/discover"  element={<Discover />} />
          <Route path="/u/:username"    element={<Profile />} />
          <Route path="/org/:slug"      element={<OrgProfile />} />

          {/* Guest only */}
          <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register"        element={<GuestRoute><RegisterUser /></GuestRoute>} />
          <Route path="/register/org"    element={<GuestRoute><RegisterOrg /></GuestRoute>} />

          {/* User authenticated */}
          <Route path="/feed"       element={<PrivateRoute><UserRoute><Feed /></UserRoute></PrivateRoute>} />
          <Route path="/dashboard"  element={<PrivateRoute><UserRoute><Dashboard /></UserRoute></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><UserRoute><EditProfile /></UserRoute></PrivateRoute>} />
          <Route path="/jobs/:id/apply" element={<PrivateRoute><UserRoute><Apply /></UserRoute></PrivateRoute>} />

          {/* Org authenticated */}
          <Route path="/org/dashboard" element={<PrivateRoute><OrgRoute><OrgDashboard /></OrgRoute></PrivateRoute>} />
          <Route path="/post-job"      element={<PrivateRoute><OrgRoute><PostJob /></OrgRoute></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#13131F',
              color: '#F0F0F0',
              border: '1px solid rgba(255,107,0,0.3)',
              fontFamily: 'Noto Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#FF6B00', secondary: '#0A0A0F' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
