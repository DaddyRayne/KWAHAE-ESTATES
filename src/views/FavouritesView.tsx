import React, { useState } from 'react';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { getFavourites, getProperties } from '../services/db';
import { Heart, ArrowRight, Building } from 'lucide-react';

interface FavouritesViewProps {
  onSelectProperty: (property: Property) => void;
  onNavigate: (view: string) => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  onSelectProperty,
  onNavigate
}) => {
  const [favIds, setFavIds] = useState<string[]>(() => getFavourites());
  const allProperties = getProperties({}, true);
  const favProperties = allProperties.filter((p) => favIds.includes(p.id));

  const handleFavChange = () => {
    setFavIds(getFavourites());
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <span>Saved Properties</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Properties in Senanga you bookmarked for later review.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700">
          {favProperties.length} Saved
        </span>
      </div>

      {favProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
              onFavouriteChange={handleFavChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-gray-900">
            No saved properties yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Tap the heart icon on any property card to save it here for fast viewing without searching again.
          </p>
          <button
            onClick={() => onNavigate('browse')}
            className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
          >
            Browse Available Properties
          </button>
        </div>
      )}
    </div>
  );
};
