import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  Lock,
  Building2,
  ShoppingBag,
  Briefcase,
  CheckCircle2,
  Save,
  Key,
  MapPin,
  Calendar,
  Phone,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { UserRole, PropertyListing, BuyerRequirement } from '../types';
import { formatIndianCurrency } from '../utils/formatters';

interface UserProfileViewProps {
  onSelectProperty?: (property: PropertyListing) => void;
  onOpenMessages?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onSelectProperty,
  onOpenMessages,
}) => {
  const {
    currentUser,
    updateUserProfile,
    changePassword,
    properties,
    requirements,
    savedPropertyIds,
    updatePropertyStatus,
    deleteProperty,
    deleteRequirement,
    switchDemoUser,
    language,
    setAuthModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'role' | 'my_properties' | 'my_requirements'>('profile');

  // Form states for personal info
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [mobile, setMobile] = useState<string>(currentUser?.mobile || '');
  const [dob, setDob] = useState<string>(currentUser?.dob || '1990-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.gender || 'Male');
  const [address, setAddress] = useState<string>(currentUser?.address || '');
  const [city, setCity] = useState<string>(currentUser?.city || 'Mohali');
  const [state, setState] = useState<string>(currentUser?.state || 'Punjab');
  const [pincode, setPincode] = useState<string>(currentUser?.pincode || '160071');

  // Role attributes
  const [chosenRole, setChosenRole] = useState<UserRole>(currentUser?.activeRole || 'seller');
  const [agencyName, setAgencyName] = useState<string>(currentUser?.agencyName || '');
  const [reraNumber, setReraNumber] = useState<string>(currentUser?.reraNumber || '');
  const [commissionRate, setCommissionRate] = useState<number>(currentUser?.commissionRate || 1.0);
  const [experienceYears, setExperienceYears] = useState<number>(currentUser?.experienceYears || 10);

  // Security
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [profileSuccess, setProfileSuccess] = useState<string>('');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-stone-200 text-center space-y-4 shadow-sm">
        <User className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-lg font-bold text-stone-900">Please Sign In to View Profile</h2>
        <p className="text-xs text-stone-500">Access and manage your personal info, listings, and security settings.</p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Handle Save Personal Details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      mobile,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
    });
    setProfileSuccess('Personal details updated successfully!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  // Handle Save Role Settings
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      activeRole: chosenRole,
      agencyName: chosenRole === 'mediator' ? agencyName : undefined,
      reraNumber: chosenRole === 'mediator' ? reraNumber : undefined,
      commissionRate: chosenRole === 'mediator' ? Number(commissionRate) : undefined,
      experienceYears: chosenRole === 'mediator' ? Number(experienceYears) : undefined,
    });
    setProfileSuccess('Role & professional preferences updated!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.error || 'Failed to update password');
    } else {
      setPasswordSuccess('Password changed successfully! Keep it secure.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3500);
    }
  };

  // User's properties
  const myProperties = properties.filter((p) => p.sellerId === currentUser.id);

  // User's requirements
  const myRequirements = requirements.filter((r) => r.buyerId === currentUser.id);

  // Saved properties
  const mySavedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-2xl font-display shadow-inner">
            {currentUser.name ? currentUser.name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 font-display">{currentUser.name}</h1>
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                {currentUser.activeRole}
              </span>
            </div>
            <div className="text-xs text-stone-500 flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-stone-400" />
                +91 {currentUser.mobile}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                {currentUser.city}, {currentUser.state}
              </span>
              <span>·</span>
              <span>Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200 text-xs">
          <span className="text-stone-500 font-medium">Switch Demo User:</span>
          <button
            type="button"
            onClick={() => switchDemoUser('seller')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${currentUser.activeRole === 'seller' ? 'bg-amber-600 text-white' : 'bg-white border text-stone-700'}`}
          >
            Seller
          </button>
          <button
            type="button"
            onClick={() => switchDemoUser('buyer')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${currentUser.activeRole === 'buyer' ? 'bg-amber-600 text-white' : 'bg-white border text-stone-700'}`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => switchDemoUser('mediator')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${currentUser.activeRole === 'mediator' ? 'bg-amber-600 text-white' : 'bg-white border text-stone-700'}`}
          >
            Mediator / Agent
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 text-xs sm:text-sm font-semibold space-x-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-amber-600 text-amber-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          1. Personal Details (ਆਮ ਜਾਣਕਾਰੀ)
        </button>
        <button
          onClick={() => setActiveTab('role')}
          className={`py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'role' ? 'border-amber-600 text-amber-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          2. Role &amp; Preferences
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'security' ? 'border-amber-600 text-amber-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          3. Account &amp; Password
        </button>
        <button
          onClick={() => setActiveTab('my_properties')}
          className={`py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'my_properties' ? 'border-amber-600 text-amber-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          My Listings ({myProperties.length})
        </button>
        <button
          onClick={() => setActiveTab('my_requirements')}
          className={`py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'my_requirements' ? 'border-amber-600 text-amber-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
        >
          My Demands ({myRequirements.length})
        </button>
      </div>

      {profileSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {/* TAB 1: PERSONAL DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-sm font-bold text-stone-900">Personal Information (ਆਮ ਜਾਣਕਾਰੀ)</h3>
              <p className="text-xs text-stone-500">Saved details for quick property listing, verification, and deals</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Date of Birth (ਜਨਮ ਮਿਤੀ)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Gender (ਲਿੰਗ)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="Male">Male (ਪੁਰਸ਼)</option>
                  <option value="Female">Female (ਮਹਿਲਾ)</option>
                  <option value="Other">Other (ਹੋਰ)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">Residential Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">City (ਸ਼ਹਿਰ)</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ROLE & PREFERENCES */}
      {activeTab === 'role' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <form onSubmit={handleSaveRole} className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-sm font-bold text-stone-900">Choose Primary Role &amp; Credentials</h3>
              <p className="text-xs text-stone-500">Select how you want to act on the platform (Buyer, Seller, or Mediator)</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setChosenRole('seller')}
                className={`p-4 rounded-xl border text-left transition-all ${chosenRole === 'seller' ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20' : 'border-stone-200 hover:border-stone-300'}`}
              >
                <Building2 className={`w-5 h-5 mb-2 ${chosenRole === 'seller' ? 'text-amber-700' : 'text-stone-400'}`} />
                <div className="font-bold text-xs text-stone-900">Seller (ਵੇਚਣ ਵਾਲਾ)</div>
                <p className="text-[11px] text-stone-500 mt-1">List your Land, Plot, Kothi, SCO, or Flat directly.</p>
              </button>

              <button
                type="button"
                onClick={() => setChosenRole('buyer')}
                className={`p-4 rounded-xl border text-left transition-all ${chosenRole === 'buyer' ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20' : 'border-stone-200 hover:border-stone-300'}`}
              >
                <ShoppingBag className={`w-5 h-5 mb-2 ${chosenRole === 'buyer' ? 'text-amber-700' : 'text-stone-400'}`} />
                <div className="font-bold text-xs text-stone-900">Buyer (ਖਰੀਦਦਾਰ)</div>
                <p className="text-[11px] text-stone-500 mt-1">Post your property requirements and receive matching deals.</p>
              </button>

              <button
                type="button"
                onClick={() => setChosenRole('mediator')}
                className={`p-4 rounded-xl border text-left transition-all ${chosenRole === 'mediator' ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20' : 'border-stone-200 hover:border-stone-300'}`}
              >
                <Briefcase className={`w-5 h-5 mb-2 ${chosenRole === 'mediator' ? 'text-amber-700' : 'text-stone-400'}`} />
                <div className="font-bold text-xs text-stone-900">Mediator / Agent (ਵਿਚੋਲਾ)</div>
                <p className="text-[11px] text-stone-500 mt-1">Professional broker matchmaking buyers and sellers.</p>
              </button>
            </div>

            {chosenRole === 'mediator' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                <span className="font-bold text-stone-900 block">Agent / Brokerage Business Credentials:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Real Estate Firm / Agency Name</label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Brar Real Estate Consultants"
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Punjab RERA Registration No.</label>
                    <input
                      type="text"
                      value={reraNumber}
                      onChange={(e) => setReraNumber(e.target.value)}
                      placeholder="e.g. PBRERA-SAS80-REA0182"
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Standard Commission Rate (%)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 1.0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Experience in Punjab Realty (Years)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value) || 5)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Role Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ACCOUNT & PASSWORD */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-xl">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-sm font-bold text-stone-900">Security &amp; Password Management</h3>
              <p className="text-xs text-stone-500">Update your account password for secure authentication</p>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Current Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password (demo: password123)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">New Password (Min 6 chars)</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong new password"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-500 text-xs flex items-center gap-1 hover:text-stone-800"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Key className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: MY LISTED PROPERTIES */}
      {activeTab === 'my_properties' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Properties Listed by You</h3>
              <p className="text-xs text-stone-500">Manage status (Available, Under Token, Sold) or remove listings</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {myProperties.length} Properties
            </span>
          </div>

          {myProperties.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-500 space-y-2">
              <Building2 className="w-8 h-8 text-stone-400 mx-auto" />
              <p>You haven't listed any properties yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myProperties.map((p) => (
                <div
                  key={p.id}
                  className="p-4 border border-stone-200 rounded-xl hover:border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.photos[0]} alt={p.subType} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        {p.propertyType}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900">{p.subType}</h4>
                      <div className="text-xs text-stone-500">
                        {p.city} · {p.areaValue} {p.areaUnit} · {formatIndianCurrency(p.expectedPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Status Dropdown */}
                    <select
                      value={p.status}
                      onChange={(e) => updatePropertyStatus(p.id, e.target.value as any)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${
                        p.status === 'available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : p.status === 'under_token'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      <option value="available">Available (ਖੁੱਲ੍ਹਾ)</option>
                      <option value="under_token">Under Token / ਬਿਆਨਾ</option>
                      <option value="sold">Sold / ਰਜਿਸਟਰੀ ਹੋ ਗਈ</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onSelectProperty && onSelectProperty(p)}
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProperty(p.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MY REQUIREMENTS */}
      {activeTab === 'my_requirements' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Your Posted Buyer Demands (ਸਮੇਂ ਦੀ ਮੰਗ)</h3>
              <p className="text-xs text-stone-500">Active purchase criteria broadcast to sellers and mediators</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {myRequirements.length} Demands
            </span>
          </div>

          {myRequirements.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-500 space-y-2">
              <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto" />
              <p>You haven't posted any buyer requirements yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequirements.map((r) => (
                <div
                  key={r.id}
                  className="p-4 border border-stone-200 rounded-xl hover:border-stone-300 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{r.propertyTypes.join(', ')}</span>
                      <span className="text-stone-400">· {r.city}</span>
                    </div>
                    <div className="text-stone-600">
                      Budget: <strong>{formatIndianCurrency(r.minBudget)} - {formatIndianCurrency(r.maxBudget)}</strong> · Area: {r.desiredAreaMin} - {r.desiredAreaMax} {r.areaUnit}
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      Timeline: {r.urgency} · Purpose: {r.purpose}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteRequirement(r.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Remove Demand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
