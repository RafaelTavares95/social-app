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
      try {
        const userData = await userService.getProfile();
        setUser(userData);
      } catch (error: any) {
        // If it's a 401, we're simply not logged in
        if (error.response?.status === 401) {
          setUser(null);
        } else if (!error.response || error.response.status >= 500) {
          setFatalError({ 
            message: t('errors.subtitle'), 
            details: error.message 
          });
        } else {
          setUser(null);
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
      navigate('/login');
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
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

  return {
    user,
    isInitializing,
    fatalError,
    handleLoginSuccess,
    handleLogout,
    handleUpdateUser,
    resetFatalError
  };
}
