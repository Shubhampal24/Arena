import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/ui/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
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
  }
  return children;
};

// ── App shell ─────────────────────────────────────────────────────────────────
const AppShell = () => {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public / Landing - No sidebar */}
        <Route path="/" element={<MainLayout showSidebar={false}><Landing /></MainLayout>} />
        <Route path="/login" element={<GuestRoute><MainLayout showSidebar={false}><Login /></MainLayout></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><MainLayout showSidebar={false}><RegisterUser /></MainLayout></GuestRoute>} />
        <Route path="/register/org" element={<GuestRoute><MainLayout showSidebar={false}><RegisterOrg /></MainLayout></GuestRoute>} />

        {/* Discovery - With sidebar if authenticated */}
        <Route path="/jobs" element={<MainLayout showSidebar={isAuthenticated}><Jobs /></MainLayout>} />
        <Route path="/jobs/:id" element={<MainLayout showSidebar={isAuthenticated}><JobDetail /></MainLayout>} />
        <Route path="/discover" element={<MainLayout showSidebar={isAuthenticated}><Discover /></MainLayout>} />
        <Route path="/u/:username" element={<MainLayout showSidebar={isAuthenticated}><Profile /></MainLayout>} />
        <Route path="/org/:slug" element={<MainLayout showSidebar={isAuthenticated}><OrgProfile /></MainLayout>} />

        {/* User authenticated - With sidebar */}
        <Route path="/feed" element={<PrivateRoute><UserRoute><MainLayout><Feed /></MainLayout></UserRoute></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><UserRoute><MainLayout><Dashboard /></MainLayout></UserRoute></PrivateRoute>} />
        <Route path="/profile/edit" element={<PrivateRoute><UserRoute><MainLayout><EditProfile /></MainLayout></UserRoute></PrivateRoute>} />
        <Route path="/jobs/:id/apply" element={<PrivateRoute><UserRoute><MainLayout><Apply /></MainLayout></UserRoute></PrivateRoute>} />

        {/* Org authenticated - With sidebar */}
        <Route path="/org/dashboard" element={<PrivateRoute><OrgRoute><MainLayout><OrgDashboard /></MainLayout></OrgRoute></PrivateRoute>} />
        <Route path="/post-job" element={<PrivateRoute><OrgRoute><MainLayout><PostJob /></MainLayout></OrgRoute></PrivateRoute>} />

        <Route path="*" element={<MainLayout showSidebar={false}><NotFound /></MainLayout>} />
      </Routes>
    </Suspense>
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
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
