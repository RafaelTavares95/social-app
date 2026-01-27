import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, X, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Notification, NotificationType } from '../../types/notification';

interface NotificationBellProps {
  userEmail?: string;
  isEmailConfirmed?: boolean;
}

export function NotificationBell({ userEmail, isEmailConfirmed }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Estado para rastrear notificações marcadas como lidas nesta sessão
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  // Gera notificações baseadas no estado do usuário
  const notifications = useMemo<Notification[]>(() => {
    const generatedNotifications: Notification[] = [];

    // Notificação de email não confirmado
    if (!isEmailConfirmed && userEmail) {
      const notificationId = 'email-confirmation';
      const isRead = readNotifications.has(notificationId) || 
                     localStorage.getItem(`notification-${notificationId}-read`) === 'true';
      
      generatedNotifications.push({
        id: notificationId,
        type: 'email_confirmation',
        title: t('notifications.emailConfirmation.title'),
        message: t('notifications.emailConfirmation.message'),
        read: isRead,
        createdAt: new Date(),
        actionUrl: '/profile',
      });
    }

    return generatedNotifications;
  }, [isEmailConfirmed, userEmail, t, readNotifications]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setReadNotifications(prev => new Set(prev).add(notificationId));
    localStorage.setItem(`notification-${notificationId}-read`, 'true');
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadNotifications(allIds);
    notifications.forEach(notif => {
      localStorage.setItem(`notification-${notif.id}-read`, 'true');
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'email_confirmation':
        return <Mail className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'email_confirmation':
        return 'text-amber-600 bg-amber-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      case 'success':
        return 'text-emerald-600 bg-emerald-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-300 ${
          unreadCount > 0
            ? 'text-emerald-700 hover:text-emerald-800'
            : 'text-stone-600 hover:text-stone-700'
        }`}
        aria-label={t('notifications.bellAriaLabel')}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-stone-200 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-950">
              {t('notifications.title')}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-500">{t('notifications.empty')}</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-emerald-50/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${getNotificationColor(notification.type)} shrink-0`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-emerald-950 line-clamp-1">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-stone-400">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

