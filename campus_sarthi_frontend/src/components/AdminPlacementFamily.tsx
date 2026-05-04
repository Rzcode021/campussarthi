import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, Users } from 'lucide-react';
import { placementFamilyApi } from '../services/crewApi';
import type { PlacementMember } from './PlacementFamilySection';
import { useToast } from '../context/ToastContext';

const ROLE_OPTIONS: PlacementMember['role'][] = ['Faculty', 'Mentor', 'Lead', 'Crew'];

const ROLE_COLOR: Record<PlacementMember['role'], string> = {
  Faculty: '#3B82F6',
  Mentor: '#6366F1',
  Lead: '#06B6D4',
  Crew: '#0EA5E9',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

type FormState = {
  name: string;
  role: PlacementMember['role'];
  hierarchy_level: number;
  imageFile: File | null;
  imagePreview: string | null;
};

const DEFAULT_FORM: FormState = {
  name: '',
  role: 'Crew',
  hierarchy_level: 3,
  imageFile: null,
  imagePreview: null,
};

export default function AdminPlacementFamily() {
  const [members, setMembers] = useState<PlacementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    placementFamilyApi
      .adminGetAll()
      .then((r) => setMembers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (m: PlacementMember) => {
    setForm({
      name: m.name,
      role: m.role,
      hierarchy_level: m.hierarchy_level,
      imageFile: null,
      imagePreview: m.image || null,
    });
    setEditingId(m.id);
    setShowModal(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageFile: file, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Name is required.', 'error'); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('role', form.role);
    fd.append('hierarchy_level', String(form.hierarchy_level));
    if (form.imageFile) fd.append('image', form.imageFile);

    try {
      if (editingId) {
        await placementFamilyApi.update(editingId, fd);
        showToast('Member updated!', 'success');
      } else {
        await placementFamilyApi.create(fd);
        showToast('Member added!', 'success');
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Remove this member from the Placement Family?')) return;
    setDeletingId(id);
    try {
      await placementFamilyApi.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast('Member removed.', 'success');
    } catch {
      showToast('Delete failed.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const grouped: Record<PlacementMember['role'], PlacementMember[]> = {
    Lead: [],
    Faculty: [],
    Mentor: [],
    Crew: [],
  };
  members.forEach((m) => {
    if (grouped[m.role]) grouped[m.role].push(m);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-heading text-lg flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Manage Placement Family
          </h2>
          <p className="text-xs text-muted mt-0.5">{members.length} members · All roles</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#3B82F6', borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* Empty */}
      {!loading && members.length === 0 && (
        <div className="card py-16 text-center">
          <Users size={40} className="mx-auto mb-3 text-muted opacity-30" />
          <p className="text-muted text-sm">No members yet. Click "Add Member" to get started.</p>
        </div>
      )}

      {/* Member Groups */}
      {!loading && members.length > 0 && (
        <div className="space-y-6">
          {(Object.keys(grouped) as PlacementMember['role'][]).map((role) => {
            const group = grouped[role];
            if (group.length === 0) return null;
            const color = ROLE_COLOR[role];
            return (
              <div key={role} className="card overflow-hidden">
                <div
                  className="px-5 py-3 border-b border-border flex items-center gap-2"
                  style={{ background: `${color}08` }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: color,
                      boxShadow: `0 0 8px ${color}`,
                      display: 'inline-block',
                    }}
                  />
                  <h3 className="font-bold text-sm" style={{ color }}>
                    {role === 'Lead' ? 'Placement Crew Lead' : role === 'Faculty' ? 'Faculty' : role === 'Mentor' ? 'T&P Mentors' : 'Placement Crew'}
                  </h3>
                  <span className="text-xs text-muted ml-auto">({group.length})</span>
                </div>
                <div className="divide-y divide-border">
                  {group
                    .sort((a, b) => a.hierarchy_level - b.hierarchy_level)
                    .map((m) => {
                      const initials = getInitials(m.name);
                      return (
                        <div
                          key={m.id}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface/30 transition-colors"
                        >
                          {/* Avatar */}
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: `2px solid ${color}60`,
                              boxShadow: `0 0 10px ${color}30`,
                              background: `${color}12`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 13,
                              fontWeight: 700,
                              color,
                              flexShrink: 0,
                            }}
                          >
                            {m.image ? (
                              <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              initials
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-heading text-sm truncate">{m.name}</p>
                            <p className="text-xs text-muted">Level {m.hierarchy_level} · {m.role}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(m)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(m.id)}
                              disabled={deletingId === m.id}
                              className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === m.id ? (
                                <div className="w-3 h-3 border border-danger border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
            onClick={() => !saving && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-bold text-heading text-base">
                  {editingId ? 'Edit Member' : 'Add New Member'}
                </h3>
                <button onClick={() => !saving && setShowModal(false)} className="text-muted hover:text-body">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-5">
                {/* Image Upload */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      border: `2px dashed ${form.imagePreview ? ROLE_COLOR[form.role] : '#CBD5E1'}`,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: form.imagePreview ? 'transparent' : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: form.imagePreview ? `0 0 20px ${ROLE_COLOR[form.role]}40` : 'none',
                    }}
                  >
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload size={20} className="text-muted" />
                        <span className="text-[10px] text-muted">Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                  <p className="text-xs text-muted">Click to upload profile photo</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Full Name *</label>
                  <input
                    className="form-input w-full"
                    placeholder="e.g. Dr. Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Role *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, role: r }))}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 10,
                          border: `2px solid ${form.role === r ? ROLE_COLOR[r] : '#E2E8F0'}`,
                          background: form.role === r ? `${ROLE_COLOR[r]}10` : '#F8FAFC',
                          color: form.role === r ? ROLE_COLOR[r] : '#64748b',
                          fontWeight: form.role === r ? 700 : 500,
                          fontSize: 13,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          boxShadow: form.role === r ? `0 0 10px ${ROLE_COLOR[r]}30` : 'none',
                        }}
                      >
                        {r === 'Lead' ? '⭐ Lead' : r === 'Faculty' ? '🎓 Faculty' : r === 'Mentor' ? '🏆 Mentor' : '👥 Crew'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hierarchy Level */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">
                    Hierarchy Level <span className="text-muted font-normal">(1 = top, higher = lower in tree)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={form.hierarchy_level}
                      onChange={(e) => setForm((f) => ({ ...f, hierarchy_level: +e.target.value }))}
                      className="flex-1"
                      style={{ accentColor: ROLE_COLOR[form.role] }}
                    />
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ background: `${ROLE_COLOR[form.role]}15`, color: ROLE_COLOR[form.role] }}
                    >
                      {form.hierarchy_level}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !saving && setShowModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving…
                      </span>
                    ) : editingId ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
