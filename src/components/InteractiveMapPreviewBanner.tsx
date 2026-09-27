import React from 'react';
import { MapPin, Compass, ArrowRight, Layers, Sparkles, Navigation } from 'lucide-react';

interface InteractiveMapPreviewBannerProps {
  onLaunchMap: (corridor?: string) => void;
  totalMappedCount: number;
}

export const InteractiveMapPreviewBanner: React.FC<InteractiveMapPreviewBannerProps> = ({
  onLaunchMap,
  totalMappedCount,
}) => {
  const corridors = [
    { name: 'All Corridors', filter: 'All' },
    { name: 'IT City / Aerotropolis', filter: 'IT City' },
    { name: 'Sector 70 & 82 Luxury Corridor', filter: 'Sector 70' },
    { name: 'PR-7 & Airport Expressway', filter: 'Airport' },
    { name: 'Chandigarh Core', filter: 'Sector 8' },
  ];

  return (
    <div className="bg-[#14181F] text-white border-y border-[#232932] py-10 relative overflow-hidden">
      {/* Subtle topographic decorative grid line overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Information & Title */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Interactive Geospatial Map Integration</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-normal text-[#FBFBF9]">
              Visualise Estates Across Prime Growth Corridors
            </h3>
            <p className="text-xs sm:text-sm text-[#A59F9A] font-light leading-relaxed">
              Synchronized split-screen vector map featuring live price pins, sector circles, RERA road clearances, and micro-market circle rates.
            </p>

            {/* Quick corridor filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] text-[#8C827A] uppercase tracking-wider font-semibold mr-1">
                Explore Corridors:
              </span>
              {corridors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onLaunchMap(c.filter)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#C5A880] text-xs text-[#E8E5DD] hover:text-white rounded-md transition-all cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Action Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[#0B0D11]/80 border border-white/10 p-4 sm:p-5 rounded-xl backdrop-blur-md">
            <div className="text-left sm:text-right pr-2">
              <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-bold block">
                {totalMappedCount} Prime Locations Mapped
              </span>
              <span className="text-xs text-[#A59F9A] font-light block">
                Side-by-side synchronized explorer
              </span>
            </div>

            <button
              onClick={() => onLaunchMap()}
              className="px-5 py-3 bg-[#C5A880] hover:bg-[#B5966B] text-[#0B0D11] text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg group whitespace-nowrap"
            >
              <Navigation className="w-4 h-4 text-[#0B0D11]" />
              <span>Launch Split Map</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
