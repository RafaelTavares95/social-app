import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const resetRequestMutation = useMutation({
        mutationFn: () => authService.passwordResetRequest(email),
        onSuccess: () => {
            setSubmitted(true);
        },
        onError: (error: any) => {
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string' 
                ? detail 
                : Array.isArray(detail) 
                    ? detail[0]?.msg || 'Failed to request password reset.'
                    : typeof detail === 'object' && detail?.msg
                        ? detail.msg
                        : 'Failed to request password reset.';
            
            setErrorMessage(message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        resetRequestMutation.mutate();
    };

    const isLoading = resetRequestMutation.isPending;

    if (submitted) {
        return (
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 text-center animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {t('auth.forgotPasswordPage.successTitle')}
                    </h2>
                    <p className="text-stone-300 mb-8">
                        {t('auth.forgotPasswordPage.successMessage')}
                    </p>
                    <Link 
                        to="/login"
                        className="inline-block py-3 px-8 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                    >
                        {t('auth.forgotPasswordPage.backToLogin')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12 duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {t('auth.forgotPasswordPage.title')}
                    </h1>
                    <p className="text-stone-300/80 text-sm">
                        {t('auth.forgotPasswordPage.subtitle')}
                    </p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm animate-pulse">
                        {errorMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-stone-200 mb-2">
                            {t('auth.forgotPasswordPage.emailLabel')}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{t('auth.forgotPasswordPage.sending')}</span>
                            </>
                        ) : (
                            <span>{t('auth.forgotPasswordPage.sendButton')}</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link 
                        to="/login"
                        className="text-stone-300 hover:text-white transition-colors text-sm font-medium"
                    >
                        {t('auth.forgotPasswordPage.backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
