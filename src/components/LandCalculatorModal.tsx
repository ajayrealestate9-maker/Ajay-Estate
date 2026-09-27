import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft, Check } from 'lucide-react';
import { AreaUnit } from '../types';
import { convertArea } from '../utils/formatters';

interface LandCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LandCalculatorModal: React.FC<LandCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [val, setVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<AreaUnit>('Kanal');

  if (!isOpen) return null;

  const units: AreaUnit[] = ['Marla', 'Kanal', 'Gaj', 'Sq.Ft', 'Acre', 'Bigha'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                Punjab Land Measurement Calculator
              </h3>
              <p className="text-xs text-stone-500">ਮਰਲਾ, ਕਨਾਲ, ਗਜ਼, ਏਕੜ ਅਤੇ ਬਿੱਘਾ ਰੂਪਾਂਤਰਨ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Unit */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Enter Quantity</label>
              <input
                type="number"
                step="any"
                min={0.01}
                value={val}
                onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">From Unit</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as AreaUnit)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="Marla">Marla (ਮਰਲਾ)</option>
                <option value="Kanal">Kanal (ਕਨਾਲ)</option>
                <option value="Gaj">Gaj / Sq.Yards (ਗਜ਼)</option>
                <option value="Sq.Ft">Sq.Ft (ਸਕੁਏਅਰ ਫੁੱਟ)</option>
                <option value="Acre">Acre / Killa (ਏਕੜ / ਕਿੱਲਾ)</option>
                <option value="Bigha">Bigha (ਬਿੱਘਾ)</option>
              </select>
            </div>
          </div>

          {/* Results Matrix */}
          <div>
            <span className="block text-xs font-bold text-stone-800 mb-2">Equivalent Values:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {units.map((u) => {
                const converted = convertArea(val, fromUnit, u);
                const isSelected = u === fromUnit;
                return (
                  <div
                    key={u}
                    className={`p-3 rounded-lg border ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 text-amber-900'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold">{u}</span>
                    <span className="text-base font-bold font-mono">{converted}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standard Revenue Benchmarks in Punjab */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
            <span className="font-bold text-stone-900 block">Punjab Revenue Standards:</span>
            <p>· 1 Kanal = 20 Marla = 500 Gaj (GMADA / Urban standard) or 605 Gaj (rural)</p>
            <p>· 1 Acre (Killa) = 8 Kanal = 160 Marla = 4,840 Gaj = 43,560 Sq.Ft</p>
            <p>· 1 Bigha ≈ 4 Kanal (Half Acre)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
