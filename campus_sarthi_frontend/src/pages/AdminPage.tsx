import React, { useEffect, useState, useCallback } from 'react';
import { Users, Building2, FileText, ShieldCheck, Check, X, Plus, Upload, Trash2, Send, Save, BookOpen, Newspaper, Edit, Eye, Download } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { adminDocumentsApi } from '../services/companyDocumentsApi';
import type { User } from '../types/user';
import type { Company, AdminCompanyDocument } from '../types/company';
import type { StudyMaterial } from '../types/studyMaterial';
import { useToast } from '../context/ToastContext';
import CompanyWizard from '../components/CompanyWizard';
import { getDomainColor } from '../utils/companyAvatar';

type Tab = 'overview' | 'users' | 'companies' | 'materials' | 'documents' | 'news' | 'resources';

interface Stats {
  total_students: number;
  pending_approvals: number;
  total_companies: number;
  pending_companies: number;
  total_crew: number;
  avg_crew_rating: number;
  total_materials: number;
  pending_materials: number;
  total_resources: number;
  total_news: number;
  draft_companies: number;
  total_documents: number;
  pending_documents: number;
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [allMaterials, setAllMaterials] = useState<StudyMaterial[]>([]);
  const [allDocuments, setAllDocuments] = useState<AdminCompanyDocument[]>([]);
  const [allNews, setAllNews] = useState<any[]>([]);
  const [allResources, setAllResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', category: 'Technical' });
  const [newsForm, setNewsForm] = useState({ title: '', description: '', tag: 'Placements', source: '', url: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', category: 'DSA', difficulty: 'Beginner', url: '' });
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [draftToEdit, setDraftToEdit] = useState<any>(null);
  const [companySubTab, setCompanySubTab] = useState<'pending' | 'all' | 'drafts'>('pending');
  const [drafts, setDrafts] = useState<Company[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userSubTab, setUserSubTab] = useState<'pending' | 'all'>('pending');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [changingRoleId, setChangingRoleId] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleViewFile = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadFile = (url: string, title: string) => {
    let downloadUrl = url;
    // Inject Cloudinary attachment flag if it's a Cloudinary URL
    if (url.includes('/upload/')) {
      // Remove any problematic characters from title
      const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
      downloadUrl = url.replace('/upload/', `/upload/fl_attachment:${safeTitle}/`);
    }
    window.open(downloadUrl, '_blank');
  };

  const loadStats = useCallback(() => {
    adminApi.getStats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const loadUsers = useCallback(() => {
    adminApi.getAllUsers(undefined, true).then((r) => setAllUsers(r.data)).catch(() => {});
    adminApi.getPendingUsers().then((r) => setPendingUsers(r.data)).catch(() => {});
  }, []);

  const loadCompanies = useCallback(() => {
    adminApi.getAdminCompanies().then((r) => setAllCompanies(r.data)).catch(() => {});
    adminApi.getDrafts().then((r) => setDrafts(r.data)).catch(() => {});
  }, []);

  const loadNews = useCallback(() => {
    adminApi.getAdminNews().then((r) => setAllNews(r.data)).catch(() => {});
  }, []);

  const loadResources = useCallback(() => {
    adminApi.getAdminResources().then((r) => setAllResources(r.data)).catch(() => {});
  }, []);

  const loadMaterials = useCallback(() => {
    adminApi.getAdminStudyMaterials().then((r) => setAllMaterials(r.data)).catch(() => {});
  }, []);

  const loadDocuments = useCallback(() => {
    adminDocumentsApi.getAll().then((r) => setAllDocuments(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      adminApi.getStats(),
      adminApi.getPendingUsers(),
      adminApi.getAdminCompanies(),
      adminApi.getAdminStudyMaterials(),
      adminApi.getAdminNews(),
      adminApi.getAdminResources(),
      adminApi.getDrafts(),
      adminDocumentsApi.getAll(),
    ]).then(([s, u, c, m, n, r, d, docs]) => {
      setStats(s.data);
      setPendingUsers(u.data);
      setAllCompanies(c.data);
      setAllMaterials(m.data);
      setAllNews(n.data);
      setAllResources(r.data);
      setDrafts(d.data);
      setAllDocuments(docs.data);
      adminApi.getAllUsers(undefined, true).then((res) => setAllUsers(res.data)).catch(() => {});
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const handleApproveUser = async (id: number) => {
    try {
      await adminApi.approveUser(id);
      loadUsers();
      showToast('User approved!', 'success');
      loadStats();
    } catch { showToast('Failed to approve user.', 'error'); }
  };

  const handleRejectUser = async (id: number) => {
    try {
      await adminApi.rejectUser(id);
      setPendingUsers((p) => p.filter((u) => u.id !== id));
      setAllUsers((p) => p.filter((u) => u.id !== id));
      showToast('User rejected.', 'success');
      loadStats();
    } catch { showToast('Failed to reject user.', 'error'); }
  };

  const handleUpdateRole = async (id: number, role: string) => {
    setChangingRoleId(id);
    try {
      const res = await adminApi.updateUserRole(id, role);
      setAllUsers((prev) => prev.map((u) => u.id === id ? res.data : u));
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`Role updated to ${role}!`, 'success');
      loadStats();
    } catch { showToast('Failed to update role.', 'error'); }
    finally { setChangingRoleId(null); }
  };

  const handleToggleActive = async (id: number) => {
    try {
      const res = await adminApi.toggleUserActive(id);
      setAllUsers((prev) => prev.map((u) => u.id === id ? res.data : u));
      showToast('User status updated!', 'success');
    } catch { showToast('Failed to update status.', 'error'); }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      setAllUsers((prev) => prev.filter((u) => u.id !== id));
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      showToast('User deleted.', 'success');
      loadStats();
    } catch { showToast('Failed to delete user.', 'error'); }
  };

  const handleApproveCompany = async (id: number) => {
    try {
      await adminApi.approveCompany(id);
      loadCompanies(); loadStats();
      showToast('Company approved!', 'success');
    } catch { showToast('Failed.', 'error'); }
  };

  const handleRejectCompany = async (id: number) => {
    try {
      await adminApi.rejectCompany(id);
      loadCompanies(); loadStats();
      showToast('Company rejected.', 'info');
    } catch { showToast('Failed.', 'error'); }
  };

  const handleApproveMaterial = async (id: number) => {
    try {
      await adminApi.approveStudyMaterial(id);
      loadMaterials(); loadStats();
      showToast('Material approved!', 'success');
    } catch { showToast('Failed.', 'error'); }
  };

  const handleRejectMaterial = async (id: number) => {
    try {
      await adminApi.rejectMaterialWithReason(id, rejectionReason);
      setAllMaterials(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
      setRejectingId(null);
      setRejectionReason('');
      loadStats();
      showToast('Material rejected.', 'info');
    } catch { showToast('Failed.', 'error'); }
  };

  const handleDeleteMaterial = async (id: number) => {
    try {
      await adminApi.deleteStudyMaterial(id);
      setAllMaterials(prev => prev.filter(m => m.id !== id));
      loadStats();
      showToast('Material deleted.', 'info');
    } catch { showToast('Failed.', 'error'); }
  };

  const handlePublishNews = async (id: number) => {
    try {
      const res = await adminApi.publishNews(id);
      const isPublished = res.data.is_published;
      setAllNews(prev => prev.map(n => n.id === id ? { ...n, is_published: isPublished } : n));
      showToast(isPublished ? 'Article published successfully' : 'Article moved to drafts', 'success');
    } catch { showToast('Action failed.', 'error'); }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await adminApi.deleteNews(id);
      setAllNews(prev => prev.filter(n => n.id !== id));
      showToast('Article deleted.', 'info');
    } catch { showToast('Delete failed.', 'error'); }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createNewsArticle(newsForm);
      showToast('Article saved as Draft.', 'success');
      setNewsForm({ title: '', description: '', tag: 'Placements', source: '', url: '' });
      setShowNewsModal(false);
      loadNews();
    } catch { showToast('Failed to create article.', 'error'); }
  };

  const handleActivateResource = async (id: number) => {
    try {
      const res = await adminApi.activateResource(id);
      const isActive = res.data.is_active;
      setAllResources(prev => prev.map(r => r.id === id ? { ...r, is_active: isActive } : r));
      showToast(isActive ? 'Resource activated' : 'Resource deactivated', 'success');
    } catch { showToast('Action failed.', 'error'); }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await adminApi.deleteResource(id);
      setAllResources(prev => prev.filter(r => r.id !== id));
      showToast('Resource deleted.', 'info');
    } catch { showToast('Delete failed.', 'error'); }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createResource(resourceForm);
      showToast('Resource created (Inactive).', 'success');
      setResourceForm({ title: '', description: '', category: 'DSA', difficulty: 'Beginner', url: '' });
      setShowResourceModal(false);
      loadResources();
    } catch { showToast('Failed to create resource.', 'error'); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) { showToast('Please select a file.', 'error'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('title', uploadForm.title);
    fd.append('description', uploadForm.description);
    fd.append('category', uploadForm.category);
    try {
      await adminApi.uploadStudyMaterial(fd);
      showToast('Material uploaded! Pending approval.', 'success');
      setUploadFile(null);
      setUploadForm({ title: '', description: '', category: 'Technical' });
      loadMaterials();
    } catch { showToast('Upload failed. Check file type/size.', 'error'); }
    finally { setUploading(false); }
  };

  const handleApproveDocument = async (id: number) => {
    try {
      await adminDocumentsApi.approve(id);
      setAllDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
      loadStats();
      showToast('Document approved.', 'success');
    } catch { showToast('Action failed.', 'error'); }
  };

  const handleRejectDocument = async (id: number) => {
    try {
      await adminDocumentsApi.reject(id, rejectionReason);
      setAllDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected', rejection_reason: rejectionReason } : d));
      setRejectingId(null);
      setRejectionReason('');
      loadStats();
      showToast('Document rejected.', 'info');
    } catch { showToast('Action failed.', 'error'); }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await adminDocumentsApi.delete(id);
      setAllDocuments(prev => prev.filter(d => d.id !== id));
      loadStats();
      showToast('Document deleted.', 'info');
    } catch { showToast('Delete failed.', 'error'); }
  };

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users', badge: pendingUsers.length },
    { id: 'companies', label: 'Companies', badge: allCompanies.filter((c) => c.status === 'pending').length },
    { id: 'materials', label: 'Study Materials', badge: allMaterials.filter((m) => m.status === 'pending').length },
    { id: 'documents', label: 'Documents', badge: allDocuments.filter((d) => d.status === 'pending').length },
    { id: 'news', label: 'News' },
    { id: 'resources', label: 'Resources' },
  ];

  const statCards = stats ? [
    { label: 'Total Students', value: stats.total_students, sub: `${stats.pending_approvals} pending`, bg: 'bg-primary-light', color: 'text-primary', icon: <Users size={20} /> },
    { label: 'Companies', value: stats.total_companies, sub: `${stats.pending_companies} pending, ${stats.draft_companies} drafts`, bg: 'bg-green-50', color: 'text-success', icon: <Building2 size={20} /> },
    { label: 'Documents', value: stats.total_documents || 0, sub: `${stats.pending_documents || 0} pending`, bg: 'bg-orange-50', color: 'text-orange-600', icon: <FileText size={20} /> },
    { label: 'Study Materials', value: stats.total_materials, sub: `${stats.pending_materials} pending`, bg: 'bg-yellow-50', color: 'text-warning', icon: <BookOpen size={20} /> },
    { label: 'Crew Members', value: stats.total_crew, sub: `Avg rating: ${stats.avg_crew_rating}`, bg: 'bg-red-50', color: 'text-danger', icon: <ShieldCheck size={20} /> },
  ] : [];

  if (isLoading) return (
    <div className="max-w-6xl mx-auto animate-pulse space-y-6">
      <div className="h-8 bg-border rounded w-48" />
      <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-border rounded-xl" />)}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Admin Panel</h1>
        <p className="text-sm text-muted mt-0.5">Manage users, companies, and content</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium relative flex items-center gap-2 transition-colors ${tab === t.id ? 'text-primary' : 'text-muted hover:text-body'}`}>
            {t.label}
            {!!t.badge && (
              <span className="bg-danger text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{t.badge}</span>
            )}
            {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="card p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
                <div className="text-2xl font-bold text-heading">{s.value}</div>
                <div className="text-sm text-muted">{s.label}</div>
                <div className="text-xs text-muted mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {pendingUsers.length > 0 && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-heading">Pending User Approvals</h2>
                <button onClick={() => setTab('users')} className="btn-ghost text-xs">View all →</button>
              </div>
              <div className="divide-y divide-border">
                {pendingUsers.slice(0, 5).map((u) => (
                  <div key={u.id} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                      {u.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">{u.full_name}</p>
                      <p className="text-xs text-muted truncate">{u.email} · {u.branch || 'No branch'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveUser(u.id)} className="w-8 h-8 rounded-lg bg-green-50 text-success flex items-center justify-center hover:bg-green-100 transition-colors" title="Approve">
                        <Check size={15} />
                      </button>
                      <button onClick={() => handleRejectUser(u.id)} className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-100 transition-colors" title="Reject">
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Sub-tabs */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setUserSubTab('pending')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${userSubTab === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-body'}`}
              >
                Pending Approvals ({pendingUsers.length})
              </button>
              <button
                onClick={() => setUserSubTab('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${userSubTab === 'all' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-body'}`}
              >
                All Users ({allUsers.length})
              </button>
            </div>
            {userSubTab === 'all' && (
              <div className="flex gap-2 items-center">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="form-input py-1.5 text-xs w-36"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="crew">Crew</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            )}
          </div>

          {/* Pending Approvals */}
          {userSubTab === 'pending' && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-heading">Pending Student Approvals</h2>
              </div>
              {pendingUsers.length === 0 ? (
                <div className="py-16 text-center text-muted text-sm">
                  <Check size={36} className="mx-auto mb-3 text-success" />
                  No pending approvals — all caught up!
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pendingUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                        {u.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-heading text-sm">{u.full_name}</p>
                        <p className="text-xs text-muted">{u.email} · {u.branch || '—'} · Year {u.year || '—'}</p>
                        <p className="text-xs text-muted">{u.phone || 'No phone'} · Joined {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveUser(u.id)} className="bg-success text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-700 transition-colors">
                          <Check size={13} /> Approve
                        </button>
                        <button onClick={() => handleRejectUser(u.id)} className="bg-red-50 text-danger text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-100 transition-colors border border-red-200">
                          <X size={13} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Users Table */}
          {userSubTab === 'all' && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface/50 text-muted font-bold border-b border-border text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allUsers
                      .filter((u) => userRoleFilter === 'all' || u.role === userRoleFilter)
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-surface/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full font-semibold text-xs flex items-center justify-center flex-shrink-0 ${
                                u.role === 'admin' ? 'bg-red-100 text-danger' :
                                u.role === 'crew' ? 'bg-purple-100 text-purple-700' :
                                'bg-primary-light text-primary'
                              }`}>
                                {u.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-heading text-sm">{u.full_name}</p>
                                <p className="text-[11px] text-muted">{u.branch || '—'} · Year {u.year || '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-body">{u.email}</p>
                            <p className="text-[11px] text-muted">{u.phone || 'No phone'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              disabled={u.is_staff && u.role === 'admin' || changingRoleId === u.id}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                              className={`text-xs font-bold px-2 py-1 rounded-lg border cursor-pointer transition-all ${
                                u.role === 'admin' ? 'bg-red-50 text-danger border-red-200' :
                                u.role === 'crew' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                'bg-primary-light text-primary border-indigo-200'
                              } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                              <option value="student">Student</option>
                              <option value="crew">Crew</option>
                              <option value="admin">Admin</option>
                            </select>
                            {changingRoleId === u.id && (
                              <div className="inline-block ml-2 w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleActive(u.id)}
                              disabled={u.is_staff}
                              title={u.is_active ? 'Click to deactivate' : 'Click to activate'}
                              className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                u.is_active
                                  ? 'bg-green-50 text-success border-green-200 hover:bg-red-50 hover:text-danger hover:border-red-200'
                                  : 'bg-red-50 text-danger border-red-200 hover:bg-green-50 hover:text-success hover:border-green-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {u.is_active ? <Check size={10} /> : <X size={10} />}
                              {u.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-muted">{new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {!u.is_staff && (
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Delete User"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              {u.is_staff && (
                                <span className="text-[10px] text-muted italic font-medium">Superuser</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {allUsers.filter((u) => userRoleFilter === 'all' || u.role === userRoleFilter).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted italic">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Companies Tab */}
      {tab === 'companies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setCompanySubTab('pending')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${companySubTab === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-body'}`}
              >
                Pending Approval ({allCompanies.filter(c => c.status === 'pending').length})
              </button>
              <button 
                onClick={() => setCompanySubTab('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${companySubTab === 'all' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-body'}`}
              >
                All Companies ({allCompanies.length})
              </button>
              <button 
                onClick={() => setCompanySubTab('drafts')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${companySubTab === 'drafts' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-body'}`}
              >
                Drafts ({drafts.length})
              </button>
            </div>
            
            <button 
              onClick={() => {
                setDraftToEdit(null);
                setShowWizard(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Add Company
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="divide-y divide-border">
              {companySubTab === 'drafts' ? (
                drafts.length === 0 ? (
                  <div className="py-12 text-center text-muted text-sm">No drafts found.</div>
                ) : drafts.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-6 py-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${getDomainColor(c.domain)}`}>
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-heading text-sm">{c.name || '(Untitled Draft)'}</p>
                      <p className="text-xs text-muted">{c.domain || 'No domain'} · Saved on {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setDraftToEdit(c);
                          setShowWizard(true);
                        }}
                        className="btn-secondary py-1 text-xs px-3"
                      >
                        Continue Editing
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                (companySubTab === 'pending' ? allCompanies.filter(c => c.status === 'pending') : allCompanies).map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-6 py-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${
                      c.domain === 'CS' ? 'bg-primary' : c.domain === 'Cyber' ? 'bg-danger' : c.domain === 'Product' ? 'bg-success' : 'bg-warning'
                    }`}>{c.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-heading text-sm">{c.name}</p>
                      <p className="text-xs text-muted">{c.job_role} · ₹{c.salary_lpa} LPA</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      c.status === 'approved' ? 'badge-approved' : c.status === 'pending' ? 'badge-pending' : 'badge-rejected'
                    }`}>{c.status}</span>
                    {c.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveCompany(c.id)} className="w-8 h-8 rounded-lg bg-green-50 text-success flex items-center justify-center hover:bg-green-100 transition-colors">
                          <Check size={14} />
                        </button>
                        <button onClick={() => handleRejectCompany(c.id)} className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-100 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Study Materials Tab */}
      {tab === 'materials' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-heading mb-4 flex items-center gap-2"><Upload size={18} /> Upload New Material</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title</label>
                  <input className="form-input" placeholder="Material title" value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}>
                    {['Aptitude', 'Technical', 'HR Interview', 'GD Preparation', 'Resume', 'Domain Specific'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input resize-none" rows={2} placeholder="Brief description of the material"
                  value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">File (PDF, DOC, DOCX, PPT, PPTX — max 10MB)</label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploadFile ? 'border-primary bg-primary-light' : 'border-border hover:border-primary'}`}>
                  <input id="file-upload" type="file" className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploadFile ? (
                      <div>
                        <p className="text-primary font-medium text-sm">{uploadFile.name}</p>
                        <p className="text-xs text-muted mt-1">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <Plus size={24} className="mx-auto text-muted mb-2" />
                        <p className="text-sm text-muted">Click to select a file</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <button type="submit" disabled={uploading}
                className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : 'Upload Material'}
              </button>
            </form>
          </div>

          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-heading">All Materials ({allMaterials.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {allMaterials.length === 0 ? (
                <div className="py-12 text-center text-muted text-sm">No materials uploaded yet.</div>
              ) : allMaterials.map((m) => (
                <div key={m.id} className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-red-50 text-danger font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {m.file_type || 'FILE'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-heading text-sm truncate">{m.title}</p>
                      <p className="text-xs text-muted">{m.category} · {m.uploaded_by_name}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                      m.status === 'approved' ? 'badge-approved' : m.status === 'pending' ? 'badge-pending' : 'badge-rejected'
                    }`}>{m.status}</span>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleViewFile(m.file)} className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleDownloadFile(m.file, m.title)} className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all shadow-sm" title="Download">
                        <Download size={14} />
                      </button>
                      {m.status === 'pending' && rejectingId !== m.id && (
                        <>
                          <button onClick={() => handleApproveMaterial(m.id)} className="w-8 h-8 rounded-lg bg-green-50 text-success flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm" title="Approve">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setRejectingId(m.id)} className="w-8 h-8 rounded-lg bg-yellow-50 text-warning flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all shadow-sm" title="Reject">
                            <X size={14} />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDeleteMaterial(m.id)} className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {rejectingId === m.id && (
                    <div className="mt-3 flex items-center gap-2 p-3 bg-surface rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
                      <input className="form-input flex-1 h-9" placeholder="Optional rejection reason..." value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)} autoFocus />
                      <button onClick={() => handleRejectMaterial(m.id)} className="btn-danger h-9 py-0 flex items-center gap-1 text-xs">Confirm Reject</button>
                      <button onClick={() => { setRejectingId(null); setRejectionReason(''); }} className="btn-secondary h-9 py-0 text-xs">Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'documents' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-heading text-xl">Company Documents</h2>
              <p className="text-sm text-muted">Review and manage documents uploaded by crew members</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full border border-border shadow-sm">
                Total: {allDocuments.length}
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-yellow-50 text-warning rounded-full border border-yellow-100 shadow-sm">
                Pending: {allDocuments.filter(d => d.status === 'pending').length}
              </span>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/50 text-muted font-bold border-b border-border text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Document</th>
                    <th className="px-6 py-4">Company & Section</th>
                    <th className="px-6 py-4">Uploaded By</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted italic">No documents found.</td>
                    </tr>
                  ) : allDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-surface/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-[10px]">
                            {doc.file_type}
                          </div>
                          <div>
                            <p className="font-bold text-heading truncate max-w-[180px]">{doc.title}</p>
                            <p className="text-[10px] text-muted mt-0.5">{doc.file_size} · {new Date(doc.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-heading">{doc.company_name}</p>
                        <p className="text-[10px] text-muted capitalize">{doc.section.replace('_', ' ')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-body">{doc.uploaded_by_name}</p>
                        <p className="text-[10px] text-muted italic">Crew Member</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          doc.status === 'approved' ? 'bg-green-50 text-success border border-green-100' : 
                          doc.status === 'pending' ? 'bg-yellow-50 text-warning border border-yellow-100' : 
                          'bg-red-50 text-danger border border-red-100'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleViewFile(doc.file)} className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="View">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handleDownloadFile(doc.file, doc.title)} className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all shadow-sm" title="Download">
                            <Download size={14} />
                          </button>
                          {doc.status === 'pending' && rejectingId !== doc.id && (
                            <>
                              <button
                                onClick={() => handleApproveDocument(doc.id)}
                                className="w-8 h-8 rounded-lg bg-green-50 text-success flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                title="Approve"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setRejectingId(doc.id)}
                                className="w-8 h-8 rounded-lg bg-yellow-50 text-warning flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                                title="Reject"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {rejectingId === doc.id && (
                          <div className="mt-4 p-3 bg-surface rounded-xl border border-border animate-in slide-in-from-right-4 duration-200">
                            <input
                              className="form-input text-xs mb-2"
                              placeholder="Reason (optional)"
                              value={rejectionReason}
                              onChange={e => setRejectionReason(e.target.value)}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRejectDocument(doc.id)}
                                className="btn-danger py-1 px-3 text-[10px] flex-1"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => { setRejectingId(null); setRejectionReason(''); }}
                                className="btn-secondary py-1 px-3 text-[10px] flex-1"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* News Tab */}
      {tab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-heading">News Articles ({allNews.length})</h2>
            <button onClick={() => setShowNewsModal(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Article
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Tag</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Published At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allNews.map((n) => (
                  <tr key={n.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-heading">{n.title}</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 bg-primary-light text-primary rounded text-xs">{n.tag}</span></td>
                    <td className="px-6 py-4 text-muted">{n.source}</td>
                    <td className="px-6 py-4">
                      {n.is_published ? (
                        <span className="badge-approved flex items-center gap-1 w-fit"><Check size={12} /> Published</span>
                      ) : (
                        <span className="badge-pending flex items-center gap-1 w-fit">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {n.published_at ? new Date(n.published_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handlePublishNews(n.id)} className={`p-1.5 rounded-lg transition-colors ${n.is_published ? 'bg-yellow-50 text-warning hover:bg-yellow-100' : 'bg-green-50 text-success hover:bg-green-100'}`} title={n.is_published ? 'Unpublish' : 'Publish'}>
                          {n.is_published ? <Save size={16} /> : <Send size={16} />}
                        </button>
                        <button onClick={() => handleDeleteNews(n.id)} className="p-1.5 rounded-lg bg-red-50 text-danger hover:bg-red-100" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {tab === 'resources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-heading">Resources ({allResources.length})</h2>
            <button onClick={() => setShowResourceModal(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Resource
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allResources.map((r) => (
                  <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-heading">{r.title}</td>
                    <td className="px-6 py-4 text-muted">{r.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        r.difficulty === 'Beginner' ? 'bg-green-50 text-success' : r.difficulty === 'Intermediate' ? 'bg-yellow-50 text-warning' : 'bg-red-50 text-danger'
                      }`}>{r.difficulty}</span>
                    </td>
                    <td className="px-6 py-4">
                      {r.is_active ? (
                        <span className="badge-approved flex items-center gap-1 w-fit"><Check size={12} /> Active</span>
                      ) : (
                        <span className="badge-pending flex items-center gap-1 w-fit">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleActivateResource(r.id)} className={`p-1.5 rounded-lg transition-colors ${r.is_active ? 'bg-yellow-50 text-warning hover:bg-yellow-100' : 'bg-green-50 text-success hover:bg-green-100'}`} title={r.is_active ? 'Deactivate' : 'Activate'}>
                          {r.is_active ? <X size={16} /> : <Check size={16} />}
                        </button>
                        <button onClick={() => handleDeleteResource(r.id)} className="p-1.5 rounded-lg bg-red-50 text-danger hover:bg-red-100" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showNewsModal || showResourceModal) && (
        <div className="fixed inset-0 bg-heading/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-heading">{showNewsModal ? 'Add News Article' : 'Add Resource'}</h3>
              <button onClick={() => { setShowNewsModal(false); setShowResourceModal(false); }} className="text-muted hover:text-body"><X size={20} /></button>
            </div>
            
            <form onSubmit={showNewsModal ? handleCreateNews : handleCreateResource} className="p-6 space-y-4">
              {showNewsModal ? (
                <>
                  <div>
                    <label className="form-label">Title</label>
                    <input className="form-input" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Tag</label>
                      <select className="form-input" value={newsForm.tag} onChange={e => setNewsForm({...newsForm, tag: e.target.value})}>
                        {['Placements', 'Tech', 'Industry', 'Campus'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Source</label>
                      <input className="form-input" value={newsForm.source} onChange={e => setNewsForm({...newsForm, source: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">URL</label>
                    <input className="form-input" type="url" value={newsForm.url} onChange={e => setNewsForm({...newsForm, url: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea className="form-input resize-none" rows={3} value={newsForm.description} onChange={e => setNewsForm({...newsForm, description: e.target.value})} required />
                  </div>
                  <p className="text-xs text-muted">Article will be saved as Draft. You can publish it from the table.</p>
                </>
              ) : (
                <>
                  <div>
                    <label className="form-label">Title</label>
                    <input className="form-input" value={resourceForm.title} onChange={e => setResourceForm({...resourceForm, title: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Category</label>
                      <select className="form-input" value={resourceForm.category} onChange={e => setResourceForm({...resourceForm, category: e.target.value})}>
                        {['DSA', 'Python', 'Interview Prep', 'Aptitude'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Difficulty</label>
                      <select className="form-input" value={resourceForm.difficulty} onChange={e => setResourceForm({...resourceForm, difficulty: e.target.value})}>
                        {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">URL</label>
                    <input className="form-input" type="url" value={resourceForm.url} onChange={e => setResourceForm({...resourceForm, url: e.target.value})} required />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea className="form-input resize-none" rows={3} value={resourceForm.description} onChange={e => setResourceForm({...resourceForm, description: e.target.value})} required />
                  </div>
                  <p className="text-xs text-muted">Resource will be inactive until you activate it.</p>
                </>
              )}
              
              <div className="pt-2 flex gap-3">
                <button type="submit" className="btn-primary flex-1">{showNewsModal ? 'Save as Draft' : 'Save'}</button>
                <button type="button" onClick={() => { setShowNewsModal(false); setShowResourceModal(false); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showWizard && (
        <CompanyWizard 
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            loadCompanies();
            loadStats();
          }}
          initialDraftData={draftToEdit}
        />
      )}
    </div>
  );
}
