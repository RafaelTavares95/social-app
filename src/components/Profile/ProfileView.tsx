import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, Mail, User as UserIconOutlined, Pencil, CheckCircle } from 'lucide-react';
import type { User } from '../../types/auth';
import { EmailConfirmationWarning } from '../ui/EmailConfirmationWarning';

interface ProfileViewProps {
    user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState<string | null>(
        location.state?.successMessage || null
    );

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                // Clear state to avoid message reappearing on refresh
                window.history.replaceState({}, document.title);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
                {/* Header/Cover Placeholder */}
                <div className="h-32 bg-gradient-to-r from-emerald-500 to-green-600 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
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
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    {/* Success Message Alert */}
                    {successMessage && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                            <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" />
                            <span className="font-medium">{successMessage}</span>
                        </div>
                    )}

                    {/* Email Confirmation Warning */}
                    {!user.confirmed_user && (
                        <EmailConfirmationWarning email={user.email} />
                    )}

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-emerald-950">
                                {t('profile.viewTitle')}
                            </h1>
                            <p className="text-stone-500 text-sm">
                                {t('profile.viewSubtitle')}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-xl transition-all border border-emerald-100"
                        >
                            <Pencil className="w-4 h-4" />
                            <span>{t('profile.editProfile')}</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Email */}
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
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500 cursor-not-allowed text-sm"
                                />
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                                {t('profile.nameLabel')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIconOutlined className="w-5 h-5 text-stone-400" />
                                </div>
                                <input
                                    type="text"
                                    value={user.name}
                                    disabled
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500 cursor-not-allowed text-sm"
                                />
                            </div>
                        </div>

                        {/* Password Placeholder */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value="********"
                                    disabled
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500 cursor-not-allowed text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
