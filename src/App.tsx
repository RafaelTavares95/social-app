import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { Dashboard } from './components/Dashboard/Dashboard'
import { EditProfile } from './components/Profile/EditProfile'
import { ProfileView } from './components/Profile/ProfileView'
import { AuthLayout } from './components/Layout/AuthLayout'
import { MainLayout } from './components/Layout/MainLayout'
import { FatalError } from './components/ui/FatalError'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { useAuth } from './hooks/useAuth'

function App() {
  const {
    user,
    isInitializing,
    fatalError,
    handleLoginSuccess,
    handleLogout,
    handleUpdateUser,
    resetFatalError
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

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          user ? (
            <Dashboard 
              user={user} 
              onLogout={handleLogout} 
            />
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
