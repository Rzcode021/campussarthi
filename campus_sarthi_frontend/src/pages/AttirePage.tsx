import { Check, X, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';

const ACCENT = '#F59E0B'; // Amber

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

const Section = ({ type, items }: { type: 'do' | 'dont'; items: string[] }) => (
  <div className="space-y-2">
    <h4
      className="font-bold text-xs flex items-center gap-1.5 mb-3"
      style={{ color: type === 'do' ? '#6EE7B7' : '#FCA5A5' }}
    >
      {type === 'do' ? <Check size={13} /> : <X size={13} />}
      {type === 'do' ? "DO's" : "DON'Ts"}
    </h4>
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="text-xs flex items-start gap-2" style={{ color: '#64748B' }}>
          <span
            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: type === 'do' ? '#10B981' : '#EF4444' }}
          />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default function AttirePage() {
  const male = {
    dos: [
      'Wear a well-fitted light-coloured full-sleeved formal shirt (white or light blue)',
      'Choose dark formal trousers (navy blue, charcoal grey, or black)',
      'Wear polished black or brown formal leather shoes',
      'Ensure your belt matches the colour of your shoes',
      'Maintain well-groomed hair and a clean-shaven look',
      'Clothes should be well-ironed and wrinkle-free',
      'Use a mild deodorant; avoid strong fragrances',
    ],
    donts: [
      'Jeans, cargo pants, or corduroy trousers',
      'Sneakers, sandals, or casual footwear',
      'Loud printed or neon-coloured shirts',
      'Excessive jewellery or multiple rings',
      'Messy or unkempt hair / heavy stubble',
      'Casual T-shirts or graphic tees',
    ],
  };

  const female = {
    dos: [
      'Formal Indian suit (salwar kameez) in subtle, muted colours',
      'For western wear: formal shirt with dark trousers or a knee-length skirt',
      'Neat hair — either well tied or professionally styled',
      'Closed-toe formal shoes or neat sandals with modest heels',
      'Minimal, subtle makeup that looks professional',
      'Simple jewellery — stud earrings and a light chain are ideal',
    ],
    donts: [
      'Heavy, dangling jewellery or multiple bangles',
      'Deep necklines, sleeveless tops, or transparent fabrics',
      'Loud make-up or strong perfumes',
      'Casual footwear like flip-flops or very high heels',
      'Bright, neon-coloured clothing',
      'Overly tight or revealing outfits',
    ],
  };

  const tips = [
    'Arrive at least 15 minutes early to compose yourself',
    'Carry 5–6 printed copies of your resume in a folder',
    'Keep a notepad and pen handy during interviews',
    'Switch your phone to silent mode before entering',
    'Offer a firm handshake and maintain eye contact',
    'Sit upright — good posture signals confidence',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
        className="rounded-2xl p-5 mb-7"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
            <Shirt size={15} style={{ color: ACCENT }} />
          </div>
          <h1 className="text-lg font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Interview Attire Guide</h1>
        </div>
        <p className="text-xs" style={{ color: '#64748B' }}>First impressions matter. Dress professionally and confidently.</p>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Men */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
          className="rounded-2xl p-6"
          style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${ACCENT}30`)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E2A45')}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}25` }}>
              <Shirt size={17} style={{ color: ACCENT }} />
            </div>
            <h2 className="font-bold text-white text-base">For Men</h2>
          </div>
          <div className="space-y-6">
            <Section type="do" items={male.dos} />
            <Section type="dont" items={male.donts} />
          </div>
        </motion.div>

        {/* Women */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
          className="rounded-2xl p-6"
          style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${ACCENT}30`)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E2A45')}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Shirt size={17} style={{ color: '#10B981' }} />
            </div>
            <h2 className="font-bold text-white text-base">For Women</h2>
          </div>
          <div className="space-y-6">
            <Section type="do" items={female.dos} />
            <Section type="dont" items={female.donts} />
          </div>
        </motion.div>
      </motion.div>

      {/* General Tips */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show"
        className="rounded-2xl p-6"
        style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
      >
        <h2 className="font-bold text-white text-sm mb-5">General Interview Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-3 p-3.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1A2236' }}
            >
              <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
              <p className="text-xs" style={{ color: '#64748B' }}>{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
