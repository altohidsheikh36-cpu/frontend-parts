import React, { useState, useEffect } from 'react';
import { Users, Car, TrendingUp, Eye, Trash2 } from 'lucide-react';
import api from '../services/api';
import { fullImageUrl } from '../utils/constants';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, vehiclesRes] = await Promise.all([
        api.get('/users/admin/stats'),
        api.get('/users/admin/users'),
        api.get('/vehicles')
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setVehicles(vehiclesRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Download CSV helpers
  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadUsersCsv = async () => {
    try {
      const res = await api.get('/users/admin/export', { responseType: 'blob' });
      downloadBlob(res.data, `users_${Date.now()}.csv`);
    } catch (error) {
      console.error('Failed to download users CSV:', error);
      alert('Failed to download users CSV');
    }
  };

  const downloadVehiclesCsv = async () => {
    try {
      const res = await api.get('/vehicles/admin/export', { responseType: 'blob' });
      downloadBlob(res.data, `vehicles_${Date.now()}.csv`);
    } catch (error) {
      console.error('Failed to download vehicles CSV:', error);
      alert('Failed to download vehicles CSV');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/admin/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleToggleListingsVisibility = async (user) => {
    try {
      const next = !Boolean(user.listingsVisible);
      await api.patch(`/users/admin/${user._id}/listings-visibility`, { listingsVisible: next });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, listingsVisible: next } : u));
    } catch (error) {
      alert('Failed to update visibility');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setVehicles(vehicles.filter(v => v._id !== vehicleId));
      alert('Vehicle deleted successfully');
    } catch (error) {
      alert('Failed to delete vehicle');
    }
  };

  if (loading) {
    return (
      <div className="cro-page flex items-center justify-center">
        <p className="text-sm font-bold text-olx-muted">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-olx-dark sm:text-4xl">Admin dashboard</h1>
          <p className="mt-2 max-w-2xl text-olx-muted leading-relaxed">
            Monitor users, listings, and exports — actions apply immediately.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-10 grid gap-4 md:grid-cols-4 md:gap-5">
          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 transition hover:shadow-premium-lg">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-olx-teal" />
              <span className="text-3xl font-bold text-olx-dark">{stats?.totalUsers || 0}</span>
            </div>
            <h3 className="text-olx-muted font-semibold text-sm">Total users</h3>
          </div>

          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 transition hover:shadow-premium-lg">
            <div className="flex items-center justify-between mb-4">
              <Car className="w-10 h-10 text-olx-teal" />
              <span className="text-3xl font-bold text-olx-dark">{stats?.totalVehicles || 0}</span>
            </div>
            <h3 className="text-olx-muted font-semibold text-sm">Total vehicles</h3>
          </div>

          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 transition hover:shadow-premium-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-emerald-600" />
              <span className="text-3xl font-bold text-olx-dark">{stats?.availableVehicles || 0}</span>
            </div>
            <h3 className="text-olx-muted font-semibold text-sm">Available</h3>
          </div>

          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 transition hover:shadow-premium-lg">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-10 h-10 text-amber-600" />
              <span className="text-3xl font-bold text-olx-dark">{stats?.soldVehicles || 0}</span>
            </div>
            <h3 className="text-olx-muted font-semibold text-sm">Sold</h3>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mb-10 grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium ring-1 ring-slate-900/5">
            <h3 className="mb-4 text-lg font-extrabold text-olx-dark">Vehicle distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-olx-muted text-sm">Cars</span>
                <span className="text-2xl font-bold text-olx-dark">{stats?.totalCars || 0}</span>
              </div>
              <div className="w-full bg-olx-bg rounded-full h-3 border border-olx-border">
                <div
                  className="bg-olx-teal h-3 rounded-full transition-all"
                  style={{ width: `${stats?.totalVehicles ? (stats.totalCars / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-olx-muted text-sm">Bikes</span>
                <span className="text-2xl font-bold text-olx-dark">{stats?.totalBikes || 0}</span>
              </div>
              <div className="w-full bg-olx-bg rounded-full h-3 border border-olx-border">
                <div
                  className="bg-olx-dark h-3 rounded-full transition-all"
                  style={{ width: `${stats?.totalVehicles ? (stats.totalBikes / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium ring-1 ring-slate-900/5">
            <h3 className="mb-4 text-lg font-extrabold text-olx-dark">Status overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-olx-muted text-sm">Available</span>
                <span className="text-2xl font-bold text-emerald-700">{stats?.availableVehicles || 0}</span>
              </div>
              <div className="w-full bg-olx-bg rounded-full h-3 border border-olx-border">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all"
                  style={{ width: `${stats?.totalVehicles ? (stats.availableVehicles / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-olx-muted text-sm">Sold</span>
                <span className="text-2xl font-bold text-red-700">{stats?.soldVehicles || 0}</span>
              </div>
              <div className="w-full bg-olx-bg rounded-full h-3 border border-olx-border">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{ width: `${stats?.totalVehicles ? (stats.soldVehicles / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-2xl border border-olx-border bg-white shadow-premium-lg ring-1 ring-slate-900/5">
          <div className="flex border-b border-olx-border bg-slate-50/90">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-bold text-sm transition ${activeTab === 'overview'
                  ? 'bg-white text-olx-dark border-b-2 border-olx-dark -mb-px'
                  : 'text-olx-muted hover:text-olx-dark'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-bold text-sm transition ${activeTab === 'users'
                  ? 'bg-white text-olx-dark border-b-2 border-olx-dark -mb-px'
                  : 'text-olx-muted hover:text-olx-dark'
                }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex-1 px-6 py-4 font-bold text-sm transition ${activeTab === 'vehicles'
                  ? 'bg-white text-olx-dark border-b-2 border-olx-dark -mb-px'
                  : 'text-olx-muted hover:text-olx-dark'
                }`}
            >
              Vehicles ({vehicles.length})
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-olx-dark mb-6">Platform overview</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-olx-bg rounded-lg p-6 border border-olx-border">
                    <h3 className="text-base font-bold text-olx-dark mb-4">Recent activity</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-olx-muted">New users today</span>
                        <span className="text-emerald-700 font-bold">+12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-olx-muted">New listings today</span>
                        <span className="text-olx-dark font-bold">+8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-olx-muted">Sold today</span>
                        <span className="text-olx-dark font-bold">+5</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-olx-bg rounded-lg p-6 border border-olx-border">
                    <h3 className="text-base font-bold text-olx-dark mb-4">Quick stats</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-olx-muted">Avg. price</span>
                        <span className="text-olx-dark font-bold">₹6.5L</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-olx-muted">Total views</span>
                        <span className="text-olx-dark font-bold">45.2K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-olx-muted">Active sellers</span>
                        <span className="text-olx-dark font-bold">{users.filter(u => u.role === 'seller').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-extrabold text-olx-dark">Manage users</h2>
                  <button
                    type="button"
                    onClick={downloadUsersCsv}
                    className="inline-flex items-center justify-center rounded-xl bg-olx-dark px-5 py-2.5 text-sm font-extrabold text-white shadow-cta transition hover:bg-[#0d3d42]"
                  >
                    Download users CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-olx-border bg-olx-bg">
                        <th className="text-left text-olx-dark text-xs font-bold uppercase py-3 px-4">Name</th>
                        <th className="text-left text-olx-dark text-xs font-bold uppercase py-3 px-4">Email</th>
                        <th className="text-left text-olx-dark text-xs font-bold uppercase py-3 px-4">Phone</th>
                        <th className="text-left text-olx-dark text-xs font-bold uppercase py-3 px-4">Role</th>
                        <th className="text-left text-olx-dark text-xs font-bold uppercase py-3 px-4">Listings</th>
                        <th className="text-left text-olx-dark text-xs font-bold uppercase py-3 px-4">Joined</th>
                        <th className="text-left text-olx-dark text-xs font-bold uppercase py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} className="border-b border-olx-border hover:bg-olx-bg/80 transition">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-olx-teal rounded-full flex items-center justify-center">
                                <span className="text-olx-dark font-bold">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-olx-dark font-semibold">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-olx-muted text-sm">{user.email}</td>
                          <td className="py-4 px-4 text-olx-muted text-sm">{user.phone || 'N/A'}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'admin'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : user.role === 'seller'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {user.role === 'seller' ? (
                              <button
                                onClick={() => handleToggleListingsVisibility(user)}
                                className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                                  user.listingsVisible
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-olx-bg text-olx-muted border-olx-border'
                                }`}
                              >
                                {user.listingsVisible ? 'On' : 'Off'}
                              </button>
                            ) : (
                              <span className="text-olx-muted">-</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-olx-muted text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-700 hover:text-red-900 transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="text-center py-8 text-olx-muted">No users found</div>
                  )}
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-extrabold text-olx-dark">Manage vehicles</h2>
                  <button
                    type="button"
                    onClick={downloadVehiclesCsv}
                    className="inline-flex items-center justify-center rounded-xl bg-olx-dark px-5 py-2.5 text-sm font-extrabold text-white shadow-cta transition hover:bg-[#0d3d42]"
                  >
                    Download vehicles CSV
                  </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map(vehicle => (
                  <div key={vehicle._id} className="overflow-hidden rounded-2xl border border-olx-border bg-white shadow-premium transition hover:shadow-premium-lg">
                    <div className="h-40 bg-olx-bg flex items-center justify-center border-b border-olx-border">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={fullImageUrl(vehicle.images[0].url)}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl">
                          {vehicle.type === 'car' ? '🚗' : '🏍️'}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-olx-dark mb-2">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-olx-dark font-bold">
                          ₹{vehicle.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-olx-muted text-sm">{vehicle.year}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${vehicle.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                          {vehicle.status}
                        </span>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id)}
                          className="text-red-700 hover:text-red-900 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
                {vehicles.length === 0 && (
                  <div className="text-center py-12 text-olx-muted">No vehicles found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;