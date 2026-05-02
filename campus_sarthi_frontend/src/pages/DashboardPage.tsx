import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, FileText, Library, Newspaper, Shirt, Star, ChevronRight, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companiesApi } from '../services/companiesApi';
import { studyMaterialsApi } from '../services/studyMaterialsApi';
import type { Company } from '../types/company';
import type { StudyMaterial } from '../types/studyMaterial';

const domainColors: Record<string, string> = {
  CS: 'bg-primary-light text-primary',
  Cyber: 'bg-red-50 text-danger',
  Product: 'bg-green-50 text-success',
  Sales: 'bg-yellow-50 text-warning',
};

const fileTypeColors: Record<string, string> = {
  PDF: 'bg-red-100 text-red-700',
  DOC: 'bg-blue-100 text-blue-700',
  DOCX: 'bg-blue-100 text-blue-700',
  PPT: 'bg-orange-100 text-orange-700',
  PPTX: 'bg-orange-100 text-orange-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([companiesApi.getAll(), studyMaterialsApi.getAll()])
      .then(([cRes, mRes]) => {
        setCompanies(cRes.data.slice(0, 4));
        setMaterials(mRes.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const stats = [
    { label: 'Companies', value: '11', icon: <Building2 size={20} className="text-primary" />, bg: 'bg-primary-light' },
    { label: 'Study Materials', value: String(materials.length || '—'), icon: <FileText size={20} className="text-success" />, bg: 'bg-green-50' },
    { label: 'Resources', value: '17', icon: <Library size={20} className="text-warning" />, bg: 'bg-yellow-50' },
    { label: 'News Articles', value: '10', icon: <Newspaper size={20} className="text-info" />, bg: 'bg-blue-50' },
  ];

  const quickLinks = [
    { label: 'Preparation Resources', path: '/resources', icon: <Library size={16} />, desc: '17 curated resources' },
    { label: 'Study Materials', path: '/study-materials', icon: <FileText size={16} />, desc: 'Downloadable PDFs & notes' },
    { label: 'Attire Guide', path: '/attire', icon: <Shirt size={16} />, desc: 'Dress for success' },
    { label: 'Latest News', path: '/news', icon: <Newspaper size={16} />, desc: 'Campus placement updates' },
    { label: 'Crew Rating', path: '/crew-rating', icon: <Star size={16} />, desc: 'Rate your coordinators' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-heading">Good morning, {firstName} 👋</h1>
        <p className="text-sm text-muted mt-0.5">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-heading">{isLoading ? '—' : s.value}</div>
            <div className="text-sm text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Companies */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-heading">Recently Added Companies</h2>
              <Link to="/companies" className="btn-ghost text-xs">View all →</Link>
            </div>
            <div className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-border rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-border rounded w-1/3" />
                        <div className="h-2 bg-border rounded w-1/4" />
                      </div>
                    </div>
                  ))
                : companies.map((c) => (
                    <Link
                      key={c.id}
                      to={`/companies/${c.id}`}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-surface transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        c.domain === 'CS' ? 'bg-primary text-white' :
                        c.domain === 'Cyber' ? 'bg-danger text-white' :
                        c.domain === 'Product' ? 'bg-success text-white' : 'bg-warning text-white'
                      }`}>
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-heading text-sm truncate">{c.name}</p>
                        <p className="text-xs text-muted truncate">{c.job_role}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${domainColors[c.domain]}`}>
                        {c.domain}
                      </span>
                      <ChevronRight size={16} className="text-muted group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-heading">Quick Access</h2>
          </div>
          <div className="divide-y divide-border">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-6 py-3.5 hover:bg-surface transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-body truncate">{link.label}</p>
                  <p className="text-xs text-muted">{link.desc}</p>
                </div>
                <ChevronRight size={14} className="text-muted flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Study Materials Preview */}
      {materials.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-heading">Study Materials</h2>
            <Link to="/study-materials" className="btn-ghost text-xs">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map((m) => (
              <div key={m.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${fileTypeColors[m.file_type] || 'bg-surface text-muted'}`}>
                    {m.file_type || 'FILE'}
                  </span>
                  <span className="text-xs text-muted bg-surface border border-border px-2 py-0.5 rounded-full">{m.category}</span>
                </div>
                <h3 className="font-medium text-heading text-sm mb-1 line-clamp-2">{m.title}</h3>
                <p className="text-xs text-muted mb-4 line-clamp-2">{m.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Download size={12} /> {m.download_count} downloads
                  </span>
                  <Link to="/study-materials" className="btn-ghost text-xs py-1 px-2">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
