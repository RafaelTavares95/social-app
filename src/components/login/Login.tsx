import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { PasswordInput } from '../ui/PasswordInput';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loginMutation = useMutation({
        mutationFn: () => authService.login(email, password),
        onSuccess: (data) => {
            // Store the token in a session cookie
            Cookies.set('access_token', data.access_token, { 
                secure: true, 
                sameSite: 'strict' 
            });
            console.log('Login successful');
            onLoginSuccess(data.access_token);
        },
        onError: (error: any) => {
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string' 
                ? detail 
                : Array.isArray(detail) 
                    ? detail[0]?.msg || 'Failed to sign in. Please check your credentials.'
                    : typeof detail === 'object' && detail?.msg
                        ? detail.msg
                        : 'Failed to sign in. Please check your credentials.';
            
            setErrorMessage(message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        loginMutation.mutate();
    };

    const isLoading = loginMutation.isPending;

    return (
        <div className="w-full max-w-md">
            {/* Glassmorphism Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 transform transition-all duration-300 hover:scale-[1.02]">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12 duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                        {t('auth.welcome')}
                    </h1>
                    <p className="text-stone-300/80 text-sm md:text-base">
                        {t('auth.loginToContinue')}
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
                    {/* Email Input */}
                    <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-stone-200 mb-2">
                            {t('auth.email')}
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

                    {/* Password Input */}
                    <PasswordInput
                        id="password"
                        label={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="ml-2 text-stone-300 group-hover:text-white transition-colors">
                                {t('auth.rememberMe')}
                            </span>
                        </label>
                        <a href="#" className="text-stone-300 hover:text-white transition-colors font-medium">
                            {t('auth.forgotPassword')}
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{t('auth.signingIn')}</span>
                            </>
                        ) : (
                            <span>{t('auth.signIn')}</span>
                        )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                    <p className="text-stone-300 text-sm">
                        {t('auth.dontHaveAccount')}{' '}
                        <Link 
                            to="/register"
                            className="text-white font-semibold hover:text-stone-200 transition-colors bg-transparent border-none p-0 cursor-pointer"
                        >
                            {t('auth.signUp')}
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
