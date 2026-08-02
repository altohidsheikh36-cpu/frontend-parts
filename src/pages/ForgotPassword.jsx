import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_URL } from "../utils/constants";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post( `${API_URL}/auth/forgot-password`, {
        identifier,
        newPassword,
      });
      setMessage('Password updated. You can sign in with your new password.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cro-page-narrow">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-olx-dark hover:text-olx-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
        <div className="mb-8 text-center">
          <h1 className="cro-section-title">Reset your password</h1>
          <p className="cro-lead mx-auto">Enter your email or phone and choose a new password.</p>
        </div>

        <div className="cro-card">
          {message && <div className="mb-6 rounded-xl border border-olx-border bg-slate-50 px-4 py-3 text-center text-sm font-medium text-olx-dark">{message}</div>}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="cro-label">Email or Phone</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                <input
                  type="text"
                  required
                  placeholder="you@example.com or +911234567890"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="cro-input-has-icon"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="cro-label">New password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="cro-input-has-icon"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="cro-btn-primary">
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
