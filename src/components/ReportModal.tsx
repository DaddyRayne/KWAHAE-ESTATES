import React, { useState } from 'react';
import { Property } from '../types';
import { createReport } from '../services/db';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ property, isOpen, onClose }) => {
  const [reason, setReason] = useState<'fraud_scam' | 'incorrect_price' | 'already_rented' | 'fake_photos' | 'wrong_location' | 'other'>('fraud_scam');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReport({
      propertyId: property.id,
      propertyTitle: property.title,
      reporterName: reporterName || 'Anonymous User',
      reporterContact: reporterContact || 'Not provided',
      reason,
      details
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h3 className="font-extrabold text-gray-900 text-base">Report Property Listing</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-gray-900 text-base">Report Submitted</h4>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Thank you for keeping Senanga safe. Our administrator has received this alert and will review the listing immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-gray-500">Reporting listing:</p>
              <p className="text-sm font-bold text-gray-900 line-clamp-1">{property.title}</p>
              <p className="text-[11px] text-gray-500">Landlord: {property.landlordName}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Reason for Report *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-rose-500 focus:outline-none"
              >
                <option value="fraud_scam">Suspected Fraud or Scam (Demanding upfront deposit)</option>
                <option value="incorrect_price">Incorrect Rental Price</option>
                <option value="already_rented">Property is Already Rented / Unavailable</option>
                <option value="fake_photos">Misleading or Fake Photographs</option>
                <option value="wrong_location">Wrong Location within Senanga</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Explain Details *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe what is incorrect or suspicious about this listing..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+260..."
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
