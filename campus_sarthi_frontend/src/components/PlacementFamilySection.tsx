import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X } from 'lucide-react';
import { placementFamilyApi } from '../services/crewApi';

/* ─── Types ─── */
export type PlacementMember = {
  id: number;
  name: string;
  role: 'Faculty' | 'Mentor' | 'Crew' | 'Lead';
  image: string | null;
  hierarchy_level: number;
};

/* ─── Helper: Initials Avatar ─── */
function getInitials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const ROLE_COLORS: Record<PlacementMember['role'], { glow: string; border: string; bg: string; text: string }> = {
  Faculty: {
    glow: 'rgba(59,130,246,0.65)',
    border: 'rgba(59,130,246,0.8)',
    bg: 'rgba(59,130,246,0.12)',
    text: '#3B82F6',
  },
  Mentor: {
    glow: 'rgba(99,102,241,0.65)',
    border: 'rgba(99,102,241,0.9)',
    bg: 'rgba(99,102,241,0.12)',
    text: '#6366F1',
  },
  Lead: {
    glow: 'rgba(6,182,212,0.8)',
    border: 'rgba(6,182,212,1)',
    bg: 'rgba(6,182,212,0.15)',
    text: '#06B6D4',
  },
  Crew: {
    glow: 'rgba(59,130,246,0.4)',
    border: 'rgba(59,130,246,0.55)',
    bg: 'rgba(59,130,246,0.08)',
    text: '#3B82F6',
  },
};

/* ─── Node Component ─── */
function MemberNode({
  member,
  size = 100,
  delay = 0,
  onClick,
}: {
  member: PlacementMember;
  size?: number;
  delay?: number;
  onClick: (m: PlacementMember) => void;
}) {
  const c = ROLE_COLORS[member.role];
  const initials = getInitials(member.name);
  const fontSize = size * 0.22;

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer"
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.1, y: -4 }}
      onClick={() => onClick(member)}
      style={{ width: size + 32 }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5 + delay * 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            padding: 3,
            background: `radial-gradient(circle, ${c.border} 0%, transparent 70%)`,
            boxShadow: `0 0 ${size * 0.35}px ${c.glow}, 0 0 ${size * 0.15}px ${c.glow}`,
          }}
        >
          {/* Inner circle */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: `2px solid ${c.border}`,
              background: '#fff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${c.bg} 0%, #e0f0ff 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize,
                  fontWeight: 700,
                  color: c.text,
                  letterSpacing: '0.04em',
                }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Name tag */}
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: `1px solid ${c.border}`,
          boxShadow: `0 0 10px ${c.glow}`,
          borderRadius: 8,
          padding: '2px 8px',
          maxWidth: size + 24,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#1e293b',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {member.name}
        </p>
        <p style={{ fontSize: 9, fontWeight: 600, color: c.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Multi-level Pyramid Crew Tree ─── */
function CrewPyramidTree({
  lead,
  crew,
  onNodeClick,
}: {
  lead: PlacementMember | undefined;
  crew: PlacementMember[];
  onNodeClick: (m: PlacementMember) => void;
}) {
  const connectorColor = 'rgba(59,130,246,0.5)';

  // Group crew by hierarchy_level, sorted ascending
  const tierMap: Record<number, PlacementMember[]> = {};
  crew.forEach((m) => {
    if (!tierMap[m.hierarchy_level]) tierMap[m.hierarchy_level] = [];
    tierMap[m.hierarchy_level].push(m);
  });
  const tierLevels = Object.keys(tierMap)
    .map(Number)
    .sort((a, b) => a - b);

  // Node sizes per row (Lead → Tier1 → Tier2 → Tier3)
  const LEAD_SIZE = 130;
  const tierSizes = [88, 76, 64];
  const ROW_V_GAP = 80; // vertical gap between rows

  // Tier label names
  const tierLabels: Record<number, string> = {};
  tierLevels.forEach((lv, idx) => {
    tierLabels[lv] = idx === 0
      ? 'Senior Coordinators'
      : idx === 1
        ? 'Core Coordinators'
        : 'Junior Coordinators';
  });

  return (
    <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      {/* ── Lead row ── */}
      {lead && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: ROW_V_GAP }}>
          <MemberNode member={lead} size={LEAD_SIZE} delay={0} onClick={onNodeClick} />
        </div>
      )}

      {/* ── Tier rows ── */}
      {tierLevels.map((lv, tierIdx) => {
        const members = tierMap[lv];
        const nodeSize = tierSizes[Math.min(tierIdx, tierSizes.length - 1)];
        const isLast = tierIdx === tierLevels.length - 1;

        return (
          <div key={lv} style={{ position: 'relative' }}>
            {/* Connector bar from tier above */}
            {(lead || tierIdx > 0) && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: 0,
                  marginBottom: 0,
                  position: 'relative',
                }}
              >
                {/* Vertical stem down into this row */}
                <div
                  style={{
                    width: 2,
                    height: 32,
                    background: `linear-gradient(to bottom, ${connectorColor}, ${connectorColor})`,
                    boxShadow: `0 0 6px rgba(59,130,246,0.4)`,
                    borderRadius: 2,
                  }}
                />
              </div>
            )}

            {/* Tier label badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 14px',
                  borderRadius: 20,
                  background: `rgba(59,130,246,${0.07 + tierIdx * 0.02})`,
                  border: `1px solid rgba(59,130,246,${0.2 + tierIdx * 0.05})`,
                  color: `rgba(37,99,235,${0.8 + tierIdx * 0.07})`,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: `rgba(59,130,246,${0.5 + tierIdx * 0.15})`,
                    boxShadow: `0 0 6px rgba(59,130,246,0.6)`,
                    display: 'inline-block',
                  }}
                />
                {tierLabels[lv]} &nbsp;·&nbsp; {members.length}
              </span>
            </div>

            {/* Horizontal connector spanning all nodes in this tier */}
            {members.length > 1 && (
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + tierIdx * 0.15 }}
                  style={{
                    height: 2,
                    width: `min(${members.length * (nodeSize + 20)}px, 100%)`,
                    background: `linear-gradient(90deg, transparent, ${connectorColor} 10%, ${connectorColor} 90%, transparent)`,
                    boxShadow: `0 0 8px rgba(59,130,246,0.35)`,
                    borderRadius: 2,
                    transformOrigin: 'center',
                  }}
                />
              </div>
            )}

            {/* Member nodes grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + tierIdx * 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: tierIdx === 0 ? 28 : tierIdx === 1 ? 18 : 12,
                padding: `0 ${tierIdx * 8}px`,
              }}
            >
              {members.map((m, i) => (
                <MemberNode
                  key={m.id}
                  member={m}
                  size={nodeSize}
                  delay={0.3 + tierIdx * 0.15 + i * 0.05}
                  onClick={onNodeClick}
                />
              ))}
            </motion.div>

            {/* Space between tiers */}
            {!isLast && <div style={{ height: ROW_V_GAP }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Member Modal ─── */
function MemberModal({ member, onClose }: { member: PlacementMember; onClose: () => void }) {
  const c = ROLE_COLORS[member.role];
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: 'rgba(0,20,50,0.55)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: 24,
            padding: 40,
            minWidth: 280,
            maxWidth: 380,
            boxShadow: `0 0 60px ${c.glow}, 0 20px 60px rgba(0,0,0,0.15)`,
            border: `1.5px solid ${c.border}`,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
            }}
          >
            <X size={18} />
          </button>

          {/* Avatar */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              margin: '0 auto 16px',
              border: `3px solid ${c.border}`,
              boxShadow: `0 0 30px ${c.glow}`,
              overflow: 'hidden',
              background: c.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: c.text,
            }}
          >
            {member.image ? (
              <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(member.name)
            )}
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{member.name}</h3>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 14px',
              borderRadius: 20,
              background: c.bg,
              color: c.text,
              border: `1px solid ${c.border}`,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {member.role}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: 6,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </motion.h3>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ fontSize: 13, color: '#64748b', maxWidth: 480, margin: '0 auto' }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          height: 2,
          width: 60,
          margin: '10px auto 0',
          background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
          borderRadius: 2,
          boxShadow: '0 0 12px rgba(59,130,246,0.6)',
        }}
      />
    </div>
  );
}

