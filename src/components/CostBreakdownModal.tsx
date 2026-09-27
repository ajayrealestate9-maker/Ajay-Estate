import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, CheckCircle2, Info, ArrowRight, Building2, Percent, IndianRupee } from 'lucide-react';
import { formatIndianCurrency } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface CostBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrice?: number;
}

export const CostBreakdownModal: React.FC<CostBreakdownModalProps> = ({
  isOpen,
  onClose,
  defaultPrice = 38500000,
}) => {
  const { language } = useApp();
  const [propertyPrice, setPropertyPrice] = useState<number>(defaultPrice);
  const [buyerType, setBuyerType] = useState<'male' | 'female' | 'joint'>('male');
  const [includeBrokerage, setIncludeBrokerage] = useState<boolean>(true);
  const [brokeragePercent, setBrokeragePercent] = useState<number>(1.0);

  if (!isOpen) return null;

  // Punjab & North India Stamp Duty Rules:
  // Male buyer: 7% (5% Stamp Duty + 1% Infrastructure Development Cess + 1% Municipal / Local Cess)
  // Female buyer: 6% (Govt of Punjab special 1% concession for female registered property buyers)
  // Joint buyer (Male + Female): 6.5%
  const stampDutyRate = buyerType === 'female' ? 0.06 : buyerType === 'joint' ? 0.065 : 0.07;
  const stampDutyAmount = propertyPrice * stampDutyRate;

  // Registration Fee in Punjab: 1%
  const registrationFee = propertyPrice * 0.01;

  // Mutation / Tehsil Facilitation Fee (approx fixed)
  const mutationAndLegalFee = 3500;

  // Brokerage / Mediator Fee (if applicable)
  const mediatorFee = includeBrokerage ? propertyPrice * (brokeragePercent / 100) : 0;

  // Total Land/Property Acquisition Cost
  const totalCost = propertyPrice + stampDutyAmount + registrationFee + mutationAndLegalFee + mediatorFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                Property Cost &amp; Registration Fee Calculator
              </h2>
              <p className="text-xs text-stone-500">
                Transparent Platform Pricing &amp; Punjab Government Stamp Duty Breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Section 1: ZameenKothi Platform Pricing Transparency */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ZameenKothi Portal Cost: 100% Free for Direct Users</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-emerald-800">
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                <span className="font-bold block text-emerald-900">₹0 For Buyers</span>
                <span>Free search, alerts, auto-matchmaking &amp; direct chats</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                <span className="font-bold block text-emerald-900">₹0 For Owners</span>
                <span>List Land, Plot, Kothi, SCO &amp; Flats with zero listing fee</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                <span className="font-bold block text-emerald-900">Standard 1% Brokerage</span>
                <span>Only if you hire a certified Mediator / Agent for closing</span>
              </div>
            </div>
          </div>

          {/* Section 2: Property Value & Stamp Duty Calculator */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Calculate Total Acquisition Cost (Punjab Stamp Duty &amp; Registry)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Property Agreed Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-mono text-sm">₹</span>
                  <input
                    type="number"
                    step={100000}
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg text-sm font-mono font-bold text-stone-900"
                  />
                </div>
                <span className="text-[11px] text-amber-800 font-medium block mt-1">
                  {formatIndianCurrency(propertyPrice)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Buyer Registration Category
                </label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="male">Male Buyer (7% Stamp Duty + Cess)</option>
                  <option value="female">Female Buyer (6% - 1% Govt Concession!)</option>
                  <option value="joint">Joint: Male + Female (6.5%)</option>
                </select>
                <span className="text-[11px] text-stone-500 block mt-1">
                  {buyerType === 'female' ? '✓ Eligible for 1% Punjab Women Concession' : 'Standard Punjab Revenue Department Rates'}
                </span>
              </div>
            </div>

            {/* Optional Mediator Checkbox */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={includeBrokerage}
                  onChange={(e) => setIncludeBrokerage(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300"
                />
                <span>Include Mediator / Agent Commission</span>
              </label>

              {includeBrokerage && (
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500">Rate:</span>
                  <select
                    value={brokeragePercent}
                    onChange={(e) => setBrokeragePercent(parseFloat(e.target.value))}
                    className="px-2 py-1 bg-white border border-stone-300 rounded text-xs font-semibold"
                  >
                    <option value={0.5}>0.5%</option>
                    <option value={1.0}>1.0% (Standard)</option>
                    <option value={1.5}>1.5%</option>
                    <option value={2.0}>2.0%</option>
                  </select>
                </div>
              )}
            </div>

            {/* Complete Itemized Cost Breakdown Sheet */}
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-stone-100 px-4 py-2.5 font-bold text-stone-700 flex justify-between">
                <span>Expense Item</span>
                <span>Estimated Amount (₹)</span>
              </div>

              <div className="divide-y divide-stone-100 p-2">
                <div className="flex items-center justify-between py-2 px-2">
                  <span className="text-stone-700">1. Agreed Property Base Price</span>
                  <span className="font-mono font-bold text-stone-900">{formatIndianCurrency(propertyPrice)}</span>
                </div>

                <div className="flex items-center justify-between py-2 px-2">
                  <div>
                    <span className="text-stone-700 block">2. Punjab Stamp Duty &amp; Cesses ({(stampDutyRate * 100).toFixed(1)}%)</span>
                    <span className="text-[10px] text-stone-400">Stamp Duty (5%) + Infra Cess (1%) + Municipal Cess (1%)</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">{formatIndianCurrency(stampDutyAmount)}</span>
                </div>

                <div className="flex items-center justify-between py-2 px-2">
                  <div>
                    <span className="text-stone-700 block">3. Sub-Registrar / Tehsil Registration Fee (1%)</span>
                    <span className="text-[10px] text-stone-400">Official government deed registration fee</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">{formatIndianCurrency(registrationFee)}</span>
                </div>

                <div className="flex items-center justify-between py-2 px-2">
                  <div>
                    <span className="text-stone-700 block">4. Inteqal (Mutation) &amp; Document Drafting</span>
                    <span className="text-[10px] text-stone-400">Patwari record entry, deed writer, legal paperwork</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">₹ 3,500</span>
                </div>

                {includeBrokerage && (
                  <div className="flex items-center justify-between py-2 px-2 bg-amber-50/50">
                    <span className="text-stone-700">5. Mediator / Real Estate Agent Fee ({brokeragePercent}%)</span>
                    <span className="font-mono font-bold text-amber-900">{formatIndianCurrency(mediatorFee)}</span>
                  </div>
                )}
              </div>

              {/* Total Row */}
              <div className="bg-stone-900 text-white px-4 py-3.5 flex items-center justify-between font-bold text-sm">
                <div>
                  <span className="block font-display">Total Final Acquisition Outlay:</span>
                  <span className="text-[10px] text-stone-400 font-normal">All taxes, registry fees &amp; property cost included</span>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-mono text-amber-400 font-display">
                    {formatIndianCurrency(totalCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Note: Stamp duty is calculated based on collector circle rate or sale deed value, whichever is higher.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
