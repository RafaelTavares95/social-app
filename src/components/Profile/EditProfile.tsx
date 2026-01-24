import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Camera, User as UserIcon, Mail, User as UserIconOutlined } from 'lucide-react';
import { userService } from '../../services/user.service';
import { PasswordInput } from '../ui/PasswordInput';
import type { User } from '../../types/auth';

interface EditProfileProps {
    user: User;
    onUpdateSuccess: (updatedUser: User) => void;
}

export function EditProfile({ user, onUpdateSuccess }: EditProfileProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const updateMutation = useMutation({
        mutationFn: () => userService.updateProfile({ name, ...(password ? { password } : {}) }),
        onSuccess: (updatedUser) => {
            onUpdateSuccess(updatedUser);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            navigate('/profile', { state: { successMessage: t('profile.updateSuccess') } });
        },
        onError: (error: any) => {
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string' 
                ? detail 
                : Array.isArray(detail) 
                    ? detail[0]?.msg || t('profile.updateError')
                    : typeof detail === 'object' && detail?.msg
                        ? detail.msg
                        : t('profile.updateError');
            
            setErrorMessage(message);
            setSuccessMessage('');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        updateMutation.mutate();
    };

    const isLoading = updateMutation.isPending;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
                {/* Header/Cover Placeholder */}
                <div className="h-32 bg-gradient-to-r from-emerald-500 to-green-600 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group cursor-pointer">
                            {user.avatarUrl ? (
                                <img 
                                    src={user.avatarUrl} 
                                    alt={user.name} 
                                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-stone-100 flex items-center justify-center border-4 border-white shadow-md">
                                    <UserIcon className="w-10 h-10 text-stone-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-emerald-950">
                            {t('profile.editTitle')}
                        </h1>
                        <p className="text-stone-500 text-sm">
                            {t('profile.editSubtitle')}
                        </p>
                    </div>

                    {/* Messages */}
                    {errorMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center space-x-2">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                                {t('auth.email')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-stone-400" />
                                </div>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed text-sm"
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-stone-400 italic">
                                {t('profile.emailNotEditable')}
                            </p>
                        </div>

                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2">
                                {t('profile.nameLabel')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIconOutlined className="w-5 h-5 text-stone-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                             <PasswordInput
                                id="password"
                                label={t('profile.passwordLabel')}
                                variant="profile"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-stone-100">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-6 py-2.5 text-sm font-semibold text-stone-600 hover:text-stone-950 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{t('common.loading')}</span>
                                    </>
                                ) : (
                                    <span>{t('common.save')}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
