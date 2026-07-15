import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Users, Newspaper,
  ArrowRight, Sparkles, Shield, ChevronDown, Star, Calendar
} from 'lucide-react';
import PlacementFamilySection from '../components/PlacementFamilySection';

/* ─── Animation Variants (defined once, reused) ─── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: EASE },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const childFade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/* ─── Reusable Components ─── */
const GoldButton = memo(({
  to, children, className = '',
}: { to: string; children: React.ReactNode; className?: string }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
    <Link to={to} className={`btn-gold ${className}`}>
      {children}
    </Link>
  </motion.div>
));

const OutlineButton = memo(({
  to, children,
}: { to: string; children: React.ReactNode }) => (
  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
    <Link
      to={to}
      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm border transition-all duration-200"
      style={{
        color: '#FFD700',
        borderColor: 'rgba(255,215,0,0.3)',
        background: 'rgba(255,215,0,0.06)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.6)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,215,0,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.3)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,215,0,0.06)';
      }}
    >
      {children}
    </Link>
  </motion.div>
));

const StatItem = memo(({ number, label }: { number: string; label: string }) => (
  <div className="text-center px-6 py-4">
    <div className="text-2xl font-extrabold text-gold-gradient mb-0.5">{number}</div>
    <div className="text-xs text-neutral-500 font-medium tracking-wide uppercase">{label}</div>
  </div>
));

