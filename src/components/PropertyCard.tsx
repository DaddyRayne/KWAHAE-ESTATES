import React from 'react';
import { Property } from '../types';
import { MapPin, Bed, Bath, Phone, Heart, Eye } from 'lucide-react';
import { isFavourite, toggleFavourite } from '../services/db';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onFavouriteChange?: () => void;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onFavouriteChange,
  compact = false
}) => {
  const [fav, setFav] = React.useState(() => isFavourite(property.id));

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavourite(property.id);
    setFav(updated);
    if (onFavouriteChange) onFavouriteChange();
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Direct tel: dialer link
    window.location.href = `tel:${property.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.whatsapp) return;
    // Clean phone number for WhatsApp: ensure international country code for Zambia (260)
    let cleanNumber = property.whatsapp.replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '260' + cleanNumber.substring(1);
    } else if (!cleanNumber.startsWith('260') && cleanNumber.length === 9) {
      cleanNumber = '260' + cleanNumber;
    }
    const message = encodeURIComponent(
      `Hello ${property.landlordName}, I saw your rental advertisement for "${property.title}" in Senanga on the Kwahae Estates app. Is it still available?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  // Thumbnail photo fallback
  const photoUrl = property.photographs && property.photographs.length > 0
    ? property.photographs[0]
    : 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=75';

  const isRented = property.status === 'rented';
  const isPending = property.status === 'pending_approval';

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Photograph Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={photoUrl}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isRented ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-xs">
              Rented Out
            </span>
          ) : isPending ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
              Pending Approval
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              Available
            </span>
          )}

          {property.isFeatured && !isRented && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavClick}
          aria-label={fav ? 'Remove from saved' : 'Save property'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-rose-600 transition shadow-xs"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Property Type Pill */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md capitalize">
          {property.propertyType.replace('_', ' ')}
        </div>

        {/* Photo count indicator */}
        {property.photographs && property.photographs.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <span>📷 {property.photographs.length}</span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="text-emerald-800 font-extrabold text-lg sm:text-xl">
              ZMW {property.monthlyRentZmw.toLocaleString()}
              <span className="text-xs font-normal text-gray-500"> / month</span>
            </div>
            <div className="text-[11px] text-gray-400 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{property.viewsCount || 0}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* Rooms Specs */}
          <div className="flex items-center gap-4 text-xs text-gray-500 py-1.5 border-t border-b border-gray-100 my-2">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-gray-400" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-gray-400" />
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </span>
            )}
            <span className="text-gray-400 ml-auto text-[11px]">
              Avail: {property.dateAvailable || 'Now'}
            </span>
          </div>
        </div>

        {/* Contact Action Buttons */}
        {!compact && (
          <div className="pt-2 mt-2 flex items-center gap-2">
            <button
              onClick={handleCall}
              className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Landlord</span>
            </button>

            {property.whatsapp && (
              <button
                onClick={handleWhatsApp}
                className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                {/* WhatsApp speech bubble icon */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.35.49 1.199.533 1.286.044.087.073.188.014.304-.058.115-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 0.742.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.433-.505.549-.679.116-.173.232-.144.39-.086.159.058 1.009.477 1.182.564.173.086.289.13.332.202.043.072.043.419-.101.824z" />
                </svg>
                <span>WhatsApp</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
