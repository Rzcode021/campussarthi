import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, FileText, Users, Newspaper, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.6]" 
             style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 opacity-[0.08]" 
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-4 border-b border-border glass sticky top-0 z-50">
        <span className="text-primary font-bold text-lg">Campus Sarthi</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
          <Link to="/request-access" className="btn-primary text-sm px-4 py-2">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-8 text-center max-w-4xl mx-auto">
        <span className="inline-block bg-primary-light text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6">
          🎓 Placement Portal — Campus Sarthi
        </span>
        <h1 className="text-5xl font-bold text-heading leading-tight mb-6 max-w-2xl mx-auto">
          Your Campus Placement Journey Starts Here
        </h1>
        <p className="text-lg text-body max-w-xl mx-auto mb-10 leading-relaxed">
          Campus Sarthi brings you verified company profiles, curated prep resources, and placement insights — all in one place, built for your success.
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <Link to="/request-access" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-base">
            Get Started Free
          </Link>
          <Link to="/login" className="bg-white text-body border border-border px-6 py-3 rounded-lg hover:bg-surface transition font-semibold text-base">
            Sign In →
          </Link>
        </div>
        <p className="text-sm text-muted">Trusted by 500+ students across departments</p>
      </section>

      {/* Stats bar */}
      <section className="bg-surface border-y border-border py-8 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
          {[
            { number: '50+', label: 'Companies' },
            { number: '200+', label: 'Interview Questions' },
            { number: '6', label: 'Crew Members' },
            { number: '100%', label: 'Free to Use' },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-6 py-2">
              <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-heading text-center mb-3">Everything you need to get placed</h2>
          <p className="text-muted text-center mb-12">One platform. All placement resources. Zero cost.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Building2 size={24} className="text-primary" />,
                title: 'Company Profiles',
                desc: 'Browse 50+ verified companies with GD questions, interview rounds, salary details, and tech requirements — all in one place.',
              },
              {
                icon: <FileText size={24} className="text-success" />,
                title: 'Study Materials',
                desc: 'Download curated PDFs, notes, and prep sheets reviewed and approved by your placement team.',
              },
              {
                icon: <Users size={24} className="text-warning" />,
                title: 'Crew Support',
                desc: 'Rate and connect with student coordinators guiding you through mock interviews, GDs, and the entire placement process.',
              },
              {
                icon: <Newspaper size={24} className="text-info" />,
                title: 'Latest News',
                desc: 'Stay updated with campus placement news, company visit announcements, and industry hiring trends.',
              },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-heading text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-20">
        <div className="max-w-5xl mx-auto bg-primary rounded-2xl py-16 px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to begin your placement journey?</h2>
          <p className="text-indigo-200 mb-8 text-base">Join hundreds of students already using Campus Sarthi.</p>
          <Link
            to="/request-access"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition text-base"
          >
            Request Access <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
}
