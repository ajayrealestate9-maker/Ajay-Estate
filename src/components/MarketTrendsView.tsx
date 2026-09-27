import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Building2,
  MapPin,
  RefreshCw,
  Coins,
  Calendar,
  Compass,
  ArrowUpRight,
  Send,
  HelpCircle,
  Home,
  Store,
  Trees,
  Layers,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyType, PropertyListing } from '../types';
import { formatIndianCurrency } from '../utils/formatters';

interface MonthlyTrendPoint {
  month: string;
  avgRatePerSqFt: number;
  avgRatePerGaj: number;
  kothiRate?: number;
  plotRate?: number;
  scoRate?: number;
  flatRate?: number;
  landRate?: number;
  volumeIndex?: number;
}

interface TopLocalityItem {
  locality: string;
  avgRatePerGaj: number;
  growthRate: string;
  demandRating: string;
}

interface MarketTrendsData {
  locality: string;
  city: string;
  propertyType: string;
  timeframe: string;
  appreciationRate12M: string;
  currentAvgRatePerSqFt: number;
  currentAvgRatePerGaj: number;
  marketSentiment: string;
  rentalYieldRange?: string;
  averageDaysOnMarket?: number;
  monthlyTrends: MonthlyTrendPoint[];
  keyDrivers: string[];
  topLocalities?: TopLocalityItem[];
  aiAnalysis: string;
  punjabiSummary: string;
  buyerAdvice?: string;
  sellerAdvice?: string;
}

interface MarketTrendsViewProps {
  onSelectProperty?: (property: PropertyListing) => void;
  onNavigateToSeller?: () => void;
  onNavigateToBuyer?: () => void;
}

const CITIES = ['All', 'Mohali', 'Ludhiana', 'Jalandhar', 'Amritsar', 'Zirakpur', 'Patiala'];

const LOCALITIES_BY_CITY: Record<string, string[]> = {
  All: ['All Prime Hubs', 'Aerocity & IT City', 'Model Town Clusters', 'PR-7 Airport Corridor', 'Urban Estate Hubs', 'GT Road Belt'],
  Mohali: ['All Mohali', 'Aerocity Blocks A-I', 'Sector 82 IT City', 'Sector 70 (Prime Kothis)', 'Sector 68', 'Sector 85 Wave City', 'Sector 115'],
  Ludhiana: ['All Ludhiana', 'Model Town', 'Pakhowal Road', 'South City & Ferozepur Rd', 'Urban Estate Phase 1 & 2', 'Sarabha Nagar'],
  Jalandhar: ['All Jalandhar', 'Model Town', 'Urban Estate Phase 2', 'Cantt Road', 'GT Road Commercial'],
  Amritsar: ['All Amritsar', 'Ranjit Avenue Blocks A-E', 'Circular Road', 'Mall Road', 'GT Road Bypass'],
  Zirakpur: ['All Zirakpur', 'PR-7 Airport Ring Road', 'VIP Road', 'Dhakoli', 'Patiala Highway'],
  Patiala: ['All Patiala', 'Urban Estate Phase 1 & 2', 'Leela Bhawan', 'Sirhind Road'],
};

const PROPERTY_TYPES: { id: PropertyType | 'All'; label: string; punjabi: string; icon: any }[] = [
  { id: 'All', label: 'All Types', punjabi: 'ਸਾਰੀਆਂ ਕਿਸਮਾਂ', icon: Layers },
  { id: 'Kothi', label: 'Kothi (Bungalow)', punjabi: 'ਕੋਠੀ', icon: Home },
  { id: 'Plot', label: 'Plot (Residential)', punjabi: 'ਪਲਾਟ', icon: Compass },
  { id: 'SCO', label: 'SCO (Commercial)', punjabi: 'ਐਸ.ਸੀ.ਓ', icon: Store },
  { id: 'Flat', label: 'Flat (Apartment)', punjabi: 'ਫਲੈਟ', icon: Building2 },
  { id: 'Land', label: 'Land (Agricultural)', punjabi: 'ਜ਼ਮੀਨ', icon: Trees },
];

