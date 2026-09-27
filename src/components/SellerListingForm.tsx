import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyType, AreaUnit, GoogleLocation } from '../types';
import { formatIndianCurrency, convertArea } from '../utils/formatters';
import { LocationPickerModal } from './LocationPickerModal';
import {
  Building2,
  Home,
  Store,
  Layers,
  Trees,
  MapPin,
  Camera,
  Video,
  CheckCircle2,
  Upload,
  Info,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';

import kothiImg from '../assets/images/property_kothi_1790396162986.jpg';
import scoImg from '../assets/images/property_sco_1790396175565.jpg';
import plotImg from '../assets/images/property_plot_1790396188576.jpg';
import flatImg from '../assets/images/property_flat_1790396201317.jpg';
import landImg from '../assets/images/property_land_1790396212516.jpg';

interface SellerListingFormProps {
  onSuccess: (propertyId: string) => void;
}

export const SellerListingForm: React.FC<SellerListingFormProps> = ({ onSuccess }) => {
  const { currentUser, activeRole, addProperty, language, setAuthModalOpen } = useApp();

  // 1. Property Type
  const [propertyType, setPropertyType] = useState<PropertyType>('Kothi');
  const [subType, setSubType] = useState<string>('1 Kanal Luxury Independent Kothi');

  // 2. Area Option
  const [areaValue, setAreaValue] = useState<number>(1);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('Kanal');
  const [dimensions, setDimensions] = useState<string>('50 x 90 ft');

  // 3. Expected Price
  const [expectedPrice, setExpectedPrice] = useState<number>(35000000);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(true);

  // 4. Address
  const [address, setAddress] = useState<string>('Plot #124, Sector 70');
  const [city, setCity] = useState<string>('Mohali');
  const [localitySector, setLocalitySector] = useState<string>('Sector 70 (Main Road)');
  const [pincode, setPincode] = useState<string>('160071');

  // 5. Google Location
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [googleLocation, setGoogleLocation] = useState<GoogleLocation>({
    lat: 30.7046,
    lng: 76.7179,
    landmark: 'Near Ivy Hospital & 60 ft Sector Road',
    locality: 'Sector 70, Mohali, Punjab',
    mapsUrl: 'https://maps.google.com/?q=30.7046,76.7179',
  });

  // 6. Photos or Videos
  const defaultImagesByType: Record<PropertyType, string> = {
    'Kothi': kothiImg,
    'SCO': scoImg,
    'Plot': plotImg,
    'Flat': flatImg,
    'Land': landImg,
  };

  const [photos, setPhotos] = useState<string[]>([defaultImagesByType['Kothi']]);
  const [videoUrl, setVideoUrl] = useState<string>('');

  // 7. Additional specifications
  const [bedrooms, setBedrooms] = useState<number>(5);
  const [bathrooms, setBathrooms] = useState<number>(5);
  const [facing, setFacing] = useState<string>('North-East (Park Facing)');
  const [roadWidthFt, setRoadWidthFt] = useState<number>(60);
  const [registryStatus, setRegistryStatus] = useState<string>('Clear Title / GMADA Allotted / Registry Done');
  const [description, setDescription] = useState<string>(
    'Prime luxury property with clear documentation, excellent connectivity, wide approach road, and high quality construction.'
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Update default images & defaults when property type changes
  const handleTypeSelect = (type: PropertyType) => {
    setPropertyType(type);
    setPhotos([defaultImagesByType[type]]);

    if (type === 'Land') {
      setSubType('Agricultural Fertile Land');
      setAreaValue(4);
      setAreaUnit('Acre');
      setDimensions('200 ft Frontage on Link Road');
      setExpectedPrice(16000000);
      setRoadWidthFt(33);
      setBedrooms(0);
      setBathrooms(0);
    } else if (type === 'Plot') {
      setSubType('Residential GMADA / PUDA Plot');
      setAreaValue(200);
      setAreaUnit('Gaj');
      setDimensions('30 x 60 ft');
      setExpectedPrice(11000000);
      setRoadWidthFt(40);
      setBedrooms(0);
      setBathrooms(0);
    } else if (type === 'Kothi') {
      setSubType('1 Kanal Luxury Independent Kothi');
      setAreaValue(1);
      setAreaUnit('Kanal');
      setDimensions('50 x 90 ft');
      setExpectedPrice(38000000);
      setRoadWidthFt(60);
      setBedrooms(5);
      setBathrooms(5);
    } else if (type === 'SCO') {
      setSubType('Commercial SCO Showroom (B+G+3)');
      setAreaValue(125);
      setAreaUnit('Gaj');
      setDimensions('16.5 x 68 ft');
      setExpectedPrice(45000000);
      setRoadWidthFt(100);
      setBedrooms(0);
      setBathrooms(4);
    } else if (type === 'Flat') {
      setSubType('Luxury 3+1 BHK High-Rise Flat');
      setAreaValue(2150);
      setAreaUnit('Sq.Ft');
      setDimensions('Super Built-up 2150 Sq.Ft');
      setExpectedPrice(13500000);
      setRoadWidthFt(80);
      setBedrooms(3);
      setBathrooms(3);
    }
  };

  // Handle sample file upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Submit Listing Handler ("ਆਖਰ a submit button")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    const newProperty = addProperty({
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerMobile: currentUser.mobile,
      sellerRole: activeRole === 'mediator' ? 'mediator' : 'seller',
      propertyType,
      subType,
      areaValue: Number(areaValue),
      areaUnit,
      dimensions,
      expectedPrice: Number(expectedPrice),
      isNegotiable,
      address,
      city,
      localitySector,
      pincode,
      googleLocation,
      photos: photos.length > 0 ? photos : [defaultImagesByType[propertyType]],
      videoUrl: videoUrl.trim() || undefined,
      bedrooms: propertyType === 'Kothi' || propertyType === 'Flat' ? Number(bedrooms) : 0,
      bathrooms: Number(bathrooms),
      facing,
      roadWidthFt: Number(roadWidthFt),
      registryStatus,
      description,
      status: 'available',
      featured: true,
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      onSuccess(newProperty.id);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-xs border border-stone-200 overflow-hidden">
        {/* Form Title Banner */}
        <div className="px-6 py-6 border-b border-stone-200 bg-stone-50/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                {language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਵੇਚਣ ਲਈ ਲਿਸਟ ਕਰੋ' : 'List Property for Sale'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {language === 'pa'
                  ? 'ਜ਼ਮੀਨ, ਪਲਾਟ, ਕੋਠੀ, ਐਸ.ਸੀ.ਓ ਜਾਂ ਫਲੈਟ ਦਾ ਪੂਰਾ ਵੇਰਵਾ, ਰਕਬਾ, ਮੁੱਲ, ਪਤਾ ਅਤੇ ਗੂਗਲ ਲੋਕੇਸ਼ਨ ਦਰਜ ਕਰੋ'
                  : 'Sell Land, Plot, Kothi, SCO, or Flat with verified area, expected price, address, and Google pin'}
              </p>
            </div>
            <div className="text-xs text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto font-medium">
              Seller: <strong className="text-stone-800">{currentUser?.name || 'Guest User'}</strong>
            </div>
          </div>
        </div>

        {submitSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              {language === 'pa' ? 'ਤੁਹਾਡੀ ਪ੍ਰਾਪਰਟੀ ਲਿਸਟ ਹੋ ਗਈ ਹੈ!' : 'Property Successfully Listed!'}
            </h2>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Your property is now live on the marketplace. Verified buyers and mediators will be able to review and make direct offers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* STEP 1: PROPERTY TYPE OPTIONS (Land, Plot, Kothi, SCO, Flat) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">1</span>
                  <span>Choose Property Type (ਕਿਸਮ ਚੁਣੋ)</span>
                </label>
                <span className="text-xs text-stone-500">Select one option</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* 1. Land */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('Land')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center ${
                    propertyType === 'Land'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30'
                      : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <Trees className={`w-7 h-7 mb-2 ${propertyType === 'Land' ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span className="text-sm font-bold text-stone-900">Land</span>
                  <span className="text-xs text-stone-500">ਜ਼ਮੀਨ (Farm/Agri)</span>
                </button>

                {/* 2. Plot */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('Plot')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center ${
                    propertyType === 'Plot'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30'
                      : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <Layers className={`w-7 h-7 mb-2 ${propertyType === 'Plot' ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span className="text-sm font-bold text-stone-900">Plot</span>
                  <span className="text-xs text-stone-500">ਪਲਾਟ (GMADA/Free)</span>
                </button>

                {/* 3. Kothi */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('Kothi')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center ${
                    propertyType === 'Kothi'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30'
                      : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <Home className={`w-7 h-7 mb-2 ${propertyType === 'Kothi' ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span className="text-sm font-bold text-stone-900">Kothi</span>
                  <span className="text-xs text-stone-500">ਕੋਠੀ (Villa/House)</span>
                </button>

                {/* 4. SCO */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('SCO')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center ${
                    propertyType === 'SCO'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30'
                      : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <Store className={`w-7 h-7 mb-2 ${propertyType === 'SCO' ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span className="text-sm font-bold text-stone-900">SCO</span>
                  <span className="text-xs text-stone-500">ਐਸ.ਸੀ.ਓ (Commercial)</span>
                </button>

                {/* 5. Flat */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('Flat')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center col-span-2 sm:col-span-1 ${
                    propertyType === 'Flat'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30'
                      : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <Building2 className={`w-7 h-7 mb-2 ${propertyType === 'Flat' ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span className="text-sm font-bold text-stone-900">Flat</span>
                  <span className="text-xs text-stone-500">ਫਲੈਟ (Apartment)</span>
                </button>
              </div>

              {/* Sub-Type Specification */}
              <div className="mt-3">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Property Title / Sub-classification
                </label>
                <input
                  type="text"
                  required
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  placeholder="e.g. 1 Kanal Duplex Kothi, 125 Gaj SCO, 3 BHK Builder Floor"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* STEP 2: AREA OF OPTION CHOOSE */}
            <div className="pt-4 border-t border-stone-200">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">2</span>
                <span>Area of Option Choose (ਰਕਬਾ / ਸਾਈਜ਼ ਚੁਣੋ)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Numeric Area Value */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Area Value (ਗਿਣਤੀ) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min={0.1}
                    value={areaValue}
                    onChange={(e) => setAreaValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Area Unit Dropdown: Marla, Kanal, Gaj, Sq.Ft, Acre, Bigha */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Choose Unit (ਮਾਪ ਇਕਾਈ) *
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Marla">Marla (ਮਰਲਾ ~ 25 Gaj / 225-272 sq.ft)</option>
                    <option value="Kanal">Kanal (ਕਨਾਲ = 20 Marla / 500 Gaj)</option>
                    <option value="Gaj">Gaj / Sq.Yards (ਗਜ਼ = 9 sq.ft)</option>
                    <option value="Sq.Ft">Sq.Ft (ਸਕੁਏਅਰ ਫੁੱਟ)</option>
                    <option value="Acre">Acre / Killa (ਏਕੜ = 8 Kanal = 4840 Gaj)</option>
                    <option value="Bigha">Bigha (ਬਿੱਘਾ ~ 4 Kanal)</option>
                  </select>
                </div>

                {/* Dimensions (Frontage x Depth) */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dimensions (ਮਾਪ: ਮੱਥਾ x ਲੰਬਾਈ)
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 50 x 90 ft (Front x Depth)"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Conversion Preview Help */}
              <div className="mt-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span>
                  <strong>Equivalent in Gaj:</strong> ≈ {convertArea(areaValue, areaUnit, 'Gaj')} Gaj (Sq.Yards)
                  &nbsp;·&nbsp;
                  <strong>In Sq.Ft:</strong> ≈ {convertArea(areaValue, areaUnit, 'Sq.Ft')} Sq.Ft
                </span>
                {areaUnit === 'Kanal' && <span className="text-amber-800 font-medium font-mono">1 Kanal = 20 Marla = 500 Gaj</span>}
                {areaUnit === 'Acre' && <span className="text-amber-800 font-medium font-mono">1 Acre = 8 Kanal = 160 Marla</span>}
              </div>
            </div>

            {/* STEP 3: PRICE EXPECTED */}
            <div className="pt-4 border-t border-stone-200">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">3</span>
                <span>Price Expected (ਮੰਗਿਆ ਗਿਆ ਮੁੱਲ)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Expected Price in ₹ (ਰੁਪਏ ਵਿੱਚ ਰਕਮ) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-500 font-medium text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min={100000}
                      step={50000}
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg text-sm font-mono text-stone-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-900 font-medium block">Price Display:</span>
                    <span className="text-lg font-bold text-amber-900 font-display">
                      {formatIndianCurrency(expectedPrice)}
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                    />
                    <span>Negotiable (ਮੁੱਲ ਘੱਟ-ਵੱਧ ਹੋ ਸਕਦਾ ਹੈ)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* STEP 4: ADDRESS */}
            <div className="pt-4 border-t border-stone-200">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">4</span>
                <span>Address of Property (ਪ੍ਰਾਪਰਟੀ ਦਾ ਪੂਰਾ ਪਤਾ)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address / House / Plot / Kothi Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Kothi #142, Street 5, Near Gurudwara Sahib"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sector / Locality / Tehsil *
                  </label>
                  <input
                    type="text"
                    required
                    value={localitySector}
                    onChange={(e) => setLocalitySector(e.target.value)}
                    placeholder="e.g. Sector 70, Aerocity Block C, Model Town"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City (ਸ਼ਹਿਰ) *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mohali"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="160071"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 5: GOOGLE LOCATION */}
            <div className="pt-4 border-t border-stone-200">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">5</span>
                <span>Google Location (ਗੂਗਲ ਮੈਪ ਪਿਨ)</span>
              </label>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{googleLocation.landmark || `${city}, Punjab`}</span>
                  </div>
                  <div className="text-xs text-stone-500 font-mono">
                    Coordinates: {googleLocation.lat.toFixed(4)}° N, {googleLocation.lng.toFixed(4)}° E
                  </div>
                  <a
                    href={googleLocation.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium underline pt-1"
                  >
                    View on Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg transition-colors shadow-xs shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose Location on Map</span>
                </button>
              </div>
            </div>

            {/* STEP 6: PHOTOS OR VIDEOS OF PROPERTY */}
            <div className="pt-4 border-t border-stone-200">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">6</span>
                <span>Photos or Videos of Property (ਫੋਟੋਆਂ ਜਾਂ ਵੀਡੀਓ)</span>
              </label>

              {/* Photo Upload & Gallery */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {photos.map((src, index) => (
                    <div key={index} className="relative w-28 h-20 rounded-lg overflow-hidden border border-stone-300 shrink-0 group">
                      <img src={src} alt={`Property ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {photos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Upload button box */}
                  <label className="w-28 h-20 rounded-lg border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-stone-100 flex flex-col items-center justify-center text-xs text-stone-600 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-5 h-5 text-amber-600 mb-1" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Video Tour URL */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-stone-500" />
                    <span>Video Tour Link (Optional - YouTube / Drone link)</span>
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* STEP 7: ADDITIONAL ATTRIBUTES */}
            <div className="pt-4 border-t border-stone-200">
              <label className="text-sm font-bold text-stone-900 block mb-3">
                Key Details &amp; Legal Title Status (ਮੁੱਖ ਵੇਰਵੇ)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-xs">
                {(propertyType === 'Kothi' || propertyType === 'Flat') && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        min={1}
                        value={bedrooms}
                        onChange={(e) => setBedrooms(parseInt(e.target.value) || 1)}
                        className="w-full px-2.5 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        min={1}
                        value={bathrooms}
                        onChange={(e) => setBathrooms(parseInt(e.target.value) || 1)}
                        className="w-full px-2.5 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Road Width (ft)</label>
                  <input
                    type="number"
                    value={roadWidthFt}
                    onChange={(e) => setRoadWidthFt(parseInt(e.target.value) || 30)}
                    className="w-full px-2.5 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Facing</label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full px-2.5 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                  >
                    <option value="North-East (Park Facing)">North-East (Park Facing)</option>
                    <option value="North Facing">North Facing</option>
                    <option value="East Facing">East Facing</option>
                    <option value="Corner Facing">Corner Plot / Two-side Road</option>
                    <option value="West Facing">West Facing</option>
                    <option value="South Facing">South Facing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Title &amp; Registry Status (ਰਜਿਸਟਰੀ / ਮਾਲਕੀ ਸਥਿਤੀ)
                </label>
                <input
                  type="text"
                  value={registryStatus}
                  onChange={(e) => setRegistryStatus(e.target.value)}
                  placeholder="e.g. Clear Title / GMADA Allotted / Registry Done / NOC in Hand"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description / Features (ਵੇਰਵਾ)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                ></textarea>
              </div>
            </div>

            {/* STEP 8: SUBMIT BUTTON ("ਆਖਰ a submit button") */}
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500">
                By submitting, your listing will be immediately broadcasted to active registered buyers and mediators.
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? 'Submitting Property...'
                    : language === 'pa'
                    ? 'ਲਿਸਟਿੰਗ ਸਬਮਿਟ ਕਰੋ (Submit Listing)'
                    : 'Submit Property Listing'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Google Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        initialLocation={googleLocation}
        city={city}
        onSelectLocation={(loc) => setGoogleLocation(loc)}
      />
    </div>
  );
};
