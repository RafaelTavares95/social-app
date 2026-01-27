import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/user.service';

interface EmailConfirmationWarningProps {
    email: string;
}

export function EmailConfirmationWarning({ email }: EmailConfirmationWarningProps) {
    const { t } = useTranslation();
    const [isResending, setIsResending] = useState(false);
    const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleResendConfirmation = async () => {
        setIsResending(true);
        setResendStatus('idle');
        try {
            await userService.resendConfirmation(email);
            setResendStatus('success');
        } catch (error) {
            console.error('Failed to resend confirmation:', error);
            setResendStatus('error');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-full shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-amber-900 font-semibold mb-1">{t('dashboard.emailConfirmation.title')}</h3>
                    <p className="text-amber-800 text-sm">
                        {t('dashboard.emailConfirmation.warning')}
                    </p>
                    {resendStatus === 'success' && (
                        <p className="text-emerald-600 text-sm mt-2 font-medium bg-emerald-50 px-2 py-1 rounded inline-block">
                            {t('dashboard.emailConfirmation.resendSuccess')}
                        </p>
                    )}
                    {resendStatus === 'error' && (
                        <p className="text-red-600 text-sm mt-2 font-medium bg-red-50 px-2 py-1 rounded inline-block">
                            {t('dashboard.emailConfirmation.resendError')}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={handleResendConfirmation}
                disabled={isResending || resendStatus === 'success'}
                className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-95"
            >
                {isResending ? t('common.loading') : t('dashboard.emailConfirmation.resend')}
            </button>
        </div>
    );
}

