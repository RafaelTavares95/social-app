import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { authService } from '../services/auth.service';
import type { User } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fatalError, setFatalError] = useState<{ message: string; details?: string } | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      const fetchUser = async () => {
        try {
          const userData = await authService.getUser();
          setUser(userData);
        } catch (error: any) {
          console.error('Failed to fetch user:', error);
          if (!error.response || error.response.status >= 500) {
            setFatalError({ 
              message: t('errors.subtitle'), 
              details: error.message 
            });
          } else {
            Cookies.remove('access_token');
            setUser(null);
          }
        } finally {
          setIsInitializing(false);
        }
      };
      fetchUser();
    } else {
      setUser(null);
      setIsInitializing(false);
    }
  }, [t]);

  const handleLogout = () => {
    Cookies.remove('access_token');
    setUser(null);
    navigate('/login');
  };

  const handleLoginSuccess = async () => {
    try {
      const userData = await authService.getUser();
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
