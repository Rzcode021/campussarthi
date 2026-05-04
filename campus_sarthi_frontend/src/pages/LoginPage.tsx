import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr?.response?.data?.detail || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden p-8"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,215,0,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 40px rgba(255,215,0,0.06), 0 24px 48px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)' }}
      />

      {/* Back to Home */}
      <motion.button
        whileHover={{ x: -3 }}
        transition={{ duration: 0.15 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs font-medium mb-8 transition-colors duration-200"
        style={{ color: '#6B7280' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FFD700')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6B7280')}
      >
        <ArrowLeft size={13} /> Back to Home
      </motion.button>

      {/* Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
          >
            <Sparkles size={14} className="text-black" />
          </div>
          <span className="font-bold text-sm" style={{ color: '#FFD700' }}>Campus Sarthi</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
          Welcome back
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>Sign in to access your placement portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>
            Email address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4B5563' }} />
            <input
              type="email"
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>
            Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4B5563' }} />
            <input
              type="password"
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              required
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          transition={{ duration: 0.15 }}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#0B0B0B',
            boxShadow: '0 0 20px rgba(255,215,0,0.3)',
          }}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <><LogIn size={15} /> Sign In</>
          )}
        </motion.button>
      </form>

      <p className="text-xs text-center mt-6" style={{ color: '#4B5563' }}>
        Don't have access?{' '}
        <Link
          to="/request-access"
          className="font-semibold transition-colors duration-200"
          style={{ color: '#FFD700' }}
        >
          Request Access →
        </Link>
      </p>
    </motion.div>
  );
}
