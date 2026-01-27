import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  MoreVertical,
  Check,
  ArrowUpDown
} from 'lucide-react';
import type { Notification, NotificationType } from '../../types/notification';

// Mock data generator for demonstration
const generateMockNotifications = (count: number): Notification[] => {
  const types: NotificationType[] = ['email_confirmation', 'info', 'warning', 'success'];
  return Array.from({ length: count }, (_, i) => ({
    id: `notif-${i}`,
    type: types[i % types.length],
    title: `Notification ${i + 1}`,
    message: `This is the message for notification number ${i + 1}. It contains some information that the user might find useful.`,
    read: false, // Reading state will be handled by readIds
    createdAt: new Date(Date.now() - i * 3600000 * 2), // staggered by 2 hours
    actionUrl: i % 3 === 0 ? '/profile' : undefined
  }));
};

const ITEMS_PER_PAGE = 8;

type SortOrder = 'newest' | 'oldest';

export function NotificationsPage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOrder>('newest');
  
  // Estado para rastrear notificações marcadas como lidas
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    // Inicializa a partir do localStorage para manter sincronia com o sino
    const saved = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('notification-') && key?.endsWith('-read')) {
            const id = key.replace('notification-', '').replace('-read', '');
            if (localStorage.getItem(key) === 'true') {
                saved.add(id);
            }
        }
    }
    return saved;
  });

  // Mantém sincronia com outras abas/componentes
  useEffect(() => {
    const handleStorage = () => {
        const saved = new Set<string>();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('notification-') && key?.endsWith('-read')) {
                const id = key.replace('notification-', '').replace('-read', '');
                if (localStorage.getItem(key) === 'true') {
                    saved.add(id);
                }
            }
        }
        setReadIds(saved);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Em um app real, isso viria de uma API
  const rawNotifications = useMemo(() => generateMockNotifications(45), []);

  const allNotifications = useMemo(() => {
    // Sincroniza o estado de 'lida' das notificações mockadas
    const notifications = rawNotifications.map(n => ({
        ...n,
        read: readIds.has(n.id)
    }));
    
    // Ordenação baseada na escolha do usuário
    return notifications.sort((a, b) => {
        const timeA = a.createdAt.getTime();
        const timeB = b.createdAt.getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [rawNotifications, readIds, sortBy]);

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter(n => {
      const matchesFilter = filter === 'all' || n.type === filter;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allNotifications, filter, searchQuery]);

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const markAsRead = (id: string) => {
    if (readIds.has(id)) return;
    const newReadIds = new Set(readIds).add(id);
    setReadIds(newReadIds);
    localStorage.setItem(`notification-${id}-read`, 'true');
  };

  const markAllAsRead = () => {
    const unreadFiltered = filteredNotifications.filter(n => !n.read);
    if (unreadFiltered.length === 0) return;

    const newReadIds = new Set(readIds);
    unreadFiltered.forEach(n => {
        newReadIds.add(n.id);
        localStorage.setItem(`notification-${n.id}-read`, 'true');
    });
    setReadIds(newReadIds);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'email_confirmation': return <Mail className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'success': return <CheckCircle2 className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'email_confirmation': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-stone-600 bg-stone-50 border-stone-100';
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            {t('notifications.historyTitle')}
          </h1>
          <p className="text-stone-500 mt-1">
            {t('notifications.historySubtitle')}
          </p>
        </div>
        
        {unreadCount > 0 && (
            <button 
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-xl border border-emerald-100 transition-all"
            >
                <Check className="w-4 h-4" />
                {t('notifications.markAllAsReadPage')}
            </button>
        )}
      </div>

      {/* Filters, Search and Sort */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder={t('notifications.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-stone-700"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            {/* Filter */}
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-400" />
                <select
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-600 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value as any);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">{t('notifications.filters.all')}</option>
                    <option value="email_confirmation">{t('notifications.filters.email')}</option>
                    <option value="info">{t('notifications.filters.info')}</option>
                    <option value="success">{t('notifications.filters.success')}</option>
                    <option value="warning">{t('notifications.filters.warning')}</option>
                </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-stone-400" />
                <select
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-600 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value as SortOrder);
                        setCurrentPage(1);
                    }}
                >
                    <option value="newest">{t('notifications.sort.newest')}</option>
                    <option value="oldest">{t('notifications.sort.oldest')}</option>
                </select>
            </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`group bg-white p-4 rounded-2xl border transition-all duration-300 hover:shadow-md cursor-pointer ${
                !notification.read ? 'border-emerald-200 bg-emerald-50/10' : 'border-stone-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl border ${getNotificationColor(notification.type)} shrink-0`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-emerald-950 truncate ${!notification.read ? 'text-emerald-900 font-bold' : ''}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {notification.createdAt.toLocaleDateString()}
                      </span>
                      {!notification.read && (
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title={t('notifications.unread')} />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 mt-1 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                    {notification.message}
                  </p>
                  {notification.actionUrl && (
                    <button className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                      {t('notifications.takeAction')}
                    </button>
                  )}
                </div>
                <button className="p-1 rounded-lg hover:bg-stone-50 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-100">
            <Bell className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900">{t('notifications.noHistory')}</h3>
            <p className="text-stone-500 mt-1">{t('notifications.tryAdjustingFilters')}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-sm text-stone-500 order-2 sm:order-1">
            {t('notifications.paginationInfo', {
              start: (currentPage - 1) * ITEMS_PER_PAGE + 1,
              end: Math.min(currentPage * ITEMS_PER_PAGE, filteredNotifications.length),
              total: filteredNotifications.length
            })}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const maxVisible = 3; // Number of pages to show around current
                
                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                
                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }

                // First page
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="hidden xs:flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(<span key="dots-1" className="px-1 text-stone-400">...</span>);
                  }
                }

                // Range
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center ${
                        currentPage === i
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                // Last page
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(<span key="dots-2" className="px-1 text-stone-400">...</span>);
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="hidden xs:flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
