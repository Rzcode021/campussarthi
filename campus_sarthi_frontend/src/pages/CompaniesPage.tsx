import React, { useEffect, useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import { companiesApi } from '../services/companiesApi';
import type { Company } from '../types/company';
import CompanyCard from '../components/CompanyCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const DOMAINS = ['All', 'CS', 'Cyber', 'Product', 'Sales'];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      companiesApi.getAll(
        activeDomain !== 'All' ? activeDomain : undefined,
        search || undefined
      )
        .then((res) => setCompanies(res.data))
        .catch(() => setCompanies([]))
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [activeDomain, search]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Companies</h1>
          <p className="text-sm text-muted mt-0.5">Explore available placement opportunities</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            className="form-input pl-9"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Domain Tabs */}
      <div className="flex gap-1 border-b border-border mb-8">
        {DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeDomain === d
                ? 'text-primary'
                : 'text-muted hover:text-body'
            }`}
          >
            {d}
            {activeDomain === d && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {companies.map((c) => <CompanyCard key={c.id} company={c} />)}
        </div>
      ) : (
        <EmptyState
          icon={<Building2 size={48} />}
          title="No companies found"
          subtitle="Try adjusting your search or domain filter."
        />
      )}
    </div>
  );
}
