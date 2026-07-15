import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Company } from '../types/company';
import BookmarkButton from './BookmarkButton';

interface CompanyCardProps { company: Company; }

const ACCENT = '#3B82F6';

const DOMAIN_STYLES: Record<string, { bg: string; text: string; badge: string; badgeText: string }> = {
  CS:      { bg: 'rgba(79,70,229,0.15)',  text: '#818CF8', badge: 'rgba(79,70,229,0.2)',  badgeText: '#A5B4FC' },
  Cyber:   { bg: 'rgba(220,38,38,0.15)',  text: '#FCA5A5', badge: 'rgba(220,38,38,0.2)',  badgeText: '#FCA5A5' },
  Product: { bg: 'rgba(5,150,105,0.15)',  text: '#6EE7B7', badge: 'rgba(5,150,105,0.2)',  badgeText: '#6EE7B7' },
  Sales:   { bg: 'rgba(217,119,6,0.15)',  text: '#FCD34D', badge: 'rgba(217,119,6,0.2)',  badgeText: '#FCD34D' },
  default: { bg: 'rgba(100,116,139,0.15)', text: '#94A3B8', badge: 'rgba(100,116,139,0.2)', badgeText: '#94A3B8' },
};

function getStyle(domain: string) {
  return DOMAIN_STYLES[domain] ?? DOMAIN_STYLES.default;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const [logoError, setLogoError] = useState(false);
  const style = getStyle(company.domain);
  const showLogo = company.logo && !logoError;

  return (
    <motion.div whileHover={{ y: -5, scale: 1.015 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
      <Link
        to={`/companies/${company.id}`}
        className="block rounded-2xl transition-all duration-250"
        style={{
          background: '#141B2D',
          border: '1px solid #1E2A45',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}45`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(59,130,246,0.12), 0 2px 8px rgba(0,0,0,0.3)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#1E2A45';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
        }}
      >
        {/* Logo area */}
        <div
          className="w-full rounded-t-2xl flex items-center justify-center overflow-hidden"
          style={{
            height: '100px',
            background: showLogo ? '#FFFFFF' : style.bg,
            borderBottom: '1px solid #1E2A45',
          }}
        >
          {showLogo ? (
            <img
              src={company.logo!}
              alt={`${company.name} logo`}
              onError={() => setLogoError(true)}
              style={{
                maxWidth: '80%',
                maxHeight: '72px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <span
              className="font-extrabold text-2xl select-none tracking-tight"
              style={{ color: style.text, letterSpacing: '-0.02em' }}
            >
              {getInitials(company.name)}
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm leading-tight truncate mb-0.5">{company.name}</h3>
              <p className="text-xs truncate" style={{ color: '#64748B' }}>{company.job_role}</p>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{ background: style.badge, color: style.badgeText }}
              >
                {company.domain}
              </span>
              <BookmarkButton type="company" id={company.id} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#6EE7B7' }}
            >
              <IndianRupee size={10} /> {company.salary_lpa} LPA
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {(company.tech_requirements || []).slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B', border: '1px solid #263048' }}
              >
                {tech}
              </span>
            ))}
            {(company.tech_requirements || []).length > 3 && (
              <span className="text-[10px] font-medium" style={{ color: '#475569' }}>
                +{company.tech_requirements.length - 3} more
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1 text-xs font-semibold transition-all duration-200"
            style={{ color: ACCENT }}
          >
            View Details <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
