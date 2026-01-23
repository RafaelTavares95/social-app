import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface FatalErrorProps {
  message: string;
  details?: string;
  onReset: () => void;
}

export function FatalError({ message, details, onReset }: FatalErrorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    Cookies.remove('access_token');
    onReset();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-emerald-950 mb-3">{t('errors.title')}</h1>
        <p className="text-stone-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            {t('errors.retry')}
          </button>
          <button
            onClick={handleBackToLogin}
            className="w-full py-3 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold rounded-xl transition-colors"
          >
            {t('errors.backToLogin')}
          </button>
        </div>

        {details && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <details className="text-left cursor-pointer group">
              <summary className="text-xs font-semibold text-stone-400 uppercase tracking-wider group-hover:text-stone-600 transition-colors">
                {t('errors.details')}
              </summary>
              <div className="mt-4 p-4 bg-stone-900 rounded-xl overflow-x-auto">
                <pre className="text-[10px] text-emerald-400 font-mono leading-relaxed">
                  {details}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
