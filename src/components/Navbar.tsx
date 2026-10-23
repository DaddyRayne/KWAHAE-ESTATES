import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import { ShieldCheck, User as UserIcon, PlusCircle, Smartphone, Info } from 'lucide-react';
import kwahaeLogo from '../assets/images/regenerated_image_1792769779503.png';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAndroidGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAndroidGuide }) => {
  const { currentUser, role, switchDemoRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      {/* Top utility row on mobile & desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-0.5 border border-emerald-400/30 shadow-xs flex items-center justify-center overflow-hidden">
            <img src={kwahaeLogo} alt="Kwahae Estates" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-white leading-none">
                KWAHAE ESTATES
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-700 text-emerald-200 uppercase tracking-wider">
                Senanga
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              Property Rentals • Western Province
            </p>
          </div>
        </div>

        {/* Action icons & Role Switcher */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton compact />

          {/* Android Play Store Package Guide trigger */}
          <button
            onClick={onOpenAndroidGuide}
            title="Google Play Store / Android AAB package guide"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 text-xs font-semibold border border-emerald-700 transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Play Store Guide</span>
          </button>

          {/* Quick Role Switcher for seamless testing */}
          <div className="relative flex items-center bg-emerald-950/60 p-1 rounded-full border border-emerald-800/60 text-xs">
            <span className="hidden md:inline-block px-2 text-[10px] text-emerald-300 uppercase font-bold">
              Role:
            </span>
            <select
              value={role}
              onChange={(e) => switchDemoRole(e.target.value as any)}
              className="bg-transparent text-emerald-100 text-xs font-semibold py-1 px-2 rounded-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="visitor" className="text-gray-900 bg-white">
                👤 Visitor
              </option>
              <option value="landlord" className="text-gray-900 bg-white">
                🏡 Landlord
              </option>
              <option value="admin" className="text-gray-900 bg-white">
                🛡️ Admin
              </option>
            </select>
          </div>

          {/* Add Property Button for Landlords or Visitors */}
          <button
            onClick={() => onNavigate('add_property')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-extrabold shadow transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Free Ad</span>
          </button>

          {/* Admin link if admin */}
          {role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`p-1.5 rounded-full ${
                currentView === 'admin' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-800 text-amber-400 hover:bg-emerald-700'
              } transition`}
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          {/* Profile / Account button */}
          <button
            onClick={() => onNavigate('profile')}
            className={`p-1.5 rounded-full ${
              currentView === 'profile' ? 'bg-white text-emerald-900' : 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'
            } transition`}
            title="User Profile & Settings"
          >
            <UserIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex border-t border-emerald-800/80 bg-emerald-950/40 px-6 py-2">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-semibold text-emerald-100">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-white transition ${
                currentView === 'home' ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className={`hover:text-white transition ${
                currentView === 'browse' ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5' : ''
              }`}
            >
              Browse All Rentals
            </button>
            <button
              onClick={() => onNavigate('add_property')}
              className={`hover:text-white transition ${
                currentView === 'add_property' ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5' : ''
              }`}
            >
              Post Advertisement
            </button>
            {role === 'landlord' && (
              <button
                onClick={() => onNavigate('my_listings')}
                className={`hover:text-white transition ${
                  currentView === 'my_listings' ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5' : ''
                }`}
              >
                My Advertisements
              </button>
            )}
            <button
              onClick={() => onNavigate('favourites')}
              className={`hover:text-white transition ${
                currentView === 'favourites' ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5' : ''
              }`}
            >
              Saved / Favourites
            </button>
            {role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hover:text-white transition flex items-center gap-1 ${
                  currentView === 'admin' ? 'text-amber-300 font-bold border-b-2 border-amber-300 pb-0.5' : 'text-amber-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-emerald-300">
            <button onClick={() => onNavigate('help')} className="hover:text-white transition flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Help & Tenancy Guide</span>
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">
              Privacy Policy
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
