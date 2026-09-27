import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyType, AreaUnit, BuyerRequirement } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import {
  ShoppingBag,
  Building2,
  Home,
  Store,
  Layers,
  Trees,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Flame,
} from 'lucide-react';

interface BuyerRequirementFormProps {
  onRequirementAdded: (req: BuyerRequirement) => void;
}

export const BuyerRequirementForm: React.FC<BuyerRequirementFormProps> = ({ onRequirementAdded }) => {
  const { currentUser, addRequirement, language, setAuthModalOpen } = useApp();

  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(['Kothi', 'Plot']);
  const [city, setCity] = useState<string>('Mohali');
  const [preferredLocalities, setPreferredLocalities] = useState<string>('Sector 70, Sector 69, Aerocity');
  const [minBudget, setMinBudget] = useState<number>(15000000); // 1.5 Cr
  const [maxBudget, setMaxBudget] = useState<number>(40000000); // 4.0 Cr
  const [desiredAreaMin, setDesiredAreaMin] = useState<number>(10);
  const [desiredAreaMax, setDesiredAreaMax] = useState<number>(20);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('Marla');
  const [bedroomsNeeded, setBedroomsNeeded] = useState<number>(4);
  const [purpose, setPurpose] = useState<'Residence' | 'Commercial' | 'Investment' | 'Agriculture'>('Residence');
  const [urgency, setUrgency] = useState<'Immediate (15 Days)' | 'Within 1 Month' | 'Within 3 Months'>('Immediate (15 Days)');
  const [notes, setNotes] = useState<string>('Looking for a modern park-facing property on wide road with clear registry title.');
  const [submittedReq, setSubmittedReq] = useState<BuyerRequirement | null>(null);

  const togglePropertyType = (type: PropertyType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.length > 1
          ? prev.filter((t) => t !== type)
          : prev
        : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const localitiesList = preferredLocalities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newReq = addRequirement({
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerMobile: currentUser.mobile,
      propertyTypes: selectedTypes,
      city,
      preferredLocalities: localitiesList.length > 0 ? localitiesList : [city],
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget),
      desiredAreaMin: Number(desiredAreaMin),
      desiredAreaMax: Number(desiredAreaMax),
      areaUnit,
      bedroomsNeeded: selectedTypes.includes('Kothi') || selectedTypes.includes('Flat') ? bedroomsNeeded : undefined,
      purpose,
      urgency,
      notes,
    });

    setSubmittedReq(newReq);
    onRequirementAdded(newReq);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-200 bg-stone-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                {language === 'pa' ? 'ਸਮੇਂ ਦੀ ਮੰਗ ਦਰਜ ਕਰੋ (Buyer Requirement)' : 'Post Buyer Requirement'}
              </h2>
              <p className="text-xs text-stone-500">
                Tell us what you want to buy (Land, Plot, Kothi, SCO, Flat). We will notify matching sellers &amp; mediators!
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Instant Auto-Match</span>
          </div>
        </div>
      </div>

      {submittedReq ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            {language === 'pa' ? 'ਤੁਹਾਡੀ ਮੰਗ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਈ ਹੈ!' : 'Requirement Successfully Posted!'}
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Our intelligent matchmaking engine has found matching properties in {city}. Review them below or submit another requirement.
          </p>
          <button
            type="button"
            onClick={() => setSubmittedReq(null)}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
          >
            Post Another Requirement
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 1. Property Types Wanted */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              1. What property type are you looking for? (ਕਿਸ ਚੀਜ਼ ਦੀ ਲੋੜ ਹੈ?) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(
                [
                  { type: 'Land', label: 'Land', pa: 'ਜ਼ਮੀਨ', icon: Trees },
                  { type: 'Plot', label: 'Plot', pa: 'ਪਲਾਟ', icon: Layers },
                  { type: 'Kothi', label: 'Kothi', pa: 'ਕੋਠੀ', icon: Home },
                  { type: 'SCO', label: 'SCO', pa: 'ਐਸ.ਸੀ.ਓ', icon: Store },
                  { type: 'Flat', label: 'Flat', pa: 'ਫਲੈਟ', icon: Building2 },
                ] as const
              ).map(({ type, label, pa, icon: Icon }) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => togglePropertyType(type)}
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600/30 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-amber-700' : 'text-stone-400'}`} />
                    <span className="text-xs font-bold text-stone-900">{label}</span>
                    <span className="text-[10px] text-stone-500">{pa}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. City & Localities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                2. Target City (ਸ਼ਹਿਰ) *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="Mohali">Mohali (SAS Nagar)</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Zirakpur">Zirakpur</option>
                <option value="Ludhiana">Ludhiana</option>
                <option value="Amritsar">Amritsar</option>
                <option value="Jalandhar">Jalandhar</option>
                <option value="Patiala">Patiala</option>
                <option value="Bathinda">Bathinda</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Preferred Sectors / Localities (ਪਸੰਦੀਦਾ ਸੈਕਟਰ / ਇਲਾਕਾ)
              </label>
              <input
                type="text"
                value={preferredLocalities}
                onChange={(e) => setPreferredLocalities(e.target.value)}
                placeholder="e.g. Sector 70, Aerocity, IT City, Model Town"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 3. Budget Range */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              3. Budget Range (ਬਜਟ ਸੀਮਾ)
            </label>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <span className="text-[11px] text-stone-500 block">Min Budget (ਘੱਟੋ-ਘੱਟ)</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-400 text-xs">₹</span>
                  <input
                    type="number"
                    step={100000}
                    value={minBudget}
                    onChange={(e) => setMinBudget(parseFloat(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1.5 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <span className="text-[11px] text-amber-800 font-medium">{formatIndianCurrency(minBudget)}</span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block">Max Budget (ਵੱਧ ਤੋਂ ਵੱਧ)</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-400 text-xs">₹</span>
                  <input
                    type="number"
                    step={100000}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(parseFloat(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1.5 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <span className="text-[11px] text-amber-800 font-medium">{formatIndianCurrency(maxBudget)}</span>
              </div>
            </div>
          </div>

          {/* 4. Area Range & Unit */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              4. Desired Area Size &amp; Unit (ਰਕਬਾ)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-stone-500 block">Min Area</span>
                <input
                  type="number"
                  min={0.1}
                  step="any"
                  value={desiredAreaMin}
                  onChange={(e) => setDesiredAreaMin(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block">Max Area</span>
                <input
                  type="number"
                  min={0.1}
                  step="any"
                  value={desiredAreaMax}
                  onChange={(e) => setDesiredAreaMax(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block">Area Unit</span>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                  className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
                >
                  <option value="Marla">Marla (ਮਰਲਾ)</option>
                  <option value="Kanal">Kanal (ਕਨਾਲ)</option>
                  <option value="Gaj">Gaj (ਗਜ਼)</option>
                  <option value="Sq.Ft">Sq.Ft</option>
                  <option value="Acre">Acre (ਏਕੜ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Purpose & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1">Purpose (ਮਨੋਰਥ)</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
              >
                <option value="Residence">Residence (ਰਹਿਣ ਲਈ)</option>
                <option value="Commercial">Commercial (ਦੁਕਾਨ / ਵਪਾਰ)</option>
                <option value="Investment">Investment (ਮੁਨਾਫਾ / ਕਿਰਾਇਆ)</option>
                <option value="Agriculture">Agriculture (ਖੇਤੀਬਾੜੀ)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Timeline / Urgency (ਲੋੜ ਕਦੋਂ ਹੈ?)</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
              >
                <option value="Immediate (15 Days)">Immediate (15 ਦਿਨਾਂ ਦੇ ਅੰਦਰ)</option>
                <option value="Within 1 Month">Within 1 Month (1 ਮਹੀਨੇ ਵਿੱਚ)</option>
                <option value="Within 3 Months">Within 3 Months (ਆਰਾਮ ਨਾਲ)</option>
              </select>
            </div>
          </div>

          {/* Submit requirement */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <span>{language === 'pa' ? 'ਸਮੇਂ ਦੀ ਮੰਗ ਦਰਜ ਕਰੋ (Post Requirement)' : 'Post Requirement & Find Matches'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
