
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BadgeCheck, Lock, Sparkles } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const [homeSearch, setHomeSearch] = useState('');
  const [counts, setCounts] = useState([12400, 5000, 680]);

  useEffect(() => {
    const targets = [12400, 5000, 680];
    const steps = 40;
    const timers = [];
    targets.forEach((t, i) => {
      let cur = 0;
      const step = Math.max(10, Math.round(t / steps));
      const id = setInterval(() => {
        cur += step;
        setCounts((s) => {
          const copy = [...s];
          copy[i] = Math.min(cur, t);
          return copy;
        });
        if (cur >= t) clearInterval(id);
      }, 30 + i * 10);
      timers.push(id);
    });
    return () => timers.forEach((id) => clearInterval(id));
  }, []);

  function handleHomeSearch(e) {
    if (e && e.preventDefault) e.preventDefault();
    navigate('/parts');
  }

  const trustChips = [
    { icon: BadgeCheck, text: 'Verified sellers' },
    { icon: Lock, text: 'UPI & COD' },
    { icon: Sparkles, text: '7-day returns' },
  ];

  const hints = ['Maruti Swift alternator', 'Nexon bumper', 'i20 clutch plate', 'Innova radiator'];

  return (
    <div className="text-olx-dark bg-mesh-hero bg-olx-bg overflow-x-hidden">
      <section className="pt-4 pb-8 sm:pt-6 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left column */}
          <div className="pt-2 sm:pt-6 min-w-0">
            <div className="anim-enter anim-d1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 mb-4 sm:mb-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-700">
                <span className="live-pulse h-2 w-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                12,400+ parts live
              </span>
              <span className="text-xs sm:text-sm text-olx-muted leading-snug">
                Trusted by 5,000+ buyers across India
              </span>
            </div>

            <h1 className="anim-enter anim-d2 text-[2rem] leading-[1.08] sm:text-4xl sm:leading-[1.05] md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-extrabold tracking-tight mb-4 text-balance">
              Find the <span className="text-olx-teal">exact part</span>
              {' '}your car needs — at the right price.
            </h1>

            <p className="anim-enter anim-d3 text-base sm:text-lg text-olx-muted max-w-xl mb-6">
              Search by car model, OEM number or part name. Genuine used parts from verified scrap dealers and sellers across India. Delivered to your door.
            </p>

            <form onSubmit={handleHomeSearch} className="anim-enter anim-d4 max-w-xl w-full">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 rounded-full bg-white border border-olx-border py-2 px-3 sm:px-4 shadow-sm transition-shadow duration-300 focus-within:ring-2 focus-within:ring-olx-teal/25 focus-within:shadow-md">
                  <Search className="w-5 h-5 shrink-0 text-olx-muted" />
                  <input
                    type="text"
                    value={homeSearch}
                    onChange={(e) => setHomeSearch(e.target.value)}
                    placeholder={'Try "Maruti Swift brake pad"'}
                    className="min-w-0 w-full outline-none bg-transparent text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-shine w-full sm:w-auto shrink-0 rounded-full bg-olx-teal text-white px-5 py-3 sm:py-2.5 font-semibold shadow-cta hover:brightness-95 hover:shadow-cta-hover transition-all duration-300 active:scale-[0.98]"
                >
                  Search
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                {hints.map((h, i) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHomeSearch(h)}
                    className="anim-enter px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-olx-border text-xs sm:text-sm text-olx-muted shadow-sm transition-all duration-300 hover:border-olx-teal/40 hover:text-olx-dark hover:shadow-md active:scale-[0.97]"
                    style={{ animationDelay: `${0.45 + i * 0.06}s` }}
                  >
                    {h}
                  </button>
                ))}
              </div>

              <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                {trustChips.map((t, i) => (
                  <div
                    key={t.text}
                    className="anim-enter flex items-center gap-2 bg-white/90 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                    style={{ animationDelay: `${0.55 + i * 0.07}s` }}
                  >
                    <t.icon className="w-4 h-4 shrink-0 text-olx-teal" />
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>
            </form>

            {/* Stats row */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl">
              {[
                { value: counts[0], title: 'Live parts listed', cap: 'Updated every hour · across 280+ cities' },
                { value: counts[1], title: 'Happy buyers', cap: 'Across 28 states · ⭐ 4.8 avg' },
                { value: counts[2], title: 'Verified sellers', cap: 'KYC & GST verified' },
              ].map((stat, i) => (
                <div
                  key={stat.title}
                  className="anim-enter hover-lift bg-white rounded-2xl border border-olx-border p-4 sm:p-5 shadow-sm"
                  style={{ animationDelay: `${0.65 + i * 0.1}s` }}
                >
                  <div className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                    {stat.value.toLocaleString()}<span className="text-emerald-500 ml-1 align-super text-lg sm:text-xl">+</span>
                  </div>
                  <div className="text-sm font-semibold mt-1">{stat.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.cap}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - mockup panel */}
          <div className="anim-enter-right anim-d3 relative w-full flex justify-center items-start pt-2 sm:pt-6 lg:pt-6 overflow-hidden">
            <div className="animate-float relative w-full max-w-[min(100%,460px)] min-h-[300px] sm:min-h-[340px] rounded-2xl bg-[#0b1720] shadow-2xl p-4 sm:p-6 transition-shadow duration-500 hover:shadow-[0_24px_60px_-12px_rgba(10,46,50,0.45)]">
              <div className="animate-glow-orb absolute -right-4 sm:-right-8 -top-6 sm:-top-10 w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-olx-teal/10 pointer-events-none" />

              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-white relative z-10">
                <div className="col-span-3 text-xs text-slate-400">LIVE LISTINGS</div>
                {[
                  { label: 'Engine', price: '₹18,500' },
                  { label: 'Brakes', price: '₹2,200' },
                  { label: 'Electrical', price: '₹4,800' },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="anim-enter bg-slate-800/60 rounded-xl p-2.5 sm:p-4 flex flex-col items-start gap-1 sm:gap-2 min-w-0 transition-colors duration-300 hover:bg-slate-700/70"
                    style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                  >
                    <div className="text-xs sm:text-sm text-emerald-300">{item.label}</div>
                    <div className="text-base sm:text-lg font-extrabold">{item.price}</div>
                  </div>
                ))}

                <div className="anim-enter anim-d6 col-span-3 mt-1 sm:mt-2 bg-gradient-to-r from-olx-teal/40 to-transparent rounded-xl p-2.5 sm:p-3">
                  <div className="text-xs sm:text-sm text-slate-50">Nearest seller</div>
                  <div className="text-xs sm:text-sm font-semibold">2.4 km away · Indore</div>
                </div>
              </div>

              <div className="hidden md:block anim-enter anim-d7 absolute -left-4 lg:-left-6 -top-4 lg:-top-6 max-w-[200px] bg-white rounded-lg px-3 py-2 shadow-md text-xs sm:text-sm font-semibold transition-transform duration-300 hover:scale-[1.02]">
                Just sold · <span className="text-olx-teal">Swift headlight · ₹1,800</span>
              </div>
              <div className="hidden md:block anim-enter anim-d8 absolute -right-4 lg:-right-6 bottom-4 max-w-[180px] bg-white rounded-lg px-3 py-2 shadow-md text-xs sm:text-sm transition-transform duration-300 hover:scale-[1.02]">
                New listing · 2 min ago · Pune
              </div>
              <div className="hidden lg:block anim-enter absolute right-4 lg:right-6 -top-4 lg:-top-6 bg-white rounded-lg px-3 py-2 shadow-md text-xs sm:text-sm transition-transform duration-300 hover:scale-[1.02]" style={{ animationDelay: '0.72s' }}>
                Saved vs new<br /><span className="text-emerald-600 font-extrabold">₹4,200 · 68%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