const FeatureCard = memo(({
  icon, title, desc, accent,
}: { icon: React.ReactNode; title: string; desc: string; accent: string }) => (
  <motion.div
    variants={childFade}
    whileHover={{ y: -4, scale: 1.015 }}
    transition={{ duration: 0.2 }}
    className="rounded-2xl p-6 border cursor-default gpu"
    style={{
      background: '#111111',
      borderColor: '#1E1E1E',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = accent + '33';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = '#1E1E1E';
    }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
      style={{ background: accent + '18', border: `1px solid ${accent}30` }}
    >
      {icon}
    </div>
    <h3 className="font-bold text-neutral-100 text-base mb-2">{title}</h3>
    <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
  </motion.div>
));

/* ─── MAIN PAGE ─── */
export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: '#0B0B0B', color: '#e5e5e5', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Subtle radial glow behind hero — static, no animation */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,215,0,0.08) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        {/* ── NAVBAR ── */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center justify-between px-8 py-4 sticky top-0 z-50"
          style={{
            background: 'rgba(11,11,11,0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '1px solid rgba(255,215,0,0.07)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
            >
              <Sparkles size={14} className="text-black" />
            </div>
            <span className="font-bold text-lg text-gold-gradient">Campus Sarthi</span>
          </div>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.15 }}>
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ color: '#a3a3a3', border: '1px solid #222' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#e5e5e5';
                  (e.currentTarget as HTMLElement).style.borderColor = '#444';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#a3a3a3';
                  (e.currentTarget as HTMLElement).style.borderColor = '#222';
                }}
              >
                Sign In
              </Link>
            </motion.div>
            <GoldButton to="/request-access" className="px-5 py-2 text-sm">
              Get Started
            </GoldButton>
          </div>
        </motion.nav>

        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 min-h-[90vh]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.25)',
              color: '#FFD700',
            }}
          >
            🎓 Placement Portal — Built for Students
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.15}
            className="font-extrabold leading-none tracking-tight mb-5 max-w-4xl"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', letterSpacing: '-0.03em' }}
          >
            <span className="block text-white mb-1">Welcome to</span>
            <motion.span
              className="block text-gold-gradient"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
              style={{ display: 'block', filter: 'drop-shadow(0 0 24px rgba(255,215,0,0.35))' }}
            >
              Campus Sarthi
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#737373' }}
          >
            Your launchpad to a successful placement. Verified company profiles,{' '}
            <span style={{ color: '#a3a3a3' }}>curated prep resources</span>, and real insights —
            all in one powerful platform.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.42}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <GoldButton to="/request-access" className="px-7 py-3 text-base gap-2">
              <Sparkles size={15} /> Get Started Free <ArrowRight size={15} />
            </GoldButton>
            <OutlineButton to="/companies">
              <Building2 size={15} /> Explore Companies
            </OutlineButton>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: '#60A5FA',
                border: '1px solid rgba(96,165,250,0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(96,165,250,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.6)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(96,165,250,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <Calendar size={16} /> Crew Events
            </Link>
            <Link
              to="/crew-rating"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: '#FFD700',
                border: '1px solid rgba(255,215,0,0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,215,0,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.6)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(255,215,0,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <Star size={16} /> Rate Our Crew
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.52}
            className="text-xs mb-12"
            style={{ color: '#525252' }}
          >
            Trusted by <span style={{ color: '#737373' }}>500+ students</span> across departments · 100% Free
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="flex flex-col items-center gap-1.5"
            style={{ color: '#404040' }}
          >
            <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
            <ChevronDown size={14} />
          </motion.div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl mx-auto rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1E1E1E]"
            style={{
              background: '#111111',
              border: '1px solid #1E1E1E',
            }}
          >
            {[
              { number: '50+', label: 'Companies' },
              { number: '200+', label: 'Questions' },
              { number: '50+', label: 'Crew Members' },
              { number: '100%', label: 'Free' },
            ].map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </motion.div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
              className="text-center mb-14"
            >
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}
              >
                ✦ Everything You Need
              </span>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white mb-3"
                style={{ letterSpacing: '-0.025em' }}
              >
                One platform.{' '}
                <span className="text-gold-gradient">All placement resources.</span>
              </h2>
              <p style={{ color: '#525252' }}>Built from the ground up for students who mean business.</p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {[
                {
                  icon: <Building2 size={20} color="#60A5FA" />, title: 'Company Profiles', accent: '#60A5FA',
                  desc: 'Browse 50+ verified companies with GD questions, interview rounds, salary details, and tech requirements.'
                },
                {
                  icon: <FileText size={20} color="#34D399" />, title: 'Study Materials', accent: '#34D399',
                  desc: 'Download curated PDFs, notes, and prep sheets reviewed and approved by your placement team.'
                },
                {
                  icon: <Users size={20} color="#F59E0B" />, title: 'Crew Support', accent: '#F59E0B',
                  desc: 'Rate and connect with student coordinators guiding you through mock interviews, GDs, and the full process.'
                },
                {
                  icon: <Newspaper size={20} color="#A78BFA" />, title: 'Latest News', accent: '#A78BFA',
                  desc: 'Stay updated with campus placement news, company visit announcements, and industry hiring trends.'
                },
              ].map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── PLACEMENT FAMILY ── */}
        <PlacementFamilySection />

        {/* ── FINAL CTA ── */}
        <section className="px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl mx-auto text-center rounded-3xl py-20 px-8 relative overflow-hidden"
            style={{
              background: '#0F0F0F',
              border: '1px solid rgba(255,215,0,0.12)',
            }}
          >
            {/* Static glow spot */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,215,0,0.07), transparent)' }}
            />
            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
              >
                <Shield size={11} /> 100% Free for Students
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ letterSpacing: '-0.025em' }}
              >
                Ready to begin your{' '}
                <span className="text-gold-gradient">placement journey?</span>
              </h2>
              <p className="mb-10 text-base" style={{ color: '#525252' }}>
                Join hundreds of students already accelerating their careers.
              </p>
              <GoldButton to="/request-access" className="px-9 py-3.5 text-base gap-2.5">
                <Sparkles size={16} /> Request Access <ArrowRight size={16} />
              </GoldButton>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="text-center py-6 text-xs"
          style={{ borderTop: '1px solid #141414', color: '#404040' }}
        >
          <span className="text-gold-gradient font-semibold">Campus Sarthi</span>
          {' '}— Built By Saksham 💛 for students. © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
