import { 
  User, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export function Sidebar({ onLogout, isCollapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: t('sidebar.dashboard'), 
      path: '/',
      id: 'sidebar-dashboard'
    },
    { 
      icon: User, 
      label: t('sidebar.profile'), 
      path: '/profile',
      id: 'sidebar-profile'
    },
    { 
      icon: Bell, 
      label: t('sidebar.notifications'), 
      path: '/notifications',
      id: 'sidebar-notifications'
    },
    { 
      icon: Settings, 
      label: t('sidebar.settings'), 
      path: '/profile/edit',
      id: 'sidebar-settings'
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => onToggle(true)}
        />
      )}

      <aside 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-stone-200 transition-all duration-300 z-40 flex flex-col ${
          isCollapsed ? 'w-20 -translate-x-20 md:translate-x-0' : 'w-64 translate-x-0'
        }`}
      >
      {/* Toggle Button */}
      <button
        onClick={() => onToggle(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-stone-200 rounded-full flex items-center justify-center text-emerald-600 hover:text-emerald-700 hover:border-emerald-200 shadow-sm transition-all z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center rounded-xl transition-all duration-200 group relative ${
                isCollapsed ? 'justify-center h-12' : 'gap-3 p-3'
              } ${
                Active 
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50' 
                  : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-600'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className={`shrink-0 transition-colors duration-200 ${
                Active ? 'text-emerald-600' : 'text-stone-400 group-hover:text-emerald-500'
              }`} size={20} />
              
              {!isCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  {item.label}
                </span>
              )}
              
              {Active && !isCollapsed && (
                <div className="ml-auto w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-stone-100 pb-6">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl transition-all duration-200 group ${
            isCollapsed ? 'justify-center h-12' : 'gap-3 p-3'
          } text-red-500 hover:bg-red-50`}
          title={isCollapsed ? t('header.logout') : ''}
        >
          <LogOut className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" size={20} />
          {!isCollapsed && (
            <span className="font-medium text-sm whitespace-nowrap">
              {t('header.logout')}
            </span>
          )}
        </button>
      </div>
    </aside>
    </>
  );
}
