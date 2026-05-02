import React from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ArrowRight } from 'lucide-react';
import type { Company } from '../types/company';
import BookmarkButton from './BookmarkButton';
import { getDomainColor, getCompanyInitial } from '../utils/companyAvatar';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {

  return (
    <Link
      to={`/companies/${company.id}`}
      className="card p-6 block group hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl ${getDomainColor(company.domain)} font-bold text-lg flex items-center justify-center flex-shrink-0`}>
          {getCompanyInitial(company.name)}
        </div>
        {/* Domain badge + Bookmark */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDomainColor(company.domain)}`}>
            {company.domain}
          </span>
          <BookmarkButton type="company" id={company.id} />
        </div>
      </div>

      <h3 className="font-semibold text-heading text-base mb-0.5">{company.name}</h3>
      <p className="text-sm text-muted mb-3">{company.job_role}</p>

      {/* Salary */}
      <div className="flex items-center gap-1 mb-4">
        <span className="inline-flex items-center gap-1 bg-green-50 text-success text-xs font-medium px-2.5 py-1 rounded-full">
          <IndianRupee size={11} />
          {company.salary_lpa} LPA
        </span>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(company.tech_requirements || []).slice(0, 3).map((tech) => (
          <span key={tech} className="text-xs bg-surface text-muted px-2 py-0.5 rounded border border-border">
            {tech}
          </span>
        ))}
        {(company.tech_requirements || []).length > 3 && (
          <span className="text-xs text-muted">+{company.tech_requirements.length - 3}</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
        View Details <ArrowRight size={14} />
      </div>
    </Link>
  );
}
