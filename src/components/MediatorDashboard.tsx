import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIndianCurrency } from '../utils/formatters';
import {
  Briefcase,
  Users,
  Building2,
  Sparkles,
  MessageSquare,
  Calculator,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { PropertyListing, BuyerRequirement } from '../types';

export const MediatorDashboard: React.FC = () => {
  const { properties, requirements, language, currentUser } = useApp();

  // Commission calculator state
  const [dealValue, setDealValue] = useState<number>(38500000); // 3.85 Cr
  const [commissionPercent, setCommissionPercent] = useState<number>(1); // 1% per side (buyer + seller = 2%)
  const [dealSides, setDealSides] = useState<number>(2); // both buyer & seller

  const totalCommission = (dealValue * (commissionPercent / 100)) * dealSides;

  // Compute matches between all requirements and all properties
  const matches: { req: BuyerRequirement; prop: PropertyListing; score: number }[] = [];

  requirements.forEach((req) => {
    properties.forEach((prop) => {
      if (req.propertyTypes.includes(prop.propertyType)) {
        let score = 50;
        if (prop.city.toLowerCase() === req.city.toLowerCase()) score += 25;
        if (prop.expectedPrice >= req.minBudget && prop.expectedPrice <= req.maxBudget) score += 25;
        if (score >= 60) {
          matches.push({ req, prop, score });
        }
      }
    });
  });

  const handleBridgeParties = (match: { req: BuyerRequirement; prop: PropertyListing }) => {
    const text = encodeURIComponent(
      `Sat Sri Akal / Hello, I am mediator ${currentUser?.name || 'Property Dealer'}. I have connected Buyer ${match.req.buyerName} (+91 ${match.req.buyerMobile}) with Seller ${match.prop.sellerName} (+91 ${match.prop.sellerMobile}) for property: "${match.prop.subType}" in ${match.prop.city} priced at ${formatIndianCurrency(match.prop.expectedPrice)}. Let's coordinate the site visit.`
    );
    window.open(`https://wa.me/91${match.req.buyerMobile}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਡੀਲਰ / ਵਿਚੋਲਾ ਪੈਨਲ' : 'Mediator & Agent Brokerage Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
            {language === 'pa' ? 'ਗਾਹਕ ਅਤੇ ਪ੍ਰਾਪਰਟੀ ਮੈਚਮੇਕਿੰਗ ਡੈਸਕ' : 'Buyer & Seller Matchmaking Desk'}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
            Empowering real estate agents, brokers, and mediators across Punjab to bridge buyers with verified property owners, close deals faster, and track commissions.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-stone-800 pt-4 md:pt-0 md:pl-6 text-xs shrink-0">
          <div>
            <span className="text-stone-400 block">Active Listings</span>
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">{properties.length}</span>
          </div>
          <div>
            <span className="text-stone-400 block">Buyer Reqs</span>
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">{requirements.length}</span>
          </div>
          <div>
            <span className="text-stone-400 block">Smart Matches</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">{matches.length}</span>
          </div>
        </div>
      </div>

      {/* Grid: Matchmaking Table & Commission Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Smart Matchmaking Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Automated Deal Matches (ਸੌਦੇ ਮਿਲਾਓ)
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">{matches.length} Ready Matches</span>
          </div>

          <div className="space-y-3">
            {matches.map((match, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 p-4 hover:border-stone-300 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900 bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      {match.score}% Deal Fit
                    </span>
                    <span className="text-xs text-stone-500">{match.prop.city}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs font-semibold text-stone-700">{match.prop.propertyType}</span>
                  </div>

                  <div className="text-xs text-stone-800">
                    <strong>Buyer:</strong> {match.req.buyerName} looking for {match.req.propertyTypes.join(', ')} in budget {formatIndianCurrency(match.req.maxBudget)}
                  </div>

                  <div className="text-xs text-stone-600">
                    <strong>Seller Listing:</strong> {match.prop.subType} ({formatIndianCurrency(match.prop.expectedPrice)}) - Listed by {match.prop.sellerName}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Est. Deal Commission (2%)</span>
                    <span className="text-sm font-bold text-emerald-700 font-mono">
                      {formatIndianCurrency(match.prop.expectedPrice * 0.02)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBridgeParties(match)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Connect Parties</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Commission Calculator & Verified Agent Credentials */}
        <div className="space-y-6">
          {/* Commission Calculator */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Calculator className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">Brokerage / Commission Calculator</h3>
                <span className="text-[11px] text-stone-500">Standard North India Real Estate Rates</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Deal Value (ਸੌਦੇ ਦੀ ਰਕਮ ₹)</label>
                <input
                  type="number"
                  step={100000}
                  value={dealValue}
                  onChange={(e) => setDealValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono font-bold"
                />
                <span className="text-[11px] text-amber-800 font-medium">{formatIndianCurrency(dealValue)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Rate Per Side (%)</label>
                  <select
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value={0.5}>0.5%</option>
                    <option value={1}>1.0% (Standard)</option>
                    <option value={1.5}>1.5%</option>
                    <option value={2}>2.0%</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Charging Sides</label>
                  <select
                    value={dealSides}
                    onChange={(e) => setDealSides(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value={2}>Both Sides (Buyer + Seller)</option>
                    <option value={1}>One Side Only</option>
                  </select>
                </div>
              </div>

              {/* Commission Result Box */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[11px] text-emerald-800 font-semibold block">Total Estimated Brokerage:</span>
                <div className="text-xl font-bold text-emerald-900 font-mono">
                  {formatIndianCurrency(totalCommission)}
                </div>
                <div className="text-[10px] text-emerald-700">
                  Calculated at {commissionPercent}% × {dealSides} side(s) on {formatIndianCurrency(dealValue)}
                </div>
              </div>
            </div>
          </div>

          {/* Deal Stage Pipeline */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Deal Closing Pipeline</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-700">1. Requirement Matched</span>
                <span className="text-emerald-700 font-bold">Done</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-700">2. Site Visit (ਮੌਕਾ ਦੇਖਣਾ)</span>
                <span className="text-amber-700 font-bold">In Progress</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-700">3. Bayana / Token Money</span>
                <span className="text-stone-400">Upcoming</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-700">4. Tehsil Registry &amp; NOC</span>
                <span className="text-stone-400">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
