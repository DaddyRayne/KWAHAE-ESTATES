import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-800">
          <Shield className="w-6 h-6" />
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          Effective Date: October 2026 • Application: KWAHAE ESTATES (com.senangarentals.kwahae)
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            1. Overview
          </h2>
          <p>
            Kwahae Estates ("we", "our", or "the app") provides a digital platform to connect property owners/landlords with property seekers in Senanga District, Western Province, Zambia. We are committed to transparency and respect for user privacy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Visitors:</strong> We do NOT collect personal identification, payment card details, or require account creation for browsing or searching properties.
            </li>
            <li>
              <strong>Landlords / Advertisers:</strong> When creating an advertisement, we collect your name, contact telephone number, optional WhatsApp number, property description, and photographs you voluntarily upload.
            </li>
            <li>
              <strong>User Reports:</strong> When submitting a report regarding fraudulent listings, we collect your explanation and optional contact details for investigation.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            3. How We Use Information
          </h2>
          <p>
            Your property details and telephone numbers are displayed publicly on your approved advertisement so interested tenants in Senanga can call or message you directly. We do not sell, rent, or trade your personal data to third parties or advertising brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            4. Service Plan & Cost Disclosure
          </h2>
          <p>
            The initial version of Kwahae Estates is completely free for tenants and landlords to browse and post listings.
          </p>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 mt-2">
            <p className="font-bold">Honest Operational Cost & Limits Notice:</p>
            <p>
              • Kwahae Estates uses standard cloud hosting and storage infrastructure that currently operate on generous free-tier plans suitable for early-stage community apps.
            </p>
            <p>
              • If the application grows significantly in the future, database storage or SMS notification services may eventually incur small operational charges. However, standard browsing remains 100% free.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            5. Contact Us
          </h2>
          <p>
            For privacy inquiries, listing removals, or account deletion requests, please contact our district administrative desk:
            <br />
            <strong>Email:</strong> privacy@kwahae.zm
            <br />
            <strong>District Office:</strong> Senanga, Western Province, Zambia
          </p>
        </section>
      </div>
    </div>
  );
};
