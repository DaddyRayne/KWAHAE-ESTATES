import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { SafetyBanner } from '../components/SafetyBanner';
import { PROPERTY_TYPES, SENANGA_LOCATIONS } from '../services/sampleData';
import { Search, MapPin, SlidersHorizontal, ArrowRight, ShieldCheck, Home as HomeIcon, Smartphone, Sparkles, Building2, Store } from 'lucide-react';

interface HomeViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (view: string, filterParams?: any) => void;
  onOpenFilter: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
  onOpenFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('browse', {
      searchQuery: searchQuery,
      location: selectedLocation !== 'all' ? selectedLocation : undefined
    });
  };

  // Featured and latest properties
  const featured = properties.filter((p) => p.isFeatured && p.status === 'available');
  const latest = properties.filter((p) => p.status === 'available').slice(0, 6);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Section with Western Province / Senanga Theme */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-8 md:p-10 shadow-xl border border-emerald-700/40">
        {/* Subtle decorative background water ripple */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Senanga District • Western Province</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Find Your Next Home or Shop in Senanga.
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            Browse houses, bedsitters, self-contained flats, and commercial shops across Senanga Boma, Mungule, Katuya, Silele Roundabout, Airport Area, and Nayaya. Direct contact with landlords with zero middleman fees.
          </p>

          {/* Search Box on Hero */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-5 bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-gray-800"
          >
            {/* Location selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-gray-100 flex-1">
              <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all">Any Location in Senanga</option>
                {SENANGA_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword / title search */}
            <div className="flex items-center gap-2 px-3 py-1.5 flex-1">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search house, bedsitter, shop..."
                className="w-full text-xs text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
              />
            </div>

            {/* Filter and Search Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenFilter}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                title="Open filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick stats badge */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-emerald-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All prices in Zambian Kwacha (ZMW)
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Admin Reviewed Listings
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
              Low Mobile Data Friendly
            </span>
          </div>
        </div>
      </section>

      {/* Safety Alert Advisory */}
      <SafetyBanner />

      {/* Quick Category Navigation Pills */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Property Categories
          </h2>
          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigate('browse', { propertyType: 'house' })}
            className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">Residential</h3>
              <p className="text-[10px] text-gray-500">Houses & Flats</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('browse', { propertyType: 'bedsitter' })}
            className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">Bedsitters</h3>
              <p className="text-[10px] text-gray-500">Self-Contained</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('browse', { propertyType: 'shop' })}
            className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">Shops & Retail</h3>
              <p className="text-[10px] text-gray-500">Commercial</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('browse', { propertyType: 'office' })}
            className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">Offices</h3>
              <p className="text-[10px] text-gray-500">Professional Suites</p>
            </div>
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                Featured Senanga Listings
              </h2>
              <p className="text-xs text-gray-500">Hand-picked quality homes & shops</p>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>See more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.slice(0, 3).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest Available Properties */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Recently Added Rentals
            </h2>
            <p className="text-xs text-gray-500">Newest available advertisements in Senanga</p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Browse All ({properties.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </section>

      {/* Landlord Call to Action */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider">
            For Property Owners in Senanga
          </div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900">
            Have a house, shop, or room to rent out?
          </h3>
          <p className="text-xs text-gray-600 max-w-lg">
            Advertise your property on Kwahae Estates for free. Reach hundreds of teachers, nurses, NGO workers, and business tenants looking for rentals in Senanga.
          </p>
        </div>

        <button
          onClick={() => onNavigate('add_property')}
          className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center gap-2 whitespace-nowrap"
        >
          <span>Post Advertisement (Free)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
