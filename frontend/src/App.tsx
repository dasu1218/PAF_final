import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { HomePage } from './components/HomePage';
import { Catalogue } from './components/Catalogue';
import { AdminPanel } from './components/AdminPanel';
import { LayoutGrid, ShieldAlert, Sun, Moon, Home as HomeIcon, Sparkles } from 'lucide-react';
import type { AuthUser } from './types/Auth';

const AUTH_STORAGE_KEY = 'resource-app-user';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catalogue' | 'admin'>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check local storage or system preference on load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const activeTitle =
    activeTab === 'home'
      ? 'Smart Campus Operations Hub'
      : activeTab === 'catalogue'
        ? 'Resource Catalogue'
        : 'Admin Dashboard';

  const activeDescription =
    activeTab === 'home'
      ? 'A polished workspace for discovering and managing shared campus resources.'
      : activeTab === 'catalogue'
        ? 'Browse and filter available resources across all locations.'
        : 'Manage resources, update details, and monitor availability.';

  const handleAuthenticated = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setActiveTab('home');
  };

  if (!currentUser) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background text-primary font-sans transition-colors duration-300 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-[-6rem] h-72 w-72 rounded-full bg-[#F27D26]/15 blur-3xl" />
        <div className="absolute top-24 right-[-5rem] h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.07)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F27D26] to-[#ff9b4d] text-white shadow-lg shadow-[#F27D26]/20 ring-1 ring-white/20">
                <span className="font-display text-xl font-bold leading-none">S</span>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.32em] text-secondary">Campus resource platform</p>
                <h1 className="font-display text-2xl font-bold tracking-tight text-primary">Smart Campus Operations Hub</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-border/70 bg-surface/70 px-4 py-2 text-sm text-secondary sm:block">
                Signed in as <span className="font-medium text-primary">{currentUser.name}</span>
              </div>
              <nav className="flex rounded-full border border-border/80 bg-surface/80 p-1 shadow-sm shadow-black/5 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === 'home'
                      ? 'bg-[#F27D26] text-white shadow-lg shadow-[#F27D26]/25'
                      : 'text-secondary hover:bg-input hover:text-primary'
                  }`}
                >
                  <HomeIcon className="h-4 w-4" />
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('catalogue')}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === 'catalogue'
                      ? 'bg-[#F27D26] text-white shadow-lg shadow-[#F27D26]/25'
                      : 'text-secondary hover:bg-input hover:text-primary'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Catalogue
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#F27D26] text-white shadow-lg shadow-[#F27D26]/25'
                      : 'text-secondary hover:bg-input hover:text-primary'
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin
                </button>
              </nav>

              <button
                onClick={toggleTheme}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/80 text-secondary shadow-sm shadow-black/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:text-primary"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={handleLogout}
                className="rounded-full border border-border/70 bg-surface/80 px-4 py-2 text-sm font-medium text-secondary shadow-sm shadow-black/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:text-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main
        className={
          activeTab === 'home'
            ? 'relative w-full px-0 py-8'
            : 'relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10'
        }
      >
        {activeTab !== 'home' && (
          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,125,38,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]" />
            <div className="relative flex flex-col gap-8">
              <div className="max-w-3xl">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                  <Sparkles className="h-3.5 w-3.5 text-[#F27D26]" />
                  Resource management made clean
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {activeTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-secondary sm:text-lg">
                  {activeDescription}
                </p>
              </div>
            </div>
          </section>
        )}

        <div className={activeTab === 'home' ? '' : 'mt-8'}>
          {activeTab === 'home' ? (
            <HomePage
              onOpenCatalogue={() => setActiveTab('catalogue')}
              onOpenAdmin={() => setActiveTab('admin')}
            />
          ) : activeTab === 'catalogue' ? (
            <Catalogue />
          ) : (
            <AdminPanel />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
