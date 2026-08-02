import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { partService } from '../services/partService';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [listingsCount, setListingsCount] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      });
      // fetch seller listings count
      (async () => {
        try {
          const res = await partService.getMyParts();
          // response may be an array or an object { data: [...] }
          const arr = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          setListingsCount(arr.length);
        } catch (err) {
          console.error('Failed to fetch listings count', err);
          setListingsCount(0);
        }
      })();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/users/profile', formData);
      setMessage({ type: 'success', text: 'Profile saved. Your name and phone are updated everywhere you use AutoMart.' });
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Could not save. Try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="cro-section-title">Your profile</h1>
          <p className="cro-lead mx-auto">
            Keep your details current so sellers and support can reach you without delay.
          </p>
        </div>

        <div className="cro-card-wide">
          <div className="mb-10 border-b border-olx-border pb-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-olx-teal to-teal-600 text-white shadow-premium-lg">
              <User className="h-10 w-10" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-extrabold text-olx-dark">{user?.name}</h2>
            <p className="mt-1 text-sm text-olx-muted">{user?.email}</p>
              <div className="mt-3 flex items-center gap-3 justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-olx-border bg-slate-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-olx-dark">{user?.role}</span>
                <Link to="/my-listings" className="inline-flex items-center gap-2 rounded-full bg-white border border-olx-border px-3 py-1 text-sm font-bold text-olx-dark">
                  <span>{listingsCount ?? '-'}</span>
                  <span className="text-olx-muted text-xs">Your listings</span>
                </Link>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div className={message.type === 'success' ? 'cro-alert-success' : 'cro-alert-error'}>{message.text}</div>
            )}

            <div>
              <label className="cro-label">Full name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="cro-input-has-icon"
                  placeholder="As on your ID"
                />
              </div>
            </div>

            <div>
              <label className="cro-label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="cro-input-has-icon cursor-not-allowed bg-slate-100 text-olx-muted"
                />
              </div>
              <p className="mt-1.5 text-xs text-olx-muted">Email sign-in is fixed for security. Contact support to change it.</p>
            </div>

            <div>
              <label className="cro-label">Phone</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="cro-input-has-icon"
                  placeholder="+91…"
                  autoComplete="tel"
                />
              </div>
              <p className="mt-1.5 text-xs text-olx-muted">Shown to sellers when you inquire about a vehicle.</p>
            </div>

            <button type="submit" disabled={loading} className="cro-btn-primary">
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving…' : 'Save profile'}</span>
            </button>
          </form>

          <div className="mt-10 border-t border-olx-border pt-10">
            <h3 className="mb-4 text-center text-xs font-extrabold uppercase tracking-widest text-olx-muted">Account</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-olx-border bg-slate-50/80 p-4 text-center">
                <div className="mb-1 flex items-center justify-center gap-1.5 text-xs font-bold text-olx-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since
                </div>
                <div className="text-sm font-extrabold text-olx-dark">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '—'}
                </div>
              </div>
              <div className="rounded-xl border border-olx-border bg-slate-50/80 p-4 text-center">
                <div className="mb-1 text-xs font-bold text-olx-muted">Status</div>
                {user?.isVerified === false ? (
                  <div className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-amber-800">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending
                  </div>
                ) : user?.isActive === false ? (
                  <div className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Inactive
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
