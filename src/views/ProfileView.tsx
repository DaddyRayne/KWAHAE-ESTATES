import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, UserCheck, Globe, MapPin, Smartphone, LogOut, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (view: string) => void;
  onOpenAndroidGuide: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate, onOpenAndroidGuide }) => {
  const { currentUser, role, isLoggedIn, isAdmin, isLandlord, logout, switchDemoRole } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'lozi'>('en');

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      {/* User Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl mx-auto shadow-inner">
          {currentUser?.fullName?.charAt(0) || 'U'}
        </div>

        <div>
          <h1 className="text-lg sm:text-xl font-black text-gray-900">
            {currentUser?.fullName || 'Visitor'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentUser?.phone || 'Browsing as Guest'} • {currentUser?.email || 'Senanga, Western Province'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          {isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>District Administrator</span>
            </>
          ) : isLandlord ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registered Landlord</span>
            </>
          ) : (
            <span>Visitor / House Seeker</span>
          )}
        </div>

        {/* Auth action */}
        <div className="pt-2">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition"
            >
              Sign In or Register Landlord Account
            </button>
          )}
        </div>
      </div>

      {/* Switch Demo Role (for easy testing without logout) */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Fast Role Switcher (Developer & Testing)
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => switchDemoRole('visitor')}
            className={`py-2 px-2 rounded-2xl text-xs font-bold border transition ${
              role === 'visitor'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            👤 Visitor
          </button>
          <button
            onClick={() => switchDemoRole('landlord')}
            className={`py-2 px-2 rounded-2xl text-xs font-bold border transition ${
              role === 'landlord'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🏡 Landlord
          </button>
          <button
            onClick={() => switchDemoRole('admin')}
            className={`py-2 px-2 rounded-2xl text-xs font-bold border transition ${
              role === 'admin'
                ? 'border-amber-600 bg-amber-50 text-amber-800'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      {/* Language Selection (English & Silozi) */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-400">
          <Globe className="w-4 h-4 text-emerald-700" />
          <span>Language / Puo ya Silozi</span>
        </div>
        <p className="text-xs text-gray-600">
          Kwahae Estates is designed for the people of Senanga, Western Province. Select your preferred display language:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
              selectedLanguage === 'en'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="block font-black text-sm">English</span>
            <span className="text-[10px] text-gray-500 font-normal">Official Release</span>
          </button>

          <button
            onClick={() => setSelectedLanguage('lozi')}
            className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
              selectedLanguage === 'lozi'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="block font-black text-sm">Silozi (Western Province)</span>
            <span className="text-[10px] text-gray-500 font-normal">Kwahae / Mandu a kulikana</span>
          </button>
        </div>
        {selectedLanguage === 'lozi' && (
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
            <strong>Silozi Preview:</strong> "Kwahae" kutalimusa "kwa ndu". Mualamu, mulekisi ni mubati wa ndu mwa Senanga District bakona kubatisisa mandu ka bunolo.
          </div>
        )}
      </div>

      {/* Play Store & Publishing Guide */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-5 text-white shadow-md flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
            Android Release
          </span>
          <h3 className="font-black text-base mt-1">Google Play Store & APK / AAB</h3>
          <p className="text-xs text-amber-100 mt-0.5">
            Step-by-step instructions to generate signed App Bundle (.aab) with zero cost.
          </p>
        </div>
        <button
          onClick={onOpenAndroidGuide}
          className="px-4 py-2.5 rounded-2xl bg-white text-amber-950 font-black text-xs hover:bg-amber-50 transition shadow-xs whitespace-nowrap active:scale-95"
        >
          View Guide
        </button>
      </div>

      {/* Useful Links */}
      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs divide-y divide-gray-100 text-xs font-semibold">
        <button
          onClick={() => onNavigate('help')}
          className="w-full py-3 px-2 text-left text-gray-700 hover:text-emerald-700 flex items-center justify-between"
        >
          <span>Tenancy Rights & Senanga Local Guide</span>
          <span className="text-gray-400">→</span>
        </button>
        <button
          onClick={() => onNavigate('privacy')}
          className="w-full py-3 px-2 text-left text-gray-700 hover:text-emerald-700 flex items-center justify-between"
        >
          <span>Google Play Store Privacy Policy</span>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );
};
