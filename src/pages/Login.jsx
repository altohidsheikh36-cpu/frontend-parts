import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRound, Lock, LogIn, Car } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cro-page-narrow">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-olx-teal to-teal-600 text-white shadow-premium-lg ring-1 ring-white/20">
            <Car className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <h1 className="cro-section-title">Welcome back</h1>
          <p className="cro-lead mx-auto">
            Sign in to save listings, message sellers, and pick up where you left off.
          </p>
        </div>

        <div className="cro-card">
          {error && <div className="cro-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="cro-label" htmlFor="login-identifier">
                Email or phone
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                <input
                  id="login-identifier"
                  type="text"
                  required
                  autoComplete="username"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="cro-input-has-icon"
                  placeholder="you@example.com or 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="cro-label" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-olx-muted" />
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="cro-input-has-icon"
                  placeholder="••••••••"
                />
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-olx-dark underline decoration-olx-teal/80 decoration-2 underline-offset-2 hover:text-olx-muted"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="cro-btn-primary">
              <LogIn className="h-5 w-5" strokeWidth={2.25} />
              <span>{loading ? 'Signing you in…' : 'Sign in'}</span>
            </button>
          </form>

          <p className="cro-trust">Your details are encrypted in transit. We never sell your data.</p>

          <p className="mt-6 text-center text-sm text-olx-muted">
            New here?{' '}
            <Link
              to="/register"
              className="font-extrabold text-olx-dark underline decoration-olx-teal decoration-2 underline-offset-2"
            >
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
