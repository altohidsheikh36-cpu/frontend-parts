import React from 'react';
import { Users, TrendingUp, Clock, Calendar, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimateOnScroll from './AnimateOnScroll';

const StatCard = ({ Icon, value, label }) => (
  <div className="hover-lift rounded-xl bg-[#0f1114] border border-white/6 p-5 flex items-center gap-4 shadow-sm">
    <div className="h-12 w-12 rounded-lg bg-olx-teal/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
      <Icon className="w-5 h-5 text-olx-teal" />
    </div>
    <div>
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  </div>
);

const Sellers = () => {
  const stats = [
    { Icon: Users, value: '680+', label: 'Active verified sellers on platform' },
    { Icon: TrendingUp, value: '₹2.4Cr+', label: 'Total GMV paid out to sellers' },
    { Icon: Clock, value: '2 min', label: 'Average time to list your first part' },
    { Icon: Calendar, value: 'T+2', label: 'Days to receive UPI payout after delivery' },
  ];

  return (
    <section className="py-16" style={{ background: 'linear-gradient(90deg,#0b0d0f 0%, #071415 100%)' }}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <AnimateOnScroll animation="fade-right">
            <div className="text-emerald-500 text-sm font-semibold mb-4">FOR SELLERS</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
              Turn your
              <span className="block text-olx-teal"> scrap yard</span>
              <span className="block">into a pan-India business.</span>
            </h2>
            <p className="text-white/70 mb-6">Join 680+ verified sellers already earning on AutoMart. List for free. Get orders from buyers across India. Get paid directly to your bank via UPI.</p>

            <ul className="space-y-4 mb-6">
              {['Free to list — always', 'WhatsApp order alerts', 'Bulk upload via CSV', 'GST invoices auto-generated'].map((t, i) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 h-7 w-7 shrink-0 rounded-full bg-olx-teal flex items-center justify-center text-white transition-transform duration-300 hover:scale-110">
                    <Check className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-semibold text-white">{t}</div>
                    <div className="text-white/60 text-sm">
                      {i === 0
                        ? 'No listing fees. We only earn a small commission when you sell.'
                        : i === 1
                          ? 'Get notified the moment an order comes in — no app download needed.'
                          : i === 2
                            ? 'List 500 parts in minutes. Perfect for scrap yards with large inventory.'
                            : 'Every sale generates a compliant GST invoice automatically.'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                to="/add-part"
                className="btn-shine bg-amber px-6 py-3 rounded-lg font-semibold text-white shadow-md inline-flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              >
                Start selling free <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/"
                className="border border-white/10 px-5 py-3 rounded-lg text-white/90 text-center transition-all duration-300 hover:border-white/30 hover:bg-white/5"
              >
                See how it works
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="space-y-4">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={stat.label} animation="fade-left" delay={i * 100} className="group">
                <StatCard Icon={stat.Icon} value={stat.value} label={stat.label} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sellers;
