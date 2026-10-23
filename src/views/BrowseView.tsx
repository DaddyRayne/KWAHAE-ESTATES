import React, { useState } from 'react';
import { FilterOptions, Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { SENANGA_LOCATIONS, PROPERTY_TYPES } from '../services/sampleData';
import { Search, SlidersHorizontal, X, ArrowUpDown, Building, MapPin } from 'lucide-react';

interface BrowseViewProps {
  properties: Property[];
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onSelectProperty: (property: Property) => void;
  onOpenFilterModal: () => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  properties,
  filters,
  onFilterChange,
  onSelectProperty,
  onOpenFilterModal
}) => {
  const [searchInput, setSearchInput] = useState(filters.searchQuery || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, searchQuery: searchInput });
  };

  const handleTypeSelect = (type: string) => {
    onFilterChange({
      ...filters,
      propertyType: filters.propertyType === type ? 'all' : type
    });
  };

  const handleSortChange = (sortBy: 'newest' | 'price_asc' | 'price_desc') => {
    onFilterChange({ ...filters, sortBy });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    onFilterChange({});
  };

  const hasActiveFilters = Boolean(
    filters.propertyType ||
    filters.location ||
    filters.minPrice ||
    filters.maxPrice ||
    (filters.bedrooms && filters.bedrooms !== 'any') ||
    filters.searchQuery ||
    (filters.status && filters.status !== 'available')
  );

  return (
    <div className="space-y-4 pb-16">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, location or landmark..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ ...filters, searchQuery: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenFilterModal}
            className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition ${
              hasActiveFilters
                ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            )}
          </button>
        </form>

        {/* Quick Type Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            type="button"
            onClick={() => handleTypeSelect('all')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition ${
              !filters.propertyType || filters.propertyType === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTypeSelect(t.value)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition ${
                filters.propertyType === t.value
                  ? 'bg-emerald-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header & Active Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
            Rental Properties in Senanga
          </h1>
          <p className="text-xs text-gray-500">
            Showing {properties.length} {properties.length === 1 ? 'advertisement' : 'advertisements'}
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            Sort:
          </span>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 font-semibold text-gray-800 focus:outline-none focus:border-emerald-600 text-xs cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-[11px] text-gray-400 font-medium">Active Filters:</span>
          {filters.propertyType && filters.propertyType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px]">
              Type: {filters.propertyType}
              <X
                className="w-3 h-3 cursor-pointer hover:text-emerald-950"
                onClick={() => onFilterChange({ ...filters, propertyType: undefined })}
              />
            </span>
          )}
          {filters.location && filters.location !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px]">
              <MapPin className="w-3 h-3" />
              {filters.location}
              <X
                className="w-3 h-3 cursor-pointer hover:text-emerald-950"
                onClick={() => onFilterChange({ ...filters, location: undefined })}
              />
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px]">
              Rent: ZMW {filters.minPrice || 0} - {filters.maxPrice || '∞'}
              <X
                className="w-3 h-3 cursor-pointer hover:text-emerald-950"
                onClick={() => onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined })}
              />
            </span>
          )}
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px]">
              Query: "{filters.searchQuery}"
              <X
                className="w-3 h-3 cursor-pointer hover:text-emerald-950"
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ ...filters, searchQuery: undefined });
                }}
              />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Property Cards Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Building className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-gray-900">
            No properties found matching your criteria
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your price range, clearing specific location filters, or searching for other rental types in Senanga.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
