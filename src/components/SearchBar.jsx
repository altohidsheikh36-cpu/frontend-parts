import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { CAR_BRANDS, BIKE_BRANDS, PARTS_CATEGORIES } from '../utils/constants';

const SearchBar = ({ onSearch, vehicleType = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPartsCategory, setSelectedPartsCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ search: searchTerm, brand: selectedBrand, partsCategory: selectedPartsCategory });
  };

  const brands =
    vehicleType === 'car'
      ? CAR_BRANDS
      : vehicleType === 'bike'
        ? BIKE_BRANDS
        : [...CAR_BRANDS, ...BIKE_BRANDS];

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="rounded-2xl bg-white p-1.5 shadow-premium-lg ring-1 ring-slate-200/80 focus-within:ring-2 focus-within:ring-olx-teal/30 transition-shadow duration-250">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-2">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50/90 px-4 py-3 min-h-[52px] ring-1 ring-slate-100">
            <Search className="w-5 h-5 text-olx-teal shrink-0" strokeWidth={2.25} />
            <input
              type="text"
              placeholder="Search by brand or model…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-olx-dark placeholder:text-slate-400 outline-none text-base font-medium min-w-0"
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50/90 px-4 py-3 min-h-[52px] ring-1 ring-slate-100 lg:min-w-[220px]">
            <Filter className="w-5 h-5 text-olx-muted shrink-0" strokeWidth={2.25} />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-olx-dark font-semibold text-sm outline-none cursor-pointer"
            >
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Parts category select (shows all categories) */}

            
            {PARTS_CATEGORIES && PARTS_CATEGORIES.length > 0 && (
              <select
                value={selectedPartsCategory}
                onChange={(e) => setSelectedPartsCategory(e.target.value)}
                className="ml-3 bg-transparent text-olx-dark font-semibold text-sm outline-none cursor-pointer"
              >
                <option value="">All parts</option>
                {PARTS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            className="rounded-xl px-8 py-3.5 bg-olx-dark text-white font-extrabold text-base shadow-cta hover:shadow-cta-hover hover:bg-[#0d3d42] active:scale-[0.98] transition-all duration-250 lg:shrink-0 lg:px-10"
          >
            Search listings
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
