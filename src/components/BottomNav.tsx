import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Search, PlusCircle, Heart, User, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { role } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-2 py-1.5 flex items-center justify-around select-none">
      {/* Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${
          currentView === 'home' ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Browse */}
      <button
        onClick={() => onNavigate('browse')}
        className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${
          currentView === 'browse' ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Search className={`w-5 h-5 ${currentView === 'browse' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Browse</span>
      </button>

      {/* Post Ad (Prominent center button) */}
      <button
        onClick={() => onNavigate('add_property')}
        className="flex flex-col items-center justify-center py-1 px-2 min-w-[56px] text-amber-600 transition-colors -mt-3"
      >
        <div className="w-11 h-11 rounded-full bg-emerald-700 text-white shadow-lg flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition-all border-2 border-white">
          <PlusCircle className="w-6 h-6 stroke-[2.2]" />
        </div>
        <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Post Ad</span>
      </button>

      {/* Favourites */}
      <button
        onClick={() => onNavigate('favourites')}
        className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${
          currentView === 'favourites' ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Heart className={`w-5 h-5 ${currentView === 'favourites' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Saved</span>
      </button>

      {/* Role specific: Admin Dashboard if admin, My Ads if landlord, or Profile */}
      {role === 'admin' ? (
        <button
          onClick={() => onNavigate('admin')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${
            currentView === 'admin' ? 'text-amber-600 font-bold' : 'text-amber-700'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Admin</span>
        </button>
      ) : role === 'landlord' ? (
        <button
          onClick={() => onNavigate('my_listings')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${
            currentView === 'my_listings' ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className={`w-5 h-5 ${currentView === 'my_listings' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">My Ads</span>
        </button>
      ) : (
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${
            currentView === 'profile' ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className={`w-5 h-5 ${currentView === 'profile' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Account</span>
        </button>
      )}
    </nav>
  );
};
