import React, { useState } from 'react';
import { PropertyType } from '../types';
import { heroImg } from '../data/mockProperties';
import {
  Search,
  MapPin,
  Building2,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  KeyRound,
  SlidersHorizontal,
} from 'lucide-react';

interface HeroBannerProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onPostRequirement: () => void;
  onListProperty: () => void;
  onExplorePortfolio?: () => void;
}

export type SearchTabIntent = 'buy' | 'rent' | 'exclusive';

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedType,
  setSelectedType,
  selectedCity,
  setSelectedCity,
  searchQuery,
  setSearchQuery,
  onPostRequirement,
  onListProperty,
  onExplorePortfolio,
}) => {
  const [activeIntent, setActiveIntent] = useState<SearchTabIntent>('buy');
  const [priceTier, setPriceTier] = useState<string>('all');

  return (
    <div className="relative bg-[#0B0D11] text-white overflow-hidden border-b border-[#232932]">
      {/* Background Hero Image with measured architectural contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Ajay Estate Signature Architectural Villa"
          className="w-full h-full object-cover opacity-45 scale-102 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Architectural Vignette Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D11]/95 via-[#0B0D11]/70 to-[#0B0D11]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-transparent to-[#0B0D11]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-14 sm:pb-20">
        <div className="max-w-4xl space-y-8">
          {/* Subtle Editorial Kicker */}
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#C5A880] font-medium">
            <span className="w-8 h-[1px] bg-[#C5A880]" />
            <span>Private Real Estate Brokerage &amp; Family Office Advisory</span>
          </div>

          {/* Majestic Serif Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-luxury font-normal tracking-tight text-[#FBFBF9] leading-[1.1] text-balance">
            Curating Exceptional Estates for the World’s Most Discerning.
          </h1>

          <p className="text-[#B3ACB2] text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Representing architectural masterpieces, bespoke penthouses, and discreet off-market residential acquisitions across Mohali, Chandigarh, and prime metropolitan corridors.
          </p>

          {/* Interactive Search Console with Tab Choices */}
          <div className="pt-2">
            <div className="bg-[#14181F]/90 backdrop-blur-md rounded-2xl border border-white/10 p-3 sm:p-4 shadow-2xl space-y-3">
              {/* Tab Choices: Buy / Rent / Exclusive Properties */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveIntent('buy')}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeIntent === 'buy'
                      ? 'bg-[#C5A880] text-[#0B0D11] shadow-xs'
                      : 'text-[#C5BEB8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Acquisitions (Buy)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIntent('exclusive')}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    activeIntent === 'exclusive'
                      ? 'bg-[#C5A880] text-[#0B0D11] shadow-xs'
                      : 'text-[#C5BEB8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Off-Market Signature</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIntent('rent')}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeIntent === 'rent'
                      ? 'bg-[#C5A880] text-[#0B0D11] shadow-xs'
                      : 'text-[#C5BEB8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Private Leases (Rent)
                </button>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                {/* Locality & Sector Input */}
                <div className="sm:col-span-4 bg-[#0B0D11]/70 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-[#C5A880] transition-colors">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <div className="w-full">
                    <span className="block text-[9px] uppercase tracking-wider text-[#8A8480] font-semibold">
                      Location / Region
                    </span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white focus:outline-hidden cursor-pointer"
                    >
                      <option value="All" className="bg-[#14181F] text-white">All Prime Corridors</option>
                      <option value="Mohali" className="bg-[#14181F] text-white">Mohali (IT City &amp; Aerocity)</option>
                      <option value="Chandigarh" className="bg-[#14181F] text-white">Chandigarh Prime Sectors</option>
                      <option value="Zirakpur" className="bg-[#14181F] text-white">PR-7 Airport Boulevard</option>
                      <option value="Ludhiana" className="bg-[#14181F] text-white">Ludhiana (Urban Estate)</option>
                      <option value="Amritsar" className="bg-[#14181F] text-white">Amritsar (Ranjit Avenue)</option>
                      <option value="Jalandhar" className="bg-[#14181F] text-white">Jalandhar (Model Town)</option>
                    </select>
                  </div>
                </div>

                {/* Property Type Selector */}
                <div className="sm:col-span-3 bg-[#0B0D11]/70 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-[#C5A880] transition-colors">
                  <Building2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <div className="w-full">
                    <span className="block text-[9px] uppercase tracking-wider text-[#8A8480] font-semibold">
                      Estate Type
                    </span>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white focus:outline-hidden cursor-pointer"
                    >
                      <option value="All" className="bg-[#14181F] text-white">All Residences</option>
                      <option value="Flat" className="bg-[#14181F] text-white">Sky Penthouses &amp; Flats</option>
                      <option value="Kothi" className="bg-[#14181F] text-white">Architectural Villas &amp; Kothis</option>
                      <option value="SCO" className="bg-[#14181F] text-white">Commercial Flagship SCOs</option>
                      <option value="Plot" className="bg-[#14181F] text-white">Prime Residential Plots</option>
                      <option value="Land" className="bg-[#14181F] text-white">Agricultural &amp; Estate Lands</option>
                    </select>
                  </div>
                </div>

                {/* Keyword search input */}
                <div className="sm:col-span-5 bg-[#0B0D11]/70 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-[#C5A880] transition-colors">
                  <Search className="w-4 h-4 text-[#8A8480] shrink-0" />
                  <div className="w-full">
                    <span className="block text-[9px] uppercase tracking-wider text-[#8A8480] font-semibold">
                      Architectural Keyword
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Penthouse, Calacatta, 1 Kanal..."
                      className="w-full bg-transparent text-xs font-normal text-white placeholder-[#78726E] focus:outline-hidden"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#8A8480] hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={onExplorePortfolio || (() => window.scrollTo({ top: 600, behavior: 'smooth' }))}
              className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#B5966B] text-[#0B0D11] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-2 group"
            >
              <span>Explore Signature Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onPostRequirement}
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/20 transition-all cursor-pointer backdrop-blur-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Submit Confidential Mandate</span>
            </button>

            <button
              onClick={onListProperty}
              className="px-6 py-3.5 text-[#C5BEB8] hover:text-white text-xs font-medium uppercase tracking-wider transition-all cursor-pointer underline underline-offset-4 decoration-[#C5A880]/50 hover:decoration-[#C5A880]"
            >
              Private Seller Inquiries &rarr;
            </button>
          </div>
        </div>

        {/* Dynamic Proof & Trust Metrics Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="font-serif-luxury text-2xl sm:text-3xl text-[#FBFBF9] block">
              ₹850M+
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#8A8480] font-medium block">
              Cumulative Transacted Volume
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-serif-luxury text-2xl sm:text-3xl text-[#C5A880] block">
              99.4%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#8A8480] font-medium block">
              Off-Market Discretion Rate
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-serif-luxury text-2xl sm:text-3xl text-[#FBFBF9] block">
              100%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#8A8480] font-medium block">
              Title Clearance &amp; Legal Audit
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-serif-luxury text-2xl sm:text-3xl text-[#C5A880] block">
              18 Days
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#8A8480] font-medium block">
              Average Qualified Matchmaking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
