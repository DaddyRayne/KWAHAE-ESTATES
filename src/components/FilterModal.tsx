import React, { useState } from 'react';
import { FilterOptions } from '../types';
import { PROPERTY_TYPES, SENANGA_LOCATIONS } from '../services/sampleData';
import { X, RotateCcw, Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApply: (newFilters: FilterOptions) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>({ ...filters });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setLocalFilters({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Filter Properties</h2>
            <p className="text-xs text-gray-500">Senanga District, Western Province</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-5 space-y-5 flex-1">
          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Property Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, propertyType: 'all' })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  !localFilters.propertyType || localFilters.propertyType === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, propertyType: t.value })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    localFilters.propertyType === t.value
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location in Senanga */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Location in Senanga
            </label>
            <select
              value={localFilters.location || 'all'}
              onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none bg-white font-medium"
            >
              <option value="all">All Locations in Senanga District</option>
              {SENANGA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Rent Range (ZMW) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Monthly Rent Range (ZMW)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-gray-500">Min Price (ZMW)</span>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={localFilters.minPrice ?? ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minPrice: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-gray-500">Max Price (ZMW)</span>
                <input
                  type="number"
                  placeholder="e.g. 4000"
                  value={localFilters.maxPrice ?? ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Number of Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Bedrooms
            </label>
            <div className="flex gap-2">
              {['any', 1, 2, 3, 4].map((num) => (
                <button
                  key={String(num)}
                  type="button"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      bedrooms: num === 'any' ? 'any' : (num as number)
                    })
                  }
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    (localFilters.bedrooms === undefined && num === 'any') ||
                    localFilters.bedrooms === num
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {num === 'any' ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Availability
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, status: 'available' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between ${
                  localFilters.status === 'available'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Available Now</span>
                {localFilters.status === 'available' && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, status: 'all' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between ${
                  !localFilters.status || localFilters.status === 'all'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Include Rented</span>
                {(!localFilters.status || localFilters.status === 'all') && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'newest', label: 'Newest First' },
                { id: 'price_asc', label: 'Price: Low-High' },
                { id: 'price_desc', label: 'Price: High-Low' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      sortBy: s.id as 'newest' | 'price_asc' | 'price_desc'
                    })
                  }
                  className={`py-2 px-2 text-center rounded-xl text-[11px] font-bold border transition ${
                    (localFilters.sortBy || 'newest') === s.id
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
