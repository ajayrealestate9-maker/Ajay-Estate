import React, { useState } from 'react';
import { founderImg, villaImg, penthouseImg } from '../data/mockProperties';
import {
  ShieldCheck,
  Building,
  Award,
  Globe2,
  PhoneCall,
  Mail,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
} from 'lucide-react';

interface AboutLeadershipViewProps {
  onScheduleConsultation?: () => void;
  onExploreProperties?: () => void;
}

export const AboutLeadershipView: React.FC<AboutLeadershipViewProps> = ({
  onScheduleConsultation,
  onExploreProperties,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [consultationData, setConsultationData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Acquisition of Luxury Estate',
    timeline: 'Immediate / Next 30 Days',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-[#FBFBF9] text-[#14181F] min-h-screen">
      {/* Editorial Header */}
      <section className="bg-[#0B0D11] text-white py-16 sm:py-24 border-b border-[#232932]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#C5A880] font-medium">
              <span className="w-8 h-[1px] bg-[#C5A880]" />
              <span>Heritage &amp; Leadership</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif-luxury font-normal tracking-tight text-[#FBFBF9] leading-tight">
              A Legacy of Discretion, Distinction, and Unrivaled Access.
            </h1>
            <p className="text-[#A59F9A] text-base sm:text-lg font-light leading-relaxed">
              Founded on the belief that acquiring rare architectural real estate requires more than a transaction—it demands seasoned foresight, legal rigor, and total client confidentiality.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait Column */}
          <div className="lg:col-span-5">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#C5A880]/30 to-transparent rounded-sm opacity-50 blur-xs"></div>
              <div className="relative overflow-hidden bg-[#14181F] aspect-[4/5] border border-[#E8E5DD] shadow-xl">
                <img
                  src={founderImg}
                  alt="Ajay Sharma, Founder & Principal Advisor"
                  className="w-full h-full object-cover grayscale-15 group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <h3 className="font-serif-luxury text-2xl font-bold">Ajay Sharma</h3>
                  <p className="text-xs uppercase tracking-widest text-[#C5A880]">
                    Founder &amp; Principal Private Advisor
                  </p>
                  <p className="text-[11px] text-[#A59F9A] font-light">
                    Over 18 years shaping premier estate acquisitions across Punjab &amp; Tri-City
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Biography Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
                From the Founder’s Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-normal text-[#14181F] leading-tight">
                "Real luxury is not ostentation. It is the peace of mind knowing your estate is legally immaculate and architecturally irreplaceable."
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#5A554E] leading-relaxed font-light">
              <p>
                At Ajay Estate, we operate not merely as brokers, but as trusted fiduciaries for high-net-worth families, enterprise leaders, and non-resident investors seeking exceptional residences and high-yielding commercial acquisitions.
              </p>
              <p>
                Having navigated the rapid expansion of Chandigarh, Mohali (IT City, Aerocity), and the Grand Trunk industrial corridor, we have built a reputation on vetting every title deed, verifying registry clearances with zero encumbrances, and preserving the privacy of both buyer and seller.
              </p>
              <p>
                Our private client office curates fewer than fifty signature properties at any one time—ensuring that every estate we present represents the pinnacle of craftsmanship, location, and long-term liquidity.
              </p>
            </div>

            {/* Quick credentials */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E8E5DD]">
              <div>
                <span className="font-serif-luxury text-2xl font-bold text-[#14181F] block">18+ Years</span>
                <span className="text-xs text-[#8C827A] block">Market Leadership</span>
              </div>
              <div>
                <span className="font-serif-luxury text-2xl font-bold text-[#C5A880] block">100%</span>
                <span className="text-xs text-[#8C827A] block">Freehold Title Audits</span>
              </div>
              <div>
                <span className="font-serif-luxury text-2xl font-bold text-[#14181F] block">1,200+</span>
                <span className="text-xs text-[#8C827A] block">Private Closings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke Client Services */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#E8E5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Bespoke Advisory Practice
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-normal text-[#14181F]">
              Comprehensive Fiduciary Services
            </h2>
            <p className="text-xs sm:text-sm text-[#8C827A] leading-relaxed">
              Every mandate is handled with institutional discipline, discreet negotiation, and deep localized knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#E8E5DD] hover:border-[#C5A880] transition-colors space-y-4 bg-[#FBFBF9]">
              <div className="w-12 h-12 bg-[#14181F] text-[#C5A880] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-luxury font-semibold text-[#14181F]">
                Off-Market Acquisitions
              </h3>
              <p className="text-xs text-[#5A554E] leading-relaxed font-light">
                Direct access to trophy residences and ancestral properties that never appear on public portals. Discretion guaranteed under strict non-disclosure agreements.
              </p>
            </div>

            <div className="p-8 border border-[#E8E5DD] hover:border-[#C5A880] transition-colors space-y-4 bg-[#FBFBF9]">
              <div className="w-12 h-12 bg-[#14181F] text-[#C5A880] flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-luxury font-semibold text-[#14181F]">
                Global NRI Family Concierge
              </h3>
              <p className="text-xs text-[#5A554E] leading-relaxed font-light">
                End-to-end representation for overseas clients across the UK, Canada, the US, and UAE. From power of attorney structuring to legal title verification and repatriation.
              </p>
            </div>

            <div className="p-8 border border-[#E8E5DD] hover:border-[#C5A880] transition-colors space-y-4 bg-[#FBFBF9]">
              <div className="w-12 h-12 bg-[#14181F] text-[#C5A880] flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-luxury font-semibold text-[#14181F]">
                Commercial SCO &amp; Portfolio Growth
              </h3>
              <p className="text-xs text-[#5A554E] leading-relaxed font-light">
                High-yield commercial properties, banking hub tenancies, and high-street retail showrooms positioned along the expanding 200ft Airport Road and PR-7 rings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Private Consultation Booking Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-[#14181F] text-white p-8 sm:p-12 border border-[#232932] shadow-2xl relative">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
                Private Office
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-normal">
                Schedule a Confidential Advisory Session
              </h2>
              <p className="text-xs text-[#A59F9A] leading-relaxed">
                Connect directly with Ajay Sharma and our senior estate advisors. All consultations are held in strict confidence.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 bg-white/5 border border-[#C5A880]/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C5A880] mx-auto" />
                <h4 className="text-lg font-serif-luxury font-semibold text-white">
                  Consultation Request Received
                </h4>
                <p className="text-xs text-[#C5BEB8] max-w-md mx-auto leading-relaxed">
                  Thank you, {consultationData.name}. Ajay Sharma’s executive office will contact you within 4 business hours to arrange your private consultation.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-[#14181F] bg-[#C5A880] hover:bg-[#B5966B] transition-colors cursor-pointer"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A59F9A] font-medium mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={consultationData.name}
                      onChange={(e) => setConsultationData({ ...consultationData, name: e.target.value })}
                      placeholder="e.g. Vikramaditya Singh"
                      className="w-full bg-[#0B0D11] border border-white/10 rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#C5A880] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A59F9A] font-medium mb-1">
                      Direct Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={consultationData.phone}
                      onChange={(e) => setConsultationData({ ...consultationData, phone: e.target.value })}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full bg-[#0B0D11] border border-white/10 rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#C5A880] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A59F9A] font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={consultationData.email}
                      onChange={(e) => setConsultationData({ ...consultationData, email: e.target.value })}
                      placeholder="advisory@familyoffice.com"
                      className="w-full bg-[#0B0D11] border border-white/10 rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#C5A880] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A59F9A] font-medium mb-1">
                      Primary Advisory Objective
                    </label>
                    <select
                      value={consultationData.interest}
                      onChange={(e) => setConsultationData({ ...consultationData, interest: e.target.value })}
                      className="w-full bg-[#0B0D11] border border-white/10 rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#C5A880] transition-colors cursor-pointer"
                    >
                      <option>Acquisition of Ultra-Luxury Residence</option>
                      <option>Off-Market Trophy Estate Sale</option>
                      <option>Commercial SCO &amp; High-Yield Investment</option>
                      <option>NRI Estate &amp; Title Verification</option>
                      <option>Agricultural / Farmhouse Land Acquisition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A59F9A] font-medium mb-1">
                    Confidential Requirements / Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={consultationData.notes}
                    onChange={(e) => setConsultationData({ ...consultationData, notes: e.target.value })}
                    placeholder="Provide any specific location preferences (e.g. Mohali Aerocity, Sector 70, Chandigarh) or budget expectations..."
                    className="w-full bg-[#0B0D11] border border-white/10 rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#C5A880] transition-colors"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#C5A880] hover:bg-[#B5966B] text-[#0B0D11] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg"
                  >
                    Submit Confidential Inquiry
                  </button>
                  <p className="text-[10px] text-center text-[#8A8480] mt-2">
                    Protected by Ajay Estate strict client non-disclosure protocols.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
