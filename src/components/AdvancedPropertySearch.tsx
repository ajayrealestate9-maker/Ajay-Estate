import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Building2,
  MapPin,
  Compass,
  LayoutGrid,
  List,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { PropertyType, AreaUnit, SortOption, SearchFilterState } from '../types';
import { formatIndianCurrency } from '../utils/formatters';

interface AdvancedPropertySearchProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
  viewMode: 'grid' | 'list' | 'map';
  onToggleViewMode: (mode: 'grid' | 'list' | 'map') => void;
}

export const AdvancedPropertySearch: React.FC<AdvancedPropertySearchProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  viewMode,
  onToggleViewMode,
}) => {
  const [showAdvancedFacets, setShowAdvancedFacets] = useState<boolean>(false);

  const update = (key: keyof SearchFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const togglePropertyType = (type: PropertyType) => {
    const list = [...filters.propertyTypes];
    const index = list.indexOf(type);
    if (index > -1) {
      if (list.length > 1) list.splice(index, 1);
    } else {
      list.push(type);
    }
    update('propertyTypes', list);
  };

  const hasActiveFilters =
    filters.keyword.trim() !== '' ||
    filters.propertyTypes.length < 5 ||
    filters.city !== 'All' ||
    filters.locality.trim() !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100000000 ||
    filters.minArea > 0 ||
    filters.maxArea < 10000 ||
    filters.facing !== 'All' ||
    filters.minRoadWidthFt > 0 ||
    filters.negotiableOnly;

  return (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {/* ROW 1: Keyword Search Bar & Sort Dropdown */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Main Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => update('keyword', e.target.value)}
              placeholder="Search by locality (Sector 70, Aerocity), title, landmarks, or features..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-stone-900"
            />
            {filters.keyword && (
              <button
                type="button"
                onClick={() => update('keyword', '')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Controls: City + Sort Dropdown + Advanced Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* City Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <select
                value={filters.city}
                onChange={(e) => update('city', e.target.value)}
                className="bg-transparent font-semibold text-stone-800 focus:outline-hidden text-xs"
              >
                <option value="All">All Punjab Cities</option>
                <option value="Mohali">Mohali (SAS Nagar)</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Zirakpur">Zirakpur</option>
                <option value="Ludhiana">Ludhiana</option>
                <option value="Amritsar">Amritsar</option>
                <option value="Jalandhar">Jalandhar</option>
                <option value="Patiala">Patiala</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => update('sortBy', e.target.value as SortOption)}
                className="bg-transparent font-semibold text-stone-800 focus:outline-hidden text-xs"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="date_desc">Newest Listings</option>
                <option value="area_desc">Area: Large to Small</option>
                <option value="area_asc">Area: Small to Large</option>
              </select>
            </div>

            {/* Toggle Advanced Facets */}
            <button
              type="button"
              onClick={() => setShowAdvancedFacets(!showAdvancedFacets)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors shrink-0 ${
                showAdvancedFacets
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Grid / List / Map View Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => onToggleViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('map')}
                className={`px-2 py-1.5 rounded-lg transition-colors text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-[#C5A880] shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Interactive Split Map"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[11px]">Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Property Type Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
          <span className="text-stone-400 font-medium shrink-0">Type:</span>
          {(['Kothi', 'Plot', 'SCO', 'Flat', 'Land'] as const).map((type) => {
            const isSelected = filters.propertyTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => togglePropertyType(type)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type}
              </button>
            );
          })}

          <div className="h-4 w-px bg-stone-300 mx-2 shrink-0"></div>

          {/* Quick Price Bracket Chips */}
          <span className="text-stone-400 font-medium shrink-0">Budget:</span>
          {[
            { label: 'All', min: 0, max: 100000000 },
            { label: '< ₹1 Cr', min: 0, max: 10000000 },
            { label: '₹1 - 2.5 Cr', min: 10000000, max: 25000000 },
            { label: '₹2.5 - 5 Cr', min: 25000000, max: 50000000 },
            { label: '₹5 Cr+', min: 50000000, max: 100000000 },
          ].map((bracket, idx) => {
            const isSelected = filters.minPrice === bracket.min && filters.maxPrice === bracket.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    minPrice: bracket.min,
                    maxPrice: bracket.max,
                  });
                }}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {bracket.label}
              </button>
            );
          })}
        </div>

        {/* EXPANDABLE ADVANCED FACETS DRAWER */}
        {showAdvancedFacets && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Area Range + Unit */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">Area Range &amp; Unit</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    value={filters.minArea || ''}
                    onChange={(e) => update('minArea', parseFloat(e.target.value) || 0)}
                    placeholder="Min"
                    className="w-1/2 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                  <span className="text-stone-400">to</span>
                  <input
                    type="number"
                    min={0}
                    value={filters.maxArea === 10000 ? '' : filters.maxArea}
                    onChange={(e) => update('maxArea', parseFloat(e.target.value) || 10000)}
                    placeholder="Max"
                    className="w-1/2 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div className="mt-1.5">
                  <select
                    value={filters.areaUnit}
                    onChange={(e) => update('areaUnit', e.target.value as AreaUnit)}
                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Marla">Marla (ਮਰਲਾ)</option>
                    <option value="Kanal">Kanal (ਕਨਾਲ)</option>
                    <option value="Gaj">Gaj / Sq.Yards (ਗਜ਼)</option>
                    <option value="Sq.Ft">Sq.Ft (ਸਕੁਏਅਰ ਫੁੱਟ)</option>
                    <option value="Acre">Acre (ਏਕੜ)</option>
                  </select>
                </div>
              </div>

              {/* Exact Custom Min & Max Price */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">Custom Price Range (₹)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step={100000}
                    value={filters.minPrice || ''}
                    onChange={(e) => update('minPrice', parseFloat(e.target.value) || 0)}
                    placeholder="Min Price"
                    className="w-1/2 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                  <span className="text-stone-400">to</span>
                  <input
                    type="number"
                    step={100000}
                    value={filters.maxPrice === 100000000 ? '' : filters.maxPrice}
                    onChange={(e) => update('maxPrice', parseFloat(e.target.value) || 100000000)}
                    placeholder="Max Price"
                    className="w-1/2 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  {formatIndianCurrency(filters.minPrice)} – {formatIndianCurrency(filters.maxPrice)}
                </div>
              </div>

              {/* Facing & Road Width */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">Facing &amp; Road Width</label>
                <div className="space-y-1.5">
                  <select
                    value={filters.facing}
                    onChange={(e) => update('facing', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="All">All Facings</option>
                    <option value="Park Facing">Park Facing</option>
                    <option value="Corner">Corner / Two-Side Road</option>
                    <option value="North-East">North-East</option>
                    <option value="North">North Facing</option>
                    <option value="East">East Facing</option>
                  </select>
                  <select
                    value={filters.minRoadWidthFt}
                    onChange={(e) => update('minRoadWidthFt', parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value={0}>Any Road Width</option>
                    <option value={40}>Min 40 Feet Road</option>
                    <option value={60}>Min 60 Feet Road</option>
                    <option value={100}>Min 100 Feet / Boulevard</option>
                  </select>
                </div>
              </div>

              {/* Specific Locality & Negotiable Toggle */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">Locality / Sector</label>
                <input
                  type="text"
                  value={filters.locality}
                  onChange={(e) => update('locality', e.target.value)}
                  placeholder="e.g. Sector 70, Aerocity Block C"
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs mb-2"
                />
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={filters.negotiableOnly}
                    onChange={(e) => update('negotiableOnly', e.target.checked)}
                    className="w-3.5 h-3.5 text-amber-600 rounded"
                  />
                  <span>Negotiable Price Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE FILTERS TAGS BAR */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-stone-400 font-medium text-[11px]">Applied Filters:</span>
            {filters.keyword && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                Keyword: "{filters.keyword}"
                <button onClick={() => update('keyword', '')}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {filters.city !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                City: {filters.city}
                <button onClick={() => update('city', 'All')}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {filters.propertyTypes.length < 5 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                Types: {filters.propertyTypes.join(', ')}
                <button onClick={() => update('propertyTypes', ['Kothi', 'Plot', 'SCO', 'Flat', 'Land'])}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 100000000) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                Budget: {formatIndianCurrency(filters.minPrice)} - {formatIndianCurrency(filters.maxPrice)}
                <button onClick={() => { update('minPrice', 0); update('maxPrice', 100000000); }}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {filters.facing !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                Facing: {filters.facing}
                <button onClick={() => update('facing', 'All')}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {filters.minRoadWidthFt > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                Road: &gt;={filters.minRoadWidthFt} ft
                <button onClick={() => update('minRoadWidthFt', 0)}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {filters.negotiableOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                Negotiable only
                <button onClick={() => update('negotiableOnly', false)}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:underline font-semibold ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
