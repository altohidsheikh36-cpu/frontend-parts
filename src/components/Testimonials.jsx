import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const testimonials = [
  { name: 'Rahul Mishra', role: 'Car owner · Indore, MP', quote: 'Found a Maruti Swift alternator in Indore within 10 minutes. The seller was GST verified, part came in perfect condition. Saved ₹4,200 compared to the new part price.', badge: 'Saved ₹4,200' },
  { name: 'Suresh Rathod', role: 'Scrap yard owner · Pune, MH', quote: 'I listed 200+ parts using the bulk CSV upload and within the same week I had 14 orders. The WhatsApp order alerts are brilliant — I don’t even need to open the app.' },
  { name: 'Priya Krishnan', role: 'Car owner · Chennai, TN', quote: 'Ordered a Hyundai i20 headlight and booked mechanic fitment in one checkout. The mechanic arrived the same day. This feature alone makes AutoMart worth it.', badgeAlt: 'Same day fit' },
  { name: 'Anil Kumar', role: 'Garage owner · Bangalore, KA', quote: 'As a garage owner I order filters and oils in bulk every week. The B2B credit terms are a game changer — I get 30-day credit and consolidated GST invoices automatically.' },
  { name: 'Mohammed Salim', role: 'Fleet owner · Hyderabad, TS', quote: 'My Toyota Innova needed a radiator replacement. Found one graded A-condition from a dealer in Delhi for ₹4,500. New was ₹15,500. Delivery in 2 days.', badge: 'Saved ₹11,000' },
  { name: 'Vijay Sharma', role: 'Auto parts dealer · Nagpur, MH', quote: 'The seller analytics dashboard tells me which parts are in demand by city. I now stock specifically for Pune and Mumbai buyers. My monthly revenue doubled in 3 months.' },
];

const TestimonialCard = ({ t, highlight }) => (
  <div className={`hover-lift h-full p-6 rounded-2xl border bg-white ${highlight ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-white/70'} shadow-sm transition-all duration-300`}>
    <div className="flex items-start justify-between gap-2">
      <div className="text-amber tracking-tight">★★★★★</div>
      {t.badge && <div className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full shrink-0">{t.badge}</div>}
      {t.badgeAlt && <div className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full shrink-0">{t.badgeAlt}</div>}
    </div>

    <blockquote className="mt-4 italic text-sm leading-relaxed">“{t.quote}”</blockquote>

    <div className="mt-6 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
        {t.name.charAt(0)}
      </div>
      <div>
        <div className="font-semibold">{t.name}</div>
        <div className="text-sm text-olx-muted">{t.role}</div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-12 bg-emerald-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="blur-up" className="text-center mb-6">
          <div className="text-emerald-600 text-xs font-semibold">REAL STORIES</div>
          <h3 className="text-3xl sm:text-4xl font-extrabold mt-2">Buyers and sellers love AutoMart</h3>
          <p className="text-olx-muted mt-2">From Indore to Chennai, real people saving real money — every day.</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.name} animation="fade-up" delay={(i % 3) * 100} className="h-full">
              <TestimonialCard t={t} highlight={i % 3 === 0} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
