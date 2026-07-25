import React from 'react';
import { 
  FileText, 
  BarChart3, 
  PenTool, 
  HelpCircle, 
  History, 
  Sun, 
  Moon, 
  User as UserIcon, 
  Sparkles,
  LogOut,
  ChevronDown,
  Layout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ResumeIQLogo } from './ResumeIQLogo';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenProfile }) => {
  const { user, logout, activeTab, setActiveTab } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Layout },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analyzer', label: 'Resume Analyzer', icon: FileText, badge: 'AI' },
    { id: 'builder', label: 'AI Builder', icon: PenTool },
    { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="cursor-pointer" onClick={() => setActiveTab('landing')}>
            <ResumeIQLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-1 px-1.5 py-0.5 text-[9px] font-black rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Theme & User Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Dark/Light Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>

            {/* User Dropdown / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.displayName.charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {user.displayName.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.displayName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="mt-1.5 inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {user.targetRole?.trim() ? `Target Role: ${user.targetRole.trim()}` : 'Target Role: Not Selected'}
                      </span>
                    </div>

                    <button
                      id="menu-item-profile"
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      <span>Profile & Preferences</span>
                    </button>

                    <button
                      id="menu-item-logout"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-2 border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="sign-in-btn"
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
              >
                <UserIcon className="h-4 w-4" />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center space-x-1.5 py-2.5 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
;
