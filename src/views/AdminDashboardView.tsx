import React, { useState } from 'react';
import { Property, PropertyReport, User } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  getProperties,
  getReports,
  getUsers,
  markPropertyStatus,
  deleteProperty,
  updateReportStatus,
  toggleUserSuspension,
  resetDatabaseToDefaults
} from '../services/db';
import {
  ShieldCheck,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Clock,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  Check,
  Ban,
  UserX
} from 'lucide-react';

interface AdminDashboardViewProps {
  onSelectProperty: (property: Property) => void;
  onNavigate: (view: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onSelectProperty,
  onNavigate
}) => {
  const { isAdmin, role, loginAs } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'reports' | 'users'>('pending');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force re-read from db
  const stats = getAdminStats();
  const allProperties = getProperties({}, true);
  const pendingProperties = allProperties.filter((p) => p.status === 'pending_approval');
  const reports = getReports();
  const users = getUsers();

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleApprove = (propertyId: string) => {
    markPropertyStatus(propertyId, 'available', 'Approved by administrator');
    handleRefresh();
  };

  const handleReject = (propertyId: string) => {
    const note = prompt('Reason for rejection or changes requested (e.g. photos unclear, price missing):') || 'Listing rejected';
    markPropertyStatus(propertyId, 'rejected', note);
    handleRefresh();
  };

  const handleDeleteListing = (propertyId: string) => {
    if (window.confirm('Delete this listing permanently from Kwahae Estates?')) {
      deleteProperty(propertyId, '', true);
      handleRefresh();
    }
  };

  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    updateReportStatus(reportId, status);
    handleRefresh();
  };

  const handleToggleUserBan = (userId: string) => {
    toggleUserSuspension(userId);
    handleRefresh();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all property data, users, and reports back to default Senanga demo seed?')) {
      resetDatabaseToDefaults();
      handleRefresh();
    }
  };

  // If not admin, block view
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Restricted Administrator Area</h2>
        <p className="text-xs text-gray-600">
          Only authorised district administrators can review pending listings, approve advertisements, or manage fraud reports.
        </p>
        <button
          onClick={() => loginAs('admin')}
          className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
        >
          Sign In as Administrator (Passkey: kwahae2026)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/40 text-amber-200 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
              Admin Control Center
            </span>
            <span className="text-xs text-amber-200">District Office • Senanga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs text-amber-100/80 mt-0.5">
            Review advertisements, moderate landlords, and safeguard Senanga tenants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-white transition flex items-center gap-1.5 text-xs font-bold"
            title="Refresh statistics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleResetData}
            className="px-3 py-2 rounded-xl bg-amber-950/80 hover:bg-black text-amber-200 text-xs font-semibold border border-amber-600/40 transition"
            title="Reset to default seed data"
          >
            Reset Seed Data
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
            Total Listings
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">{stats.totalListings}</div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            {stats.availableListings} available • {stats.rentedListings} rented
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs bg-amber-50/30">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
            Pending Approval
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1">{stats.pendingApprovals}</div>
          <span className="text-[11px] text-amber-600 mt-0.5 block">
            Requires admin decision
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
            Landlords Registered
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {stats.registeredLandlords}
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            Active in Senanga
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-200 shadow-xs bg-rose-50/30">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block">
            Fraud Reports
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">{stats.pendingReports}</div>
          <span className="text-[11px] text-rose-500 mt-0.5 block">
            Pending investigation
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2.5 px-4 rounded-t-2xl transition flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-white border-t-2 border-l border-r border-amber-600 text-amber-800 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals ({pendingProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 px-4 rounded-t-2xl transition flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-white border-t-2 border-l border-r border-amber-600 text-amber-800 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>All Listings ({allProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2.5 px-4 rounded-t-2xl transition flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-white border-t-2 border-l border-r border-rose-600 text-rose-800 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>User Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 rounded-t-2xl transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-white border-t-2 border-l border-r border-amber-600 text-amber-800 shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Accounts ({users.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Approvals */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingProperties.length > 0 ? (
            pendingProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs flex flex-col md:flex-row gap-5 items-start"
              >
                <div
                  onClick={() => onSelectProperty(property)}
                  className="w-full md:w-48 aspect-[16/10] md:aspect-square rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={property.photographs[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=75'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      Pending Review
                    </span>
                    <span className="text-xs text-gray-500">
                      Submitted: {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => onSelectProperty(property)}
                      className="font-extrabold text-base text-gray-900 hover:text-emerald-700 cursor-pointer"
                    >
                      {property.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {property.location} • {property.addressOrLandmark}
                    </p>
                  </div>

                  <div className="text-emerald-800 font-extrabold text-sm">
                    ZMW {property.monthlyRentZmw.toLocaleString()} / month • {property.bedrooms} Bed(s)
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    "{property.description}"
                  </p>

                  <div className="text-xs text-gray-500">
                    Landlord: <strong>{property.landlordName}</strong> ({property.phone})
                  </div>

                  {/* Admin Decisions */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(property.id)}
                      className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Listing</span>
                    </button>

                    <button
                      onClick={() => handleReject(property.id)}
                      className="py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-amber-700" />
                      <span>Request Changes / Reject</span>
                    </button>

                    <button
                      onClick={() => onSelectProperty(property)}
                      className="py-2 px-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition"
                    >
                      Inspect Full Details
                    </button>

                    <button
                      onClick={() => handleDeleteListing(property.id)}
                      className="py-2 px-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs ml-auto"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-base text-gray-900">
                All caught up! No pending advertisements
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Any new listings submitted by landlords in Senanga will appear here for your review and approval.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Listings */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Rent (ZMW)</th>
                  <th className="pb-3">Landlord</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="py-3 font-bold text-gray-900 max-w-[200px] truncate">
                      {p.title}
                    </td>
                    <td className="py-3 text-gray-600">{p.location}</td>
                    <td className="py-3 font-extrabold text-emerald-800">
                      ZMW {p.monthlyRentZmw.toLocaleString()}
                    </td>
                    <td className="py-3 text-gray-600">{p.landlordName}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'rented'
                            ? 'bg-rose-100 text-rose-800'
                            : p.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => onSelectProperty(p)}
                        className="p-1 rounded hover:bg-gray-200 text-gray-600"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(p.id)}
                        className="p-1 rounded hover:bg-rose-100 text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Fraud / Scam Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {report.reason.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">
                    Reported on: {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-gray-900">
                    Report on: "{report.propertyTitle}"
                  </h4>
                  <p className="text-xs text-gray-500">Property ID: {report.propertyId}</p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-gray-800">
                  <strong>User Explanation:</strong> "{report.details}"
                </div>

                <div className="text-xs text-gray-500">
                  Reported by: <strong>{report.reporterName}</strong> ({report.reporterContact})
                </div>

                <div className="pt-2 flex items-center gap-2 border-t border-gray-100">
                  <button
                    onClick={() => handleResolveReport(report.id, 'resolved')}
                    className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                  >
                    Mark Resolved (Action Taken)
                  </button>
                  <button
                    onClick={() => handleResolveReport(report.id, 'dismissed')}
                    className="py-1.5 px-3 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50"
                  >
                    Dismiss Report
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-base text-gray-900">
                No user fraud reports logged
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                When users report suspicious pricing, fake photographs, or scam attempts, they will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Landlords & Accounts */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Registered Users & Landlords
          </h3>
          <div className="divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-gray-900">{u.fullName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {u.role}
                    </span>
                    {u.isSuspended && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                        Suspended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {u.phone} • {u.email || 'No email provided'}
                  </p>
                </div>

                {u.role !== 'admin' && (
                  <button
                    onClick={() => handleToggleUserBan(u.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      u.isSuspended
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {u.isSuspended ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Reactivate Account</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspend Account</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
