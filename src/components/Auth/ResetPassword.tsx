import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { PasswordInput } from '../ui/PasswordInput';

export function ResetPassword() {
    const { t } = useTranslation();
    const { token } = useParams<{ token: string }>();
    
    const [status, setStatus] = useState<'verifying' | 'form' | 'invalid'>('verifying');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('invalid');
                return;
            }
            try {
                await authService.passwordResetVerify(token);
                setStatus('form');
            } catch (error) {
                console.error('Token verification error:', error);
                setStatus('invalid');
            }
        };
        verifyToken();
    }, [token]);

    const resetMutation = useMutation({
        mutationFn: () => authService.passwordReset(token || '', password),
        onSuccess: () => {
            setSuccess(true);
        },
        onError: (error: any) => {
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string' 
                ? detail 
                : Array.isArray(detail) 
                    ? detail[0]?.msg || t('common.error')
                    : typeof detail === 'object' && detail?.msg
                        ? detail.msg
                        : t('common.error');
            setErrorMessage(message);
        }
    });

    const strength = useMemo(() => {
        let score = 0;
        if (password.length === 0) return 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const getStrengthColor = () => {
        switch (strength) {
            case 0: return 'bg-stone-500';
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-emerald-500';
            default: return 'bg-stone-500';
        }
    };

    const getStrengthText = () => {
        switch (strength) {
            case 0: return t('auth.tooShort');
            case 1: return t('auth.weak');
            case 2: return t('auth.medium');
            case 3: return t('auth.good');
            case 4: return t('auth.strong');
            default: return '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        if (password !== confirmPassword) {
            setErrorMessage(t('auth.resetPasswordPage.passwordsDoNotMatch'));
            return;
        }
        resetMutation.mutate();
    };

    if (status === 'verifying') {
        return (
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 text-center animate-pulse">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                        {t('auth.resetPasswordPage.verifying')}
                    </h2>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 text-center animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {t('auth.resetPasswordPage.invalidToken')}
                    </h2>
                    <Link 
                        to="/forgot-password"
                        className="inline-block py-3 px-8 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                    >
                        {t('auth.forgotPasswordPage.backToLogin')}
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 text-center animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {t('auth.resetPasswordPage.successTitle')}
                    </h2>
                    <p className="text-stone-300 mb-8">
                        {t('auth.resetPasswordPage.successMessage')}
                    </p>
                    <Link 
                        to="/login"
                        className="w-full inline-block py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
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
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12 duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {t('auth.resetPasswordPage.title')}
                    </h1>
                    <p className="text-stone-300/80 text-sm">
                        {t('auth.resetPasswordPage.subtitle')}
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm animate-pulse">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <PasswordInput
                            id="new-password"
                            label={t('auth.resetPasswordPage.passwordLabel')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        
                        {password && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">{t('auth.passwordStrength')}: {getStrengthText()}</span>
                                    <span className="text-[10px] text-stone-400">{password.length} chars</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div 
                                            key={step}
                                            className={`h-full flex-1 transition-all duration-500 ${
                                                strength >= step ? getStrengthColor() : 'bg-white/10'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <PasswordInput
                        id="confirm-password"
                        label={t('auth.resetPasswordPage.confirmPasswordLabel')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <button
                        type="submit"
                        disabled={resetMutation.isPending}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {resetMutation.isPending ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{t('auth.resetPasswordPage.resetting')}</span>
                            </>
                        ) : (
                            <span>{t('auth.resetPasswordPage.submitButton')}</span>
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
