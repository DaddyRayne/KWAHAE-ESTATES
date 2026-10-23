import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, Smartphone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import kwahaeLogo from '../assets/images/regenerated_image_1792769779503.png';

interface AuthViewProps {
  onSuccess: () => void;
  onNavigate: (view: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onNavigate }) => {
  const { loginAs, registerLandlord } = useAuth();
  const [tab, setTab] = useState<'signin' | 'register' | 'admin'>('signin');

  // Landlord Sign in / Register state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+260 97 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Admin state
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleLandlordRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please enter your name and phone number');
      return;
    }
    registerLandlord(name, phone, email);
    onSuccess();
  };

  const handleLandlordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('landlord', {
      fullName: name || 'Mr. Mubita Silishebo',
      phone: phone || '+260977451290',
      email: email || 'mubita.silishebo@gmail.com'
    });
    onSuccess();
  };

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure PIN for demo
    if (adminPasscode === 'kwahae2026' || adminPasscode === 'admin' || adminPasscode === '1234') {
      loginAs('admin');
      onSuccess();
    } else {
      setAdminError('Invalid administrator credentials. (Hint: kwahae2026)');
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-800 text-white p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-2 border border-white/20 overflow-hidden">
          <img src={kwahaeLogo} alt="Kwahae Logo" className="w-full h-full object-cover rounded-lg" />
        </div>
        <h1 className="text-xl font-black tracking-tight">KWAHAE ESTATES</h1>
        <p className="text-xs text-emerald-200 mt-0.5">Senanga Rentals • Western Province</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 text-xs font-bold">
        <button
          onClick={() => { setTab('signin'); setAdminError(''); }}
          className={`flex-1 py-3.5 text-center transition ${
            tab === 'signin'
              ? 'text-emerald-700 border-b-2 border-emerald-700 bg-emerald-50/50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setTab('register'); setAdminError(''); }}
          className={`flex-1 py-3.5 text-center transition ${
            tab === 'register'
              ? 'text-emerald-700 border-b-2 border-emerald-700 bg-emerald-50/50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Register (Landlord)
        </button>
        <button
          onClick={() => { setTab('admin'); setAdminError(''); }}
          className={`flex-1 py-3.5 text-center transition ${
            tab === 'admin'
              ? 'text-amber-700 border-b-2 border-amber-600 bg-amber-50/50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Admin Portal
        </button>
      </div>

      <div className="p-6">
        {tab === 'signin' && (
          <form onSubmit={handleLandlordSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                placeholder="+260 97 ... or email"
                defaultValue="+260 97 7451290"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                defaultValue="password123"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95"
            >
              Sign In as Landlord
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  loginAs('visitor');
                  onSuccess();
                }}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Or Continue as Visitor (Browse without account)
              </button>
            </div>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleLandlordRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Namakau Sitwala"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number (Calls & SMS) *
              </label>
              <input
                type="tel"
                required
                placeholder="+260 97 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="landlord@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Create Password *
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <p className="text-[11px] text-gray-500 leading-tight">
              By creating an account, you agree to only list real properties in Senanga and provide honest pricing.
            </p>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95"
            >
              Create Free Landlord Account
            </button>
          </form>
        )}

        {tab === 'admin' && (
          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <span className="font-bold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Authorised Administrator Access Only
              </span>
              <span>
                Enter the administration passkey to review pending advertisements and handle scam reports. (Default demo passkey: <strong>kwahae2026</strong>)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Admin Passkey / Password *
              </label>
              <input
                type="password"
                required
                placeholder="Enter passkey"
                value={adminPasscode}
                onChange={(e) => {
                  setAdminPasscode(e.target.value);
                  setAdminError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-amber-600 focus:outline-none"
              />
              {adminError && (
                <p className="text-xs text-rose-600 mt-1 font-semibold">{adminError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition active:scale-95"
            >
              Unlock Administrator Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
