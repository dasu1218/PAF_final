import React, { useState } from 'react';
import { authApi } from '../api/authApi';
import type { AuthUser } from '../types/Auth';
import { ArrowRight, Building2, CheckCircle2, LogIn, Mail, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser) => void;
}

type AuthMode = 'login' | 'signup';

const benefits = [
  'Access the resource catalogue instantly',
  'Keep admin operations behind a sign-in wall',
  'Save your session for quicker return visits',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();

      const user = mode === 'login'
        ? await authApi.login({ email: normalizedEmail, password: formData.password })
        : await authApi.signup({ name: formData.name.trim(), email: normalizedEmail, password: formData.password });

      onAuthenticated(user);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8 text-primary sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-16 h-80 w-80 rounded-full bg-[#F27D26]/18 blur-3xl" />
        <div className="absolute right-0 top-8 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.07)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
            <Sparkles className="h-3.5 w-3.5 text-[#F27D26]" />
            Campus resource platform
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Sign in to manage campus resources with clarity.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-secondary sm:text-lg">
            Login gives you access to the catalogue and admin workspace. Create an account to save your session and start managing resources immediately.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: Building2, title: 'Structured overview', copy: 'Clear resource navigation for campus spaces.' },
              { icon: ShieldCheck, title: 'Simple access control', copy: 'Authenticated entry to the app shell.' },
              { icon: CheckCircle2, title: 'Fast return visits', copy: 'Session persists in the browser.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-secondary">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="border-b border-border/70 px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.28em] text-secondary">Authentication</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                {mode === 'login' ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 rounded-full border border-border/70 bg-background/70 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  mode === 'login' ? 'bg-[#F27D26] text-white shadow-lg shadow-[#F27D26]/20' : 'text-secondary'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  mode === 'signup' ? 'bg-[#F27D26] text-white shadow-lg shadow-[#F27D26]/20' : 'text-secondary'
                }`}
              >
                Sign up
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border/70 bg-input/90 py-3 pl-11 pr-4 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-border/70 bg-input/90 px-4 py-3 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F27D26] px-6 py-3.5 font-medium text-white shadow-lg shadow-[#F27D26]/25 transition hover:-translate-y-0.5 hover:bg-[#ff9548] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login to continue' : 'Create account'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-secondary">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-primary shadow-sm transition hover:bg-input hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google Login
            </button>

            <p className="text-center text-sm text-secondary">
              {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-medium text-[#F27D26] hover:text-[#ff9548]"
              >
                {mode === 'login' ? 'Sign up now' : 'Login'}
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};