import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';



const Footer = () => {
  return (
    <>
    {/* Landing page sections (Categories, HowItWorks, Features, Sellers, Testimonials) moved to Home.jsx so they render only on the landing page */}
  <div className="bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 text-center py-6">
          <div className="text-sm text-slate-500 mb-4">Parts available for all major Indian car brands</div>

          <div className="marquee">
            <div className="marquee-track">
              {['Maruti Suzuki','Hyundai','Tata Motors','Mahindra','Honda','Toyota','Kia','MG'].map((b, i) => (
                <div key={`a-${i}`} className="flex items-center gap-3 text-sm font-medium text-slate-400">
                  <span className="text-lg">🚗</span>
                  <span>{b}</span>
                </div>
              ))}
              {['Maruti Suzuki','Hyundai','Tata Motors','Mahindra','Honda','Toyota','Kia','MG'].map((b, i) => (
                <div key={`b-${i}`} className="flex items-center gap-3 text-sm font-medium text-slate-400">
                  <span className="text-lg">🚗</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section
        className="text-white py-12"
        style={{
          backgroundImage:
            `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(160deg,#0d9e84 0%, #18b39a 100%)`,
          backgroundSize: '28px 28px, cover',
          backgroundPosition: '0 0, center'
        }}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimateOnScroll animation="blur-up">
          <div className="inline-block bg-white/10 text-white rounded-full px-4 py-2 text-xs mb-6">IN Built for India</div>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-4 text-balance px-2">Ready to find your part?</h2>
            <p className="mx-auto max-w-2xl mt-2 text-white/90 text-base sm:text-lg px-2">Average time to first matching listing: under 90 seconds. No signup needed to browse.</p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 w-full max-w-sm sm:max-w-none mx-auto px-4 sm:px-0">
              <Link to="/parts" className="btn-shine bg-white text-olx-dark px-6 sm:px-8 py-3.5 rounded-lg font-semibold shadow-md text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">Browse all parts →</Link>
              <Link to="/add-part" className="border border-white/30 text-white px-6 sm:px-8 py-3.5 rounded-lg font-semibold text-center transition-all duration-300 hover:border-white/60 hover:bg-white/10 active:scale-[0.98]">List a part free</Link>
            </div>

            <div className="mt-6 text-white/80 text-sm">✓ Free to browse · ✓ Free to list · ✓ UPI & COD accepted</div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      <footer className="relative mt-auto bg-olx-dark text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-olx-teal/20 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-32 bg-footer-fade pointer-events-none opacity-60" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-olx-teal text-white shadow-md">
                <Car className="w-5 h-5" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-extrabold tracking-tight">AutoMart</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-6">
              India's trusted marketplace for used car auto parts. Find genuine, verified parts for every Indian car model — delivered pan-India.
            </p>

            <div className="flex items-center gap-3">
              {[{ Icon: Facebook, label: 'Facebook' }, { Icon: Twitter, label: 'Twitter' }, { Icon: Instagram, label: 'Instagram' }, { Icon: Linkedin, label: 'LinkedIn' }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-olx-teal/90 mb-4">Browse</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link to="/parts" className="hover:text-white">All parts</Link></li>
              <li><Link to="/parts" className="hover:text-white">Engine & Drivetrain</Link></li>
              <li><Link to="/parts" className="hover:text-white">Body & Exterior</Link></li>
              <li><Link to="/parts" className="hover:text-white">Brakes & Suspension</Link></li>
              <li><Link to="/parts" className="hover:text-white">EV Parts</Link></li>
              <li><Link to="/add-part" className="hover:text-white">List a part</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-olx-teal/90 mb-4">Categories</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>Electrical</li>
              <li>Transmission</li>
              <li>Fuel & Exhaust</li>
              <li>Cooling & AC</li>
              <li>Interior & Cabin</li>
              <li>Wheels & Tyres</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-olx-teal/90 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>Help centre</li>
              <li>Track your order</li>
              <li>Returns policy</li>
              <li>Dispute centre</li>
              <li>Terms of service</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          <div className="md:text-right">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-olx-teal/90 mb-4">Contact</h4>
            <ul className="space-y-4 text-sm text-white/75 md:items-end">
              <li className="flex items-center md:justify-end gap-3">
                <Phone className="w-5 h-5 shrink-0 text-olx-teal" />
                <div className="md:text-right">
                  <div className="font-semibold text-white">+91 98765 43210</div>
                  <div className="text-white/50 text-xs mt-1">Mon–Sat, 9AM–6PM IST</div>
                </div>
              </li>

              <li className="flex items-center md:justify-end gap-3">
                <Mail className="w-5 h-5 shrink-0 text-olx-teal" />
                <a href="mailto:support@automart.com" className="font-medium hover:text-olx-teal transition-colors break-all sm:break-normal">support@automart.com</a>
              </li>

              <li className="flex items-start md:justify-end gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-olx-teal mt-0.5" />
                <div className="md:text-right">
                  <div>AutoMart HQ, Indore</div>
                  <div>Madhya Pradesh, India 452020</div>
                </div>
              </li>

              <li className="pt-2 flex md:justify-end">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm font-semibold text-olx-dark">
                  <span className="text-amber">🔒</span>
                  <span className="text-white">Razorpay Secured</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/3 text-sm text-white/60">© {new Date().getFullYear()} AutoMart. All rights reserved.</div>

            <div className="w-full md:w-1/3 flex items-center justify-center gap-6">
              <a href="#" className="text-sm text-white/50 hover:text-white">Terms</a>
              <a href="#" className="text-sm text-white/50 hover:text-white">Privacy</a>
              <a href="#" className="text-sm text-white/50 hover:text-white">Cookies</a>
            </div>

            <div className="w-full md:w-1/3 flex items-center justify-end text-sm text-white/50">Made with <span className="px-1 text-rose-400">♥</span> in India</div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
