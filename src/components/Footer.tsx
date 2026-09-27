import React from 'react';
import { ShieldCheck, Phone, Mail, Award, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0D11] text-[#A59F9A] text-xs border-t border-[#232932]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="space-y-1">
              <span className="text-2xl font-serif-luxury font-bold text-[#FBFBF9] block">
                Ajay Estate
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-medium block">
                Private Real Estate Advisory
              </span>
            </div>
            <p className="text-xs text-[#8A8480] leading-relaxed font-light">
              Representing exceptional architectural estates, private penthouses, and bespoke commercial investments across Chandigarh, Mohali, and global family offices.
            </p>
            <div className="flex items-center gap-2 text-[#C5A880] text-[11px] font-medium pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Discreet &amp; Confidential Transactions</span>
            </div>
          </div>

          {/* Signature Portfolios */}
          <div className="space-y-3">
            <h4 className="text-[#FBFBF9] font-serif-luxury text-sm font-semibold tracking-wider uppercase">
              Signature Portfolios
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#8A8480]">
              <li><span className="hover:text-[#C5A880] transition-colors cursor-pointer">Sky Penthouses &amp; Duplexes</span></li>
              <li><span className="hover:text-[#C5A880] transition-colors cursor-pointer">Architectural Villas &amp; Kothis (1–2 Kanal)</span></li>
              <li><span className="hover:text-[#C5A880] transition-colors cursor-pointer">Prime Commercial Flagships (200ft Airport Rd)</span></li>
              <li><span className="hover:text-[#C5A880] transition-colors cursor-pointer">Heritage Agricultural &amp; Farmhouse Retreats</span></li>
              <li><span className="hover:text-[#C5A880] transition-colors cursor-pointer">Off-Market Private Mandates</span></li>
            </ul>
          </div>

          {/* Prime Territories */}
          <div className="space-y-3">
            <h4 className="text-[#FBFBF9] font-serif-luxury text-sm font-semibold tracking-wider uppercase">
              Prime Territories
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#8A8480]">
              <li><span>Mohali (IT City Sector 82 &amp; Aerocity Boulevard)</span></li>
              <li><span>Chandigarh (Sectors 4, 8, 9, 10 &amp; 33)</span></li>
              <li><span>Zirakpur PR-7 Airport Expressway</span></li>
              <li><span>Ludhiana South City &amp; Grand Trunk Corridor</span></li>
              <li><span>Overseas NRI Client Desks (UK, Canada, UAE)</span></li>
            </ul>
          </div>

          {/* Private Office Contact */}
          <div className="space-y-3">
            <h4 className="text-[#FBFBF9] font-serif-luxury text-sm font-semibold tracking-wider uppercase">
              Private Office
            </h4>
            <div className="space-y-2.5 text-xs text-[#8A8480] font-light">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-[#FBFBF9] font-mono">+91 98140-12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>concierge@ajayestate.com</span>
              </div>
              <p className="text-[11px] text-[#78726E] pt-2 leading-relaxed">
                Headquarters: Aerocity Boulevard Tower, Mohali, Punjab · By appointment only.
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-[#232932] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78726E]">
          <div>
            © {new Date().getFullYear()} Ajay Estate. All rights reserved. RERA Registered Brokerage &amp; Advisory.
          </div>
          <div className="flex gap-5">
            <span className="hover:text-[#A59F9A] cursor-pointer">Discretion Policy</span>
            <span className="hover:text-[#A59F9A] cursor-pointer">RERA Compliance</span>
            <span className="hover:text-[#A59F9A] cursor-pointer">Title Due Diligence Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
