import React from 'react';

const messages = [
  { pre: 'New listing', text: 'Hyundai i20 clutch plate · ₹2,800 · Mumbai' },
  { pre: 'Priya', text: 'saved ₹6,200 on a Tata Nexon front bumper in Chennai' },
  { pre: 'Suresh Auto', text: 'listed 48 new parts from Pune scrap yard' },
];

const TopTicker = () => {
  return (
    <div className="w-full bg-[#0b0b0b] text-white text-sm anim-enter anim-d2">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="overflow-hidden">
          <div className="flex gap-8 py-2 items-center" style={{ whiteSpace: 'nowrap', animation: 'ticker 22s linear infinite' }}>
            {[...messages, ...messages].map((m, i) => (
              <div key={i} className="inline-flex items-center gap-4 text-white/90">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <div>
                  <strong className="text-white font-semibold mr-2">{m.pre}</strong>
                  <span className="text-white/80">— {m.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopTicker;
