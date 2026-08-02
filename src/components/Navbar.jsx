import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Car, Menu, X, User, LogOut, Plus, LayoutDashboard, MapPin, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
  <header className="relative w-full z-50 anim-enter-down overflow-visible">
      {/* Top thin announcement bar */}
      <div className="w-full bg-olx-teal text-white text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center leading-snug max-w-3xl">
            <strong>New:</strong>
            <span className="hidden sm:inline">Book a mechanic for fitment right from checkout!</span>
            <span className="sm:hidden">Mechanic fitment at checkout</span>
            <a href="#" className="underline whitespace-nowrap">Try it now →</a>
          </span>
        </div>
      </div>

      <nav className="bg-white/95 backdrop-blur-md border-b border-olx-border anim-enter anim-d1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center gap-2 sm:gap-4 h-14 sm:h-16 min-w-0">
            {/* Left: logo */}
            <div className="flex items-center shrink-0 min-w-0">
              <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-gradient-to-br from-olx-teal to-teal-600 text-white shadow-premium">
                  <Car className="w-5 h-5" strokeWidth={2.5} />
                </span>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-olx-dark truncate">AutoMart</span>
              </Link>
            </div>

            {/* Center: search (hidden on small screens) */}
            <div className="flex-1 hidden lg:flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="flex items-center rounded-full bg-slate-100/90 pl-4 pr-1 py-1 ring-1 ring-slate-200/80 focus-within:ring-2 focus-within:ring-olx-teal/30 transition-shadow">
                  <Search className="w-4 h-4 shrink-0 text-olx-muted" strokeWidth={2.25} />
                  <input
                    type="text"
                    placeholder="Search parts, OEM number, car model..."
                    className="flex-1 py-2.5 px-3 text-sm text-olx-dark placeholder:text-slate-400 outline-none bg-transparent font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        navigate('/parts');
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: links & auth */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-olx-muted hover:text-olx-dark rounded-lg transition-colors">
                <MapPin className="w-4 h-4 text-olx-teal" />
                India
              </button>

              <Link to="/parts" className="hidden md:inline-flex px-3 py-2 text-sm font-semibold text-olx-dark rounded-lg hover:bg-slate-100/80 transition-colors">
                Browse
              </Link>
              <Link to="/contact" className="hidden md:inline-flex px-3 py-2 text-sm font-semibold text-olx-muted rounded-lg hover:bg-slate-100/80 transition-colors">
                Help
              </Link>

              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-bold text-olx-dark rounded-lg hover:bg-slate-100/80 transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="hidden sm:inline-flex px-4 py-2.5 rounded-full bg-olx-teal text-white text-sm font-extrabold hover:brightness-95 transition-all">
                    Sign up
                  </Link>
                  <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 ml-1 px-4 py-2.5 rounded-full bg-olx-sell text-olx-dark text-sm font-extrabold shadow-md">
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    Sell
                  </Link>
                </>
              ) : (
                <>
                  {(user?.role === 'seller' || user?.role === 'admin') && (
                    <>
                      <Link to="/add-part" className="hidden md:inline-flex items-center gap-1.5 ml-1 px-4 py-2.5 rounded-full bg-olx-sell text-olx-dark text-sm font-extrabold shadow-md">
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        Sell
                      </Link>
                      <Link to="/my-listings" className="hidden md:inline-flex items-center gap-1 ml-2 px-3 py-2 rounded-lg text-sm font-semibold text-olx-dark hover:bg-slate-100/80 transition-colors">
                        My listings
                      </Link>
                      <Link to="/seller-sales" className="hidden md:inline-flex items-center gap-1.5 ml-2 px-3 py-2 text-sm font-semibold text-olx-dark rounded-lg hover:bg-slate-100/80 transition-colors">
                        <BarChart3 className="w-4 h-4" />
                        Sales
                      </Link>
                      {isAdmin && (
                        <Link to="/dashboard" className="hidden md:inline-flex items-center gap-1.5 ml-2 px-3 py-2 text-sm font-semibold text-olx-dark rounded-lg hover:bg-slate-100/80 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                    </>
                  )}

                  <div className="relative ml-1" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen((open) => !open);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl border border-transparent hover:border-olx-border text-sm font-semibold text-olx-dark transition-all"
                      aria-expanded={isProfileOpen}
                      aria-haspopup="menu"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-olx-dark">
                        <User className="w-4 h-4" />
                      </span>
                      <span className="max-w-[100px] truncate hidden lg:inline">{user?.name}</span>
                    </button>
                    {isProfileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-[min(18rem,calc(100vw-1rem))] overflow-hidden rounded-xl border border-olx-border bg-white shadow-premium-lg ring-1 ring-slate-900/5 z-[100]" role="menu">
                        <div className="border-b border-olx-border bg-slate-50 px-4 py-4">
                          <p className="truncate text-sm font-extrabold text-olx-dark">{user?.name || 'Account'}</p>
                          <p className="mt-1 truncate text-xs font-semibold text-olx-muted">{user?.email}</p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-extrabold uppercase text-olx-dark ring-1 ring-olx-border">
                              {user?.role || 'user'}
                            </span>
                            {user?.phone && <span className="truncate text-xs font-bold text-olx-muted">{user.phone}</span>}
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-olx-dark hover:bg-slate-50"
                          role="menuitem"
                        >
                          <User className="w-4 h-4" />
                          Account information
                        </Link>
                        <Link
                          to="/my-purchases"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-olx-dark hover:bg-slate-50 border-t border-olx-border"
                          role="menuitem"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          My purchases
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50 flex items-center gap-2 border-t border-olx-border"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setIsProfileOpen(false);
                }}
                className="md:hidden p-2.5 rounded-xl text-olx-dark hover:bg-slate-100 transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-olx-border">
              <div className="mb-3 px-2">
                <div className="flex items-center rounded-full bg-slate-100/90 pl-4 pr-1 py-1 ring-1 ring-slate-200/80">
                  <Search className="w-4 h-4 shrink-0 text-olx-muted" strokeWidth={2.25} />
                  <input
                    type="text"
                    placeholder="Search parts..."
                    className="flex-1 min-w-0 py-2.5 px-3 text-sm text-olx-dark placeholder:text-slate-400 outline-none bg-transparent font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        navigate('/parts');
                        setIsOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
              <Link to="/parts" className="block py-3 px-2 text-olx-dark font-bold rounded-lg hover:bg-slate-50" onClick={() => setIsOpen(false)}>Browse</Link>
              <Link to="/contact" className="block py-3 px-2 text-olx-dark font-semibold rounded-lg hover:bg-slate-50" onClick={() => setIsOpen(false)}>Help</Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="block py-3 px-2 text-olx-dark font-bold" onClick={() => setIsOpen(false)}>Log in</Link>
                  <Link to="/register" className="block py-3 px-2 text-olx-dark font-bold" onClick={() => setIsOpen(false)}>Sign up</Link>
                  <Link to="/login" className="block py-3 px-2 font-extrabold text-olx-dark" onClick={() => setIsOpen(false)}>Sell</Link>
                </>
              ) : (
                <>
                  {(user?.role === 'seller' || user?.role === 'admin') && (
                      <>
                        <Link to="/add-part" className="block py-3 px-2 font-extrabold text-olx-dark rounded-lg hover:bg-slate-50" onClick={() => setIsOpen(false)}>Sell a part</Link>
                        <Link to="/my-listings" className="block py-3 px-2 text-olx-dark" onClick={() => setIsOpen(false)}>My listings</Link>
                        <Link to="/seller-sales" className="block py-3 px-2 text-olx-dark" onClick={() => setIsOpen(false)}>Sales</Link>
                        {isAdmin && (
                          <Link to="/dashboard" className="block py-3 px-2 text-olx-dark" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        )}
                      </>
                  )}
                  <Link to="/profile" className="block py-3 px-2 text-olx-dark" onClick={() => setIsOpen(false)}>Account information</Link>
                  <Link to="/my-purchases" className="block py-3 px-2 text-olx-dark" onClick={() => setIsOpen(false)}>My purchases</Link>
                  <button type="button" onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left py-3 px-2 text-olx-dark font-semibold">Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
