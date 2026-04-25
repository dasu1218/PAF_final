import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Command, ChevronRight, Globe, Github, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { cn } from '../../lib/utils';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('USER');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSwitch = (role: string) => {
    setSelectedRole(role);
    setError('');
  };

  const performLogin = async (loginEmail: string, loginPassword = 'password') => {
    setIsLoading(true);
    setError('');
    try {
      const data = await authService.login({ email: loginEmail, password: loginPassword });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Required fields are missing.');
      return;
    }
    performLogin(email, password);
  };

  return (
    <div className="min-h-screen flex bg-paper transition-colors duration-500 mesh-gradient selection:bg-accent/20">
      {/* Cinematic Identity Section */}
      <div className="hidden lg:flex lg:w-[45%] bg-ink p-16 flex-col justify-between relative overflow-hidden m-4 rounded-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-accent/30 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex flex-col h-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-24"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-ink shadow-2xl transition-transform hover:rotate-12">
              <Command size={24} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl text-white tracking-tight">CampusHub</span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">Enterprise OS</span>
            </div>
          </motion.div>

          <div className="mt-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8">
                The Future<br />
                <span className="text-accent italic serif-italic font-medium lowercase">is</span> Unified.
              </h1>
              <p className="text-xl text-white/50 max-w-sm leading-relaxed font-medium">
                Experience the world's most advanced campus orchestration framework.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              className="mt-16 flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.3em] text-white"
            >
              <span className="flex items-center gap-2"><Globe size={14} /> Global Node 01</span>
              <div className="w-12 h-px bg-white/20" />
              <span>Verified System</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern Authentication Interface */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="mb-12 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
               <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-xl">
                <Command size={20} />
              </div>
              <span className="font-black text-2xl text-ink">CampusHub</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-ink mb-4 flex items-center justify-center lg:justify-start gap-3">
              Auth Pulse <ChevronRight size={24} className="text-accent" />
            </h2>
            <p className="text-ink/40 font-semibold uppercase text-[11px] tracking-[0.1em]">Identity verification required for network access.</p>
          </div>

          <div className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border p-2 mb-10 shadow-xl flex gap-1">
            {['USER', 'TECHNICIAN', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={cn(
                  "flex-1 py-3.5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                  selectedRole === role 
                    ? "bg-ink text-white shadow-xl" 
                    : "text-ink/30 hover:text-ink/60 hover:bg-white/50"
                )}
              >
                {role}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-4 shadow-sm"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Credential Identity</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-card rounded-3xl focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm font-bold shadow-sm border border-transparent focus:border-border"
                  placeholder={selectedRole === 'ADMIN' ? 'admin@node.hub' : selectedRole === 'TECHNICIAN' ? 'tech@node.hub' : 'student@node.hub'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-14 py-5 bg-card rounded-3xl focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm font-bold shadow-sm border border-transparent focus:border-border"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-ink/20 hover:text-accent transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-[11px] font-black uppercase tracking-widest text-ink/30">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-lg bg-card border-none text-accent focus:ring-accent transition-all ring-offset-paper" />
                <span className="group-hover:text-ink">Trust session</span>
              </label>
              <a href="#" className="hover:text-accent transition-colors">Recovery Mode</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-accent text-white rounded-3xl font-black hover:bg-accent/90 transition-all duration-500 shadow-2xl shadow-accent/10 disabled:opacity-50 flex items-center justify-center gap-4 text-[13px] uppercase tracking-[0.2em] group overflow-hidden relative active:scale-[0.98]"
            >
              <span className="relative z-10">
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Establish Connection <ChevronRight size={18} className="inline-block group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
              <div className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <div className="relative flex items-center justify-center mb-10">
              <div className="w-full border-t border-border"></div>
              <span className="absolute px-6 bg-paper text-[10px] font-black uppercase tracking-[0.3em] text-ink/20">Secure Link</span>
            </div>

            <div className="flex gap-4 mb-12">
              <button 
                onClick={() => window.location.href = 'http://localhost:8081/oauth2/authorization/google'}
                className="flex-1 py-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-ink/40 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <div className="w-4 h-4 overflow-hidden rounded-full">
                  <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                </div> 
                Google Sign In
              </button>
              <button className="flex-1 py-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-ink/40 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-3">
                <Github size={16} /> GitHub
              </button>
            </div>

            <p className="text-ink/30 text-[11px] font-black uppercase tracking-[0.2em]">
              Node Access Required?{' '}
              <Link to={`/signup?role=${selectedRole}`} className="text-accent border-b border-accent/20 hover:border-accent pb-0.5 transition-all">Secure Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
