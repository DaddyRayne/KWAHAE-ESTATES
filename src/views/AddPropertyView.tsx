import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { useAuth } from '../context/AuthContext';
import { createProperty, compressImage } from '../services/db';
import { PROPERTY_TYPES, SENANGA_LOCATIONS, AMENITIES_LIST } from '../services/sampleData';
import {
  Upload,
  X,
  Camera,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';

interface AddPropertyViewProps {
  onSuccess: (newProperty: Property) => void;
  onNavigate: (view: string) => void;
}

export const AddPropertyView: React.FC<AddPropertyViewProps> = ({ onSuccess, onNavigate }) => {
  const { currentUser, role, isLandlord, isAdmin, loginAs } = useAuth();

  // Form State
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('house');
  const [monthlyRentZmw, setMonthlyRentZmw] = useState<number | ''>('');
  const [location, setLocation] = useState(SENANGA_LOCATIONS[0]);
  const [addressOrLandmark, setAddressOrLandmark] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'ZESCO Prepaid Electricity',
    'Running Borehole Water',
    'Self-Contained Bathroom'
  ]);
  const [photographs, setPhotographs] = useState<string[]>([]);
  const [phone, setPhone] = useState(currentUser?.phone || '+260');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '+260');
  const [landlordName, setLandlordName] = useState(currentUser?.fullName || '');
  const [dateAvailable, setDateAvailable] = useState('Immediately');

  // Preview & Processing state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProperty, setSubmittedProperty] = useState<Property | null>(null);

  // Quick prompt if visitor
  if (role === 'visitor') {
    return (
      <div className="max-w-md mx-auto my-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Landlord Sign-In Required</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          To advertise a house, shop, or room in Senanga, please sign in or register as a landlord so you can edit and manage your listings.
        </p>
        <div className="space-y-2 pt-2">
          <button
            onClick={() => onNavigate('auth')}
            className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
          >
            Sign In / Register as Landlord
          </button>
          <button
            onClick={() => loginAs('landlord')}
            className="w-full py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition"
          >
            Quick Test: Continue as Landlord (Demo)
          </button>
        </div>
      </div>
    );
  }

  // Handle Image Upload & Compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photographs.length + files.length > 10) {
      alert('You can upload a maximum of 10 photographs per property.');
      return;
    }

    setIsCompressing(true);
    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        compressedList.push(compressed);
      }
      setPhotographs((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('Failed to process image. Please try another photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotographs((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Add default sample photos helper if landlord doesn't have camera right now
  const addSamplePhotos = () => {
    setPhotographs([
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !monthlyRentZmw || !location || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newProp = createProperty(
        {
          title,
          propertyType,
          monthlyRentZmw: Number(monthlyRentZmw),
          location,
          addressOrLandmark,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          description,
          amenities: selectedAmenities,
          photographs: photographs.length > 0 ? photographs : [
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80'
          ],
          landlordId: currentUser?.id || 'landlord-mubita-01',
          landlordName: landlordName || currentUser?.fullName || 'Landlord',
          phone,
          whatsapp,
          dateAvailable,
        },
        isAdmin // If admin is posting, automatically approve for instant live
      );

      setSubmittedProperty(newProp);
    } catch (err) {
      console.error(err);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view
  if (submittedProperty) {
    return (
      <div className="max-w-lg mx-auto my-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          Advertisement Submitted!
        </h2>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-800">
            <Info className="w-4 h-4" />
            Administrator Review in Progress
          </p>
          <p>
            Your advertisement for <strong>"{submittedProperty.title}"</strong> has been saved with status: <strong>Pending Approval</strong>.
          </p>
          <p>
            Our administrator reviews every listing to protect people in Senanga against fraud before it appears publicly on the search page. You can track this in "My Advertisements".
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onNavigate('my_listings')}
            className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
          >
            Go to My Advertisements
          </button>
          <button
            onClick={() => {
              setSubmittedProperty(null);
              setTitle('');
              setMonthlyRentZmw('');
              setDescription('');
              setPhotographs([]);
            }}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition"
          >
            Post Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 sm:p-6 rounded-3xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          Post Property Advertisement
        </h1>
        <p className="text-xs text-emerald-100/90 mt-1">
          Advertise rental houses, bedsitters, shops, or offices in Senanga District.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7 rounded-3xl border border-gray-100 shadow-xs space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Property Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Spacious 3-Bedroom Standalone House in Senanga Central"
            className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Property Type & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Property Type *
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none bg-white font-medium"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Monthly Rent (ZMW) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-800">
                ZMW
              </span>
              <input
                type="number"
                required
                min="100"
                max="50000"
                value={monthlyRentZmw}
                onChange={(e) => setMonthlyRentZmw(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 1500"
                className="w-full pl-14 pr-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Landmark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Location within Senanga *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none bg-white font-medium"
            >
              {SENANGA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Address or Local Landmark
            </label>
            <input
              type="text"
              value={addressOrLandmark}
              onChange={(e) => setAddressOrLandmark(e.target.value)}
              placeholder="e.g. Opposite District Hospital, near Sioma Rd"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Bedrooms, Bathrooms & Date Available */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              max="15"
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-2xl border border-gray-200 text-xs font-bold text-center focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Bathrooms
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-2xl border border-gray-200 text-xs font-bold text-center focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Available From
            </label>
            <input
              type="text"
              value={dateAvailable}
              onChange={(e) => setDateAvailable(e.target.value)}
              placeholder="Immediately"
              className="w-full px-3 py-2 rounded-2xl border border-gray-200 text-xs font-medium text-center focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Property Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the rooms, compound, security, electricity, water reliability, road access, and terms..."
            className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Amenities Multi-Select */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Available Amenities & Utilities
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AMENITIES_LIST.map((amenity) => {
              const isChecked = selectedAmenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition ${
                    isChecked
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{amenity}</span>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photographs Upload (up to 10) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Photographs ({photographs.length}/10)
            </label>
            {photographs.length === 0 && (
              <button
                type="button"
                onClick={addSamplePhotos}
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                + Add sample photos
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {photographs.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                <img src={photo} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {photographs.length < 10 && (
              <label className="relative aspect-square rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer p-3 text-center transition">
                <Camera className="w-6 h-6 text-emerald-700 mb-1" />
                <span className="text-[11px] font-bold text-emerald-800">
                  {isCompressing ? 'Compressing...' : 'Add Photo'}
                </span>
                <span className="text-[9px] text-gray-500">Auto-compressed</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={isCompressing}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-[11px] text-gray-500">
            💡 Photos are compressed in your browser to minimize mobile data usage on Zambian mobile networks.
          </p>
        </div>

        {/* Landlord Contact Info */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Landlord Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="e.g. Mr. Mubita Silishebo"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Phone Number (Calls) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+260 97 1234567"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+260 97 1234567"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: Preview & Submit */}
        <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-emerald-600 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Ad</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            className="flex-1 py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Submitting...' : 'Submit Advertisement for Approval'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Advertisement Preview
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Card Preview */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <div className="aspect-[16/10] bg-gray-100 relative">
                <img
                  src={photographs[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=75'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  Pending Approval
                </span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] capitalize">
                  {propertyType}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-lg font-extrabold text-emerald-800">
                  ZMW {monthlyRentZmw ? Number(monthlyRentZmw).toLocaleString() : '---'}
                  <span className="text-xs font-normal text-gray-500"> / month</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{title || 'Untitled Property'}</h4>
                <p className="text-xs text-gray-600">{location} • {addressOrLandmark || 'Senanga'}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{description || 'No description provided yet.'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsPreviewOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold"
            >
              Close Preview & Continue Editing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
