import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, ActiveTabType } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { HeroBanner } from './components/HeroBanner';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SellerListingForm } from './components/SellerListingForm';
import { BuyerRequirementForm } from './components/BuyerRequirementForm';
import { MediatorDashboard } from './components/MediatorDashboard';
import { MessagesView } from './components/MessagesView';
import { UserProfileView } from './components/UserProfileView';
import { AdvancedPropertySearch } from './components/AdvancedPropertySearch';
import { SplitScreenMapView } from './components/SplitScreenMapView';
import { FeaturedLuxuryCarousel } from './components/FeaturedLuxuryCarousel';
import { InteractiveMapPreviewBanner } from './components/InteractiveMapPreviewBanner';
import { AboutLeadershipView } from './components/AboutLeadershipView';
import { MarketTrendsView } from './components/MarketTrendsView';
import { CostBreakdownModal } from './components/CostBreakdownModal';
import { AuthModal } from './components/AuthModal';
import { LandCalculatorModal } from './components/LandCalculatorModal';
import { Footer } from './components/Footer';
import {
  PropertyListing,
  BuyerRequirement,
  UserRole,
  SearchFilterState,
  PropertyType,
} from './types';
import { formatIndianCurrency, convertArea } from './utils/formatters';
import {
  Building2,
  Home,
  Store,
  Layers,
  Trees,
  Sparkles,
  Search,
  PlusCircle,
  ShoppingBag,
  Coins,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Award,
  KeyRound,
  CheckCircle2,
  Quote,
} from 'lucide-react';

const INITIAL_FILTER_STATE: SearchFilterState = {
  keyword: '',
  propertyTypes: ['Kothi', 'Plot', 'SCO', 'Flat', 'Land'],
  city: 'All',
  locality: '',
  minPrice: 0,
  maxPrice: 100000000,
  minArea: 0,
  maxArea: 10000,
  areaUnit: 'Marla',
  facing: 'All',
  minRoadWidthFt: 0,
  negotiableOnly: false,
  sortBy: 'featured',
};

