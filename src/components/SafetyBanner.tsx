import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-3.5 my-3 shadow-xs text-amber-900">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800">
              Senanga Tenant Safety Advisory
            </h4>
            <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
              <strong>Never send rent or deposits via Airtel Money, MTN Money, or Zamtel Kwacha before physically inspecting the property and meeting the landlord in person.</strong>
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-amber-700 hover:text-amber-900 p-1 flex-shrink-0"
          aria-label="Toggle safety guidance"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-amber-200 text-xs space-y-1.5 text-amber-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Always visit the property in daylight in Senanga.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Verify water supply (running borehole or council tap) and ZESCO meter.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Sign a formal Zambian Tenancy Agreement and obtain a signed physical receipt.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Report any suspicious listings using the "Report Listing" button immediately.</span>
          </div>
        </div>
      )}
    </div>
  );
};
