import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, MapPin, ChevronRight, Package } from 'lucide-react';
import { fullImageUrl } from '../utils/constants';

const VehicleCard = ({ vehicle, showStatus = true, onToggleCompare, isCompared = false }) => {
  const getStatusBadge = () => {
    const statusConfig = {
      available: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200/90',
        label: 'Available',
      },
      sold: {
        bg: 'bg-red-50',
        text: 'text-red-800',
        border: 'border-red-200/90',
        label: 'Sold',
      },
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-200/90',
        label: 'Pending',
      },
    };

    const config = statusConfig[vehicle.status] || statusConfig.available;

    return (
      <span
        className={`absolute top-3 right-3 z-10 px-2.5 py-1 ${config.bg} ${config.text} border ${config.border} rounded-lg text-[11px] font-extrabold uppercase tracking-wide shadow-sm`}
      >
        {config.label}
      </span>
    );
  };

  const handleCompareClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof onToggleCompare === 'function') {
      onToggleCompare(vehicle);
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-olx-border bg-white shadow-premium transition-all duration-400 ease-out-expo hover:shadow-premium-lg hover:-translate-y-1.5 hover:border-slate-300/80">
      {showStatus && getStatusBadge()}

      {typeof onToggleCompare === 'function' && (
        <button
          type="button"
          onClick={handleCompareClick}
          className={`absolute top-3 left-3 z-20 rounded-lg border px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-sm transition-all ${
            isCompared
              ? 'border-olx-dark bg-olx-dark text-white shadow-md'
              : 'border-white/80 bg-white/95 text-olx-dark shadow-sm hover:bg-white hover:border-olx-teal/50'
          }`}
        >
          {isCompared ? 'Added' : 'Compare'}
        </button>
      )}

  <Link to={`/parts/${vehicle._id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-olx-teal focus-visible:ring-offset-2 rounded-2xl">
        <div
          className={`relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden ${
            vehicle.status === 'sold' ? 'opacity-85' : ''
          }`}
        >
          {vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={fullImageUrl(vehicle.images[0].url)}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl opacity-40">
              {vehicle.type === 'car' ? '🚗' : '🏍️'}
            </div>
          )}
          {vehicle.status === 'sold' && (
            <div className="absolute inset-0 flex items-center justify-center bg-olx-dark/55 backdrop-blur-[2px]">
              <span className="rounded-lg bg-white/95 px-4 py-1.5 text-sm font-extrabold tracking-wide text-olx-dark">
                SOLD
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-olx-dark leading-snug line-clamp-2 group-hover:text-[#0d3d42] transition-colors">
                {vehicle.brand ? `${vehicle.brand} ${vehicle.model || ''}` : vehicle.name || 'Part'}
            </h3>
            <span className="shrink-0 rounded-lg border border-olx-border bg-slate-50 px-2 py-1 text-xs font-extrabold text-olx-muted tabular-nums">
              {vehicle.year}
            </span>
          </div>

          <div className="mt-3 text-2xl font-extrabold tabular-nums tracking-tight text-olx-dark">
            ₹{vehicle.price.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs font-medium text-olx-muted">Seller-listed price · Confirm compatibility and condition before you buy</p>

          <div className="mt-4 space-y-2 text-sm text-olx-muted">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 shrink-0 text-olx-teal" strokeWidth={2.25} />
              <span className="font-medium">
                {Number(vehicle.quantity || 0) > 0 ? `${vehicle.quantity} in stock` : 'Out of stock'}
              </span>
            </div>
            {/* Parts usually don't have km/mileage; show condition and fitment instead */}
            {vehicle.condition && (
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 shrink-0 text-olx-teal" strokeWidth={2.25} />
                <span className="font-medium">Condition: {vehicle.condition}</span>
              </div>
            )}
            {vehicle.fitment && (
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 shrink-0 text-olx-teal opacity-70" strokeWidth={2.25} />
                <span>Fitment: {vehicle.fitment}</span>
              </div>
            )}
            {vehicle.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-olx-teal" strokeWidth={2.25} />
                <span className="line-clamp-1">
                  {vehicle.location.city}, {vehicle.location.state}
                </span>
              </div>
            )}
          </div>

          <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-olx-dark py-3.5 text-sm font-extrabold text-white shadow-cta transition-all duration-250 group-hover:bg-[#0d3d42] group-hover:shadow-cta-hover active:scale-[0.99]">
            View details
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
          </span>
        </div>
      </Link>
    </article>
  );
};

export default VehicleCard;