function AppContent() {
  const {
    currentUser,
    activeRole,
    setActiveRole,
    properties,
    requirements,
    language,
    setAuthModalOpen,
    calculateMatches,
    startOrOpenChat,
  } = useApp();

  // Tab routing
  const [currentTab, setCurrentTab] = useState<ActiveTabType>('marketplace');

  // Search & Filtering State
  const [filters, setFilters] = useState<SearchFilterState>(INITIAL_FILTER_STATE);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState<boolean>(false);
  const [costModalDefaultPrice, setCostModalDefaultPrice] = useState<number>(38500000);
  const [activeBuyerRequirement, setActiveBuyerRequirement] = useState<BuyerRequirement | null>(requirements[0] || null);

  // Filter & Sort Logic
  const filteredAndSortedProperties = useMemo(() => {
    let list = properties.filter((p) => {
      // 1. Property Type
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(p.propertyType)) {
        return false;
      }

      // 2. City
      if (filters.city !== 'All' && p.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // 3. Locality
      if (filters.locality.trim()) {
        const locQ = filters.locality.toLowerCase();
        if (
          !p.localitySector.toLowerCase().includes(locQ) &&
          !p.address.toLowerCase().includes(locQ)
        ) {
          return false;
        }
      }

      // 4. Price Range
      if (p.expectedPrice < filters.minPrice || p.expectedPrice > filters.maxPrice) {
        return false;
      }

      // 5. Area Range (Normalized to Gaj for fair comparison)
      if (filters.minArea > 0 || filters.maxArea < 10000) {
        const propAreaInGaj = convertArea(p.areaValue, p.areaUnit, 'Gaj');
        const minFilterInGaj = convertArea(filters.minArea, filters.areaUnit, 'Gaj');
        const maxFilterInGaj = convertArea(filters.maxArea, filters.areaUnit, 'Gaj');
        if (propAreaInGaj < minFilterInGaj || propAreaInGaj > maxFilterInGaj) {
          return false;
        }
      }

      // 6. Facing
      if (filters.facing !== 'All') {
        if (!p.facing || !p.facing.toLowerCase().includes(filters.facing.toLowerCase())) {
          return false;
        }
      }

      // 7. Road width
      if (filters.minRoadWidthFt > 0) {
        if (!p.roadWidthFt || p.roadWidthFt < filters.minRoadWidthFt) {
          return false;
        }
      }

      // 8. Negotiable Only
      if (filters.negotiableOnly && !p.isNegotiable) {
        return false;
      }

      // 9. Keyword Search (title, locality, address, description)
      if (filters.keyword.trim()) {
        const q = filters.keyword.toLowerCase();
        const matchesType = p.subType.toLowerCase().includes(q);
        const matchesAddress = p.address.toLowerCase().includes(q);
        const matchesLocality = p.localitySector.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.propertyType.toLowerCase().includes(q);
        if (!matchesType && !matchesAddress && !matchesLocality && !matchesCity && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.expectedPrice - b.expectedPrice;
        case 'price_desc':
          return b.expectedPrice - a.expectedPrice;
        case 'date_desc':
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case 'area_desc': {
          const aGaj = convertArea(a.areaValue, a.areaUnit, 'Gaj');
          const bGaj = convertArea(b.areaValue, b.areaUnit, 'Gaj');
          return bGaj - aGaj;
        }
        case 'area_asc': {
          const aGaj = convertArea(a.areaValue, a.areaUnit, 'Gaj');
          const bGaj = convertArea(b.areaValue, b.areaUnit, 'Gaj');
          return aGaj - bGaj;
        }
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return list;
  }, [properties, filters]);

  // Matches for active buyer requirement if any
  const buyerMatches = useMemo(() => {
    if (!activeBuyerRequirement) return [];
    return calculateMatches(activeBuyerRequirement);
  }, [activeBuyerRequirement, calculateMatches]);

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'seller') {
      setCurrentTab('seller_form');
    } else if (role === 'buyer') {
      setCurrentTab('buyer_reqs');
    } else if (role === 'mediator') {
      setCurrentTab('mediator_desk');
    }
  };

  const handleStartChatFromProperty = (property: PropertyListing) => {
    startOrOpenChat(
      {
        id: property.sellerId,
        name: property.sellerName,
        role: property.sellerRole,
        mobile: property.sellerMobile,
      },
      property
    );
    setCurrentTab('messages');
  };

  const handleOpenCostBreakdown = (price: number) => {
    setCostModalDefaultPrice(price);
    setIsCostModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenCostModal={() => {
          setCostModalDefaultPrice(38500000);
          setIsCostModalOpen(true);
        }}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onSelectMapView={() => {
          setViewMode('map');
          const el = document.getElementById('listings-portfolio');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Role Switcher Bar ("After login ਦੇ choose Act As buyer or seller or mediator") */}
      <RoleSwitcher onSelectRole={handleRoleSelect} />

      {/* MAIN TAB ROUTING */}

      {/* 1. MARKETPLACE / SEARCH & PROPERTIES TAB */}
      {currentTab === 'marketplace' && (
        <>
          {/* Hero Banner */}
          <HeroBanner
            selectedType={filters.propertyTypes.length === 1 ? filters.propertyTypes[0] : 'All'}
            setSelectedType={(type) => {
              if (type === 'All') {
                setFilters((prev) => ({
                  ...prev,
                  propertyTypes: ['Kothi', 'Plot', 'SCO', 'Flat', 'Land'],
                }));
              } else {
                setFilters((prev) => ({
                  ...prev,
                  propertyTypes: [type as PropertyType],
                }));
              }
            }}
            selectedCity={filters.city}
            setSelectedCity={(city) => setFilters((prev) => ({ ...prev, city }))}
            searchQuery={filters.keyword}
            setSearchQuery={(keyword) => setFilters((prev) => ({ ...prev, keyword }))}
            onPostRequirement={() => setCurrentTab('buyer_reqs')}
            onListProperty={() => setCurrentTab('seller_form')}
            onExplorePortfolio={() => {
              const el = document.getElementById('listings-portfolio');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Featured Ultra-Luxury Listings Carousel */}
          <FeaturedLuxuryCarousel
            properties={properties}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onStartChat={handleStartChatFromProperty}
          />

          {/* Interactive Geospatial Map Preview Banner */}
          <InteractiveMapPreviewBanner
            totalMappedCount={properties.length}
            onLaunchMap={(corridor) => {
              if (corridor && corridor !== 'All') {
                setFilters((prev) => ({ ...prev, locality: corridor }));
              } else if (corridor === 'All') {
                setFilters((prev) => ({ ...prev, locality: '' }));
              }
              setViewMode('map');
              const el = document.getElementById('listings-portfolio');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Comprehensive Property Search & Filtering Toolbar */}
          <div id="listings-portfolio">
            <AdvancedPropertySearch
              filters={filters}
              onFilterChange={(newFilters) => setFilters(newFilters)}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              totalResults={filteredAndSortedProperties.length}
              viewMode={viewMode}
              onToggleViewMode={(mode) => setViewMode(mode)}
            />
          </div>

          {/* View Mode Switching: Split Map vs Grid vs List */}
          {viewMode === 'map' ? (
            <SplitScreenMapView
              properties={filteredAndSortedProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onStartChat={handleStartChatFromProperty}
            />
          ) : (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#14181F]">
                    Signature Portfolio &amp; Available Estates
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8C827A] mt-0.5">
                    Presenting <strong>{filteredAndSortedProperties.length}</strong> authenticated luxury estates across prime sectors
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('trends')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F4F2EC] hover:bg-[#E8E5DD] text-[#14181F] border border-[#E8E5DD] rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Market Intelligence</span>
                    <span className="text-[10px] bg-[#C5A880]/20 text-[#8A6A3F] px-1 rounded font-bold">AI</span>
                  </button>
                  <button
                    onClick={() => setIsCostModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F4F2EC] hover:bg-[#E8E5DD] text-[#14181F] border border-[#E8E5DD] rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Stamp Duty &amp; Fees</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('seller_form')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#14181F] hover:bg-[#252B35] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>List Estate</span>
                  </button>
                </div>
              </div>

              {filteredAndSortedProperties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E5DD] p-8 space-y-4 shadow-xs">
                  <div className="w-14 h-14 bg-[#F4F2EC] text-[#C5A880] rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-[#14181F]">No properties match your specific criteria</h3>
                  <p className="text-xs text-[#8C827A] max-w-md mx-auto leading-relaxed">
                    Try broadening your budget parameters, selecting all prime corridors, or speak directly with our private office for off-market listings.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setFilters(INITIAL_FILTER_STATE)}
                      className="px-4 py-2 bg-[#14181F] text-white text-xs font-semibold rounded-lg hover:bg-[#252B35] cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                    <button
                      onClick={() => setCurrentTab('buyer_reqs')}
                      className="px-4 py-2 bg-[#C5A880] text-[#0B0D11] text-xs font-semibold rounded-lg hover:bg-[#B5966B] cursor-pointer"
                    >
                      Post Private Mandate
                    </button>
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={(p) => setSelectedProperty(p)}
                      onStartChat={handleStartChatFromProperty}
                      layoutMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAndSortedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={(p) => setSelectedProperty(p)}
                      onStartChat={handleStartChatFromProperty}
                      layoutMode="list"
                    />
                  ))}
                </div>
              )}
            </main>
          )}

          {/* Homepage Value Proposition & Private Client Trust Signals */}
          <section className="bg-white border-t border-[#E8E5DD] py-16 sm:py-20 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
                  The Ajay Estate Standard
                </span>
                <h3 className="text-3xl font-serif-luxury font-normal text-[#14181F]">
                  Why Discerning Clients Trust Our Private Office
                </h3>
                <p className="text-xs text-[#8C827A] leading-relaxed">
                  Institutional rigor, seasoned fiduciaries, and unmatched regional reach.
                </p>
              </div>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border border-[#E8E5DD] rounded-xl space-y-3 bg-[#FBFBF9]">
                  <div className="w-10 h-10 bg-[#14181F] text-[#C5A880] rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#14181F]">
                    100% Freehold Title Audit
                  </h4>
                  <p className="text-xs text-[#5A554E] leading-relaxed font-light">
                    Every listed estate undergoes independent revenue record scrutiny, GMADA/PUDA allotment verification, and zero-encumbrance title clearance prior to presentation.
                  </p>
                </div>

                <div className="p-6 border border-[#E8E5DD] rounded-xl space-y-3 bg-[#FBFBF9]">
                  <div className="w-10 h-10 bg-[#14181F] text-[#C5A880] rounded-lg flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#14181F]">
                    Strict Off-Market Discretion
                  </h4>
                  <p className="text-xs text-[#5A554E] leading-relaxed font-light">
                    Preserving client privacy is paramount. High-profile principals and business families can transact confidentially under binding Non-Disclosure Agreements.
                  </p>
                </div>

                <div className="p-6 border border-[#E8E5DD] rounded-xl space-y-3 bg-[#FBFBF9]">
                  <div className="w-10 h-10 bg-[#14181F] text-[#C5A880] rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#14181F]">
                    Bespoke Concierge &amp; Global Desks
                  </h4>
                  <p className="text-xs text-[#5A554E] leading-relaxed font-light">
                    From NRI capital repatriation and power of attorney execution to interior architectural consultations, our concierge serves clients across 6 countries.
                  </p>
                </div>
              </div>

              {/* Client Endorsements / Testimonials */}
              <div className="pt-8 border-t border-[#E8E5DD]">
                <div className="text-center mb-8">
                  <span className="text-xs uppercase tracking-widest text-[#8A8480] font-semibold">
                    Client Endorsements &amp; Statements
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-[#FBFBF9] border border-[#E8E5DD] rounded-xl space-y-4">
                    <p className="text-xs text-[#5A554E] italic leading-relaxed">
                      "Ajay Estate secured our 2 Kanal estate in IT City with complete off-market discretion. Their legal due diligence and architectural knowledge set them miles apart from traditional brokers."
                    </p>
                    <div className="pt-2 border-t border-[#E8E5DD] text-[11px]">
                      <span className="font-bold text-[#14181F] block">Dr. Tejinder S.</span>
                      <span className="text-[#8C827A] block">Healthcare Founder &amp; Philanthropist</span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#FBFBF9] border border-[#E8E5DD] rounded-xl space-y-4">
                    <p className="text-xs text-[#5A554E] italic leading-relaxed">
                      "As an NRI living in London, finding clear-title commercial SCO showrooms on Airport Road seemed daunting until we engaged Ajay Sharma. Flawless execution and zero friction."
                    </p>
                    <div className="pt-2 border-t border-[#E8E5DD] text-[11px]">
                      <span className="font-bold text-[#14181F] block">Rajiv &amp; Nina M.</span>
                      <span className="text-[#8C827A] block">Mayfair, London · Private Family Investors</span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#FBFBF9] border border-[#E8E5DD] rounded-xl space-y-4">
                    <p className="text-xs text-[#5A554E] italic leading-relaxed">
                      "The level of confidentiality and accurate circle-rate analysis provided by Ajay Estate is exceptional. Our family office relies on them exclusively for all North India transactions."
                    </p>
                    <div className="pt-2 border-t border-[#E8E5DD] text-[11px]">
                      <span className="font-bold text-[#14181F] block">Karanjit Singh</span>
                      <span className="text-[#8C827A] block">Managing Director, Manufacturing Group</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 2. SELLER LISTING FORM TAB */}
      {currentTab === 'seller_form' && (
        <main className="flex-1 bg-stone-100/50 py-8">
          <SellerListingForm
            onSuccess={(propId) => {
              const created = properties.find((p) => p.id === propId);
              if (created) setSelectedProperty(created);
              setCurrentTab('marketplace');
            }}
          />
        </main>
      )}

      {/* 3. BUYER REQUIREMENTS TAB */}
      {currentTab === 'buyer_reqs' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <BuyerRequirementForm
                onRequirementAdded={(req) => {
                  setActiveBuyerRequirement(req);
                }}
              />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <div>
                      <h3 className="text-base font-bold text-stone-900 font-display">
                        Auto-Matched Properties for Your Demand
                      </h3>
                      <p className="text-xs text-stone-500">
                        {activeBuyerRequirement
                          ? `Matching for: ${activeBuyerRequirement.buyerName}'s demand (${activeBuyerRequirement.propertyTypes.join(', ')} in ${activeBuyerRequirement.city})`
                          : 'Select or post a requirement to see matched listings'}
                      </p>
                    </div>
                  </div>
                  {activeBuyerRequirement && (
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {buyerMatches.length} Matches Found
                    </span>
                  )}
                </div>

                {buyerMatches.length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone-500 space-y-2">
                    <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="font-semibold text-stone-700">No direct matches currently for this specific budget and locality.</p>
                    <p>Sellers are automatically notified of your demand and will contact you directly!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {buyerMatches.map(({ property, matchScore, matchReasons }) => (
                      <div key={property.id} className="relative">
                        <PropertyCard
                          property={property}
                          onSelect={(p) => setSelectedProperty(p)}
                          onStartChat={handleStartChatFromProperty}
                          matchScore={matchScore}
                        />
                        <div className="mt-1 text-[11px] text-emerald-700 font-medium px-2">
                          ✓ {matchReasons.join(' · ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Community Demands Feed */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900">
                    Live In-Market Buyer Demands (ਹੋਰ ਗਾਹਕਾਂ ਦੀਆਂ ਮੰਗਾਂ)
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">{requirements.length} Active Demands</span>
                </div>

                <div className="space-y-2.5">
                  {requirements.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => setActiveBuyerRequirement(req)}
                      className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        activeBuyerRequirement?.id === req.id
                          ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600/30'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span>{req.buyerName}</span>
                          <span className="text-stone-400 font-normal">· {req.city}</span>
                        </div>
                        <span className="text-amber-800 font-mono">
                          {formatIndianCurrency(req.minBudget)} - {formatIndianCurrency(req.maxBudget)}
                        </span>
                      </div>
                      <div className="text-stone-600">
                        Wants: <strong>{req.propertyTypes.join(', ')}</strong> ({req.desiredAreaMin} - {req.desiredAreaMax} {req.areaUnit}) · Urgency: {req.urgency}
                      </div>
                      {req.notes && <p className="text-[11px] text-stone-500 mt-1 italic">"{req.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 4. IN-APP MESSAGING TAB */}
      {currentTab === 'messages' && (
        <main className="flex-1">
          <MessagesView
            onSelectProperty={(p) => {
              setSelectedProperty(p);
            }}
          />
        </main>
      )}

      {/* 5. MEDIATOR DESK TAB */}
      {currentTab === 'mediator_desk' && (
        <main className="flex-1">
          <MediatorDashboard />
        </main>
      )}

      {/* 6. PROPERTY MARKET TRENDS (GEMINI AI & RECHARTS) */}
      {currentTab === 'trends' && (
        <main className="flex-1 bg-stone-50 py-4">
          <MarketTrendsView
            onSelectProperty={(p) => setSelectedProperty(p)}
            onNavigateToSeller={() => setCurrentTab('seller_form')}
            onNavigateToBuyer={() => setCurrentTab('buyer_reqs')}
          />
        </main>
      )}

      {/* 7. USER PROFILE & ACCOUNT TAB */}
      {currentTab === 'profile' && (
        <main className="flex-1 bg-stone-100/50">
          <UserProfileView
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenMessages={() => setCurrentTab('messages')}
          />
        </main>
      )}

      {/* 8. ABOUT & FOUNDER LEADERSHIP TAB */}
      {currentTab === 'about' && (
        <main className="flex-1">
          <AboutLeadershipView
            onScheduleConsultation={() => setCurrentTab('buyer_reqs')}
            onExploreProperties={() => setCurrentTab('marketplace')}
          />
        </main>
      )}

      {/* MODALS */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onStartChat={handleStartChatFromProperty}
        onOpenCostBreakdown={handleOpenCostBreakdown}
        onOpenMarketTrends={() => {
          setSelectedProperty(null);
          setCurrentTab('trends');
        }}
      />

      <CostBreakdownModal
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        defaultPrice={costModalDefaultPrice}
      />

      <AuthModal />

      <LandCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
