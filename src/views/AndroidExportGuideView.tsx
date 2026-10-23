import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle,
  Copy,
  Download,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AndroidExportGuideViewProps {
  onClose: () => void;
}

export const AndroidExportGuideView: React.FC<AndroidExportGuideViewProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Play Store Publication Guide</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Publish KWAHAE ESTATES to Google Play
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Complete step-by-step guide to generating a signed Android App Bundle (.aab) with zero developer tool costs using official Google tools.
          </p>
        </div>
      </div>

      {/* Package Specs Card */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-700" />
          <span>Android App Identification</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block font-medium">Application Name</span>
            <span className="font-extrabold text-gray-900 text-sm">KWAHAE ESTATES</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block font-medium">Android Package ID (Application ID)</span>
            <span className="font-mono font-bold text-emerald-800 text-sm">com.senangarentals.kwahae</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block font-medium">Target Operating System</span>
            <span className="font-bold text-gray-900">Android 7.0+ (API level 24 to 34+)</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block font-medium">Output Format for Google Play</span>
            <span className="font-bold text-emerald-700">Signed Android App Bundle (.aab)</span>
          </div>
        </div>
      </div>

      {/* Free Tooling & Cost Breakdown */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Cost & Free Service Plan Breakdown</span>
        </h2>
        <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>100% Free Development & Build Tools:</strong> We use Google's official <code>bubblewrap</code> CLI and Progressive Web Activity (TWA). It requires no paid licenses, no subscription SDKs, and builds straight from your web application.
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Google Play Console Account Fee:</strong> Google charges a one-time $25 USD registration fee to open a Google Play Developer account (this is paid directly to Google once, not monthly or per-app).
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Hosting & Database:</strong> The web runtime is hosted on Cloud Run / free tier hosting with automatic HTTPS and PWA caching.
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-700" />
          <span>Method: Build Signed .AAB using Google Bubblewrap CLI (Official)</span>
        </h2>

        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-gray-900">
              Install Node.js & Bubblewrap CLI on your computer
            </h3>
          </div>
          <p className="text-xs text-gray-600 pl-8">
            Run this command in your computer's terminal (or Mac/Linux/Windows terminal):
          </p>
          <div className="ml-8 bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
            <span>npm install -g @bubblewrap/cli</span>
            <button
              onClick={() => copyToClipboard('npm install -g @bubblewrap/cli', 1)}
              className="text-gray-400 hover:text-white p-1"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-sm text-gray-900">
              Initialize Android Project from Kwahae Estates Manifest
            </h3>
          </div>
          <p className="text-xs text-gray-600 pl-8">
            Point Bubblewrap directly to your live app manifest URL. It automatically downloads the app name, icon, and colors:
          </p>
          <div className="ml-8 bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between overflow-x-auto">
            <span>bubblewrap init --manifest https://ais-pre-eijp2onkmcsjxvwrac3jzs-965764470602.europe-west2.run.app/manifest.webmanifest</span>
            <button
              onClick={() =>
                copyToClipboard(
                  'bubblewrap init --manifest https://ais-pre-eijp2onkmcsjxvwrac3jzs-965764470602.europe-west2.run.app/manifest.webmanifest',
                  2
                )
              }
              className="text-gray-400 hover:text-white p-1 flex-shrink-0 ml-2"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-gray-500 pl-8">
            When asked for Application ID, confirm: <strong>com.senangarentals.kwahae</strong>
          </p>
        </div>

        {/* Step 3 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm text-gray-900">
              Build Signed Android App Bundle (.aab)
            </h3>
          </div>
          <p className="text-xs text-gray-600 pl-8">
            Run the build command. Bubblewrap will automatically generate your release keystore and compile <code>app-release-bundle.aab</code>:
          </p>
          <div className="ml-8 bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
            <span>bubblewrap build</span>
            <button
              onClick={() => copyToClipboard('bubblewrap build', 3)}
              className="text-gray-400 hover:text-white p-1"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="ml-8 p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs border border-emerald-200">
            ✅ The output file is named: <strong>app-release-signed.aab</strong> ready for Google Play Console.
          </div>
        </div>

        {/* Step 4 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-sm text-gray-900">
              Upload to Google Play Console
            </h3>
          </div>
          <ol className="list-decimal pl-12 space-y-1.5 text-xs text-gray-600">
            <li>Log in to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">play.google.com/console</a></li>
            <li>Click <strong>Create App</strong> → Title: <strong>Kwahae Estates - Senanga Rentals</strong>.</li>
            <li>Select <strong>Free</strong> app.</li>
            <li>Under <strong>Production</strong> → <strong>Releases</strong>, drag and drop your <code>app-release-signed.aab</code> file.</li>
            <li>Add the Privacy Policy URL from this app: <code>https://[your-app-url]/#privacy</code>.</li>
            <li>Submit for review. Google Play usually approves in 24 to 48 hours!</li>
          </ol>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
        >
          Close Publishing Guide
        </button>
      </div>
    </div>
  );
};
