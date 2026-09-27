import React, { useState } from 'react';
import { X, Phone, ShieldCheck, User, Lock, CheckCircle2, ArrowRight, ArrowLeft, Building2, ShoppingBag, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authStep,
    setAuthStep,
    registerUser,
    loginUser,
    switchDemoUser,
  } = useApp();

  // Registration step state: 1 (Mobile) | 2 (OTP) | 3 (Customer Info) | 4 (Password & Role)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(false);

  // Form states
  const [mobile, setMobile] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('582914');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');

  // Step 3: Customer general info ("ਆਮ information")
  const [name, setName] = useState<string>('');
  const [dob, setDob] = useState<string>('1992-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Mohali');
  const [state, setState] = useState<string>('Punjab');
  const [pincode, setPincode] = useState<string>('160071');

  // Step 4: Password & Role ("Act As")
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [chosenRole, setChosenRole] = useState<UserRole>('seller');
  const [agencyName, setAgencyName] = useState<string>('');
  const [reraNumber, setReraNumber] = useState<string>('');

  // Login form state
  const [loginMobile, setLoginMobile] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  if (!authModalOpen) return null;

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, '').length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpError('');
    setActiveStep(2);
  };

  // Handle OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
      setOtpError('Incorrect OTP. Please enter the 6-digit verification code.');
      return;
    }
    setOtpError('');
    setActiveStep(3); // Proceed to Customer General Info
  };

  // Handle Step 3 submit
  const handleCustomerInfoNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setOtpError('Please enter your full name');
      return;
    }
    if (!address.trim()) {
      setOtpError('Please enter your street / residential address');
      return;
    }
    setOtpError('');
    setActiveStep(4); // Proceed to Password & Choose Role
  };

  // Final Registration
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setOtpError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setOtpError('Passwords do not match');
      return;
    }

    registerUser({
      mobile: mobile.replace(/\D/g, ''),
      name,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
      password,
      activeRole: chosenRole,
      agencyName: chosenRole === 'mediator' ? agencyName : undefined,
      reraNumber: chosenRole === 'mediator' ? reraNumber : undefined,
    });
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = loginMobile.replace(/\D/g, '');
    if (clean.length < 10) {
      setLoginError('Please enter a 10-digit mobile number');
      return;
    }
    // Simulate user login
    loginUser({
      id: `user-${Date.now()}`,
      mobile: clean,
      name: clean === '9876543210' ? 'S. Gurpreet Singh Dhillon' : 'Registered Member',
      dob: '1988-04-12',
      gender: 'Male',
      address: 'House #45, Urban Estate',
      city: 'Mohali',
      state: 'Punjab',
      pincode: '160071',
      activeRole: 'seller',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-display">
              {isLoginMode ? 'Login to ZameenKothi' : 'New User Registration / ਰਜਿਸਟਰੇਸ਼ਨ'}
            </h2>
            <p className="text-xs text-stone-500">
              {isLoginMode
                ? 'Access your property listings, requirements & deals'
                : 'Mobile verification, personal details, password & role setup'}
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex border-b border-stone-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setOtpError('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              !isLoginMode
                ? 'border-amber-600 text-amber-900 bg-amber-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            1. Register with Mobile &amp; OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setLoginError('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              isLoginMode
                ? 'border-amber-600 text-amber-900 bg-amber-50/40'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            2. Existing User Login
          </button>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="px-6 py-2 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500">Quick Demo Account:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => switchDemoUser('seller')}
              className="px-2 py-0.5 bg-white border border-stone-300 rounded text-stone-700 hover:bg-amber-50 hover:border-amber-500 transition-colors"
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => switchDemoUser('buyer')}
              className="px-2 py-0.5 bg-white border border-stone-300 rounded text-stone-700 hover:bg-amber-50 hover:border-amber-500 transition-colors"
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => switchDemoUser('mediator')}
              className="px-2 py-0.5 bg-white border border-stone-300 rounded text-stone-700 hover:bg-amber-50 hover:border-amber-500 transition-colors"
            >
              Mediator / Dealer
            </button>
          </div>
        </div>

        <div className="p-6">
          {!isLoginMode ? (
            <div>
              {/* Wizard Step Indicator */}
              <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
                <div className={`flex items-center gap-1.5 ${activeStep >= 1 ? 'text-amber-700 font-bold' : ''}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeStep >= 1 ? 'bg-amber-600 text-white' : 'bg-stone-200'}`}>1</span>
                  <span>Mobile</span>
                </div>
                <span className="text-stone-300">―</span>
                <div className={`flex items-center gap-1.5 ${activeStep >= 2 ? 'text-amber-700 font-bold' : ''}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeStep >= 2 ? 'bg-amber-600 text-white' : 'bg-stone-200'}`}>2</span>
                  <span>OTP</span>
                </div>
                <span className="text-stone-300">―</span>
                <div className={`flex items-center gap-1.5 ${activeStep >= 3 ? 'text-amber-700 font-bold' : ''}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeStep >= 3 ? 'bg-amber-600 text-white' : 'bg-stone-200'}`}>3</span>
                  <span>ਆਮ Info</span>
                </div>
                <span className="text-stone-300">―</span>
                <div className={`flex items-center gap-1.5 ${activeStep >= 4 ? 'text-amber-700 font-bold' : ''}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeStep >= 4 ? 'bg-amber-600 text-white' : 'bg-stone-200'}`}>4</span>
                  <span>Password &amp; Role</span>
                </div>
              </div>

              {otpError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                  {otpError}
                </div>
              )}

              {/* STEP 1: Register with Mobile Number */}
              {activeStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="text-center py-2">
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-stone-900">Step 1: Enter Mobile Number</h3>
                    <p className="text-xs text-stone-500 mt-1">We will send a 6-digit OTP code to verify your phone number</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number (ਮੋਬਾਈਲ ਨੰਬਰ)
                    </label>
                    <div className="flex rounded-lg border border-stone-300 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 overflow-hidden">
                      <span className="inline-flex items-center px-3 bg-stone-100 text-stone-700 text-sm font-medium border-r border-stone-300">
                        +91 (India)
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2 text-sm focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: Fill OTP for Verification */}
              {activeStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Simulated SMS Alert Preview */}
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start gap-2.5 text-xs text-emerald-900">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">SMS Received: </span>
                      <span>Your OTP is <strong className="font-mono text-sm text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-300">{generatedOtp}</strong> for ZameenKothi verification.</span>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtp)}
                        className="block mt-1 text-xs text-emerald-700 font-semibold underline hover:text-emerald-800"
                      >
                        Click to Auto-fill ({generatedOtp})
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Enter 6-digit OTP sent to +91 {mobile}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-3 py-2.5 text-center font-mono text-lg tracking-widest border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Change Number
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(newOtp);
                      }}
                      className="text-amber-700 font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Verify OTP &amp; Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 3: Customer General Information ("ਆਮ Information") */}
              {activeStep === 3 && (
                <form onSubmit={handleCustomerInfoNext} className="space-y-3.5">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-sm font-bold text-stone-900">Step 3: Customer General Information (ਆਮ ਜਾਣਕਾਰੀ)</h3>
                    <p className="text-xs text-stone-500">Please provide your personal and address details</p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name (ਪੂਰਾ ਨਾਮ) *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. S. Harpreet Singh Brar"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* DOB & Gender */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        DOB (ਜਨਮ ਮਿਤੀ) *
                      </label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Gender (ਲਿੰਗ) *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Male">Male (ਪੁਰਸ਼)</option>
                        <option value="Female">Female (ਮਹਿਲਾ)</option>
                        <option value="Other">Other (ਹੋਰ)</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Address (ਰਿਹਾਇਸ਼ੀ ਪਤਾ / ਗਲੀ / ਸੈਕਟਰ) *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Kothi #42, Street 3, Urban Estate"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">City (ਸ਼ਹਿਰ) *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mohali"
                        className="w-full px-2.5 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">State (ਰਾਜ)</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-2.5 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="160071"
                        className="w-full px-2.5 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
                    >
                      <span>Proceed to Password &amp; Role Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: Password Setup & Act As Role */}
              {activeStep === 4 && (
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h3 className="text-sm font-bold text-stone-900">Step 4: Set Password &amp; Choose Your Role</h3>
                    <p className="text-xs text-stone-500">After creating account, choose whether to act as Buyer, Seller, or Mediator</p>
                  </div>

                  {/* Password fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Password (ਪਾਸਵਰਡ) *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm Password *</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Role Selection: Buyer, Seller, Mediator */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      Choose Your Primary Role (ਕਿਸ ਤੌਰ ਤੇ ਕੰਮ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Seller Option */}
                      <button
                        type="button"
                        onClick={() => setChosenRole('seller')}
                        className={`p-3 text-left rounded-lg border text-xs transition-all ${
                          chosenRole === 'seller'
                            ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600/30'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <Building2 className={`w-5 h-5 mb-1.5 ${chosenRole === 'seller' ? 'text-amber-700' : 'text-stone-500'}`} />
                        <div className="font-bold text-stone-900">Seller</div>
                        <div className="text-[11px] text-stone-500">ਵੇਚਣ ਵਾਲਾ</div>
                      </button>

                      {/* Buyer Option */}
                      <button
                        type="button"
                        onClick={() => setChosenRole('buyer')}
                        className={`p-3 text-left rounded-lg border text-xs transition-all ${
                          chosenRole === 'buyer'
                            ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600/30'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <ShoppingBag className={`w-5 h-5 mb-1.5 ${chosenRole === 'buyer' ? 'text-amber-700' : 'text-stone-500'}`} />
                        <div className="font-bold text-stone-900">Buyer</div>
                        <div className="text-[11px] text-stone-500">ਖਰੀਦਦਾਰ</div>
                      </button>

                      {/* Mediator / Agent Option */}
                      <button
                        type="button"
                        onClick={() => setChosenRole('mediator')}
                        className={`p-3 text-left rounded-lg border text-xs transition-all ${
                          chosenRole === 'mediator'
                            ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600/30'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <Briefcase className={`w-5 h-5 mb-1.5 ${chosenRole === 'mediator' ? 'text-amber-700' : 'text-stone-500'}`} />
                        <div className="font-bold text-stone-900">Mediator</div>
                        <div className="text-[11px] text-stone-500">ਵਿਚੋਲਾ / ਡੀਲਰ</div>
                      </button>
                    </div>
                  </div>

                  {chosenRole === 'mediator' && (
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Agency / Real Estate Firm Name</label>
                        <input
                          type="text"
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="e.g. Royal Punjab Estates"
                          className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Punjab RERA / GMADA License (Optional)</label>
                        <input
                          type="text"
                          value={reraNumber}
                          onChange={(e) => setReraNumber(e.target.value)}
                          placeholder="e.g. PBRERA-SAS80-REA0199"
                          className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Registration &amp; Open Account</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* EXISTING USER LOGIN */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-stone-900">Sign In to Your Account</h3>
                <p className="text-xs text-stone-500 mt-1">Enter your registered mobile number and password</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Registered Mobile Number</label>
                <div className="flex rounded-lg border border-stone-300 focus-within:ring-2 focus-within:ring-amber-500 overflow-hidden">
                  <span className="inline-flex items-center px-3 bg-stone-100 text-stone-700 text-sm font-medium border-r border-stone-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Account Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
              >
                <span>Login Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className="text-xs text-amber-700 hover:underline font-medium"
                >
                  Don't have an account? Register with Mobile &amp; OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
