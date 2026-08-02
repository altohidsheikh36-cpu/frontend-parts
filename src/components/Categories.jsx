import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimateOnScroll from './AnimateOnScroll';

const categories = [
  { title: 'Engine & Drivetrain', count: '2,800+ parts', tag: 'Popular', icon: '⚙️' },
  { title: 'Transmission & Gearbox', count: '1,600+ parts', tag: null, icon: '🔧' },
  { title: 'Brakes & Suspension', count: '2,100+ parts', tag: 'Safety', icon: '🛡️' },
  { title: 'Electrical & Electronics', count: '1,900+ parts', tag: null, icon: '⚡' },
  { title: 'Fuel & Exhaust', count: '980+ parts', tag: null, icon: '⛽' },
  { title: 'Cooling & AC System', count: '740+ parts', tag: null, icon: '❄️' },
  { title: 'Body & Exterior', count: '1,400+ parts', tag: 'Popular', icon: '🚘' },
  { title: 'Interior & Cabin', count: '860+ parts', tag: null, icon: '🪑' },
  { title: 'EV Parts', count: '370+ parts', tag: 'EV', icon: '🔌' },
  { title: 'Filters, Fluids & Service', count: '680+ parts', tag: 'B2B', icon: '🧰' },
];

const CategoryCard = ({ c }) => (
  <Link
    to="/parts"
    className="group block h-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 relative hover-lift transition-all duration-300"
  >
    {c.tag && (
      <div className="absolute right-4 top-4 text-xs font-semibold rounded-full bg-rose-50 text-rose-600 px-2 py-0.5">{c.tag}</div>
    )}

    <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-emerald-50 flex items-center justify-center text-xl sm:text-2xl border border-emerald-100 transition-transform duration-300 group-hover:scale-110 group-hover:border-emerald-200">
        {c.icon}
      </div>
      <div className="text-center font-semibold text-olx-dark text-sm sm:text-lg leading-snug">{c.title}</div>
      <div className="text-sm text-slate-400 mt-1">{c.count}</div>
    </div>
  </Link>
);

const Categories = () => {
  return (
    <section className="py-10 sm:py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div className="min-w-0">
            <div className="text-emerald-600 text-xs font-semibold">BROWSE BY CATEGORY</div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mt-2 leading-tight text-balance">Find parts by what your car needs</h3>
          </div>

          <Link to="/parts" className="group inline-flex shrink-0 items-center gap-2 text-sm sm:text-base text-emerald-600 font-medium whitespace-nowrap transition-all duration-300 hover:gap-3">
            View all 10 categories <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {categories.map((c, i) => (
            <AnimateOnScroll key={c.title} animation="scale" delay={i * 70} className="h-full">
              <CategoryCard c={c} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
