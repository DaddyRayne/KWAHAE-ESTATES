import React from 'react';
import { SafetyBanner } from '../components/SafetyBanner';
import { HelpCircle, Phone, ShieldCheck, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Guidance & Support
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          Senanga Tenancy Guide & Help
        </h1>
        <p className="text-xs text-emerald-100/90 mt-1">
          Practical advice for house seekers, business owners, and landlords in Senanga District, Western Province.
        </p>
      </div>

      <SafetyBanner />

      {/* Tenancy Advice for Tenants in Senanga */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Rules for Tenants Searching for Properties</span>
        </h2>

        <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h3 className="font-bold text-gray-900">1. Physical Daytime Inspection</h3>
            <p>
              Always arrange an in-person physical viewing during daylight hours. Inspect the roof for leaks, check the borehole or council water pressure, and inspect window burglar bars and door locks.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h3 className="font-bold text-gray-900">2. Verify ZESCO Electricity Meter</h3>
            <p>
              Confirm whether the property has an independent prepaid ZESCO meter or if you will be sharing a sub-meter with neighboring tenants. Inquire about outstanding debt on the meter before signing.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h3 className="font-bold text-gray-900">3. Written Tenancy Agreement & Receipts</h3>
            <p>
              Never pay rent without a signed written Tenancy Agreement stating the monthly rent, security deposit terms, notice period (standard 1 month), and a signed physical paper receipt for every Kwacha paid.
            </p>
          </div>
        </div>
      </div>

      {/* Landlord Guidelines */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Tips for Landlords in Senanga</span>
        </h2>

        <div className="space-y-2.5 text-xs text-gray-700">
          <p className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
            <span><strong>Clear photographs:</strong> Take photos in daylight showing the outside gate, compound, living room, bedrooms, kitchen, and bathroom.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
            <span><strong>Prompt status updates:</strong> When a tenant pays and takes occupancy, please use the "Mark as Rented" button in your "My Advertisements" screen to avoid wasted phone calls.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
            <span><strong>Fair Pricing:</strong> State your genuine monthly rent in Zambian Kwacha (ZMW) without hidden agent surcharges.</span>
          </p>
        </div>
      </div>

      {/* Senanga Local Contacts */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>Senanga District Public Services</span>
        </h2>

        <div className="divide-y divide-gray-100 text-xs">
          <div className="py-2.5 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Senanga Town Council (Boma)</span>
            <span className="text-gray-500">Council Offices, Senanga</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Senanga Police Station (Emergency/Reports)</span>
            <span className="text-emerald-700 font-bold">Dial 991 / Local Desk</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Senanga District Hospital</span>
            <span className="text-gray-500">Off Sioma Road</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Kwahae Estates Support & Verification</span>
            <span className="text-emerald-800 font-bold">+260 97 7000111</span>
          </div>
        </div>
      </div>
    </div>
  );
};
