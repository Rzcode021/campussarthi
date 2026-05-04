import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { authApi } from '../services/authApi';

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', branch: '', year: '', phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.register({
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      const data = axiosErr?.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,215,0,0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(255,215,0,0.06), 0 24px 48px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <CheckCircle size={32} style={{ color: '#FFD700' }} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
        <p className="text-sm leading-relaxed max-w-sm mx-auto mb-8" style={{ color: '#9CA3AF' }}>
          Your account is under review. You'll be able to login once the placement team approves your request.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold text-sm transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}
        >
          ← Back to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden p-8 w-full max-w-lg mx-auto"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,215,0,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 40px rgba(255,215,0,0.06), 0 24px 48px rgba(0,0,0,0.4)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)' }} />

      <motion.button
        whileHover={{ x: -3 }}
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors duration-200"
        style={{ color: '#6B7280' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FFD700')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6B7280')}
      >
        <ArrowLeft size={13} /> Back
      </motion.button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
            <Sparkles size={14} className="text-black" />
          </div>
          <span className="font-bold text-sm" style={{ color: '#FFD700' }}>Campus Sarthi</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>Request Access</h1>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Your request will be reviewed by the placement team.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Full Name</label>
          <input name="full_name" type="text" className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="Your full name" value={formData.full_name} onChange={handleChange} required onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Email Address</label>
          <input name="email" type="email" className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="you@college.edu" value={formData.email} onChange={handleChange} required onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Password</label>
          <input name="password" type="password" className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="Minimum 6 characters" value={formData.password} onChange={handleChange} required minLength={6} onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Branch</label>
            <select name="branch" className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200 appearance-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} value={formData.branch} onChange={handleChange} required>
              <option value="" className="text-black">Select Branch</option>
              <option value="CS" className="text-black">Computer Science</option>
              <option value="IT" className="text-black">Information Technology</option>
              <option value="ENTC" className="text-black">Electronics & Telecom</option>
              <option value="Mechanical" className="text-black">Mechanical</option>
              <option value="Civil" className="text-black">Civil</option>
              <option value="CyberSecurity" className="text-black">CyberSecurity</option>
              <option value="MBA" className="text-black">MBA</option>
              <option value="Other" className="text-black">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Year</label>
            <select name="year" className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200 appearance-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} value={formData.year} onChange={handleChange} required>
              <option value="" className="text-black">Select Year</option>
              <option value="1" className="text-black">First Year</option>
              <option value="2" className="text-black">Second Year</option>
              <option value="3" className="text-black">Third Year</option>
              <option value="4" className="text-black">Final Year</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Phone Number</label>
          <input name="phone" type="tel" className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="10-digit phone number" value={formData.phone} onChange={handleChange} onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
            {error}
          </motion.div>
        )}

        <motion.button type="submit" disabled={isLoading} whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0B0B0B', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Send size={15} /> Submit Request</>
          )}
        </motion.button>
      </form>

      <p className="text-xs text-center mt-6" style={{ color: '#9CA3AF' }}>
        Already have access?{' '}
        <Link to="/login" className="font-semibold transition-colors duration-200" style={{ color: '#FFD700' }}>
          Sign In →
        </Link>
      </p>
    </motion.div>
  );
}
