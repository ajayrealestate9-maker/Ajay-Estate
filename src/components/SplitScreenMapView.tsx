import React, { useState } from 'react';
import { PropertyListing } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Layers,
  ChevronRight,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { PropertyCard } from './PropertyCard';

interface SplitScreenMapViewProps {
  properties: PropertyListing[];
  selectedProperty: PropertyListing | null;
  onSelectProperty: (property: PropertyListing) => void;
  onStartChat: (property: PropertyListing) => void;
}

export const SplitScreenMapView: React.FC<SplitScreenMapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onStartChat,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'luxury_dark' | 'architectural_light'>('luxury_dark');

  // Active property for map popup preview
  const activePinProperty = properties.find((p) => p.id === hoveredId) || selectedProperty || properties[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[720px]">
        {/* Left Column: Properties Scrollable List */}
        <div className="lg:col-span-6 space-y-4 max-h-[820px] overflow-y-auto pr-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DD]">
            <div>
              <h2 className="text-xl font-serif-luxury font-semibold text-[#14181F]">
                Prime Regional Estates
              </h2>
              <p className="text-xs text-[#8C827A]">
                Showing {properties.length} geocoded residences. Click or hover on any property or map pin.
              </p>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A6A3F] bg-[#C5A880]/15 px-2 py-0.5 rounded">
              Live Coordinate Sync
            </span>
          </div>

          <div className="space-y-4">
            {properties.map((prop) => {
              const isSelected = activePinProperty?.id === prop.id;
              return (
                <div
                  key={prop.id}
                  onMouseEnter={() => setHoveredId(prop.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-[#C5A880] rounded-xl shadow-md' : ''
                  }`}
                >
                  <PropertyCard
                    property={prop}
                    onSelect={onSelectProperty}
                    onStartChat={onStartChat}
                    layoutMode="list"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Architectural Map */}
        <div className="lg:col-span-6 sticky top-24 h-[650px] lg:h-[820px]">
          <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-[#232932] shadow-2xl transition-colors ${
            mapStyle === 'luxury_dark' ? 'bg-[#0B0D11]' : 'bg-[#F2EFE9]'
          }`}>
            {/* Map Top Bar Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto bg-[#14181F]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#C5A880] animate-spin-slow" />
                <span>Punjab Tri-City &amp; Prime Metro Spatial Grid</span>
              </div>

              <div className="pointer-events-auto flex items-center gap-1.5 bg-[#14181F]/90 backdrop-blur-md p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setMapStyle('luxury_dark')}
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                    mapStyle === 'luxury_dark'
                      ? 'bg-[#C5A880] text-[#0B0D11]'
                      : 'text-[#A59F9A] hover:text-white'
                  }`}
                >
                  Obsidian
                </button>
                <button
                  onClick={() => setMapStyle('architectural_light')}
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                    mapStyle === 'architectural_light'
                      ? 'bg-[#C5A880] text-[#0B0D11]'
                      : 'text-[#A59F9A] hover:text-white'
                  }`}
                >
                  Parchment
                </button>
              </div>
            </div>

            {/* Stylized Architectural Canvas / Vector Grid */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 900"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={mapStyle === 'luxury_dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}
                    strokeWidth="1"
                  />
                </pattern>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C5A880" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#C5A880" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="400" cy="450" r="350" fill="url(#mapGlow)" />

              {/* Major Highway Corridors */}
              {/* 200ft Airport Road corridor */}
              <path
                d="M 120 750 Q 350 480 720 220"
                fill="none"
                stroke={mapStyle === 'luxury_dark' ? '#C5A880' : '#8A6A3F'}
                strokeWidth="3.5"
                strokeDasharray="6 3"
                opacity="0.7"
              />
              {/* PR-7 Ring Road */}
              <path
                d="M 280 820 Q 550 620 760 480"
                fill="none"
                stroke={mapStyle === 'luxury_dark' ? '#3B4252' : '#C7BFB5'}
                strokeWidth="2.5"
                opacity="0.8"
              />
              {/* NH-44 Grand Trunk Highway */}
              <path
                d="M 80 200 L 750 850"
                fill="none"
                stroke={mapStyle === 'luxury_dark' ? '#2E3440' : '#D8D2C8'}
                strokeWidth="2"
                opacity="0.6"
              />

              {/* Sector Boundary Grids */}
              <rect x="250" y="320" width="160" height="130" fill="none" stroke={mapStyle === 'luxury_dark' ? 'rgba(197, 168, 128, 0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
              <rect x="420" y="380" width="180" height="140" fill="none" stroke={mapStyle === 'luxury_dark' ? 'rgba(197, 168, 128, 0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
              <rect x="180" y="470" width="140" height="150" fill="none" stroke={mapStyle === 'luxury_dark' ? 'rgba(197, 168, 128, 0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />

              {/* Highway labels */}
              <text x="380" y="410" fill={mapStyle === 'luxury_dark' ? '#78726E' : '#8C827A'} fontSize="11" letterSpacing="2" fontFamily="monospace">
                200 FT AIRPORT EXPRESSWAY
              </text>
              <text x="260" y="340" fill={mapStyle === 'luxury_dark' ? '#8A8480' : '#8C827A'} fontSize="10" letterSpacing="1.5" fontFamily="monospace">
                SECTOR 70 / 68 CIVIC CORE
              </text>
              <text x="430" y="405" fill={mapStyle === 'luxury_dark' ? '#8A8480' : '#8C827A'} fontSize="10" letterSpacing="1.5" fontFamily="monospace">
                AEROCITY BOULEVARD
              </text>
              <text x="200" y="495" fill={mapStyle === 'luxury_dark' ? '#8A8480' : '#8C827A'} fontSize="10" letterSpacing="1.5" fontFamily="monospace">
                IT CITY SECTOR 82
              </text>
            </svg>

            {/* Interactive Pins for each listing */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {properties.map((prop, idx) => {
                // Approximate visual coordinate positions distributed nicely across sectors
                const positions = [
                  { top: '35%', left: '48%' }, // Penthouse Aerocity
                  { top: '56%', left: '32%' }, // Sovereign Villa IT City
                  { top: '40%', left: '38%' }, // Kothi Sector 70
                  { top: '48%', left: '30%' }, // SCO Sector 82
                  { top: '38%', left: '58%' }, // Plot Aerocity Block C
                  { top: '62%', left: '68%' }, // Flat PR-7 Zirakpur
                  { top: '75%', left: '22%' }, // Land Ludhiana
                ];

                const pos = positions[idx % positions.length];
                const isSelected = activePinProperty?.id === prop.id;

                return (
                  <div
                    key={prop.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                    onClick={() => onSelectProperty(prop)}
                    onMouseEnter={() => setHoveredId(prop.id)}
                  >
                    <div className="flex flex-col items-center">
                      {/* Price badge pin */}
                      <div
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-xl transition-all duration-300 flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#C5A880] text-[#0B0D11] scale-110 ring-4 ring-[#C5A880]/30 shadow-2xl z-30'
                            : mapStyle === 'luxury_dark'
                            ? 'bg-[#14181F] text-white border border-white/20 hover:border-[#C5A880] hover:scale-105'
                            : 'bg-white text-[#14181F] border border-[#D8D2C8] hover:border-[#C5A880] hover:scale-105'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                        <span>{formatIndianCurrency(prop.expectedPrice)}</span>
                      </div>

                      {/* Needle */}
                      <div className={`w-0.5 h-3 ${isSelected ? 'bg-[#C5A880]' : 'bg-white/40'}`}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Floating Active Property Card Overlay */}
            {activePinProperty && (
              <div className="absolute bottom-4 left-4 right-4 z-30">
                <div
                  onClick={() => onSelectProperty(activePinProperty)}
                  className="bg-[#14181F]/95 backdrop-blur-md border border-[#C5A880]/40 rounded-xl p-3.5 text-white flex items-center justify-between gap-4 cursor-pointer shadow-2xl hover:border-[#C5A880] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activePinProperty.photos[0]}
                      alt={activePinProperty.subType}
                      className="w-16 h-14 object-cover rounded-lg shrink-0 border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold">
                        {activePinProperty.localitySector}, {activePinProperty.city}
                      </div>
                      <h4 className="text-xs sm:text-sm font-serif-luxury font-bold truncate text-[#FBFBF9]">
                        {activePinProperty.subType}
                      </h4>
                      <div className="text-xs font-bold text-[#C5A880] font-mono mt-0.5">
                        {formatIndianCurrency(activePinProperty.expectedPrice)}
                        <span className="text-[10px] text-[#8A8480] font-normal ml-1">
                          · {activePinProperty.areaValue} {activePinProperty.areaUnit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProperty(activePinProperty);
                      }}
                      className="px-3 py-1.5 bg-[#C5A880] text-[#0B0D11] text-xs font-semibold rounded-lg hover:bg-[#B5966B] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
