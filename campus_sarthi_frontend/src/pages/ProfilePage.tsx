import React, { useState } from 'react';
import { Mail, Phone, BookOpen, Calendar, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/authApi';

const roleColors: Record<string, string> = {
  admin: 'bg-red-50 text-danger',
  crew: 'bg-yellow-50 text-warning',
  student: 'bg-primary-light text-primary',
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.updateProfile({
        ...form,
        year: form.year ? parseInt(form.year) : null,
      });
      updateUser(res.data);
      setIsEditing(false);
      showToast('Profile updated!', 'success');
    } catch {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">My Profile</h1>
        <p className="text-sm text-muted mt-0.5">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-light text-primary font-bold text-2xl flex items-center justify-center mx-auto mb-4">
            {initials}
          </div>
          <h2 className="font-bold text-heading text-lg mb-1">{user.full_name}</h2>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
          <div className="mt-4 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Mail size={14} /> <span className="truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Phone size={14} /> {user.phone}
              </div>
            )}
            {user.branch && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <BookOpen size={14} /> {user.branch}
              </div>
            )}
            {user.year && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar size={14} /> Year {user.year}
              </div>
            )}
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-secondary w-full mt-5 text-sm">
              Edit Profile
            </button>
          )}
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 card p-6">
          {isEditing ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-heading">Edit Information</h3>
                <button onClick={() => setIsEditing(false)} className="p-1.5 text-muted hover:text-body rounded-lg hover:bg-surface transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Branch</label>
                    <select className="form-input" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
                      <option value="">Select Branch</option>
                      <option value="CS">Computer Science</option>
                      <option value="IT">Information Technology</option>
                      <option value="ENTC">Electronics & Telecom</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Year</label>
                    <select className="form-input" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                      <option value="">Select Year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Final Year</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-semibold text-heading mb-6">Account Details</h3>
              <div className="space-y-4">
                {[
                  { label: 'Full Name', value: user.full_name },
                  { label: 'Email Address', value: user.email },
                  { label: 'Phone Number', value: user.phone || 'Not provided' },
                  { label: 'Branch', value: user.branch || 'Not specified' },
                  { label: 'Year', value: user.year ? `Year ${user.year}` : 'Not specified' },
                  { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                    <span className="text-sm text-muted w-36 flex-shrink-0">{label}</span>
                    <span className="text-sm text-body font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
