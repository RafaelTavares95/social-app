import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import type { User } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fatalError, setFatalError] = useState<{ message: string; details?: string } | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/confirm-email'];
      const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));
      const hasSessionIndicator = localStorage.getItem('social_app_session') === 'active';

      // Skip fetching if on a public path and no session indicator is present
      if (isPublicPath && !hasSessionIndicator) {
        setIsInitializing(false);
        return;
      }

      try {
        const userData = await userService.getProfile();
        setUser(userData);
        localStorage.setItem('social_app_session', 'active');
      } catch (error: any) {
        // If it's a 401, we're simply not logged in
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('social_app_session');
        } else if (!error.response || error.response.status >= 500) {
          setFatalError({ 
            message: t('errors.subtitle'), 
            details: error.message 
          });
        } else {
          setUser(null);
          localStorage.removeItem('social_app_session');
        }
      } finally {
        setIsInitializing(false);
      }
    };
    fetchUser();
  }, [t]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('social_app_session');
      navigate('/login');
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
      localStorage.setItem('social_app_session', 'active');
      navigate('/');
    } catch (error: any) {
      console.error('Failed to fetch user after login:', error);
      setFatalError({ 
        message: t('errors.subtitle'), 
        details: error.message 
      });
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const resetFatalError = () => {
    setFatalError(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
      localStorage.setItem('social_app_session', 'active');
    } catch (error) {
      console.error('Failed to refresh user:', error);
      localStorage.removeItem('social_app_session');
    }
  };

  return {
    user,
    isInitializing,
    fatalError,
    handleLoginSuccess,
    handleLogout,
    handleUpdateUser,
    resetFatalError,
    refreshUser
  };
}
