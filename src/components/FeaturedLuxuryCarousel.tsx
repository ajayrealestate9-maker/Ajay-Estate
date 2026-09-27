import React, { useState } from 'react';
import { PropertyListing } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  Eye,
  ArrowRight,
  Maximize2,
  Compass,
} from 'lucide-react';

interface FeaturedLuxuryCarouselProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onStartChat: (property: PropertyListing) => void;
}

export const FeaturedLuxuryCarousel: React.FC<FeaturedLuxuryCarouselProps> = ({
  properties,
  onSelectProperty,
  onStartChat,
}) => {
  // Filter for ultra-luxury signature properties (expectedPrice >= 4.5 Cr or featured)
  const featuredList = properties.filter(
    (p) => p.expectedPrice >= 45000000 || p.isFeatured
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  if (featuredList.length === 0) return null;

  const current = featuredList[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredList.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#14181F] text-white py-14 sm:py-20 border-y border-[#232932] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Nav Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium mb-2">
              <span className="w-6 h-[1px] bg-[#C5A880]" />
              <span>Curated Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-normal text-[#FBFBF9] tracking-tight">
              Featured Ultra-Luxury Estates
            </h2>
            <p className="text-xs sm:text-sm text-[#A59F9A] font-light mt-1">
              Architecturally significant residences and trophy assets currently available for acquisition
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#8C827A] tracking-widest mr-2">
              <span className="text-[#C5A880] font-bold">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>{' '}
              / {String(featuredList.length).padStart(2, '0')}
            </span>
            <button
              onClick={handlePrev}
              aria-label="Previous Featured Estate"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-[#C5A880] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Featured Estate"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-[#C5A880] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="relative bg-[#0B0D11] border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Column */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden group">
              <img
                src={current.images[0]}
                alt={current.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11]/90 via-transparent to-transparent lg:hidden" />
              
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#14181F]/90 backdrop-blur-md border border-[#C5A880]/40 text-[#C5A880] text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A880]" />
                  <span>Exclusive Signature</span>
                </span>
                <span className="px-3 py-1 bg-[#0B0D11]/80 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-wider rounded-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Freehold Title Verified</span>
                </span>
              </div>

              {/* Quick Image Lightbox Trigger */}
              <button
                onClick={() => onSelectProperty(current)}
                className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#0B0D11]/80 hover:bg-[#0B0D11] text-white text-[11px] font-medium border border-white/20 rounded-md backdrop-blur-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>View Full Gallery ({current.images.length})</span>
              </button>
            </div>

            {/* Editorial Details Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#A59F9A]">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>
                    {current.localitySector}, {current.city}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif-luxury font-normal text-[#FBFBF9] leading-snug">
                  {current.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A59F9A] font-light leading-relaxed line-clamp-3">
                  {current.description}
                </p>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8480] block">
                      Scale &amp; Area
                    </span>
                    <span className="font-serif-luxury text-base font-semibold text-white">
                      {current.areaValue} {current.areaUnit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8480] block">
                      Orientation
                    </span>
                    <span className="font-serif-luxury text-base font-semibold text-white">
                      {current.facing || 'East Facing'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8480] block">
                      Frontage Road
                    </span>
                    <span className="font-serif-luxury text-base font-semibold text-white">
                      {current.roadWidthFt ? `${current.roadWidthFt} Ft Wide` : '60 Ft Boulevard'}
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] block font-semibold">
                    Offered Investment
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-serif-luxury font-semibold text-[#FBFBF9]">
                      {formatIndianCurrency(current.expectedPrice)}
                    </span>
                    <span className="text-xs text-[#8A8480] font-light">
                      (Approx. ₹{Math.round(current.expectedPrice / (current.areaValue || 1)).toLocaleString('en-IN')} / {current.areaUnit})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onSelectProperty(current)}
                  className="flex-1 px-5 py-3 bg-[#C5A880] hover:bg-[#B5966B] text-[#0B0D11] text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-md"
                >
                  <span>View Private Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onStartChat(current)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/20 rounded-md transition-all cursor-pointer text-center"
                >
                  Inquire Confidentially
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Micro Indicators */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {featuredList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-[#C5A880]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
