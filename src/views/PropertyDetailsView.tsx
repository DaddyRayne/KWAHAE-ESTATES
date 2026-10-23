import React, { useState } from 'react';
import { Property } from '../types';
import { SafetyBanner } from '../components/SafetyBanner';
import { ReportModal } from '../components/ReportModal';
import { isFavourite, toggleFavourite } from '../services/db';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Calendar,
  Phone,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface PropertyDetailsViewProps {
  property: Property;
  onBack: () => void;
  onSelectProperty?: (property: Property) => void;
}

export const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({
  property,
  onBack,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [fav, setFav] = useState(() => isFavourite(property.id));
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const photos = property.photographs && property.photographs.length > 0
    ? property.photographs
    : ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'];

  const handleFav = () => {
    const updated = toggleFavourite(property.id);
    setFav(updated);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${property.title} - Kwahae Estates Senanga`,
      text: `Rental in Senanga (${property.location}) for ZMW ${property.monthlyRentZmw.toLocaleString()}/month.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${property.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    if (!property.whatsapp) return;
    let cleanNumber = property.whatsapp.replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '260' + cleanNumber.substring(1);
    } else if (!cleanNumber.startsWith('260') && cleanNumber.length === 9) {
      cleanNumber = '260' + cleanNumber;
    }
    const message = encodeURIComponent(
      `Hello ${property.landlordName}, I saw your rental advertisement for "${property.title}" in Senanga on the Kwahae Estates app. Is it still available for viewing?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const isRented = property.status === 'rented';

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Back to List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-emerald-700 transition shadow-xs relative"
            title="Share property"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink && (
              <span className="absolute -bottom-7 right-0 text-[10px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
          <button
            onClick={handleFav}
            className="p-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-rose-600 transition shadow-xs"
            title={fav ? 'Saved' : 'Save'}
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Photo Carousel & Gallery */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-md">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center">
          <img
            src={photos[activePhotoIndex]}
            alt={`${property.title} photo ${activePhotoIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Previous / Next buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Status Badges on Photo */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isRented ? (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
                Rented Out
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                Available Now
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white">
              {property.propertyType.replace('_', ' ')}
            </span>
          </div>

          {/* Photo Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-xs text-white text-xs font-medium px-3 py-1 rounded-full">
            {activePhotoIndex + 1} / {photos.length} Photos
          </div>
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="p-3 bg-gray-950 flex gap-2 overflow-x-auto no-scrollbar">
            {photos.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                  idx === activePhotoIndex ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Property Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Title & Price Header Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
                ZMW {property.monthlyRentZmw.toLocaleString()}
                <span className="text-xs sm:text-sm font-normal text-gray-500"> / month</span>
              </div>
              <div className="text-xs text-gray-500 bg-emerald-50 px-3 py-1 rounded-full font-semibold text-emerald-800 border border-emerald-100">
                Kwacha Pricing
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
              {property.title}
            </h1>

            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-800">{property.location}</p>
                {property.addressOrLandmark && (
                  <p className="text-xs text-gray-500 mt-0.5">{property.addressOrLandmark}</p>
                )}
              </div>
            </div>

            {/* Quick Specs Pill Row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
              <div className="p-2.5 rounded-2xl bg-gray-50">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Bedrooms</span>
                <span className="text-sm font-black text-gray-900 flex items-center justify-center gap-1 mt-0.5">
                  <Bed className="w-4 h-4 text-emerald-700" />
                  {property.bedrooms > 0 ? property.bedrooms : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-gray-50">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Bathrooms</span>
                <span className="text-sm font-black text-gray-900 flex items-center justify-center gap-1 mt-0.5">
                  <Bath className="w-4 h-4 text-emerald-700" />
                  {property.bathrooms > 0 ? property.bathrooms : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-gray-50">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Available</span>
                <span className="text-xs font-black text-gray-900 flex items-center justify-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  {property.dateAvailable || 'Immediately'}
                </span>
              </div>
            </div>
          </div>

          {/* Safety Advisory Banner */}
          <SafetyBanner />

          {/* Description */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Property Description
            </h2>
            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {/* Amenities & Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Amenities & Utilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/60 text-xs font-semibold text-emerald-900"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Button */}
          <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Listing ID: {property.id}</span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold p-1 rounded transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report this Advertisement</span>
            </button>
          </div>
        </div>

        {/* Right Column: Landlord Card & Contact Actions */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md space-y-4 sticky top-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg shadow-inner">
                {property.landlordName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Landlord / Advertiser
                </span>
                <h3 className="font-extrabold text-gray-900 text-sm">
                  {property.landlordName}
                </h3>
                <span className="text-[11px] text-gray-500">Senanga, Western Province</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 text-xs space-y-1">
              <div className="flex items-center justify-between text-gray-600">
                <span>Direct Phone:</span>
                <span className="font-bold text-gray-900">{property.phone}</span>
              </div>
              {property.whatsapp && (
                <div className="flex items-center justify-between text-gray-600">
                  <span>WhatsApp:</span>
                  <span className="font-bold text-emerald-700">{property.whatsapp}</span>
                </div>
              )}
            </div>

            {/* Big Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCall}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Landlord Now</span>
              </button>

              {property.whatsapp && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.35.49 1.199.533 1.286.044.087.073.188.014.304-.058.115-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 0.742.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.102-.115.433-.505.549-.679.116-.173.232-.144.39-.086.159.058 1.009.477 1.182.564.173.086.289.13.332.202.043.072.043.419-.101.824z" />
                  </svg>
                  <span>WhatsApp Message</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-400 text-center leading-tight pt-1">
              No middleman or agency fee required to contact landlords on Kwahae Estates.
            </p>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        property={property}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
