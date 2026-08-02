import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Headphones } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WHATSAPP_NUMBER } from '../utils/constants';
import { contactService } from '../services/contactService';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWhatsAppInquiry = () => {
    const message = `Hello! I'm interested in your vehicles. 
    
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject || 'General Inquiry'}

Message: ${formData.message || 'I would like to know more about your vehicles.'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await contactService.submitContact(formData);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-olx-border bg-white px-4 py-1.5 text-xs font-bold text-olx-muted shadow-olx">
            <Headphones className="h-3.5 w-3.5 text-olx-teal" />
            We reply within one business day
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-olx-dark sm:text-4xl text-balance">
            We’re here to help
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-olx-muted leading-relaxed">
            Ask about listings, payments, or your account — or chat with us on WhatsApp for a faster answer.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5">
              <h2 className="text-lg font-extrabold text-olx-dark">Contact</h2>
              <p className="mt-1 text-sm text-olx-muted">Prefer calling? We’re on the line weekdays.</p>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-olx-teal/15 text-olx-dark">
                    <Phone className="h-5 w-5" strokeWidth={2.25} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-olx-muted">Phone</div>
                    <p className="font-bold text-olx-dark">+91 98765 43210</p>
                    <p className="text-xs text-olx-muted">Mon–Sat · 9AM–6PM</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-olx-teal/15 text-olx-dark">
                    <Mail className="h-5 w-5" strokeWidth={2.25} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-olx-muted">Email</div>
                    <a
                      href="mailto:support@automart.com"
                      className="font-bold text-olx-dark underline decoration-olx-teal/80 underline-offset-2 hover:text-olx-muted"
                    >
                      support@automart.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-olx-teal/15 text-olx-dark">
                    <MapPin className="h-5 w-5" strokeWidth={2.25} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-olx-muted">Office</div>
                    <p className="text-sm leading-relaxed text-olx-muted">
                      AutoMart HQ, Indore, Madhya Pradesh, India 452020
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-olx-border pt-6">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-extrabold text-white shadow-md transition hover:brightness-105 active:scale-[0.99]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </button>
                <p className="mt-3 text-center text-xs text-olx-muted">Usually replies in minutes during business hours</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 sm:p-8">
              <h2 className="text-lg font-extrabold text-olx-dark">Send a message</h2>
              <p className="mt-1 text-sm text-olx-muted">
                The more detail you share, the faster we can help. We never share your details with third parties.
              </p>

              {submitted && (
                <div className="cro-alert-success mt-6">Thanks — we’ve received your message and will reply shortly.</div>
              )}

              {error && <div className="cro-alert-error mt-6">{error}</div>}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="cro-label">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="cro-input"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="cro-label">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="cro-input"
                      placeholder="+91…"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="cro-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="cro-input"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="cro-label">
                    Subject <span className="font-medium text-olx-muted">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="cro-input"
                    placeholder="e.g. Listing not showing"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="cro-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="cro-input resize-none"
                    placeholder="Describe your question…"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="cro-btn-primary flex-1 sm:flex-[2]"
                  >
                    <Send className="h-5 w-5" />
                    <span>{loading ? 'Sending…' : 'Send message'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-olx-border bg-white px-6 py-3.5 text-base font-extrabold text-olx-dark transition hover:border-olx-teal/50 hover:bg-slate-50"
                  >
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    WhatsApp instead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
