import { Check, X, Shirt, User, Users, Monitor, CheckSquare, Scissors, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/* ── Design tokens ── */
const CARD  = '#FFFDF9';
const TEXT  = '#1F2937';
const MUTED = '#4B5563';
const BORD  = '#DDD8CF';
const GOLD  = '#D4A017';
const BROWN = '#8B6F47';
const NAVY  = '#4F46E5';


/* ── Helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as any } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: CARD, border: `1px solid ${BORD}`, boxShadow: '0 2px 16px rgba(139,111,71,0.08)' }}>
      {children}
    </div>
  );
}

function SectionHead({ icon, title, accent = GOLD }: { icon: React.ReactNode; title: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: `1px solid ${BORD}` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <h3 className="font-bold text-base" style={{ color: TEXT }}>{title}</h3>
    </div>
  );
}

function DoList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(133, 187, 169, 0.12)' }}>
            <Check size={11} color="#10B981" />
          </span>
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{item}</p>
        </li>
      ))}
    </ul>
  );
}

function DontList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(185,28,28,0.1)' }}>
            <X size={11} color="#DC2626" />
          </span>
          <p className="text-sm leading-relaxed" style={{ color: TEXT }}>{item}</p>
        </li>
      ))}
    </ul>
  );
}

function Accordion({ title, accent = GOLD, children }: { title: string; accent?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORD}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-150"
        style={{ background: open ? `${accent}10` : CARD }}
      >
        <span className="font-semibold text-sm" style={{ color: TEXT }}>{title}</span>
        <ChevronDown size={16} style={{ color: MUTED, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${BORD}`, background: CARD }}
          >
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Data ── */
const CHECKLIST = [
  { item: 'Printed Resume Copies (5–6)', tip: 'Keep in a clean folder' },
  { item: 'Formal Attire (ironed, wrinkle-free)', tip: 'Prepared the night before' },
  { item: 'Polished Formal Shoes', tip: 'No scuffs or dirt' },
  { item: 'Black or Blue Pen', tip: 'For signing documents' },
  { item: 'College ID / Offer Letter', tip: 'As required by the company' },
  { item: 'Notepad', tip: 'For noting down points' },
  { item: 'Phone on Silent Mode', tip: 'Before entering the venue' },
  { item: 'Confidence & Positive Attitude', tip: 'Your best accessory' },
];

const GROOMING = [
  { category: 'Hair', men: 'Neatly combed, no messy look', women: 'Tied back or professionally styled' },
  { category: 'Beard', men: 'Clean-shaved or well-trimmed', women: 'N/A' },
  { category: 'Hygiene', men: 'Fresh and clean, no body odour', women: 'Fresh and clean, no body odour' },
  { category: 'Fragrance', men: 'Mild deodorant only', women: 'Subtle perfume only' },
  { category: 'Nails', men: 'Trimmed and clean', women: 'Trimmed, neutral polish' },
  { category: 'Teeth', men: 'Brushed and clean breath', women: 'Brushed and clean breath' },
];

const SECTIONS = [
  {
    id: 'men',
    icon: <User size={17} />,
    title: 'Formal Attire for Men',
    accent: GOLD,
    emoji: '👔',
    dos: [
      'Well-fitted light-coloured full-sleeved formal shirt (white or light blue)',
      'Dark formal trousers — navy blue, charcoal grey, or black',
      'Polished black or brown formal leather shoes',
      'Belt matching the colour of your shoes',
      'Subtle tie in a complementary colour (optional but preferred)',
      'Well-groomed hair; clean-shaven or very neatly trimmed beard',
      'Mild deodorant — avoid strong fragrances',
    ],
    donts: [
      'Jeans, cargo pants, or corduroy trousers',
      'Sneakers, sandals, or casual footwear',
      'Loud printed or neon-coloured shirts',
      'Excessive jewellery or multiple rings',
      'Casual T-shirts or graphic tees',
      'Wrinkled or ill-fitting clothes',
    ],
    tips: ['Iron clothes the night before', 'Dark trousers pair with light shirts', 'Keep your shoes polished'],
  },
  {
    id: 'women',
    icon: <User size={17} />,
    title: 'Formal Attire for Women',
    accent: BROWN,
    emoji: '👗',
    dos: [
      'Formal Indian suit (salwar kameez) in subtle, muted colours',
      'Western option: formal shirt with dark trousers or a knee-length skirt',
      'Neat hair — well tied or professionally styled',
      'Closed-toe formal shoes or neat sandals with modest heels',
      'Minimal, subtle makeup that looks professional',
      'Simple jewellery — stud earrings and a light chain are ideal',
    ],
    donts: [
      'Heavy, dangling jewellery or multiple bangles',
      'Deep necklines, sleeveless tops, or transparent fabrics',
      'Loud makeup or strong perfumes',
      'Casual footwear like flip-flops or very high heels',
      'Bright neon-coloured clothing',
      'Overly tight or revealing outfits',
    ],
    tips: ['Neutral tones appear most professional', 'Minimal accessories work best', 'Avoid noisy jewellery'],
  },
  {
    id: 'gd',
    icon: <Users size={17} />,
    title: 'Group Discussion (GD) Attire',
    accent: '#059669',
    emoji: '🎤',
    dos: [
      'Same formal attire as interview — GD panels observe your presentation',
      'Comfortable clothing that allows you to sit and speak freely',
      'Well-groomed appearance — first impressions matter in GDs too',
      'Keep accessories minimal and non-distracting',
    ],
    donts: [
      'Casual clothing even for informal GDs',
      'Fidgeting accessories like loud bangles or chains',
      'Strong fragrances that may distract other participants',
      'Overly bright colours that draw negative attention',
    ],
    tips: ['Dress as if it were the final interview', 'Comfort matters — you\'ll be speaking for extended periods'],
  },
  {
    id: 'technical',
    icon: <Monitor size={17} />,
    title: 'Technical Interview Attire',
    accent: BROWN,
    emoji: '⚙️',
    dos: [
      'Smart casual is often acceptable at tech companies — but err on the side of formal',
      'Neat, clean, pressed clothing regardless of how casual the company culture seems',
      'Dark jeans with a formal collared shirt is acceptable at some product companies',
      'Ensure you are comfortable as technical rounds can be lengthy',
    ],
    donts: [
      'Completely casual clothing (T-shirts + joggers)',
      'Torn or faded denim',
      'Loud graphic prints or slogans',
    ],
    tips: ['When in doubt, go formal', 'Product companies (startups) accept smart-casual; service companies expect formal'],
  },
  {
    id: 'virtual',
    icon: <Monitor size={17} />,
    title: 'Virtual Interview Attire',
    accent: NAVY,
    emoji: '💻',
    dos: [
      'Wear full formal attire from top to bottom — even if only the upper half is visible',
      'Solid, non-distracting colours work best on camera (light blue, white, grey)',
      'Ensure your background is clean, minimal, and professional',
      'Good lighting — natural or ring light, facing your face',
      'Test your camera and microphone 15 minutes before',
    ],
    donts: [
      'Wearing casual clothes on the bottom half — you may have to stand up',
      'Busy patterned shirts that distort on camera',
      'Cluttered backgrounds with personal items visible',
      'Dark or dim room lighting',
    ],
    tips: ['Use a plain white or light-coloured wall as your background', 'Mute notifications before the call'],
  },
];

/* ── Main Component ── */
export default function AttirePage() {
  return (
    <div className="max-w-5xl mx-auto" style={{ background: 'transparent' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 mb-8"
        style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)', border: `1px solid ${BORD}` }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${BROWN})`, boxShadow: `0 4px 16px rgba(212,160,23,0.3)` }}>
            <Shirt size={22} color="#fff" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold mb-1" style={{ color: TEXT, letterSpacing: '-0.03em' }}>
              Placement Attire Guide
            </h1>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: MUTED }}>
              Dress professionally and create a strong first impression during interviews, group discussions and corporate interactions. Your appearance speaks before you do.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Attire Sections ── */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 mb-8">
        {SECTIONS.map((sec) => (
          <motion.div key={sec.id} variants={fadeUp}>
            <Accordion title={`${sec.emoji}  ${sec.title}`} accent={sec.accent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Do's */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>
                    ✓ Do's
                  </p>
                  <DoList items={sec.dos} />
                </div>
                {/* Don'ts */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#DC2626' }}>
                    ✗ Don'ts
                  </p>
                  <DontList items={sec.donts} />
                </div>
              </div>
              {/* Quick Tips */}
              <div className="mt-5 pt-4 flex flex-wrap gap-2" style={{ borderTop: `1px solid ${BORD}` }}>
                <span className="text-xs font-bold" style={{ color: MUTED }}>Quick Tips:</span>
                {sec.tips.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: `${sec.accent}10`, color: sec.accent, border: `1px solid ${sec.accent}20` }}>
                    {t}
                  </span>
                ))}
              </div>
            </Accordion>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Placement Day Checklist ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <Card className="p-6">
          <SectionHead icon={<CheckSquare size={17} />} title="Placement Day Checklist" accent={GOLD} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHECKLIST.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-150"
                style={{ background: '#F9FAFB', border: `1px solid ${BORD}` }}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${GOLD}20`, color: GOLD }}>
                  <Check size={13} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: TEXT }}>{item.item}</p>
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Grooming Guide ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <Card className="p-6">
          <SectionHead icon={<Scissors size={17} />} title="Grooming Guide" accent={BROWN} />
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORD}` }}>
            <div className="grid grid-cols-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ background: '#F5F1EA', borderBottom: `1px solid ${BORD}`, color: '#6B5432' }}>
              <span>Category</span><span>For Men</span><span>For Women</span>
            </div>
            {GROOMING.map((row, i) => (
              <div
                key={row.category}
                className="grid grid-cols-3 px-4 py-3.5 text-sm"
                style={{ background: i % 2 === 0 ? CARD : '#FBF8F2', borderBottom: i < GROOMING.length - 1 ? `1px solid ${BORD}` : 'none' }}
              >
                <span className="font-semibold" style={{ color: '#374151' }}>{row.category}</span>
                <span style={{ color: '#4B5563' }}>{row.men}</span>
                <span style={{ color: '#4B5563' }}>{row.women}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Common Mistakes ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <Card className="p-6">
          <SectionHead icon={<AlertTriangle size={17} />} title="Common Mistakes to Avoid" accent="#DC2626" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Wearing casuals because "it\'s just a first round"',
              'Applying heavy or loud cologne / perfume',
              'Forgetting to iron clothes the night before',
              'Wearing squeaky shoes that draw attention',
              'Overdressing with too much jewellery or accessories',
              'Messy or uncombed hair at the venue',
              'Wearing new shoes without breaking them in first',
              'Neglecting oral hygiene before the interview',
            ].map((mistake) => (
              <div key={mistake} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#FFF5F5', border: '1px solid #FEE2E2' }}>
                <X size={14} color="#EF4444" className="flex-shrink-0 mt-0.5" />
                <p className="text-sm" style={{ color: '#374151' }}>{mistake}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Body Language Tips ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card className="p-6">
          <SectionHead icon={<Users size={17} />} title="Body Language & Etiquette" accent="#059669" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { tip: 'Firm Handshake', desc: 'Conveys confidence — not too tight, not too weak' },
              { tip: 'Maintain Eye Contact', desc: 'Shows focus and engagement with the interviewer' },
              { tip: 'Sit Upright', desc: 'Good posture signals confidence and alertness' },
              { tip: 'Arrive 15 Minutes Early', desc: 'Allows you to compose yourself before the interview' },
              { tip: 'Phone on Silent', desc: 'Switch off notifications before entering the venue' },
              { tip: 'Knock Before Entering', desc: 'Always ask for permission before entering an interview room' },
            ].map(({ tip, desc }) => (
              <div key={tip} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #D1FAE5' }}>
                <Check size={14} color="#10B981" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#111827' }}>{tip}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
