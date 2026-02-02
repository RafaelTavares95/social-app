import { useTranslation } from 'react-i18next';
import type { User as UserType } from '../../types/auth';
import { EmailConfirmationWarning } from '../ui/EmailConfirmationWarning';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
    user: UserType;
}

export function Dashboard({ user }: DashboardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="relative z-10">
            {!user.confirmed && (
                <EmailConfirmationWarning email={user.email} />
            )}

            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-emerald-950 tracking-tight">
                {t('dashboard.welcomeBack', { name: user.name })}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-3 text-emerald-700">{t('dashboard.profileTitle')}</h3>
                    <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                        {t('dashboard.profileDesc')}
                    </p>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm"
                    >
                        {t('dashboard.viewDetails')}
                    </button>
                </div>

                {/* Recent Activity Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-3 text-emerald-700">{t('dashboard.activityTitle')}</h3>
                    <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                        {t('dashboard.activityDesc')}
                    </p>
                    <button 
                        onClick={() => navigate('/notifications')}
                        className="px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors text-sm font-semibold"
                    >
                        {t('dashboard.viewAll')}
                    </button>
                </div>

                {/* Community Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-3 text-emerald-700">{t('dashboard.communityTitle')}</h3>
                    <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                        {t('dashboard.communityDesc')}
                    </p>
                    <button className="px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors text-sm font-semibold">
                        {t('dashboard.explore')}
                    </button>
                </div>
            </div>
        </div>
    );
}
