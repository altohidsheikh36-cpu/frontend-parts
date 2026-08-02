import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Eye, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { fullImageUrl } from '../utils/constants';
import { partService } from '../services/partService';

const MyListings = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const data = await partService.getMyParts();
      setVehicles(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await partService.deletePart(id);
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete part');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
  await partService.updatePartStatus(id, newStatus);
      
      // Update local state
      setVehicles(vehicles.map(v => 
        v._id === id ? { ...v, status: newStatus } : v
      ));
      
      // Show success message
  alert(`Part marked as ${newStatus}!`);
    } catch (error) {
      console.error('Error updating status:', error);
  alert('Failed to update part status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusButton = (vehicle) => {
    const isUpdating = updatingStatus === vehicle._id;
    
    if (vehicle.status === 'available') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate(vehicle._id, 'pending')}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-900 font-semibold rounded-lg border border-amber-200 hover:bg-amber-100 transition disabled:opacity-50"
          >
            <Clock className="w-4 h-4" />
            <span>{isUpdating ? 'Updating...' : 'Mark Pending'}</span>
          </button>
          <button
            onClick={() => handleStatusUpdate(vehicle._id, 'sold')}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-800 font-semibold rounded-lg border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>{isUpdating ? 'Updating...' : 'Mark Sold'}</span>
          </button>
        </div>
      );
    } else if (vehicle.status === 'pending') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate(vehicle._id, 'available')}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isUpdating ? 'Updating...' : 'Mark Available'}</span>
          </button>
          <button
            onClick={() => handleStatusUpdate(vehicle._id, 'sold')}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-800 font-semibold rounded-lg border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>{isUpdating ? 'Updating...' : 'Mark Sold'}</span>
          </button>
        </div>
      );
    } else {
      // status === 'sold'
      return (
        <button
          onClick={() => handleStatusUpdate(vehicle._id, 'available')}
          disabled={isUpdating}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isUpdating ? 'Updating...' : 'Relist as Available'}</span>
        </button>
      );
    }
  };

  if (loading) {
    return (
      <div className="cro-page flex items-center justify-center">
        <p className="text-sm font-bold text-olx-muted">Loading your ads…</p>
      </div>
    );
  }

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-olx-dark sm:text-4xl">Your listings</h1>
            <p className="mt-2 max-w-lg text-olx-muted leading-relaxed">
              Update status when a deal progresses — buyers see live availability.
            </p>
          </div>
          <Link 
            to="/add-part"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-olx-sell px-6 py-3.5 font-extrabold text-olx-dark shadow-md transition hover:brightness-105 active:scale-[0.99]"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            Post another ad
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-5">
          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olx-muted text-sm mb-1">Available</p>
                <p className="text-3xl font-bold text-emerald-700">
                  {vehicles.filter(v => v.status === 'available').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          
          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olx-muted text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-700">
                  {vehicles.filter(v => v.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </div>
          
          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olx-muted text-sm mb-1">Sold</p>
                <p className="text-3xl font-bold text-red-700">
                  {vehicles.filter(v => v.status === 'sold').length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-olx-muted text-sm mb-1">Stock units</p>
                <p className="text-3xl font-bold text-sky-700">
                  {vehicles.reduce((total, v) => total + Number(v.quantity || 0), 0)}
                </p>
              </div>
              <Package className="w-12 h-12 text-sky-600" />
            </div>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-olx-border bg-white py-20 text-center shadow-premium">
            <p className="text-lg font-extrabold text-olx-dark">No ads yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-olx-muted">Your first listing goes live in minutes — add photos and a fair price.</p>
            <Link 
              to="/add-part"
              className="mt-8 inline-flex rounded-xl bg-olx-dark px-8 py-3.5 font-extrabold text-white shadow-cta transition hover:bg-[#0d3d42]"
            >
              Post your first ad
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {vehicles.map(vehicle => (
              <div key={vehicle._id} className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium transition hover:shadow-premium-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 bg-olx-bg rounded-lg overflow-hidden flex-shrink-0 relative border border-olx-border">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img 
                        src={fullImageUrl(vehicle.images[0].url)} 
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {vehicle.type === 'car' ? '🚗' : '🏍️'}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-olx-dark mb-2">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <div className="flex items-center gap-4 text-olx-muted text-sm">
                          <span className="bg-olx-bg text-olx-dark px-3 py-1 rounded font-bold border border-olx-border">
                            {vehicle.year}
                          </span>
                          <span className="capitalize">{vehicle.type}</span>
                          <span>{vehicle.mileage}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-olx-dark">
                          ₹{vehicle.price.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center text-olx-muted text-sm mt-2">
                          <Eye className="w-4 h-4 mr-1" />
                          {vehicle.views} views
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1 text-sm font-bold text-olx-dark ring-1 ring-olx-border">
                          <Package className="h-4 w-4 text-olx-teal" />
                          {Number(vehicle.quantity || 0)} in stock
                        </div>
                      </div>
                    </div>

                    {vehicle.description && (
                      <p className="text-olx-muted mb-4 line-clamp-2 text-sm">{vehicle.description}</p>
                    )}

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        vehicle.status === 'available' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : vehicle.status === 'sold'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/parts/${vehicle._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-olx-bg text-olx-dark font-semibold rounded-lg border border-olx-border hover:bg-white transition"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      
                      {/* Status Update Buttons */}
                      {getStatusButton(vehicle)}
                      
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-800 font-semibold rounded-lg border border-red-200 hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
