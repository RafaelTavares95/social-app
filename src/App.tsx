import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthLayout } from './components/Layout/AuthLayout'
import { MainLayout } from './components/Layout/MainLayout'
import { FatalError } from './components/ui/FatalError'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { useAuth } from './hooks/useAuth'

// Lazy load page components
const Login = lazy(() => import('./components/Login/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./components/Register/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const EditProfile = lazy(() => import('./components/Profile/EditProfile').then(m => ({ default: m.EditProfile })));
const ProfileView = lazy(() => import('./components/Profile/ProfileView').then(m => ({ default: m.ProfileView })));
const EmailConfirmation = lazy(() => import('./components/Auth/EmailConfirmation').then(m => ({ default: m.EmailConfirmation })));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const NotificationsPage = lazy(() => import('./components/Notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));

function App() {
  const {
    user,
    isInitializing,
    fatalError,
    handleLoginSuccess,
    handleLogout,
    handleUpdateUser,
    resetFatalError,
    refreshUser
  } = useAuth();

  if (fatalError) {
    return (
      <FatalError 
        message={fatalError.message} 
        details={fatalError.details} 
        onReset={resetFatalError}
      />
    );
  }

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                <Login onLoginSuccess={handleLoginSuccess} />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                <Register />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/confirm-email/:token"
          element={<EmailConfirmation onConfirmSuccess={refreshUser} />}
        />
        <Route
          path="/reset-password/:token"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            user ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <Dashboard 
                  user={user} 
                />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <ProfileView user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile/edit"
          element={
            user ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <EditProfile 
                  user={user} 
                  onUpdateSuccess={handleUpdateUser}
                />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            user ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <NotificationsPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App
