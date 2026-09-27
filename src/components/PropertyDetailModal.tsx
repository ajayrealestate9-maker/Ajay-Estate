import React, { useState } from 'react';
import { PropertyListing } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import {
  X,
  MapPin,
  ExternalLink,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Compass,
  Layers,
  ArrowRight,
  MessageCircle,
  Calculator,
  TrendingUp,
  Maximize2,
  Eye,
  Camera,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PropertyDetailModalProps {
  property: PropertyListing | null;
  onClose: () => void;
  onStartChat?: (property: PropertyListing) => void;
  onOpenCostBreakdown?: (price: number) => void;
  onOpenMarketTrends?: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onStartChat,
  onOpenCostBreakdown,
  onOpenMarketTrends,
}) => {
  const { currentUser, submitInquiry, startOrOpenChat, setAuthModalOpen } = useApp();

  const [activeTab, setActiveTab] = useState<'gallery' | 'virtual_tour' | 'mortgage'>('gallery');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Mortgage Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  // Advisory Inquiry state
  const [offerPrice, setOfferPrice] = useState<number>(property?.expectedPrice || 0);
  const [clientName, setClientName] = useState<string>(currentUser?.name || '');
  const [clientMobile, setClientMobile] = useState<string>(currentUser?.mobile || '');
  const [visitDate, setVisitDate] = useState<string>('2026-09-29');
  const [offerMessage, setOfferMessage] = useState<string>(
    'I would like to schedule a private walkthrough and receive the certified title dossier for this estate.'
  );
  const [inquirySent, setInquirySent] = useState<boolean>(false);

  if (!property) return null;

  // Mortgage Math
  const propertyPrice = property.expectedPrice;
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanPrincipal = propertyPrice - downPaymentAmount;
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = loanTenureYears * 12;
  const monthlyEMI =
    monthlyRate > 0 && totalMonths > 0
      ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;

  const handleWhatsApp = () => {
    const cleanPhone = property.sellerMobile.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Sat Sri Akal / Hello, I am inquiring regarding "${property.subType}" in ${property.localitySector}, ${property.city} (Listed at: ${formatIndianCurrency(property.expectedPrice)}). Please provide private access details.`
    );
    window.open(`https://wa.me/91${cleanPhone}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:+91${property.sellerMobile}`, '_self');
  };

  const handleInAppChat = () => {
    if (onStartChat) {
      onStartChat(property);
    } else {
      startOrOpenChat(
        {
          id: property.sellerId,
          name: property.sellerName,
          role: property.sellerRole,
          mobile: property.sellerMobile,
        },
        property
      );
    }
    onClose();
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    submitInquiry({
      propertyId: property.id,
      propertyTitle: property.subType,
      senderId: currentUser.id,
      senderName: clientName || currentUser.name,
      senderMobile: clientMobile || currentUser.mobile,
      senderRole: currentUser.activeRole,
      offeredPrice: Number(offerPrice),
      message: offerMessage,
      preferredVisitDate: visitDate,
      status: 'pending',
    });

    setInquirySent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-white hover:text-[#C5A880] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={property.photos[activePhotoIdx]}
            alt={property.subType}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="mt-4 text-xs text-[#A59F9A] uppercase tracking-widest font-mono">
            Photograph {activePhotoIdx + 1} of {property.photos.length} · {property.subType}
          </div>
        </div>
      )}

      {/* Main Modal Frame */}
      <div className="relative w-full max-w-5xl bg-[#FBFBF9] text-[#14181F] rounded-2xl shadow-2xl overflow-hidden border border-[#E8E5DD] flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5DD] bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-lg sm:text-xl text-[#14181F]">
              Ajay Estate Signature Dossier
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-xs uppercase tracking-wider text-[#8A6A3F] font-semibold">
              Ref #{property.id.slice(0, 10)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5A554E] hover:text-[#14181F] hover:bg-[#F4F2EC] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Header Title & Pricing Strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E5DD]">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A6A3F] font-semibold">
                <span>{property.city}</span>
                <span>·</span>
                <span>{property.localitySector}</span>
                <span>·</span>
                <span>{property.propertyType}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-normal text-[#14181F] leading-tight">
                {property.subType}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[#5A554E]">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{property.address}</span>
              </div>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-xs uppercase tracking-widest text-[#8A8480] block font-medium">
                Offering Price
              </span>
              <span className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#14181F] tabular-nums tracking-tight block">
                {formatIndianCurrency(property.expectedPrice)}
              </span>
              <span className="text-xs text-[#8A6A3F] font-medium">
                {property.isNegotiable ? 'Discreet Negotiation Considered' : 'Fixed Valuation'}
              </span>
            </div>
          </div>

          {/* Interactive Media Tabs: Gallery / 3D Virtual Tour / Mortgage Calculator */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E5DD] pb-2">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'bg-[#14181F] text-white'
                    : 'text-[#5A554E] hover:text-[#14181F]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>High-Res Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab('virtual_tour')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === 'virtual_tour'
                    ? 'bg-[#14181F] text-white'
                    : 'text-[#5A554E] hover:text-[#14181F]'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>3D Virtual Walkthrough</span>
              </button>

              <button
                onClick={() => setActiveTab('mortgage')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === 'mortgage'
                    ? 'bg-[#14181F] text-white'
                    : 'text-[#5A554E] hover:text-[#14181F]'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Mortgage &amp; EMI Estimator</span>
              </button>
            </div>

            {/* TAB 1: Gallery */}
            {activeTab === 'gallery' && (
              <div className="space-y-3">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#14181F] shadow-lg group">
                  <img
                    src={property.photos[activePhotoIdx]}
                    alt={property.subType}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-101"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg text-xs backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </button>

                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-xs backdrop-blur-xs font-mono">
                    Image {activePhotoIdx + 1} / {property.photos.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {property.photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {property.photos.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activePhotoIdx === i
                            ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={src} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: 3D Virtual Tour Embed */}
            {activeTab === 'virtual_tour' && (
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#0B0D11] border border-[#232932] relative flex flex-col items-center justify-center text-white p-6 shadow-xl">
                <img
                  src={property.photos[0]}
                  alt="3D Panorama"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xs"
                />
                <div className="relative z-10 max-w-md text-center space-y-4">
                  <div className="w-14 h-14 bg-[#C5A880]/20 text-[#C5A880] rounded-full flex items-center justify-center mx-auto border border-[#C5A880]/40">
                    <RotateCcw className="w-7 h-7 animate-spin-slow" />
                  </div>
                  <h3 className="font-serif-luxury text-2xl font-bold">
                    360° Interactive Architectural Simulation
                  </h3>
                  <p className="text-xs text-[#A59F9A] leading-relaxed">
                    Explore high-resolution spatial dimensions, double-height foyer volumes, and terrace sightlines in our real-time interactive viewer.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => window.open(property.videoUrl || 'https://www.youtube.com', '_blank')}
                      className="px-5 py-2.5 bg-[#C5A880] hover:bg-[#B5966B] text-[#0B0D11] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Launch Cinematic Tour
                    </button>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Return to Gallery
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Mortgage Calculator */}
            {activeTab === 'mortgage' && (
              <div className="p-6 bg-white border border-[#E8E5DD] rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="font-serif-luxury text-xl font-bold text-[#14181F]">
                      Acquisition Financing Calculator
                    </h3>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#5A554E] mb-1">
                        <span>Down Payment ({downPaymentPercent}%)</span>
                        <span className="font-mono font-bold text-[#14181F]">
                          {formatIndianCurrency(downPaymentAmount)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        step="5"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-[#C5A880]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#5A554E] mb-1">
                        <span>Loan Tenure ({loanTenureYears} Years)</span>
                        <span className="font-mono font-bold text-[#14181F]">
                          {loanTenureYears * 12} Months
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={loanTenureYears}
                        onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                        className="w-full accent-[#C5A880]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#5A554E] mb-1">
                        <span>Interest Rate ({interestRate}% p.a.)</span>
                        <span className="font-mono font-bold text-[#14181F]">{interestRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="6.5"
                        max="14"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#14181F] text-white p-6 rounded-xl space-y-4">
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
                      Estimated Monthly Commitment
                    </span>
                    <div className="text-3xl font-serif-luxury font-bold text-white tabular-nums">
                      {formatIndianCurrency(Math.round(monthlyEMI))}
                      <span className="text-xs text-[#8A8480] font-sans font-normal ml-1">/ month</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-[#A59F9A]">
                      <div className="flex justify-between">
                        <span>Principal Borrowing</span>
                        <span className="font-mono text-white font-semibold">
                          {formatIndianCurrency(loanPrincipal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Initial Capital Outlay</span>
                        <span className="font-mono text-white font-semibold">
                          {formatIndianCurrency(downPaymentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Punjab Stamp Duty (7%)</span>
                        <span className="font-mono text-[#C5A880] font-semibold">
                          {formatIndianCurrency(Math.round(propertyPrice * 0.07))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Architectural Key Specifications Grid */}
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-[#14181F]">
              Architectural &amp; Legal Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-white border border-[#E8E5DD] rounded-xl space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C827A] font-medium block">
                  Plot / Built-up Area
                </span>
                <span className="text-sm font-bold text-[#14181F] block">
                  {property.areaValue} {property.areaUnit}
                </span>
                <span className="text-[11px] text-[#5A554E] block">{property.dimensions}</span>
              </div>

              <div className="p-3.5 bg-white border border-[#E8E5DD] rounded-xl space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C827A] font-medium block">
                  Orientation &amp; Vastu
                </span>
                <span className="text-sm font-bold text-[#14181F] block">{property.facing}</span>
                <span className="text-[11px] text-[#5A554E] block">{property.roadWidthFt} ft Front Road</span>
              </div>

              <div className="p-3.5 bg-white border border-[#E8E5DD] rounded-xl space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C827A] font-medium block">
                  Title &amp; Clearances
                </span>
                <span className="text-sm font-bold text-[#14181F] block">100% Freehold Verified</span>
                <span className="text-[11px] text-[#8A6A3F] block truncate" title={property.registryStatus}>
                  {property.registryStatus}
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#E8E5DD] rounded-xl space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C827A] font-medium block">
                  Accommodations
                </span>
                <span className="text-sm font-bold text-[#14181F] block">
                  {property.bedrooms && property.bedrooms > 0 ? `${property.bedrooms} Suites · ${property.bathrooms || 0} Baths` : 'Commercial Shell / Open Layout'}
                </span>
                <span className="text-[11px] text-[#5A554E] block">Dedicated Private Parking</span>
              </div>
            </div>
          </div>

          {/* Detailed Architectural Prose */}
          <div className="space-y-2">
            <h3 className="font-serif-luxury text-xl font-bold text-[#14181F]">
              Curator’s Overview
            </h3>
            <p className="text-sm text-[#5A554E] leading-relaxed font-light whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Action Row & Private Advisory Booking Form */}
          <div className="bg-[#14181F] text-white p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold block">
                  Exclusive Representation
                </span>
                <h4 className="text-lg font-serif-luxury font-bold">{property.sellerName}</h4>
                <p className="text-xs text-[#A59F9A]">Ajay Estate Private Office &amp; Advisory</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleInAppChat}
                  className="px-4 py-2 bg-[#C5A880] hover:bg-[#B5966B] text-[#0B0D11] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Direct Encrypted Chat</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>WhatsApp Concierge</span>
                </button>

                <button
                  onClick={handleCall}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                  title="Direct Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Private Mandate Form */}
            {inquirySent ? (
              <div className="p-6 bg-white/5 border border-[#C5A880]/30 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#C5A880] mx-auto" />
                <h5 className="font-serif-luxury text-base font-bold">Inquiry Successfully Registered</h5>
                <p className="text-xs text-[#C5BEB8]">
                  Our private client desk has received your request for {property.subType}. A licensed principal broker will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-[#C5A880] font-bold block">
                  Schedule Private Site Walkthrough or Submit Offer
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A59F9A] mb-1">
                      Preferred Offer Valuation (₹)
                    </label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full bg-[#0B0D11] border border-white/15 px-3 py-2 text-xs text-white rounded-lg focus:outline-hidden focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A59F9A] mb-1">
                      Preferred Inspection Date
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-[#0B0D11] border border-white/15 px-3 py-2 text-xs text-white rounded-lg focus:outline-hidden focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#C5A880] hover:bg-[#B5966B] text-[#0B0D11] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Dispatch Private Request
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
