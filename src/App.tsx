/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FilterOptions, Property } from './types';
import { getProperties, getPropertyById } from './services/db';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FilterModal } from './components/FilterModal';
import { HomeView } from './views/HomeView';
import { BrowseView } from './views/BrowseView';
import { PropertyDetailsView } from './views/PropertyDetailsView';
import { AddPropertyView } from './views/AddPropertyView';
import { MyListingsView } from './views/MyListingsView';
import { FavouritesView } from './views/FavouritesView';
import { AuthView } from './views/AuthView';
import { ProfileView } from './views/ProfileView';
import { HelpView } from './views/HelpView';
import { PrivacyView } from './views/PrivacyView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AndroidExportGuideView } from './views/AndroidExportGuideView';
import { WifiOff } from 'lucide-react';
import kwahaeLogo from './assets/images/regenerated_image_1792769779503.png';

function MainApp() {
  const { role, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status for low-connectivity zones in Senanga
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProperty]);

  // Query properties based on current filters and role
  const properties = getProperties(filters, isAdmin);

  const handleSelectProperty = (property: Property) => {
    // Refresh latest data for selected property
    const fresh = getPropertyById(property.id) || property;
    setSelectedProperty(fresh);
    setCurrentView('details');
  };

  const handleNavigate = (view: string, filterParams?: FilterOptions) => {
    if (filterParams) {
      setFilters((prev) => ({ ...prev, ...filterParams }));
    }
    if (view !== 'details') {
      setSelectedProperty(null);
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 flex flex-col font-sans antialiased">
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Displaying cached Senanga listings.</span>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAndroidGuide={() => handleNavigate('android_guide')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-6">
        {currentView === 'home' && (
          <HomeView
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
            onOpenFilter={() => setIsFilterModalOpen(true)}
          />
        )}

        {currentView === 'browse' && (
          <BrowseView
            properties={properties}
            filters={filters}
            onFilterChange={setFilters}
            onSelectProperty={handleSelectProperty}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
          />
        )}

        {currentView === 'details' && selectedProperty && (
          <PropertyDetailsView
            property={selectedProperty}
            onBack={() => handleNavigate('browse')}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {currentView === 'add_property' && (
          <AddPropertyView
            onSuccess={(newProp) => {
              setSelectedProperty(newProp);
              handleNavigate('my_listings');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'my_listings' && (
          <MyListingsView
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'favourites' && (
          <FavouritesView
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'auth' && (
          <AuthView
            onSuccess={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            onNavigate={handleNavigate}
            onOpenAndroidGuide={() => handleNavigate('android_guide')}
          />
        )}

        {currentView === 'help' && <HelpView />}

        {currentView === 'privacy' && <PrivacyView />}

        {currentView === 'admin' && (
          <AdminDashboardView
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'android_guide' && (
          <AndroidExportGuideView onClose={() => handleNavigate('home')} />
        )}
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          if (currentView !== 'browse') setCurrentView('browse');
        }}
        onReset={() => setFilters({})}
      />

      {/* Android Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Footer (Desktop & Tablet) */}
      <footer className="hidden md:block bg-white border-t border-gray-200 py-6 mt-auto text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={kwahaeLogo} alt="Logo" className="w-5 h-5 rounded object-cover" />
            <span className="font-extrabold text-gray-800">KWAHAE ESTATES</span>
            <span>• Senanga District Property Rentals, Western Province, Zambia</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-800 font-semibold">
            <button onClick={() => handleNavigate('home')} className="hover:underline">Home</button>
            <button onClick={() => handleNavigate('browse')} className="hover:underline">Browse</button>
            <button onClick={() => handleNavigate('help')} className="hover:underline">Tenancy Guide</button>
            <button onClick={() => handleNavigate('privacy')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => handleNavigate('android_guide')} className="hover:underline text-amber-700">Play Store (.AAB)</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
