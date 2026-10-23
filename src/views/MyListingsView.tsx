import React, { useState } from 'react';
import { Property, PropertyStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { getLandlordProperties, deleteProperty, markPropertyStatus, updateProperty } from '../services/db';
import {
  Building2,
  PlusCircle,
  Trash2,
  CheckCircle,
  Eye,
  AlertCircle,
  Clock,
  XCircle,
  Check,
  Edit3,
  X
} from 'lucide-react';

interface MyListingsViewProps {
  onSelectProperty: (property: Property) => void;
  onNavigate: (view: string) => void;
}

export const MyListingsView: React.FC<MyListingsViewProps> = ({
  onSelectProperty,
  onNavigate
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [properties, setProperties] = useState<Property[]>(() =>
    getLandlordProperties(currentUser?.id || 'landlord-mubita-01')
  );
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const refresh = () => {
    setProperties(getLandlordProperties(currentUser?.id || 'landlord-mubita-01'));
  };

  const handleToggleStatus = (property: Property) => {
    const nextStatus: PropertyStatus = property.status === 'rented' ? 'available' : 'rented';
    markPropertyStatus(property.id, nextStatus);
    refresh();
  };

  const handleDelete = (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement? This action cannot be undone.')) {
      deleteProperty(propertyId, currentUser?.id || '', isAdmin);
      refresh();
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    updateProperty(editingProperty.id, editingProperty, currentUser?.id || '', isAdmin);
    setEditingProperty(null);
    refresh();
  };

  const statusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Approved & Available
          </span>
        );
      case 'rented':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <Check className="w-3.5 h-3.5 text-rose-600" />
            Marked as Rented
          </span>
        );
      case 'pending_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Administrator Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            <XCircle className="w-3.5 h-3.5 text-gray-500" />
            Changes Requested / Rejected
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Landlord Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            My Property Advertisements
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your rental listings, mark units as rented, or submit new spaces.
          </p>
        </div>

        <button
          onClick={() => onNavigate('add_property')}
          className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Advertisement</span>
        </button>
      </div>

      {/* Listings List */}
      {properties.length > 0 ? (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-4 items-start"
            >
              {/* Photo */}
              <div
                onClick={() => onSelectProperty(property)}
                className="relative w-full sm:w-44 aspect-[16/10] sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer group"
              >
                <img
                  src={property.photographs[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=75'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              </div>

              {/* Details & Actions */}
              <div className="flex-1 w-full flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    {statusBadge(property.status)}
                    <span className="text-xs text-gray-400">
                      Views: <strong>{property.viewsCount || 0}</strong>
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProperty(property)}
                    className="font-bold text-sm sm:text-base text-gray-900 hover:text-emerald-700 cursor-pointer line-clamp-1"
                  >
                    {property.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {property.location} • {property.addressOrLandmark}
                  </p>

                  <div className="text-emerald-800 font-black text-sm mt-1">
                    ZMW {property.monthlyRentZmw.toLocaleString()} / month
                  </div>

                  {property.adminNotes && (
                    <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong>Admin note:</strong> {property.adminNotes}
                    </div>
                  )}
                </div>

                {/* Landlord Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="py-1.5 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    View Listing
                  </button>

                  <button
                    onClick={() => setEditingProperty({ ...property })}
                    className="py-1.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(property)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition ${
                      property.status === 'rented'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {property.status === 'rented' ? 'Mark as Available' : 'Mark as Rented'}
                  </button>

                  <button
                    onClick={() => handleDelete(property.id)}
                    className="py-1.5 px-2.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition ml-auto flex items-center gap-1"
                    title="Delete listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-gray-900">
            You don't have any advertisements yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Start advertising your houses, shops, or rooms in Senanga for free today.
          </p>
          <button
            onClick={() => onNavigate('add_property')}
            className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
          >
            Post Your First Free Ad
          </button>
        </div>
      )}

      {/* Quick Edit Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Edit Advertisement</h3>
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Property Title
              </label>
              <input
                type="text"
                required
                value={editingProperty.title}
                onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Monthly Rent (ZMW)
                </label>
                <input
                  type="number"
                  required
                  value={editingProperty.monthlyRentZmw}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      monthlyRentZmw: Number(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Available Date
                </label>
                <input
                  type="text"
                  value={editingProperty.dateAvailable}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, dateAvailable: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={editingProperty.description}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
