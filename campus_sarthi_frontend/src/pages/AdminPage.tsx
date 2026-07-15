import { useEffect, useState, useCallback } from 'react';
import { Users, Building2, FileText, ShieldCheck, Check, X, Plus, Upload, Trash2, Send, Save, BookOpen, Edit, Eye, Download } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { adminDocumentsApi } from '../services/companyDocumentsApi';
import type { User } from '../types/user';
import type { Company, AdminCompanyDocument } from '../types/company';
import type { StudyMaterial } from '../types/studyMaterial';
import { useToast } from '../context/ToastContext';
import CompanyWizard from '../components/CompanyWizard';
import { getDomainColor } from '../utils/companyAvatar';
import AdminPlacementFamily from '../components/AdminPlacementFamily';
import AdminEvents from '../components/AdminEvents';
import AdminContributions from '../components/AdminContributions';
import AdminArchitecture from '../components/AdminArchitecture';

type Tab = 'overview' | 'users' | 'crew' | 'companies' | 'materials' | 'documents' | 'news' | 'resources' | 'placement-family' | 'events' | 'contributions' | 'architecture';

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
  const [allCrew, setAllCrew] = useState<any[]>([]);
  const [pendingContributions, setPendingContributions] = useState<number>(0);
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
  
  // Crew specific state
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [crewForm, setCrewForm] = useState<{ id?: number, email: string, full_name: string, title: string, department: string, bio: string, profile_photo: File | null }>({
    email: '', full_name: '', title: 'Placement Coordinator', department: 'T&P Cell', bio: '', profile_photo: null
  });
  
  const { showToast } = useToast();

  const handleViewFile = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadFile = (url: string, title: string) => {
    let downloadUrl = url;
    if (url.includes('/upload/')) {
      const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
      downloadUrl = url.replace('/upload/', `/upload/fl_attachment:${safeTitle}/`);
    }
    window.open(downloadUrl, '_blank');
  };

  const loadStats = useCallback(() => {
    adminApi.getStats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const loadUsers = useCallback(() => {
    adminApi.getAllUsers(undefined, true).then((r) => setAllUsers(r.data as any)).catch(() => {});
    adminApi.getPendingUsers().then((r) => setPendingUsers(r.data as any)).catch(() => {});
  }, []);

  const loadCompanies = useCallback(() => {
    adminApi.getAdminCompanies().then((r) => setAllCompanies(r.data as any)).catch(() => {});
    adminApi.getDrafts().then((r) => setDrafts(r.data as any)).catch(() => {});
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
      adminApi.getAdminCrew(),
      adminApi.getContributions(),
    ]).then(([s, u, c, m, n, r, d, docs, crew, cont]) => {
      setStats(s.data);
      setPendingUsers(u.data as any);
      setAllCompanies(c.data as any);
      setAllMaterials(m.data);
      setAllNews(n.data);
      setAllResources(r.data);
      setDrafts(d.data as any);
      setAllDocuments(docs.data);
      setAllCrew(crew.data);
      setPendingContributions(cont.data.length);
      adminApi.getAllUsers(undefined, true).then((res) => setAllUsers(res.data as any)).catch(() => {});
    }).catch(() => {}).finally(() => setIsLoading(false));

    // Poll every 20s for realtime access requests and stats
    const poll = setInterval(() => {
      adminApi.getPendingUsers().then(r => setPendingUsers(r.data as any)).catch(() => {});
      adminApi.getStats().then(r => setStats(r.data)).catch(() => {});
      adminApi.getContributions().then(r => setPendingContributions(r.data.length)).catch(() => {});
    }, 20_000);

    return () => clearInterval(poll);
  }, []);

  const handleApproveUser = async (id: number) => {
    try {
      await adminApi.approveUser(id);
      // Reload fresh from backend so UI reflects real state
      loadUsers();
      loadStats();
      showToast('User approved! They can now login.', 'success');
    } catch (err: any) {
      console.error('Approve user error:', err);
      showToast(err?.response?.data?.error || 'Failed to approve user.', 'error');
    }
  };

  const handleRejectUser = async (id: number) => {
    try {
      await adminApi.rejectUser(id);
      setPendingUsers((p) => p.filter((u) => u.id !== id));
      setAllUsers((p) => p.filter((u) => u.id !== id));
      loadStats();
      showToast('User rejected.', 'success');
    } catch (err: any) {
      console.error('Reject user error:', err);
      showToast(err?.response?.data?.error || 'Failed to reject user.', 'error');
    }
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

  const handleDeleteCompany = async (id: number, name: string) => {
    if (!window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteCompany(id);
      setAllCompanies((prev) => prev.filter((c) => c.id !== id));
      setDrafts((prev) => prev.filter((c) => c.id !== id));
      loadStats();
      showToast(`Company "${name}" deleted.`, 'success');
    } catch { showToast('Failed to delete company.', 'error'); }
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

  const handleSaveCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    if (crewForm.email) fd.append('email', crewForm.email);
    if (crewForm.full_name) fd.append('full_name', crewForm.full_name);
    fd.append('title', crewForm.title);
    fd.append('department', crewForm.department);
    fd.append('bio', crewForm.bio);
    if (crewForm.profile_photo) {
      fd.append('profile_photo', crewForm.profile_photo);
    }

    try {
      if (crewForm.id) {
        await adminApi.updateCrewMember(crewForm.id, fd);
        showToast('Crew member updated!', 'success');
      } else {
        await adminApi.createCrewMember(fd);
        showToast('Crew member added!', 'success');
      }
      setShowCrewModal(false);
      setCrewForm({ email: '', full_name: '', title: 'Placement Coordinator', department: 'T&P Cell', bio: '', profile_photo: null });
      adminApi.getAdminCrew().then(r => setAllCrew(r.data));
    } catch (error: any) { 
      console.error(error);
      showToast(error.response?.data?.error || 'Failed to save crew member.', 'error'); 
    }
  };

  const handleDeleteCrew = async (id: number) => {
    if (!confirm('Are you sure you want to delete this crew member? This cannot be undone.')) return;
    try {
      await adminApi.deleteCrewMember(id);
      setAllCrew(prev => prev.filter(c => c.id !== id));
      showToast('Crew member deleted.', 'info');
      loadStats();
    } catch { showToast('Delete failed.', 'error'); }
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




  const statCards = stats ? [
    { label: 'Total Students',   value: stats.total_students,       sub: `${stats.pending_approvals} pending`,   bg: 'rgba(37,99,235,0.15)',   color: '#60A5FA', icon: <Users size={20} /> },
    { label: 'Companies',        value: stats.total_companies,      sub: `${stats.pending_companies} pending`,   bg: 'rgba(16,185,129,0.15)', color: '#34D399', icon: <Building2 size={20} /> },
    { label: 'Documents',        value: stats.total_documents || 0, sub: `${stats.pending_documents || 0} pending`, bg: 'rgba(249,115,22,0.15)', color: '#FB923C', icon: <FileText size={20} /> },
    { label: 'Study Materials',  value: stats.total_materials,      sub: `${stats.pending_materials} pending`,   bg: 'rgba(245,158,11,0.15)', color: '#FBBF24', icon: <BookOpen size={20} /> },
    { label: 'Crew Members',     value: stats.total_crew,           sub: `Avg rating: ${stats.avg_crew_rating}`, bg: 'rgba(168,85,247,0.15)', color: '#C084FC', icon: <ShieldCheck size={20} /> },
  ] : [];

  if (isLoading) return (
    <div className="max-w-6xl mx-auto animate-pulse space-y-6">
      <div className="h-24 rounded-2xl" style={{ background: '#1E293B' }} />
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 rounded-xl" style={{ background: '#1E2A45' }} />)}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* ══ COMMAND CENTER HERO ══ */}
      <div className="relative rounded-2xl overflow-hidden mb-7 p-7"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F2044 50%, #091422 100%)', border: '1px solid rgba(37,99,235,0.25)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
        {/* Decorative orb */}
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', boxShadow: '0 0 32px rgba(37,99,235,0.5)' }}>
              <ShieldCheck size={30} color="#fff" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.2)', color: '#93C5FD', border: '1px solid rgba(37,99,235,0.3)' }}>ADMINISTRATOR ACCESS</span>
                {pendingUsers.length > 0 && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse" style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)' }}>⚠ {pendingUsers.length} Pending</span>}
              </div>
              <h1 className="text-2xl font-extrabold text-white" style={{ letterSpacing: '-0.03em' }}>Placement Command Center</h1>
              <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Campus Sarthi Administrative Operations</p>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Placement Operations Control</span>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} /><span className="text-xs font-semibold" style={{ color: '#34D399' }}>All Systems Operational</span></div>
          </div>
        </div>
      </div>

      {/* ══ SIDEBAR + MAIN LAYOUT ══ */}
      <div className="flex gap-6 items-start">

        {/* ── Left Sidebar ── */}
        <aside className="w-52 flex-shrink-0 sticky top-4">
          <div className="rounded-2xl overflow-hidden" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1E2A45' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Navigation</p>
            </div>
            <nav className="py-2">
              {([
                { id: 'overview',          label: 'Overview',          icon: '🏠' },
                { id: 'users',             label: 'User Management',   icon: '👥', badge: pendingUsers.length },
                { id: 'crew',              label: 'Crew',              icon: '🛡️' },
                { id: 'placement-family',  label: 'Placement Family',  icon: '🎓' },
                { id: 'companies',         label: 'Companies',         icon: '🏢', badge: allCompanies.filter(c=>c.status==='pending').length },
                { id: 'materials',         label: 'Study Materials',   icon: '📚', badge: allMaterials.filter(m=>m.status==='pending').length },
                { id: 'documents',         label: 'Documents',         icon: '📄', badge: allDocuments.filter(d=>d.status==='pending').length },
                { id: 'news',              label: 'News',              icon: '📰' },
                { id: 'resources',         label: 'Resources',         icon: '🔗' },
                { id: 'events',            label: 'Events',            icon: '📅' },
                { id: 'contributions',     label: 'Contributions',     icon: '✍️', badge: pendingContributions },
                { id: 'architecture',      label: 'System Info',       icon: '⚙️' },
              ] as { id: Tab; label: string; icon: string; badge?: number }[]).map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150 text-left"
                  style={{ background: tab === item.id ? 'rgba(37,99,235,0.15)' : 'transparent', color: tab === item.id ? '#93C5FD' : '#64748B', borderLeft: tab === item.id ? '2px solid #3B82F6' : '2px solid transparent' }}>
                  <span style={{ fontSize: '13px' }}>{item.icon}</span>
                  <span className="flex-1 font-medium text-xs">{item.label}</span>
                  {!!item.badge && <span className="text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center" style={{ background: '#EF4444', color: '#fff' }}>{item.badge}</span>}
                </button>
              ))}
            </nav>
            {/* System Health */}
            <div className="px-4 py-3 mt-1" style={{ borderTop: '1px solid #1E2A45' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#334155' }}>System Health</p>
              {[
                { name: 'Auth Service', ok: true },
                { name: 'Database',     ok: true },
                { name: 'Upload CDN',   ok: true },
                { name: 'Events API',   ok: true },
                { name: 'Resources',    ok: true },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.ok ? '#10B981' : '#EF4444', boxShadow: s.ok ? '0 0 4px #10B981' : '0 0 4px #EF4444' }} />
                  <span className="text-[10px] font-medium" style={{ color: '#64748B' }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Quick Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '+ Add Company',       action: () => { setDraftToEdit(null); setShowWizard(true); }, color: '#3B82F6' },
                { label: '+ Review Requests',   action: () => setTab('users'),         color: '#F59E0B' },
                { label: '+ Contributions',     action: () => setTab('contributions'), color: '#8B5CF6' },
                { label: '+ Study Materials',   action: () => setTab('materials'),     color: '#10B981' },
                { label: '+ Events',            action: () => setTab('events'),        color: '#0EA5E9' },
                { label: '+ Resources',         action: () => setTab('resources'),     color: '#EC4899' },
              ].map(qa => (
                <button key={qa.label} onClick={qa.action}
                  className="px-4 py-3 rounded-xl text-xs font-bold text-left transition-all duration-200"
                  style={{ background: `${qa.color}12`, color: qa.color, border: `1px solid ${qa.color}25` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${qa.color}22`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${qa.color}12`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >{qa.label}</button>
              ))}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-5 transition-all duration-200 cursor-default"
                style={{ background: '#141B2D', border: '1px solid #1E2A45', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#263048'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1E2A45'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="text-2xl font-extrabold text-white" style={{ letterSpacing: '-0.03em' }}>{s.value}</div>
                <div className="text-sm font-medium mt-0.5" style={{ color: '#94A3B8' }}>{s.label}</div>
                <div className="text-xs mt-1" style={{ color: '#475569' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Pending Approvals + Activity Timeline side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Pending Approvals */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid #1E2A45' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F59E0B' }} />
                  <h2 className="font-bold text-white text-sm">Approval Queue</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#FBBF24' }}>{pendingUsers.length}</span>
                </div>
                <button onClick={() => setTab('users')} className="text-xs font-semibold" style={{ color: '#3B82F6' }}>View all →</button>
              </div>
              {pendingUsers.length === 0 ? (
                <div className="py-10 text-center">
                  <Check size={28} className="mx-auto mb-2" style={{ color: '#10B981' }} />
                  <p className="text-sm font-medium" style={{ color: '#34D399' }}>All caught up!</p>
                </div>
              ) : pendingUsers.slice(0, 4).map((u, idx) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3 transition-colors"
                  style={{ borderBottom: idx < Math.min(pendingUsers.length, 4) - 1 ? '1px solid #1E2A45' : 'none' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                  <div className="w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.15)', color: '#60A5FA' }}>
                    {u.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{u.full_name}</p>
                    <p className="text-xs truncate" style={{ color: '#64748B' }}>{u.branch || 'No branch'}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleApproveUser(u.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background: 'rgba(16,185,129,0.12)', color: '#34D399' }}><Check size={11} /> Ok</button>
                    <button onClick={() => handleRejectUser(u.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}><X size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity Timeline */}
            <div className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Recent Activity</p>
              <div className="space-y-3">
                {[
                  { icon: '✅', label: 'User Approved', desc: 'Access granted to new student', time: '2 min ago', color: '#10B981' },
                  { icon: '🏢', label: 'Company Added', desc: 'New company profile created', time: '18 min ago', color: '#3B82F6' },
                  { icon: '✍️', label: 'Contribution Approved', desc: 'Interview Q&A submitted', time: '1 hr ago', color: '#8B5CF6' },
                  { icon: '📅', label: 'Event Created', desc: 'Placement drive scheduled', time: '3 hr ago', color: '#F59E0B' },
                  { icon: '📚', label: 'Material Uploaded', desc: 'Aptitude PDF approved', time: '5 hr ago', color: '#0EA5E9' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{ background: `${a.color}15` }}>{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{a.label}</p>
                      <p className="text-[11px]" style={{ color: '#475569' }}>{a.desc}</p>
                    </div>
                    <span className="text-[10px] whitespace-nowrap" style={{ color: '#334155' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

      {/* Crew Tab */}
      {tab === 'crew' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-heading text-lg">Crew Management ({allCrew.length})</h2>
            <button
              onClick={() => {
                setCrewForm({ email: '', full_name: '', title: 'Placement Coordinator', department: 'T&P Cell', bio: '', profile_photo: null });
                setShowCrewModal(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Add Crew Member
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="divide-y divide-border">
              {allCrew.length === 0 ? (
                <div className="py-12 text-center text-muted text-sm">No crew members found.</div>
              ) : allCrew.map((c) => {
                const initials = c.user.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
                return (
                  <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface/30 transition-colors">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0 border border-purple-200">
                      {c.user.profile_photo ? (
                        <img src={c.user.profile_photo} alt={c.user.full_name} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-heading text-sm">{c.user.full_name} {c.user.is_active ? '' : '(Deactivated)'}</p>
                      <p className="text-xs text-muted">{c.title} · {c.department}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCrewForm({
                            id: c.id,
                            email: c.user.email,
                            full_name: c.user.full_name,
                            title: c.title,
                            department: c.department,
                            bio: c.bio,
                            profile_photo: null
                          });
                          setShowCrewModal(true);
                        }}
                        className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Edit size={14} /> Edit / Photo
                      </button>
                      <button
                        onClick={() => handleDeleteCrew(c.id)}
                        className="btn-danger py-1.5 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
                    <div className="flex gap-2">
                      {c.status === 'pending' && (
                        <>
                          <button onClick={() => handleApproveCompany(c.id)} className="w-8 h-8 rounded-lg bg-green-50 text-success flex items-center justify-center hover:bg-green-100 transition-colors" title="Approve">
                            <Check size={14} />
                          </button>
                          <button onClick={() => handleRejectCompany(c.id)} className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-100 transition-colors" title="Reject">
                            <X size={14} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteCompany(c.id, c.name)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Company"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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

      {/* Crew Modal */}
      {showCrewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-heading">{crewForm.id ? 'Edit Crew Member' : 'Add Crew Member'}</h2>
              <button onClick={() => setShowCrewModal(false)} className="text-muted hover:text-heading"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveCrew} className="p-6 space-y-4">
              {!crewForm.id && (
                <>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" type="email" value={crewForm.email} onChange={e => setCrewForm({ ...crewForm, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={crewForm.full_name} onChange={e => setCrewForm({ ...crewForm, full_name: e.target.value })} required />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={crewForm.title} onChange={e => setCrewForm({ ...crewForm, title: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Department *</label>
                  <input className="form-input" value={crewForm.department} onChange={e => setCrewForm({ ...crewForm, department: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="form-label">Bio (Optional)</label>
                <textarea className="form-input resize-none" rows={3} value={crewForm.bio} onChange={e => setCrewForm({ ...crewForm, bio: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Profile Photo (Optional)</label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${crewForm.profile_photo ? 'border-primary bg-primary-light' : 'border-border hover:border-primary'}`}>
                  <input id="crew-photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setCrewForm({ ...crewForm, profile_photo: e.target.files?.[0] || null })} />
                  <label htmlFor="crew-photo-upload" className="cursor-pointer">
                    {crewForm.profile_photo ? (
                      <div>
                        <p className="text-primary font-medium text-sm">{crewForm.profile_photo.name}</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} className="mx-auto text-muted mb-2" />
                        <p className="text-sm text-muted">Click to select an image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCrewModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{crewForm.id ? 'Save Changes' : 'Create Crew Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {tab === 'placement-family' && (
        <AdminPlacementFamily />
      )}
      {tab === 'events' && (
        <AdminEvents />
      )}
      {tab === 'contributions' && (
        <AdminContributions />
      )}
      {tab === 'architecture' && (
        <AdminArchitecture />
      )}
        </main>
      </div>
    </div>
  );
}