/* ─── MAIN SECTION ─── */
export default function PlacementFamilySection() {
  const [members, setMembers] = useState<PlacementMember[]>([]);
  const [selected, setSelected] = useState<PlacementMember | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const load = useCallback(() => {
    setLoading(true);
    placementFamilyApi
      .getAll()
      .then((r) => setMembers(r.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const faculties = members.filter((m) => m.role === 'Faculty').sort((a, b) => a.hierarchy_level - b.hierarchy_level);
  const mentors = members.filter((m) => m.role === 'Mentor').sort((a, b) => a.hierarchy_level - b.hierarchy_level);
  const crewLead = members.find((m) => m.role === 'Lead');
  const crewMembers = members.filter((m) => m.role === 'Crew').sort((a, b) => a.hierarchy_level - b.hierarchy_level);

  const isEmpty = !loading && members.length === 0;

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#f8fbff',
        padding: '80px 24px 100px',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Radial glow BG */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.09) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99,102,241,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '4px 16px',
              borderRadius: 20,
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#3B82F6',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Our Ecosystem
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: 12,
            }}
          >
            Placement{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.4))',
              }}
            >
              Family
            </span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
            The people who guide, support and empower every student's journey toward a successful career.
          </p>
        </motion.div>

        {isEmpty && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p style={{ fontSize: 14 }}>No placement family members added yet.</p>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '3px solid rgba(59,130,246,0.2)',
                borderTopColor: '#3B82F6',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && !isEmpty && (
          <>
            {/* ─── FACULTY ROW ─── */}
            {faculties.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ marginBottom: 72 }}
              >
                <SectionHeader title="Our Faculty" subtitle="The academic pillars behind every placement success" />
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                  {faculties.map((m, i) => (
                    <MemberNode key={m.id} member={m} size={110} delay={0.1 + i * 0.1} onClick={setSelected} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── MENTORS ROW ─── */}
            {mentors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
                style={{ marginBottom: 72 }}
              >
                {/* Mentor section glass card */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    border: '1.5px solid rgba(99,102,241,0.25)',
                    borderRadius: 24,
                    padding: '36px 40px',
                    boxShadow: '0 0 40px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.06)',
                    backdropFilter: 'blur(16px)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Animated border glow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 24,
                      background:
                        'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 50%, rgba(59,130,246,0.06) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <SectionHeader
                    title="Training & Placement Mentors"
                    subtitle="Guiding students for 4 years towards successful placements"
                  />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
                    {mentors.map((m, i) => (
                      <MemberNode key={m.id} member={m} size={130} delay={0.1 + i * 0.1} onClick={setSelected} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── CREW HIERARCHY ─── */}
            {(crewLead || crewMembers.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <SectionHeader
                  title="Placement Crew"
                  subtitle="Our dedicated team of student coordinators driving the entire placement ecosystem"
                />
                <CrewPyramidTree lead={crewLead} crew={crewMembers} onNodeClick={setSelected} />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