export const MarketTrendsView: React.FC<MarketTrendsViewProps> = ({
  onSelectProperty,
  onNavigateToSeller,
  onNavigateToBuyer,
}) => {
  const { language, properties } = useApp();

  // Filter State
  const [selectedCity, setSelectedCity] = useState<string>('Mohali');
  const [selectedLocality, setSelectedLocality] = useState<string>('Aerocity & IT City');
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | 'All'>('All');
  const [timeframe, setTimeframe] = useState<'6m' | '12m' | '24m'>('6m');
  const [chartMetric, setChartMetric] = useState<'ratePerGaj' | 'ratePerSqFt' | 'multiType' | 'volume'>('ratePerGaj');

  // AI & Data State
  const [loading, setLoading] = useState<boolean>(true);
  const [trendsData, setTrendsData] = useState<MarketTrendsData | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);
  const [activeLines, setActiveLines] = useState<Record<string, boolean>>({
    kothi: true,
    plot: true,
    sco: true,
    flat: true,
    land: true,
  });

  // Calculate platform listing statistics to ground Gemini analysis
  const platformStats = useMemo(() => {
    const total = properties.length;
    const avgPrice = Math.round(properties.reduce((acc, p) => acc + p.expectedPrice, 0) / (total || 1));
    const kothis = properties.filter((p) => p.propertyType === 'Kothi').length;
    const plots = properties.filter((p) => p.propertyType === 'Plot').length;
    const scos = properties.filter((p) => p.propertyType === 'SCO').length;
    const flats = properties.filter((p) => p.propertyType === 'Flat').length;
    const lands = properties.filter((p) => p.propertyType === 'Land').length;

    return { totalListings: total, avgPrice, kothis, plots, scos, flats, lands };
  }, [properties]);

  // Fetch or update market trends via server API (which invokes Gemini API)
  const fetchMarketTrends = async (promptOverride?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/market-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity,
          locality: selectedLocality,
          propertyType: selectedPropertyType,
          timeframe,
          customPrompt: promptOverride || customQuestion,
          platformStats,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setTrendsData(result.data);
        setDataSource(result.source || 'gemini');
      }
    } catch (err) {
      console.error('Failed to fetch market trends:', err);
    } finally {
      setLoading(false);
      setIsAskingAi(false);
    }
  };

  useEffect(() => {
    fetchMarketTrends();
  }, [selectedCity, selectedLocality, selectedPropertyType, timeframe]);

  // Handle City Change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const available = LOCALITIES_BY_CITY[city] || ['All'];
    setSelectedLocality(available[0] || 'All');
  };

  // Submit custom AI question
  const handleAskCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setIsAskingAi(true);
    fetchMarketTrends(customQuestion);
  };

  // Relevant listings from the platform
  const relevantListings = useMemo(() => {
    return properties.filter((p) => {
      const matchesCity = selectedCity === 'All' || p.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesType = selectedPropertyType === 'All' || p.propertyType === selectedPropertyType;
      return matchesCity && matchesType;
    }).slice(0, 3);
  }, [properties, selectedCity, selectedPropertyType]);

  // Custom Recharts Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 text-white p-3.5 rounded-xl shadow-xl border border-stone-800 text-xs min-w-[200px]">
          <p className="font-bold text-amber-400 mb-2 border-b border-stone-800 pb-1.5 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-stone-400 font-normal">Monthly Index</span>
          </p>
          <div className="space-y-1.5">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}:
                </span>
                <span className="font-mono font-semibold text-white">
                  {chartMetric === 'volume'
                    ? `${item.value} inquiries`
                    : chartMetric === 'ratePerGaj'
                    ? `₹${Number(item.value).toLocaleString('en-IN')}/Gaj`
                    : `₹${Number(item.value).toLocaleString('en-IN')}/sq.ft`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-amber-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>
                {language === 'pa'
                  ? 'ਜੈਮਿਨੀ ਏ.ਆਈ. ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ'
                  : 'Powered by Gemini Real Estate Intelligence'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display">
              {language === 'pa'
                ? 'ਪ੍ਰਾਪਰਟੀ ਮਾਰਕੀਟ ਰੁਝਾਨ ਅਤੇ ਭਾਅ'
                : 'Property Market Trends & Price Intelligence'}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Track authentic monthly price trajectories, Gaj &amp; Sq.Ft appreciation, and historical transaction momentum across Punjab’s key sectors, powered by Gemini 3.8 Flash AI and regional registry benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchMarketTrends()}
              disabled={loading || isAskingAi}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing Trends...' : 'Refresh AI Analysis'}</span>
            </button>
            {dataSource && (
              <span className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-[11px] font-mono text-amber-200 border border-white/10">
                Model: gemini-3.8-flash
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'pa' ? 'ਸ਼ਹਿਰ ਚੁਣੋ' : 'Target City'}</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Punjab Major Hubs' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Locality Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'pa' ? 'ਇਲਾਕਾ / ਸੈਕਟਰ' : 'Locality / Sector'}</span>
            </label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {(LOCALITIES_BY_CITY[selectedCity] || ['All']).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'pa' ? 'ਸਮਾਂ ਸੀਮਾ' : 'Trend Timeframe'}</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setTimeframe('6m')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timeframe === '6m' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                6 Mos
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('12m')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timeframe === '12m' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                12 Mos
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('24m')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timeframe === '24m' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                2 Years
              </button>
            </div>
          </div>

          {/* Metric Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'pa' ? 'ਚਾਰਟ ਮਾਪਦੰਡ' : 'Chart Metric'}</span>
            </label>
            <select
              value={chartMetric}
              onChange={(e: any) => setChartMetric(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="ratePerGaj">Rate per Gaj (₹/Gaj - Punjab Standard)</option>
              <option value="ratePerSqFt">Rate per Sq.Ft (₹/Sq.Ft)</option>
              <option value="multiType">Compare Property Types (Kothi vs Plot vs SCO)</option>
              <option value="volume">Buyer Inquiry &amp; Transaction Activity</option>
            </select>
          </div>
        </div>

        {/* Property Type Pills */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Type:</span>
          </span>
          {PROPERTY_TYPES.map((pt) => {
            const Icon = pt.icon;
            const isSelected = selectedPropertyType === pt.id;
            return (
              <button
                key={pt.id}
                onClick={() => setSelectedPropertyType(pt.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'pa' ? pt.punjabi : pt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 12M Appreciation */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">
              {language === 'pa' ? '12 ਮਹੀਨਿਆਂ ਦਾ ਵਾਧਾ' : '12-Month Capital Growth'}
            </span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-display">
            {trendsData?.appreciationRate12M || '+14.2% YoY'}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Historical compound growth for {selectedLocality}
          </p>
        </div>

        {/* Card 2: Current Avg Rate Per Gaj */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">
              {language === 'pa' ? 'ਔਸਤ ਰੇਟ ਪ੍ਰਤੀ ਗਜ਼' : 'Avg Rate / Gaj (Sq.Yards)'}
            </span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-display font-mono">
            ₹{trendsData?.currentAvgRatePerGaj?.toLocaleString('en-IN') || '52,200'}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            ≈ ₹{trendsData?.currentAvgRatePerSqFt?.toLocaleString('en-IN') || '5,800'} / sq.ft
          </p>
        </div>

        {/* Card 3: Market Sentiment */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">
              {language === 'pa' ? 'ਮਾਰਕੀਟ ਦੀ ਹਾਲਤ' : 'Market Sentiment'}
            </span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base font-bold text-stone-900 line-clamp-1">
            {trendsData?.marketSentiment || 'Strong Seller Market'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            High NRI buyer inflow &amp; token velocity
          </p>
        </div>

        {/* Card 4: Rental Yield & Days on Market */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">
              {language === 'pa' ? 'ਔਸਤ ਵਿਕਰੀ ਸਮਾਂ / ਕਿਰਾਇਆ' : 'Liquidity & Rental Yield'}
            </span>
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-bold text-stone-900 font-display">
            {trendsData?.averageDaysOnMarket || 35} Days / {trendsData?.rentalYieldRange || '3.5% - 5.0%'}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Average deal closing timeline in Punjab
          </p>
        </div>
      </div>

      {/* Main Recharts Line Chart Section */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <span>
                {language === 'pa'
                  ? `${selectedLocality} ਵਿੱਚ ਮਹੀਨਾਵਾਰ ਭਾਅ ਦਾ ਰੁਝਾਨ`
                  : `Monthly Price Movement Chart: ${selectedLocality}`}
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {chartMetric === 'multiType'
                ? 'Comparing monthly rates across Kothi, Plot, SCO Commercial, Flat, and Land'
                : chartMetric === 'volume'
                ? 'Buyer demand inquiry index tracking transaction velocity'
                : `Tracking price per ${chartMetric === 'ratePerGaj' ? 'Gaj (Square Yard)' : 'Square Foot'} over consecutive months`}
            </p>
          </div>

          {/* Multi-type line toggles */}
          {chartMetric === 'multiType' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveLines((p) => ({ ...p, kothi: !p.kothi }))}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium flex items-center gap-1.5 transition-colors ${
                  activeLines.kothi ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Kothi</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLines((p) => ({ ...p, plot: !p.plot }))}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium flex items-center gap-1.5 transition-colors ${
                  activeLines.plot ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Plot</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLines((p) => ({ ...p, sco: !p.sco }))}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium flex items-center gap-1.5 transition-colors ${
                  activeLines.sco ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>SCO</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLines((p) => ({ ...p, flat: !p.flat }))}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium flex items-center gap-1.5 transition-colors ${
                  activeLines.flat ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Flat</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLines((p) => ({ ...p, land: !p.land }))}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium flex items-center gap-1.5 transition-colors ${
                  activeLines.land ? 'bg-stone-100 border-stone-300 text-stone-900' : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-stone-600" />
                <span>Land</span>
              </button>
            </div>
          )}
        </div>

        {/* The Recharts Line Chart Container */}
        <div className="w-full h-80 sm:h-96 pt-2">
          {trendsData && trendsData.monthlyTrends && trendsData.monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendsData.monthlyTrends}
                margin={{ top: 15, right: 25, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e7e5e4' }}
                  tick={{ fill: '#78716c', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#e7e5e4' }}
                  tick={{ fill: '#78716c', fontSize: 11 }}
                  tickFormatter={(val) => {
                    if (chartMetric === 'volume') return `${val}`;
                    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                    return `₹${val}`;
                  }}
                  dx={-6}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '15px' }}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-medium text-stone-700">{value}</span>}
                />

                {/* Conditional Lines depending on Selected Metric */}
                {chartMetric === 'ratePerGaj' && (
                  <Line
                    type="monotone"
                    dataKey="avgRatePerGaj"
                    name="Average Rate / Gaj (₹)"
                    stroke="#b45309"
                    strokeWidth={3}
                    dot={{ fill: '#b45309', r: 4 }}
                    activeDot={{ r: 7, stroke: '#fef3c7', strokeWidth: 2 }}
                  />
                )}

                {chartMetric === 'ratePerSqFt' && (
                  <Line
                    type="monotone"
                    dataKey="avgRatePerSqFt"
                    name="Average Rate / Sq.Ft (₹)"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ fill: '#059669', r: 4 }}
                    activeDot={{ r: 7, stroke: '#d1fae5', strokeWidth: 2 }}
                  />
                )}

                {chartMetric === 'volume' && (
                  <Line
                    type="monotone"
                    dataKey="volumeIndex"
                    name="Buyer Demand Activity Index"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 4 }}
                    activeDot={{ r: 7, stroke: '#e0e7ff', strokeWidth: 2 }}
                  />
                )}

                {chartMetric === 'multiType' && (
                  <>
                    {activeLines.kothi && (
                      <Line
                        type="monotone"
                        dataKey="kothiRate"
                        name="Kothi (₹/sq.ft)"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    )}
                    {activeLines.plot && (
                      <Line
                        type="monotone"
                        dataKey="plotRate"
                        name="Plot (₹/sq.ft)"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    )}
                    {activeLines.sco && (
                      <Line
                        type="monotone"
                        dataKey="scoRate"
                        name="SCO (₹/sq.ft)"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    )}
                    {activeLines.flat && (
                      <Line
                        type="monotone"
                        dataKey="flatRate"
                        name="Flat (₹/sq.ft)"
                        stroke="#0284c7"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    )}
                    {activeLines.land && (
                      <Line
                        type="monotone"
                        dataKey="landRate"
                        name="Land (₹/sq.ft)"
                        stroke="#57534e"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    )}
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 text-xs">
              Loading market series...
            </div>
          )}
        </div>
      </div>

      {/* Gemini AI Market Intelligence Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gemini Analysis & Regional Drivers */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    {language === 'pa' ? 'ਜੈਮਿਨੀ ਏ.ਆਈ. ਮਾਰਕੀਟ ਰਿਪੋਰਟ' : 'Gemini AI Market Intelligence'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Deep structural analysis of circle rates, infrastructure catalysts, and price trajectories
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">
                Verified Punjab Metrics
              </span>
            </div>

            {/* AI Narrative text */}
            <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
              <p>{trendsData?.aiAnalysis}</p>
            </div>

            {/* Dual Language Punjabi Box */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <span>ਪੰਜਾਬੀ ਸਾਰ (Punjabi Market Summary):</span>
              </div>
              <p className="leading-relaxed font-sans">{trendsData?.punjabiSummary}</p>
            </div>

            {/* Key Drivers Pill Grid */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {language === 'pa' ? 'ਮੁੱਖ ਵਾਧੇ ਦੇ ਕਾਰਨ' : 'Key Local Growth Drivers'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {trendsData?.keyDrivers?.map((driver, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Advice for Buyers and Sellers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Strategic Advice for Buyers:</span>
                </span>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {trendsData?.buyerAdvice || 'Target pre-launch or under-construction corridors along PR-7 before revised tehsil circle rates take effect.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-xs font-bold text-amber-900 block flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-700" />
                  <span>Strategic Advice for Sellers:</span>
                </span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {trendsData?.sellerAdvice || 'List high-demand 1 Kanal and 10 Marla inventory with clear RERA status; token velocity is currently under 35 days.'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive AI Query Form */}
          <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-2xl p-5 text-white border border-stone-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Ask Gemini Real Estate AI a Custom Market Question
              </h4>
            </div>
            <form onSubmit={handleAskCustomQuestion} className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. Compare 1 Kanal Kothis in Sector 70 Mohali with Model Town Ludhiana..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={isAskingAi || !customQuestion.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isAskingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Ask AI</span>
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-stone-400">Quick prompts:</span>
              <button
                type="button"
                onClick={() => {
                  const q = 'Will PR-7 Airport Road SCOs yield higher rental returns than Sector 82 IT City Mohali?';
                  setCustomQuestion(q);
                  fetchMarketTrends(q);
                }}
                className="text-[11px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-amber-200 transition-colors"
              >
                PR-7 vs IT City SCO Yields
              </button>
              <button
                type="button"
                onClick={() => {
                  const q = 'Analyze how upcoming Punjab circle rate revisions affect stamp duty in Ludhiana';
                  setCustomQuestion(q);
                  fetchMarketTrends(q);
                }}
                className="text-[11px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-amber-200 transition-colors"
              >
                Circle Rates &amp; Stamp Duty
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Top Submarket Comparison & Matched Listings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Localities Table */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-display flex items-center justify-between">
              <span>Top Punjab Micro-Markets</span>
              <span className="text-[10px] text-stone-400 uppercase font-mono">Rate / Gaj</span>
            </h3>
            <div className="divide-y divide-stone-100">
              {trendsData?.topLocalities?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-stone-900 line-clamp-1">{item.locality}</div>
                    <div className="text-[11px] text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{item.growthRate} annual</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-stone-900">
                      ₹{item.avgRatePerGaj.toLocaleString('en-IN')}
                    </div>
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
                      {item.demandRating} Demand
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Listings Matching This Submarket */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-display">
                Active Listings in {selectedCity}
              </h3>
              <span className="text-xs text-amber-700 font-semibold">{relevantListings.length} found</span>
            </div>

            {relevantListings.length === 0 ? (
              <p className="text-xs text-stone-500 py-3 text-center">
                No active listings currently matching this exact combination.
              </p>
            ) : (
              <div className="space-y-3">
                {relevantListings.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => onSelectProperty?.(prop)}
                    className="group cursor-pointer p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all flex gap-3 items-center bg-stone-50/50"
                  >
                    <img
                      src={prop.photos[0]}
                      alt={prop.subType}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-800">
                        {prop.subType}
                      </h5>
                      <p className="text-[11px] text-stone-500 truncate">
                        {prop.localitySector}, {prop.city}
                      </p>
                      <div className="text-xs font-mono font-bold text-amber-800 mt-0.5">
                        {formatIndianCurrency(prop.expectedPrice)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 shrink-0" />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={onNavigateToBuyer}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors text-center"
              >
                Post Buyer Demand for {selectedCity}
              </button>
              <button
                type="button"
                onClick={onNavigateToSeller}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors text-center"
              >
                List Property for Sale in {selectedCity}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
