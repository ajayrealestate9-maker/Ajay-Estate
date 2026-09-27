import React from 'react';
import { PropertyListing } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import { MapPin, MessageCircle, Heart, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PropertyCardProps {
  property: PropertyListing;
  onSelect: (property: PropertyListing) => void;
  onStartChat?: (property: PropertyListing) => void;
  matchScore?: number;
  layoutMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onStartChat,
  matchScore,
  layoutMode = 'grid',
}) => {
  const { savedPropertyIds, toggleSaveProperty, startOrOpenChat } = useApp();
  const isSaved = savedPropertyIds.includes(property.id);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = property.sellerMobile.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Sat Sri Akal / Hello, I am inquiring regarding "${property.subType}" in ${property.localitySector}, ${property.city} (Listed Valuation: ${formatIndianCurrency(property.expectedPrice)}) through Ajay Estate.`
    );
    window.open(`https://wa.me/91${cleanPhone}?text=${text}`, '_blank');
  };

  const handleInAppChat = (e: React.MouseEvent) => {
    e.stopPropagation();
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
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveProperty(property.id);
  };

  // Compact Row / List View
  if (layoutMode === 'list') {
    return (
      <div
        onClick={() => onSelect(property)}
        className="group bg-white rounded-xl border border-[#E8E5DD] hover:border-[#C5A880] transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer shadow-xs hover:shadow-md"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-[#14181F]">
            <img
              src={property.photos[0]}
              alt={property.subType}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-sm bg-[#0B0D11]/90 text-[9px] font-semibold text-[#C5A880] uppercase tracking-widest">
              {property.propertyType}
            </span>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#8C827A]">
              <span>{property.city}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#5A554E]">
                {property.areaValue} {property.areaUnit}
              </span>
              {property.facing && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] truncate">{property.facing}</span>
                </>
              )}
            </div>

            <h3 className="text-base font-serif-luxury font-bold text-[#14181F] truncate group-hover:text-[#8A6A3F] transition-colors">
              {property.subType}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-[#8C827A] truncate">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span className="truncate">{property.localitySector}, {property.city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F2EFE9]">
          <div className="text-left sm:text-right">
            <span className="text-lg font-serif-luxury font-bold text-[#14181F] tabular-nums tracking-tight block">
              {formatIndianCurrency(property.expectedPrice)}
            </span>
            <span className="text-[10px] text-[#8C827A] uppercase tracking-wider">
              {property.isNegotiable ? 'Discreet Offer' : 'Fixed Valuation'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInAppChat}
              title="Encrypted Inquiry"
              className="px-3 py-1.5 rounded-md bg-[#14181F] text-white hover:bg-[#252B35] transition-colors text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Inquire</span>
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-md border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-[#8C827A] border-[#E8E5DD] hover:text-[#14181F]'
              }`}
              title="Save to Portfolio"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Marquee Grid Card
  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white rounded-xl border border-[#E8E5DD] hover:border-[#C5A880] transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-xs hover:shadow-xl"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#14181F]">
        <img
          src={property.photos[0]}
          alt={property.subType}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-sm bg-[#0B0D11]/90 text-[10px] font-semibold text-[#C5A880] uppercase tracking-widest backdrop-blur-xs border border-white/10">
            {property.propertyType}
          </span>

          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
              isSaved
                ? 'bg-white text-rose-600'
                : 'bg-black/50 text-white hover:text-[#C5A880] hover:bg-black/80'
            }`}
            title="Save to Portfolio"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Match score if calculating for buyer demands */}
        {matchScore !== undefined && (
          <div className="absolute top-11 left-3 px-2 py-0.5 rounded-sm bg-[#C5A880] text-[#0B0D11] text-[10px] font-bold uppercase tracking-wider">
            {matchScore}% Mandate Match
          </div>
        )}

        {/* Bottom Card Image Data */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold block mb-0.5">
            {property.city} · {property.localitySector}
          </span>
          <div className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tabular-nums tracking-tight">
            {formatIndianCurrency(property.expectedPrice)}
          </div>
        </div>
      </div>

      {/* Card Content & Metadata (Zero-pill discipline) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8C827A]">
            <span>{property.areaValue} {property.areaUnit}</span>
            <span aria-hidden="true">·</span>
            <span>{property.dimensions || 'Spacious Plan'}</span>
            {Boolean(property.bedrooms && property.bedrooms > 0) && (
              <>
                <span aria-hidden="true">·</span>
                <span>{property.bedrooms} Suites</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-serif-luxury font-bold text-[#14181F] group-hover:text-[#8A6A3F] transition-colors leading-snug">
            {property.subType}
          </h3>

          <p className="text-xs text-[#5A554E] line-clamp-2 leading-relaxed font-light">
            {property.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#8C827A] truncate max-w-[55%]">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span className="truncate">{property.localitySector}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInAppChat}
              className="px-3 py-1.5 bg-[#14181F] hover:bg-[#252B35] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>Inquire</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
