import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, User, Languages } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { User as UserType } from '../../types/auth';
import { NotificationBell } from '../ui/NotificationBell';

interface HeaderProps {
    user: UserType;
    onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'pt' : 'en';
        i18n.changeLanguage(newLang);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="w-full h-16 backdrop-blur-md bg-white/70 border-b border-stone-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
                {/* Application Name */}
                <Link 
                    to="/"
                    className="flex items-center space-x-2 group cursor-pointer"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-emerald-950 tracking-tight">
                        {t('header.appTitle')}<span className="text-emerald-600 font-medium">{t('header.appSubtitle')}</span>
                    </span>
                </Link>

                {/* Notifications and User Area */}
                <div className="flex items-center gap-3">
                    <NotificationBell 
                        userEmail={user.email} 
                        isEmailConfirmed={user.confirmed_user} 
                    />
                    
                    <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-3 p-1 rounded-full hover:bg-stone-100 transition-all duration-300 group"
                    >
                        {/* User Info */}
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-emerald-950 leading-none">
                                {user.name}
                            </p>
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                            {user.avatarUrl ? (
                                <img 
                                    src={user.avatarUrl} 
                                    alt={user.name} 
                                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/20 group-hover:border-emerald-500 transition-colors"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500/20 group-hover:border-emerald-500 transition-colors">
                                    <User className="w-5 h-5 text-emerald-700" />
                                </div>
                            )}
                        </div>

                        <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-stone-200 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Header */}
                            <div className="px-4 py-3 sm:hidden border-b border-stone-100 mb-1">
                                <p className="text-sm font-semibold text-emerald-950 line-clamp-1">{user.name}</p>
                                <p className="text-xs text-stone-500 line-clamp-1">{user.email}</p>
                            </div>

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate('/profile');
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-emerald-700 transition-colors text-left"
                            >
                                <User className="w-4 h-4 text-emerald-500" />
                                <span>{t('header.profile')}</span>
                            </button>

                            <button
                                onClick={toggleLanguage}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-emerald-700 transition-colors text-left"
                            >
                                <Languages className="w-4 h-4 text-emerald-500" />
                                <span>{i18n.language === 'en' ? 'Português' : 'English'}</span>
                            </button>

                            <div className="h-px bg-stone-100 my-1 mx-2" />

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    onLogout();
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>{t('header.logout')}</span>
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </header>
    );
}
