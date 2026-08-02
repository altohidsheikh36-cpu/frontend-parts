import React, { useState } from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const stepsBuyer = [
  { title: 'Search your part', desc: 'Enter your car model, part name or OEM number. Get results in seconds.' },
  { title: 'Compare listings', desc: 'Compare price, condition grade, seller rating and distance from you.' },
  { title: 'Pay securely', desc: 'Pay via UPI, card or COD. Funds held safely until you confirm delivery.' },
  { title: 'Get it delivered', desc: 'Tracked shipping pan-India. Optional: book a mechanic for same-day fitment.' },
];

const stepsSeller = [
  { title: 'Register free', desc: 'GST & Aadhaar KYC in 2 minutes. Individual or business — both welcome.' },
  { title: 'List your parts', desc: 'Add photos, set condition grade A/B/C, price, and go live instantly.' },
  { title: 'Accept orders', desc: 'Get WhatsApp alerts on every order. Accept, pack and dispatch in 24hrs.' },
  { title: 'Get paid T+2', desc: 'Direct UPI or bank transfer within 2 days of delivery confirmation.' },
];

const HowItWorks = () => {
  const [mode, setMode] = useState('buyer');
  const steps = mode === 'buyer' ? stepsBuyer : stepsSeller;

  return (
    <section className="py-16 bg-emerald-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <AnimateOnScroll animation="blur-up">
          <div className="text-emerald-600 text-xs font-semibold">HOW IT WORKS</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Simple for buyers. Simple for sellers.</h2>

          <div className="inline-flex rounded-xl border mt-6 overflow-hidden mx-auto shadow-sm">
            <button
              type="button"
              onClick={() => setMode('buyer')}
              className={`px-6 py-3 transition-all duration-300 ${mode === 'buyer' ? 'bg-olx-teal text-white' : 'bg-white text-olx-dark hover:bg-slate-50'}`}
            >
              For Buyers
            </button>
            <button
              type="button"
              onClick={() => setMode('seller')}
              className={`px-6 py-3 transition-all duration-300 ${mode === 'seller' ? 'bg-olx-teal text-white' : 'bg-white text-olx-dark hover:bg-slate-50'}`}
            >
              For Sellers
            </button>
          </div>
        </AnimateOnScroll>

        <div key={mode} className="steps-fade mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="anim-enter text-center sm:text-left"
              style={{ animationDelay: `${0.12 + i * 0.08}s` }}
            >
              <div className="h-12 w-12 rounded-full bg-white border flex items-center justify-center mx-auto sm:mx-0 mb-4 font-bold text-olx-teal shadow-sm transition-transform duration-300 hover:scale-110">
                {i + 1}
              </div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-olx-muted mt-2">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
