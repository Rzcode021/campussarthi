import { useState } from 'react';
import { Mail, Phone, BookOpen, Calendar, Save, X, User, TrendingUp, Bookmark, Building2, FileText, Shield, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/authApi';

const ACCENT = '#10B981';

const roleBadge: Record<string, { bg: string; color: string; label: string }> = {
  admin:   { bg: 'rgba(239,68,68,0.14)',   color: '#FCA5A5', label: 'Administrator' },
  crew:    { bg: 'rgba(245,158,11,0.14)',  color: '#FCD34D', label: 'Crew Member'   },
  student: { bg: 'rgba(16,185,129,0.14)', color: '#6EE7B7', label: 'Student'        },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.36, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
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

  const initials = user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
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

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

  const recentActivity = [
    { icon: <Bookmark size={12} />, text: 'Bookmarked a resource', time: 'Recently', color: '#F472B6' },
    { icon: <Building2 size={12} />, text: 'Viewed company profile', time: 'Recently', color: '#818CF8' },
    { icon: <FileText size={12} />, text: 'Downloaded study material', time: 'Recently', color: '#6EE7B7' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg,#0D1A2E 0%,#162035 60%,#0A1220 100%)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute right-0 top-0 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg,#10B981,#059669)', boxShadow: '0 0 24px rgba(16,185,129,0.3)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
              {user.is_active && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(16,185,129,0.12)', color: '#34D399' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} /> Active
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>{user.full_name}</h1>
            <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
              {[user.branch, user.year ? `Year ${user.year}` : null].filter(Boolean).join(' · ') || 'Profile incomplete'}
            </p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0"
              style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${ACCENT}25`)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = `${ACCENT}15`)}>
              <Edit3 size={13} /> Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Profile Info */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.1}
          className="space-y-4">
          {/* Contact Info Card */}
          <div className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
            <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
              <User size={13} color={ACCENT} /><h3 className="font-bold text-white text-sm">Contact Information</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: <Mail size={13} />, label: 'Email', value: user.email },
                { icon: <Phone size={13} />, label: 'Phone', value: user.phone || 'Not provided' },
                { icon: <BookOpen size={13} />, label: 'Branch', value: user.branch || 'Not specified' },
                { icon: <Calendar size={13} />, label: 'Year', value: user.year ? `Year ${user.year}` : 'Not specified' },
                { icon: <Shield size={13} />, label: 'Role', value: badge.label },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,255,255,0.04)', color: '#64748B' }}>{icon}</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>{label}</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
            <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
              <TrendingUp size={13} color="#60A5FA" /><h3 className="font-bold text-white text-sm">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15`, color: a.color }}>{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">{a.text}</p>
                    <p className="text-[10px]" style={{ color: '#334155' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Journey + Edit Panel */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.15}
          className="lg:col-span-2 space-y-4">
          {/* Placement Journey Stats */}
          <div className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
            <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
              <TrendingUp size={13} color="#6EE7B7" /><h3 className="font-bold text-white text-sm">Placement Journey</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Bookmarks',     value: '—', icon: <Bookmark size={15} />, color: '#F472B6' },
                { label: 'Contributions', value: '—', icon: <FileText size={15} />, color: '#818CF8' },
                { label: 'Companies',     value: '—', icon: <Building2 size={15} />, color: '#67E8F9' },
                { label: 'Resources',     value: '—', icon: <BookOpen size={15} />, color: '#FCD34D' },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1A2236' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2.5" style={{ background: `${item.color}12`, color: item.color }}>{item.icon}</div>
                  <p className="text-xl font-extrabold text-white" style={{ letterSpacing: '-0.03em' }}>{item.value}</p>
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: '#475569' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details / Edit */}
          <div className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
            {isEditing ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-white text-sm">Edit Profile</h3>
                  <button onClick={() => setIsEditing(false)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: '#475569' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                    <X size={15} />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', key: 'full_name', placeholder: 'Your full name' },
                    { label: 'Phone', key: 'phone', placeholder: '10-digit number' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                      <input className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                        style={inputStyle} placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        onFocus={e => (e.currentTarget.style.borderColor = `${ACCENT}50`)}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: 'Branch', key: 'branch',
                        options: [['', 'Select Branch'], ['CS', 'Computer Science'], ['IT', 'Information Technology'], ['ENTC', 'Electronics & Telecom'], ['Mechanical', 'Mechanical'], ['Civil', 'Civil'], ['CyberSecurity', 'Cyber Security'], ['MBA', 'MBA'], ['Other', 'Other']],
                      },
                      {
                        label: 'Year', key: 'year',
                        options: [['', 'Select Year'], ['1', 'First Year'], ['2', 'Second Year'], ['3', 'Third Year'], ['4', 'Final Year']],
                      },
                    ].map(({ label, key, options }) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                        <select className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200"
                          style={{ ...inputStyle, appearance: 'none' as any }}
                          value={form[key as keyof typeof form]}
                          onChange={e => setForm({ ...form, [key]: e.target.value })}
                          onFocus={e => (e.currentTarget.style.borderColor = `${ACCENT}50`)}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                          {options.map(([v, l]) => <option key={v} value={v} style={{ background: '#141B2D' }}>{l}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid #1E2A45' }}>
                    Cancel
                  </button>
                  <motion.button onClick={handleSave} disabled={isLoading}
                    whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg,${ACCENT},#059669)`, color: 'white' }}>
                    {isLoading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={13} /> Save Changes</>}
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid #1E2A45' }}>
                  <h3 className="font-bold text-white text-sm">Account Details</h3>
                </div>
                <div className="space-y-0">
                  {[
                    { label: 'Full Name',    value: user.full_name },
                    { label: 'Email',        value: user.email },
                    { label: 'Phone',        value: user.phone || 'Not provided' },
                    { label: 'Branch',       value: user.branch || 'Not specified' },
                    { label: 'Year',         value: user.year ? `Year ${user.year}` : 'Not specified' },
                    { label: 'Role',         value: badge.label },
                    { label: 'Account Status', value: user.is_active ? 'Active' : 'Inactive' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-4 py-3.5" style={{ borderBottom: '1px solid #1A2236' }}>
                      <span className="text-xs w-32 flex-shrink-0 font-semibold" style={{ color: '#334155' }}>{label}</span>
                      <span className="text-xs font-semibold text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
