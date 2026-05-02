import React from 'react';
import { Check, X, Shirt } from 'lucide-react';

const Section = ({ type, items }: { type: 'do' | 'dont'; items: string[] }) => (
  <div className={`border-l-4 ${type === 'do' ? 'border-success' : 'border-danger'} pl-4 space-y-2`}>
    <h4 className={`font-semibold text-sm ${type === 'do' ? 'text-success' : 'text-danger'} flex items-center gap-1.5`}>
      {type === 'do' ? <Check size={16} /> : <X size={16} />}
      {type === 'do' ? "DO's" : "DON'Ts"}
    </h4>
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="text-sm text-body flex items-start gap-2">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${type === 'do' ? 'bg-success' : 'bg-danger'}`} />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default function AttirePage() {
  const male = {
    dos: ['Wear a well-fitted light-coloured full-sleeved formal shirt (white or light blue)',
      'Choose dark formal trousers (navy blue, charcoal grey, or black)',
      'Wear polished black or brown formal leather shoes',
      'Ensure your belt matches the colour of your shoes',
      'Maintain well-groomed hair and a clean-shaven look',
      'Clothes should be well-ironed and wrinkle-free',
      'Use a mild deodorant; avoid strong fragrances'],
    donts: ['Jeans, cargo pants, or corduroy trousers',
      'Sneakers, sandals, or casual footwear',
      'Loud printed or neon-coloured shirts',
      'Excessive jewellery or multiple rings',
      'Messy or unkempt hair / heavy stubble',
      'Casual T-shirts or graphic tees'],
  };

  const female = {
    dos: ['Formal Indian suit (salwar kameez) in subtle, muted colours',
      'For western wear: formal shirt with dark trousers or a knee-length skirt',
      'Neat hair — either well tied or professionally styled',
      'Closed-toe formal shoes or neat sandals with modest heels',
      'Minimal, subtle makeup that looks professional',
      'Simple jewellery — stud earrings and a light chain are ideal'],
    donts: ['Heavy, dangling jewellery or multiple bangles',
      'Deep necklines, sleeveless tops, or transparent fabrics',
      'Loud make-up or strong perfumes',
      'Casual footwear like flip-flops or very high heels',
      'Bright, neon-coloured clothing',
      'Overly tight or revealing outfits'],
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-heading">Interview Attire Guide</h1>
        <p className="text-sm text-muted mt-0.5">First impressions matter. Dress professionally and confidently.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Male */}
        <div className="card p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <Shirt size={20} />
            </div>
            <h2 className="font-bold text-heading text-lg">For Men</h2>
          </div>
          <div className="space-y-6">
            <Section type="do" items={male.dos} />
            <Section type="dont" items={male.donts} />
          </div>
        </div>

        {/* Female */}
        <div className="card p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-success flex items-center justify-center">
              <Shirt size={20} />
            </div>
            <h2 className="font-bold text-heading text-lg">For Women</h2>
          </div>
          <div className="space-y-6">
            <Section type="do" items={female.dos} />
            <Section type="dont" items={female.donts} />
          </div>
        </div>
      </div>

      {/* General Tips */}
      <div className="card p-7">
        <h2 className="font-bold text-heading mb-5">General Interview Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip) => (
            <div key={tip} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
              <Check size={16} className="text-success mt-0.5 flex-shrink-0" />
              <p className="text-sm text-body">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
