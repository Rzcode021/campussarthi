import { Link } from 'react-router-dom';
import { IndianRupee, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Company } from '../types/company';
import BookmarkButton from './BookmarkButton';
import { getDomainColor, getCompanyInitial } from '../utils/companyAvatar';

interface CompanyCardProps { company: Company; }

const ACCENT = '#3B82F6';

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.18 }}>
      <Link
        to={`/companies/${company.id}`}
        className="block rounded-2xl p-5 transition-all duration-200"
        style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}35`)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#1E2A45')}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl ${getDomainColor(company.domain)} font-bold text-base flex items-center justify-center flex-shrink-0`}>
            {getCompanyInitial(company.name)}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDomainColor(company.domain)}`}>
              {company.domain}
            </span>
            <BookmarkButton type="company" id={company.id} />
          </div>
        </div>

        <h3 className="font-bold text-white text-sm mb-0.5">{company.name}</h3>
        <p className="text-xs mb-3" style={{ color: '#475569' }}>{company.job_role}</p>

        <div className="flex items-center gap-1 mb-4">
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
              style={{ background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid #1E2A45' }}
            >
              {tech}
            </span>
          ))}
          {(company.tech_requirements || []).length > 3 && (
            <span className="text-[10px]" style={{ color: '#334155' }}>+{company.tech_requirements.length - 3}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold transition-all duration-200" style={{ color: ACCENT }}>
          View Details <ArrowRight size={12} />
        </div>
      </Link>
    </motion.div>
  );
}
