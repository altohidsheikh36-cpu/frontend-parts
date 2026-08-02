import React from 'react';
import { Search, Shield, CreditCard, Wrench, MessageCircle, Repeat } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

const featureData = [
  { icon: Search, title: 'Vehicle-specific search', desc: 'Search by Make → Model → Year → Variant. Only see parts compatible with your exact car.', color: 'bg-emerald-50 text-emerald-700' },
  { icon: Shield, title: 'KYC-verified sellers', desc: 'Every seller is Aadhaar & GST verified before going live. Condition graded parts with real photos.', color: 'bg-amber-50 text-amber-700' },
  { icon: CreditCard, title: 'UPI, COD & EMI', desc: 'Pay the Indian way — UPI, Razorpay, Paytm, cash on delivery, or EMI via partner lenders.', color: 'bg-emerald-50 text-emerald-700' },
  { icon: Wrench, title: 'Book a mechanic', desc: 'Order part + book a fitment slot at a partner garage near you. Pay after the job is done.', color: 'bg-amber-50 text-amber-700' },
  { icon: MessageCircle, title: 'WhatsApp order alerts', desc: 'Track every order update on WhatsApp in real time — no app needed.', color: 'bg-emerald-50 text-emerald-700' },
  { icon: Repeat, title: '7-day returns', desc: 'Part doesn’t fit? Return within 7 days. Full refund processed in 48 hours.', color: 'bg-amber-50 text-amber-700' },
];

const FeatureCard = ({ f }) => (
  <div className="hover-lift rounded-xl border border-olx-border bg-white p-6 h-full">
    <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${f.color} mb-4 transition-transform duration-300 group-hover:scale-105`}>
      <f.icon className="w-5 h-5" />
    </div>
    <h4 className="font-semibold text-olx-dark mb-2">{f.title}</h4>
    <p className="text-sm text-olx-muted">{f.desc}</p>
  </div>
);

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="text-left mb-6">
          <div className="text-emerald-600 text-xs font-semibold">WHY AUTOMART</div>
          <h3 className="text-3xl sm:text-4xl font-extrabold mt-2">Built for Indian car owners & dealers</h3>
          <p className="text-olx-muted mt-2">Every feature is designed around how Indian buyers search, pay and receive parts.</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {featureData.map((f, i) => (
            <AnimateOnScroll key={f.title} animation="fade-up" delay={i * 80} className="group h-full">
              <FeatureCard f={f} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
