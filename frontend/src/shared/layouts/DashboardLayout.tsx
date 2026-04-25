import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Search,
  User,
  Settings,
  Sun,
  Moon,
  Megaphone,
  ChevronRight,
  Command,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../../lib/utils';

export const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminOrTech = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN';

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Campus Pulse', path: '/' },
    
    // Management Tools (Role Specific)
    ...(user?.role === 'ADMIN' ? [
      { icon: <Layout size={18} />, label: 'Admin Console', path: '/admin/overview' },
      { icon: <Settings size={18} />, label: 'Resources', path: '/admin/resources' },
      { icon: <Calendar size={18} />, label: 'Manage Bookings', path: '/admin/bookings' },
      { icon: <Megaphone size={18} />, label: 'Publish Notice', path: '/admin/notices' }
    ] : []),
    ...(user?.role === 'TECHNICIAN' ? [
      { icon: <Layout size={18} />, label: 'Tech Console', path: '/technician/overview' },
      { icon: <Ticket size={18} />, label: 'Task Inbox', path: '/technician/tickets' }
    ] : []),

    // Universal Campus Services
    { icon: <Calendar size={18} />, label: 'Book Facility', path: '/bookings' },
    { icon: <Calendar size={18} />, label: 'My Bookings', path: '/my-bookings' },
    { icon: <Ticket size={18} />, label: 'Support Tickets', path: '/tickets' },
    { icon: <Bell size={18} />, label: 'Notifications', path: '/notifications' },
  ];

  const NavLinks = ({ className, itemClassName }: { className?: string, itemClassName?: (isActive: boolean) => string }) => (
    <nav className={className}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) => itemClassName ? itemClassName(isActive) : cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative text-[13px] font-medium",
            isActive 
              ? "bg-accent text-white shadow-lg shadow-accent/20" 
              : "text-ink/50 hover:text-ink hover:bg-surface"
          )}
        >
          <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
            {item.icon}
          </span>
          <span className="relative font-semibold">
            {item.label}
          </span>
          {location.pathname === item.path && (
            <motion.div 
              layoutId="nav-pill"
              className="absolute inset-0 bg-accent rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className={cn(
      "min-h-screen bg-paper text-ink font-sans flex transition-colors duration-500 mesh-gradient",
      isAdminOrTech ? "flex-row" : "flex-col"
    )}>
      {/* Sidebar for Admin/Technician */}
      {isAdminOrTech && (
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 z-50 p-6">
          <div className="flex flex-col h-full bg-card rounded-3xl border border-border shadow-premium overflow-hidden">
            <div className="p-8">
              <div 
                onClick={() => navigate('/')} 
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xl shadow-accent/20 text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Command size={22} />
                  </div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-black text-xl text-ink tracking-tight">Campus</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Hub.OS</span>
                </div>
              </div>
            </div>

            <div className="flex-1 px-4 py-4 overflow-y-auto">
              <NavLinks 
                className="flex flex-col gap-1.5" 
                itemClassName={(isActive) => cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group text-[13px] font-semibold relative",
                  isActive 
                    ? "text-white" 
                    : "text-ink/40 hover:text-ink hover:bg-surface"
                )}
              />
            </div>

            <div className="p-6 border-t border-border">
              <div className="bg-surface/50 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <User size={14} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[11px] font-bold text-ink truncate uppercase tracking-tight">{user?.name}</p>
                    <p className="text-[9px] font-bold text-accent/60 uppercase tracking-widest">{user?.role}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-ink/30 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[13px] font-bold">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-paper/40 backdrop-blur-2xl border-b border-border/5 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
          <div className="flex items-center gap-12">
            {!isAdminOrTech && (
              <div 
                onClick={() => navigate('/')} 
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xl shadow-accent/20 text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Command size={22} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-black text-xl text-ink tracking-tight">Campus</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Hub.OS</span>
                </div>
              </div>
            )}

            {!isAdminOrTech && (
              <NavLinks className="hidden lg:flex items-center gap-1.5" />
            )}
            
            {isAdminOrTech && (
              <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/20">
                <span>Management</span>
                <ChevronRight size={12} />
                <span className="text-ink/40">{location.pathname === '/' ? 'Overview' : location.pathname.split('/').pop()}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6 md:gap-8">
            {/* Search removed for minimalism */}
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-ink/30 hover:bg-surface transition-all duration-300 hover:text-accent hover:rotate-12"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              <div className="flex items-center gap-4 pl-4 border-l border-border">
                <div className="relative" ref={profileMenuRef}>
                  <div 
                    className="group cursor-pointer" 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent border-2 border-paper rounded-full shadow-glow" />
                  </div>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-card/80 backdrop-blur-2xl border border-border rounded-2xl shadow-premium z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-border bg-surface/30">
                          <p className="text-[11px] font-bold text-accent uppercase tracking-widest mb-1">{user?.role}</p>
                          <p className="text-sm font-black text-ink uppercase tracking-tight truncate">{user?.name}</p>
                          <p className="text-[10px] text-ink/40 truncate mt-0.5">{user?.email || 'user@campus.hub'}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              navigate('/dashboard');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-ink/60 hover:text-ink hover:bg-surface transition-all duration-200"
                          >
                            <User size={16} />
                            <span>My Profile</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              toggleTheme();
                            }}
                            className="w-full lg:hidden flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-ink/60 hover:text-ink hover:bg-surface transition-all duration-200"
                          >
                            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                            <span>Toggle Theme</span>
                          </button>
                        </div>
                        <div className="p-2 border-t border-border bg-red-500/5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                          >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex lg:hidden">
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2.5 hover:bg-surface rounded-xl transition-all text-ink/60"
                  >
                    {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden fixed inset-0 top-20 bg-card/95 backdrop-blur-2xl z-40 p-8 flex flex-col gap-6"
            >
              <NavLinks 
                className="flex flex-col gap-2" 
                itemClassName={(isActive) => cn(
                  "flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 text-[15px] font-bold relative",
                  isActive 
                    ? "bg-accent text-white shadow-xl shadow-accent/20" 
                    : "text-ink/40 hover:text-ink hover:bg-surface"
                )}
              />
              <div className="mt-auto pt-8 border-t border-border">
                <div className="flex items-center gap-4 mb-8 p-4 bg-surface rounded-2xl">
                  <div className="w-12 h-12 rounded-xl border border-border overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" />
                  </div>
                  <div>
                    <p className="font-black text-ink uppercase tracking-tight">{user?.name}</p>
                    <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-4 px-6 py-5 rounded-2xl bg-red-500/10 text-red-500 font-bold transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
