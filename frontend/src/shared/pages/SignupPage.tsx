import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, Command, ChevronRight, Globe, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authService } from '../services/authService';
import { cn } from '../../lib/utils';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'USER';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole
  });

  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      setFormData(prev => ({ ...prev, role }));
    }
  }, [searchParams]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) return 'All network parameters are required.';
    if (!formData.email.includes('@')) return 'Invalid terminal identity format.';
    if (formData.password.length < 6) return 'Access key security too weak (min 6 chars).';
    if (formData.password !== formData.confirmPassword) return 'Access keys do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration sequence failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-paper transition-colors duration-500 mesh-gradient selection:bg-accent/20 overflow-hidden">
      {/* Cinematic Identity Section */}
      <div className="hidden lg:flex lg:w-[40%] bg-ink p-16 flex-col justify-between relative overflow-hidden m-4 rounded-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute -left-24 -top-24 w-96 h-96 bg-accent/30 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex flex-col h-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 mb-24 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-ink shadow-2xl">
              <Command size={24} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl text-white tracking-tight text-gradient bg-gradient-to-br from-white to-white/40">CampusHub</span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">Register Node</span>
            </div>
          </motion.div>

          <div className="mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter mb-8">
                Initialize<br />
                <span className="text-accent italic serif-italic font-medium lowercase text-gradient bg-gradient-to-br from-accent to-blue-300">New Identity</span>.
              </h1>
              <p className="text-lg text-white/50 max-w-sm leading-relaxed font-medium">
                Establish your footprint in the Smart Campus ecosystem.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              className="mt-16 flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.3em] text-white"
            >
              <span className="flex items-center gap-2"><Globe size={14} /> Node 00/INIT</span>
              <div className="w-12 h-px bg-white/20" />
              <span>Public Registry</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern Signup Interface */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full"
        >
          <div className="mb-12">
            <h2 className="text-5xl font-black tracking-tight text-ink mb-4 flex items-center gap-3">
              Registration <UserPlus size={40} className="text-accent" />
            </h2>
            <p className="text-ink/40 font-semibold uppercase text-[11px] tracking-[0.1em]">Provisioning new node on the hub network.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] text-[11px] font-bold uppercase tracking-wider flex items-center gap-4 shadow-sm"
              >
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Legal Alias</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-16 pr-8 py-4.5 bg-white rounded-[2rem] focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm font-bold shadow-sm border border-transparent focus:border-border"
                  placeholder="Hedy Lamarr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Network Identity</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-16 pr-8 py-4.5 bg-white rounded-[2rem] focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm font-bold shadow-sm border border-transparent focus:border-border"
                  placeholder="hedy@hub.network"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Node Class</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-16 pr-12 py-4.5 bg-card rounded-[2rem] focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm font-bold shadow-sm border border-transparent focus:border-border appearance-none cursor-pointer"
                >
                  <option value="USER">Student Node</option>
                  <option value="TECHNICIAN">Technician Node</option>
                  <option value="ADMIN">System Admin</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-ink/20 rotate-90 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Security Phrase</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-16 pr-14 py-4.5 bg-card rounded-[2rem] focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm font-bold shadow-sm border border-transparent focus:border-border"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-ink/20 hover:text-accent transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 ml-4">Verify Security Phrase</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-16 pr-14 py-4.5 bg-card rounded-[2rem] focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm font-bold shadow-sm border border-transparent focus:border-border"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-ink/20 hover:text-accent transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-accent text-white rounded-[2rem] font-black hover:bg-accent transition-all duration-500 shadow-2xl shadow-accent/10 disabled:opacity-50 flex items-center justify-center gap-4 text-[14px] uppercase tracking-[0.25em] group overflow-hidden relative active:scale-[0.98]"
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Initialize Registry <ArrowRight size={20} className="inline-block group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-ink/30 text-[11px] font-black uppercase tracking-[0.2em]">
            Identity already exists?{' '}
            <Link to="/login" className="text-accent border-b border-accent/20 hover:border-accent pb-0.5 transition-all">Relink Node</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
