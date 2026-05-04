import { useState } from 'react';
import { Mail, Phone, BookOpen, Calendar, Save, X, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/authApi';

const ACCENT = '#10B981'; // Emerald green

const roleBadge: Record<string, { bg: string; color: string }> = {
  admin:   { bg: 'rgba(239,68,68,0.12)',   color: '#FCA5A5' },
  crew:    { bg: 'rgba(245,158,11,0.12)',  color: '#FCD34D' },
  student: { bg: 'rgba(16,185,129,0.12)',  color: '#6EE7B7' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    branch: user?.branch || '',
    year: user?.year?.toString() || '',
    phone: user?.phone || '',
  });

  if (!user) return null;

  const initials = user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const badge = roleBadge[user.role] || roleBadge.student;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.updateProfile({ ...form, year: form.year ? parseInt(form.year) : null });
      updateUser(res.data);
      setIsEditing(false);
      showToast('Profile updated!', 'success');
    } catch {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header strip */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show"
        className="rounded-2xl p-5 mb-7"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.03) 100%)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
            <User size={15} style={{ color: ACCENT }} />
          </div>
          <h1 className="text-lg font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>My Profile</h1>
        </div>
        <p className="text-xs" style={{ color: '#64748B' }}>Manage your account information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          className="rounded-2xl p-6 text-center"
          style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #059669)` }}
          >
            {initials}
          </div>
          <h2 className="font-bold text-white text-base mb-2">{user.full_name}</h2>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color }}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
          <div className="mt-5 space-y-2.5 text-left">
            {[
              { icon: <Mail size={13} />, text: user.email },
              ...(user.phone ? [{ icon: <Phone size={13} />, text: user.phone }] : []),
              ...(user.branch ? [{ icon: <BookOpen size={13} />, text: user.branch }] : []),
              ...(user.year ? [{ icon: <Calendar size={13} />, text: `Year ${user.year}` }] : []),
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
                {icon} <span className="truncate">{text}</span>
              </div>
            ))}
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{ background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}30` }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${ACCENT}28`)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = `${ACCENT}18`)}
            >
              Edit Profile
            </button>
          )}
        </motion.div>

        {/* Detail / Edit Panel */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
        >
          {isEditing ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-sm">Edit Information</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
                  style={{ color: '#475569' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Full Name', key: 'full_name', type: 'input', placeholder: 'Your name' },
                  { label: 'Phone', key: 'phone', type: 'input', placeholder: '10-digit number' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                    <input
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                      style={inputStyle}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      onFocus={(e) => (e.currentTarget.style.borderColor = `${ACCENT}50`)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: 'Branch', key: 'branch',
                      options: [['', 'Select Branch'], ['CS', 'Computer Science'], ['IT', 'Information Technology'], ['ENTC', 'Electronics & Telecom'], ['Mechanical', 'Mechanical'], ['Civil', 'Civil'], ['Other', 'Other']],
                    },
                    {
                      label: 'Year', key: 'year',
                      options: [['', 'Select Year'], ['1', 'First Year'], ['2', 'Second Year'], ['3', 'Third Year'], ['4', 'Final Year']],
                    },
                  ].map(({ label, key, options }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                      <select
                        className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200"
                        style={{ ...inputStyle, appearance: 'none' }}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        onFocus={(e) => (e.currentTarget.style.borderColor = `${ACCENT}50`)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                      >
                        {options.map(([v, l]) => <option key={v} value={v} style={{ background: '#141B2D' }}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid #1E2A45' }}
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSave} disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.15 }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #059669)`, color: 'white' }}
                >
                  {isLoading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={13} /> Save Changes</>}
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold text-white text-sm mb-6">Account Details</h3>
              <div className="space-y-0">
                {[
                  { label: 'Full Name', value: user.full_name },
                  { label: 'Email Address', value: user.email },
                  { label: 'Phone Number', value: user.phone || 'Not provided' },
                  { label: 'Branch', value: user.branch || 'Not specified' },
                  { label: 'Year', value: user.year ? `Year ${user.year}` : 'Not specified' },
                  { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4 py-3.5" style={{ borderBottom: '1px solid #1A2236' }}>
                    <span className="text-xs w-32 flex-shrink-0 font-medium" style={{ color: '#334155' }}>{label}</span>
                    <span className="text-xs font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
