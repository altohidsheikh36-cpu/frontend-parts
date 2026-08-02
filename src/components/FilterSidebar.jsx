import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CAR_BRANDS, BIKE_BRANDS, FUEL_TYPES, TRANSMISSION_TYPES, PARTS_CATEGORIES} from '../utils/constants';

const field =
  'w-full px-4 py-3 bg-white border border-olx-border rounded-lg text-olx-dark placeholder:text-olx-muted focus:outline-none focus:ring-2 focus:ring-olx-teal focus:border-olx-dark';

const FilterSidebar = ({ filters, onFilterChange, vehicleType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const brands = vehicleType === 'car' ? CAR_BRANDS : vehicleType === 'bike' ? BIKE_BRANDS : [];

  const handleReset = () => {
    onFilterChange({
      type: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      minYear: '',
      maxYear: '',
      partsCategory:''
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-olx-dark flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-olx-teal" />
          Filters
        </h3>
        <button type="button" onClick={() => setIsOpen(false)} className="lg:hidden text-olx-dark p-1" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
      </div>

      {brands.length > 0 && (
        <div>
          <label className="block text-olx-dark font-semibold text-sm mb-2">Brand</label>
          <select
            value={filters.brand || ''}
            onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
            className={field}
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

        {/* ******************* */}
        {/* Parts category search */}

      {PARTS_CATEGORIES.length > 0 && (
        <div>
          <label className="block text-olx-dark font-semibold text-sm mb-2">Parts Categories</label>
          <select
            value={filters.partsCategory || ''}
            onChange={(e) => onFilterChange({ ...filters, partsCategory: e.target.value })}
            className={field}
          >
            <option value="">All Parts Categories</option>
            {PARTS_CATEGORIES.map((partsCategory) => (
              <option key={partsCategory} value={partsCategory}>
                {partsCategory}
              </option>
            ))}
          </select>
        </div>
      )}


      {/* ********************* */}
      <div>
        <label className="block text-olx-dark font-semibold text-sm mb-2">Price range (₹)</label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
            className={field}
          />
          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className="block text-olx-dark font-semibold text-sm mb-2">Year</label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min year"
            min="1990"
            max={new Date().getFullYear()}
            value={filters.minYear || ''}
            onChange={(e) => onFilterChange({ ...filters, minYear: e.target.value })}
            className={field}
          />
          <input
            type="number"
            placeholder="Max year"
            min="1990"
            max={new Date().getFullYear()}
            value={filters.maxYear || ''}
            onChange={(e) => onFilterChange({ ...filters, maxYear: e.target.value })}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className="block text-olx-dark font-semibold text-sm mb-2">Fuel type</label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => onFilterChange({ ...filters, fuelType: e.target.value })}
          className={field}
        >
          <option value="">All types</option>
          {FUEL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-olx-dark font-semibold text-sm mb-2">Transmission</label>
        <select
          value={filters.transmission || ''}
          onChange={(e) => onFilterChange({ ...filters, transmission: e.target.value })}
          className={field}
        >
          <option value="">All types</option>
          {TRANSMISSION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="w-full py-3 bg-olx-bg text-olx-dark font-bold rounded-lg border border-olx-border hover:bg-white transition"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-olx-dark text-white rounded-full shadow-olx-hover hover:bg-olx-muted transition"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>

      <div className="hidden lg:block bg-white rounded-xl p-6 border border-olx-border shadow-olx sticky top-24">
        <FilterContent />
      </div>

      {isOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-olx-dark/40 z-40" onClick={() => setIsOpen(false)} role="presentation" />
          <div className="lg:hidden fixed inset-y-0 right-0 w-80 bg-white border-l border-olx-border p-6 z-50 overflow-y-auto shadow-olx-hover">
            <FilterContent />
          </div>
        </>
      )}
    </>
  );
};

export default FilterSidebar;
