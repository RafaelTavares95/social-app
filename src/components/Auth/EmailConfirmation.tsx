import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/auth.service';

interface EmailConfirmationProps {
  onConfirmSuccess?: () => void;
}

export function EmailConfirmation({ onConfirmSuccess }: EmailConfirmationProps) {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const confirm = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await authService.confirmEmail(token);
        setStatus('success');
        if (onConfirmSuccess) {
          onConfirmSuccess();
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
      }
    };

    confirm();
  }, [token, onConfirmSuccess]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        {/* Minimal Logo */}
        <div className="flex justify-center mb-10">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-black text-emerald-950 tracking-tighter uppercase">
              Social<span className="text-emerald-600">.</span>
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="text-center">
          {/* Status Icon Wrapper */}
          <div className="mb-8 flex justify-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 ${
              status === 'loading' ? 'bg-stone-50' : 
              status === 'success' ? 'bg-emerald-50 scale-110' : 
              'bg-red-50 scale-110'
            }`}>
              {status === 'loading' && (
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
              )}
              {status === 'success' && (
                <div className="text-emerald-600 animate-in zoom-in-50 duration-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {status === 'error' && (
                <div className="text-red-500 animate-in zoom-in-50 duration-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-emerald-950 mb-3 tracking-tight">
            {status === 'loading' && t('auth.emailConfirmation.verifying')}
            {status === 'success' && t('auth.emailConfirmation.success')}
            {status === 'error' && t('auth.emailConfirmation.error')}
          </h1>

          <p className="text-stone-500 text-sm leading-relaxed mb-10 max-w-[280px] mx-auto">
            {status === 'loading' && t('auth.emailConfirmation.verifying')}
            {status === 'success' && t('auth.emailConfirmation.message')}
            {status === 'error' && t('auth.emailConfirmation.errorMessage')}
          </p>

          {status !== 'loading' && (
            <Link
              to="/"
              className="group flex items-center justify-center w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-95"
            >
              <span>{t('auth.emailConfirmation.backToSite')}</span>
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}

          {status === 'error' && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 text-sm font-semibold text-stone-400 hover:text-emerald-600 transition-colors"
            >
              {t('errors.retry')}
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
            <p className="text-xs text-stone-400 font-medium tracking-widest uppercase">
                &copy; {new Date().getFullYear()} Social App System
            </p>
        </div>
      </div>
    </div>
  );
}
