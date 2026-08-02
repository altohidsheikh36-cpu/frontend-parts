import React, { useState, useEffect } from 'react';
import { Search, Car, Bike, Scale, X, AlertCircle } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import AnimateOnScroll from '../components/AnimateOnScroll';
import VehicleCompareModal from '../components/VehicleCompareModal';
import { partService } from '../services/partService';
import { CAR_BRANDS, BIKE_BRANDS, PARTS_CATEGORIES } from '../utils/constants';

const MAX_COMPARE_ITEMS = 3;

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    partsCategory: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
    limit: 12,
    nearLat: '',
    nearLng: '',
    nearRadiusKm: ''
  });
  const [activeType, setActiveType] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [useNearby, setUseNearby] = useState(false);
  const [compareSelections, setCompareSelections] = useState([]);
  const [compareError, setCompareError] = useState('');
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareResults, setCompareResults] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  useEffect(() => {
    if (compareModalOpen && compareSelections.length < 2) {
      setCompareModalOpen(false);
    }
  }, [compareModalOpen, compareSelections]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      if (!useNearby) {
        delete params.nearLat; delete params.nearLng; delete params.nearRadiusKm;
      }
      const data = await partService.getParts(params);
      setVehicles(data.data);
      setTotalPages(Number(data.totalPages || 1));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setFilters(prev => ({ ...prev, type, brand: '' }));
    setCompareError('');

    if (type && compareSelections.length > 0 && compareSelections[0].type !== type) {
      setCompareSelections([]);
      setCompareResults([]);
    }
  };

  const handleToggleCompare = (vehicle) => {
    setCompareError('');
    setCompareModalOpen(false);
    setCompareResults(prev => prev.filter(item => item._id !== vehicle._id));

    const alreadySelected = compareSelections.some(item => item._id === vehicle._id);

    if (alreadySelected) {
      setCompareSelections(prev => prev.filter(item => item._id !== vehicle._id));
      return;
    }

    if (compareSelections.length >= MAX_COMPARE_ITEMS) {
      const label = compareSelections[0]?.type === 'bike' ? 'bikes' : 'four wheelers';
      setCompareError(`You can compare up to ${MAX_COMPARE_ITEMS} ${label} at a time.`);
      return;
    }

    if (compareSelections.length > 0 && compareSelections[0].type !== vehicle.type) {
      const currentLabel = compareSelections[0].type === 'bike' ? 'bikes' : 'four wheelers';
      const newLabel = vehicle.type === 'bike' ? 'bikes' : 'four wheelers';
      setCompareError(`You can only compare ${currentLabel} together. Clear your selection to compare ${newLabel}.`);
      return;
    }

    setCompareSelections(prev => [...prev, vehicle]);
  };

  const handleOpenCompare = async () => {
    if (compareSelections.length < 2) return;

    try {
      setCompareError('');
      setCompareLoading(true);
      setCompareResults([]);

      const ids = compareSelections.map(vehicle => vehicle._id);
  const response = await partService.compareParts(ids);
      const items = Array.isArray(response.data) ? response.data.filter(Boolean) : [];

      if (items.length < 2) {
        setCompareError('Need at least two vehicles of the same type to compare.');
        return;
      }

      setCompareResults(items);
      setCompareModalOpen(true);
    } catch (error) {
      console.error('Error fetching compare data:', error);
      const message = error?.response?.data?.message || 'Failed to load comparison. Please try again.';
      setCompareError(message);
    } finally {
      setCompareLoading(false);
    }
  };

  const handleRemoveFromCompare = (vehicleId) => {
    setCompareError('');
    setCompareSelections(prev => prev.filter(vehicle => vehicle._id !== vehicleId));
    setCompareResults(prev => prev.filter(vehicle => vehicle._id !== vehicleId));
  };

  const handleClearCompare = () => {
    setCompareSelections([]);
    setCompareResults([]);
    setCompareModalOpen(false);
    setCompareError('');
  };

  const selectedTypeLabel = compareSelections.length > 0 && compareSelections[0].type === 'bike' ? 'Bikes' : 'Four Wheelers';
  const selectedTypeLowerLabel = compareSelections.length > 0 && compareSelections[0].type === 'bike' ? 'bikes' : 'four wheelers';

  const brands = activeType === 'car' ? CAR_BRANDS : activeType === 'bike' ? BIKE_BRANDS : [];

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setFilters(f => ({ ...f, nearLat: latitude, nearLng: longitude, nearRadiusKm: f.nearRadiusKm || 25 }));
      setUseNearby(true);
    });
  };

  return (
    <>
      <div className="cro-page">
        <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-balance text-center text-3xl font-extrabold tracking-tight text-olx-dark md:text-4xl">
          Find the part you need
        </h1>
        <p className="mx-auto mb-2 max-w-lg text-center text-base leading-relaxed text-olx-muted">
          Filter by type, price, and location — open a listing to message the seller in one tap.
        </p>
        <p className="mb-10 text-center text-xs font-medium text-olx-muted/80">Compare up to three similar listings side by side to decide faster.</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-olx-border shadow-premium-lg p-4 sm:p-6 md:p-8 mb-10">
          {/* Type Tabs */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex w-full max-w-md sm:max-w-none sm:w-auto flex-wrap justify-center bg-slate-100/90 rounded-xl p-1 ring-1 ring-slate-200/80 shadow-inner">
              <button
                onClick={() => handleTypeChange('')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${activeType === ''
                  ? 'bg-white text-olx-dark shadow-sm ring-1 ring-slate-200/80'
                  : 'text-olx-muted hover:text-olx-dark'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => handleTypeChange('car')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${activeType === 'car'
                  ? 'bg-white text-olx-dark shadow-sm ring-1 ring-slate-200/80'
                  : 'text-olx-muted hover:text-olx-dark'
                  }`}
              >
                <Car className="w-5 h-5" />
                <span>Cars</span>
              </button>
              <button
                onClick={() => handleTypeChange('bike')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${activeType === 'bike'
                  ? 'bg-white text-olx-dark shadow-sm ring-1 ring-slate-200/80'
                  : 'text-olx-muted hover:text-olx-dark'
                  }`}
              >
                <Bike className="w-5 h-5" />
                <span>Bikes</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-olx-muted" />
                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-olx-border rounded-xl text-olx-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-olx-teal/25 focus:border-olx-teal/40 transition font-medium"
                />
              </div>
            </div>

            <div>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-olx-border rounded-lg text-olx-dark focus:outline-none focus:border-olx-dark transition"
                style={{ position: 'relative', overflow: 'visible', direction: 'ltr' }}
              >
                <option value="">All Brands</option>
                {[
                  'Honda', 'Yamaha', 'Hero', 'TVS', 'Bajaj', 'Suzuki', 'KTM', 'Royal Enfield',
                  'Mahindra', 'Hyundai', 'Tata', 'Maruti Suzuki', 'Toyota', 'Kia', 'Ford',
                  'Volkswagen', 'Nissan'
                ].map((brand) => (
                  <option key={brand} value={brand} className="text-black bg-white">
                    {brand}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <select
                value={filters.partsCategory || ''}
                onChange={(e) => setFilters({ ...filters, partsCategory: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-olx-border rounded-lg text-olx-dark focus:outline-none focus:border-olx-dark transition"
              >
                <option value="">All Parts</option>
                {PARTS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="text-black bg-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-olx-border rounded-lg text-olx-dark focus:outline-none focus:border-olx-dark transition"
              >
                <option value="">
                  All Status
                </option>
                <option value="available" className="text-black bg-white">
                  Available
                </option>
                <option value="sold" className="text-black bg-white">
                  Sold
                </option>
                <option value="pending" className="text-black bg-white">
                  Pending
                </option>
              </select>


            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-1/2 px-4 py-3 bg-olx-bg border border-olx-border rounded-lg text-olx-dark placeholder:text-olx-muted focus:outline-none focus:border-olx-dark transition"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-1/2 px-4 py-3 bg-olx-bg border border-olx-border rounded-lg text-olx-dark placeholder:text-olx-muted focus:outline-none focus:border-olx-dark transition"
              />
            </div>
          <div>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="w-full px-4 py-3 bg-white border border-olx-border rounded-lg text-olx-dark focus:outline-none focus:border-olx-dark transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest" className="text-black bg-white">Oldest</option>
              <option value="price_asc" className="text-black bg-white">Price: Low to High</option>
              <option value="price_desc" className="text-black bg-white">Price: High to Low</option>
              <option value="year_desc" className="text-black bg-white">Year: New to Old</option>
              <option value="year_asc" className="text-black bg-white">Year: Old to New</option>
              <option value="popular" className="text-black bg-white">Most Viewed</option>
            </select>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
            <label className="text-olx-dark flex items-center gap-2 text-sm font-semibold shrink-0">
              <input
                type="checkbox"
                checked={useNearby}
                onChange={(e) => setUseNearby(e.target.checked)}
                className="rounded border-olx-border"
              />
              Nearby
            </label>
            <button
              type="button"
              onClick={useMyLocation}
              className="px-4 py-2 bg-olx-teal text-olx-dark font-bold rounded-lg hover:brightness-95 transition text-sm"
            >
              Use my location
            </button>
            {useNearby && (
              <input
                type="number"
                min="1"
                placeholder="Radius (km)"
                value={filters.nearRadiusKm}
                onChange={(e) => setFilters({ ...filters, nearRadiusKm: e.target.value, page: 1 })}
                className="px-4 py-2 bg-olx-bg border border-olx-border rounded-lg text-olx-dark placeholder:text-olx-muted focus:outline-none focus:border-olx-dark transition"
              />
            )}
          </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-olx-muted">Loading listings…</p>
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <AnimateOnScroll key={vehicle._id} animation="fade-up" delay={(index % 9) * 70}>
                <VehicleCard
                  vehicle={vehicle}
                  onToggleCompare={handleToggleCompare}
                  isCompared={compareSelections.some(item => item._id === vehicle._id)}
                />
              </AnimateOnScroll>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-olx-border bg-white py-16 text-center shadow-premium">
            <p className="text-lg font-extrabold text-olx-dark">No listings match</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-olx-muted">Widen your price range or clear filters — new ads are added daily.</p>
          </div>
        )}
        {/* Pagination */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={filters.page <= 1}
            onClick={() => setFilters({ ...filters, page: Math.max(1, Number(filters.page) - 1) })}
            className="rounded-xl border border-olx-border bg-white px-5 py-2.5 text-sm font-extrabold text-olx-dark shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </button>
          <span className="rounded-full border border-olx-border bg-white px-4 py-2 text-sm font-bold text-olx-dark shadow-sm">
            Page {filters.page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={filters.page >= totalPages}
            onClick={() => setFilters({ ...filters, page: Math.min(totalPages, Number(filters.page) + 1) })}
            className="rounded-xl border border-olx-border bg-white px-5 py-2.5 text-sm font-extrabold text-olx-dark shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
      </div>
    </div>

      {compareSelections.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-5xl -translate-x-1/2 px-4">
          <div className="rounded-2xl border-2 border-olx-dark bg-white p-4 shadow-premium-lg ring-1 ring-slate-900/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-olx-teal">
                  <Scale className="h-4 w-4 text-olx-dark" />
                  <span className="text-olx-dark">Compare {selectedTypeLabel}</span>
                </div>
                <div className="mt-1 text-lg font-bold text-olx-dark">{compareSelections.length} selected</div>
                <div className="text-sm text-olx-muted">
                  Select up to {MAX_COMPARE_ITEMS} {selectedTypeLowerLabel} to compare side by side.
                </div>
                {compareError && (
                  <div className="mt-2 flex items-start gap-2 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{compareError}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-start gap-3 md:flex-1 md:justify-center">
                {compareSelections.map(vehicle => (
                  <div
                    key={vehicle._id}
                    className="flex items-center gap-2 rounded-full border border-olx-border bg-olx-bg px-3 py-2 text-sm text-olx-dark"
                  >
                    <span className="font-semibold">{vehicle.brand} {vehicle.model}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCompare(vehicle._id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-olx-border text-olx-dark transition hover:bg-olx-bg"
                      aria-label={`Remove ${vehicle.brand} ${vehicle.model} from comparison`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 md:w-auto md:flex-row">
                <button
                  type="button"
                  onClick={handleClearCompare}
                  className="inline-flex items-center justify-center rounded-full border-2 border-olx-border px-4 py-2 text-sm font-bold text-olx-dark transition hover:bg-olx-bg"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleOpenCompare}
                  disabled={compareSelections.length < 2 || compareLoading}
                  className="inline-flex items-center justify-center rounded-full bg-olx-dark px-6 py-2.5 text-sm font-extrabold text-white shadow-cta transition hover:bg-[#0d3d42] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {compareLoading ? 'Loading…' : 'Compare now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <VehicleCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        vehicles={compareResults.length >= 2 ? compareResults : compareSelections}
        onRemove={handleRemoveFromCompare}
      />
    </>
  );
};

export default Vehicles;
