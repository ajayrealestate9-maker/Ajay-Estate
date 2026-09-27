import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, X, Check } from 'lucide-react';
import { GoogleLocation } from '../types';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: GoogleLocation;
  city?: string;
  onSelectLocation: (location: GoogleLocation) => void;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; label: string }> = {
  'Mohali': { lat: 30.7046, lng: 76.7179, label: 'Mohali (SAS Nagar), Punjab' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, label: 'Chandigarh City' },
  'Zirakpur': { lat: 30.6425, lng: 76.8173, label: 'Zirakpur, Punjab' },
  'Ludhiana': { lat: 30.9010, lng: 75.8573, label: 'Ludhiana Industrial Hub' },
  'Amritsar': { lat: 31.6340, lng: 74.8723, label: 'Amritsar Holy City' },
  'Jalandhar': { lat: 31.3260, lng: 75.5762, label: 'Jalandhar Doaba' },
  'Patiala': { lat: 30.3398, lng: 76.3869, label: 'Patiala Royal City' },
};

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  initialLocation,
  city = 'Mohali',
  onSelectLocation,
}) => {
  const defaultCoord = CITY_COORDINATES[city] || CITY_COORDINATES['Mohali'];

  const [lat, setLat] = useState<number>(initialLocation?.lat || defaultCoord.lat);
  const [lng, setLng] = useState<number>(initialLocation?.lng || defaultCoord.lng);
  const [landmark, setLandmark] = useState<string>(initialLocation?.landmark || 'Near Main Market & Sector Divider Road');
  const [locality, setLocality] = useState<string>(initialLocation?.locality || `${city}, Punjab`);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  if (!isOpen) return null;

  const handleQuickCity = (cityName: string) => {
    const target = CITY_COORDINATES[cityName];
    if (target) {
      setLat(target.lat);
      setLng(target.lng);
      setLocality(`${cityName}, Punjab`);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Relative click on simulated map canvas
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Slight delta adjustment from base coordinates
    const deltaLat = ((y / rect.height) - 0.5) * -0.05;
    const deltaLng = ((x / rect.width) - 0.5) * 0.05;

    setLat(Number((lat + deltaLat).toFixed(4)));
    setLng(Number((lng + deltaLng).toFixed(4)));
  };

  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

  const handleConfirm = () => {
    onSelectLocation({
      lat,
      lng,
      landmark,
      locality,
      mapsUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">Pin Google Location</h3>
            <p className="text-xs text-stone-500">Click on the map or select a sector/city to set GPS coordinates for buyers</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Quick Selector */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-500 font-medium shrink-0">Quick Focus:</span>
          {Object.keys(CITY_COORDINATES).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleQuickCity(c)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                locality.includes(c)
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Map Canvas */}
        <div className="p-6 space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-stone-300">
            {/* Map Controls */}
            <div className="absolute top-3 right-3 z-10 flex gap-1 bg-white/95 backdrop-blur-xs rounded-md shadow-sm border border-stone-200 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMapType('standard')}
                className={`px-2.5 py-1 rounded ${mapType === 'standard' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Street Map
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded ${mapType === 'satellite' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Satellite
              </button>
            </div>

            {/* Interactive Simulated Map Grid */}
            <div
              onClick={handleMapClick}
              className={`w-full h-64 cursor-crosshair relative flex items-center justify-center transition-all ${
                mapType === 'satellite'
                  ? 'bg-stone-800'
                  : 'bg-[#e5e3df]'
              }`}
              style={{
                backgroundImage: mapType === 'satellite'
                  ? 'radial-gradient(circle, #2d3748 10%, #1a202c 90%)'
                  : 'radial-gradient(circle, #d6d3cb 10%, #e8e6e1 90%)',
              }}
            >
              {/* Simulated road grid vectors */}
              <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="40" x2="100%" y2="40" stroke="#fefefe" strokeWidth="4" />
                <line x1="0" y1="120" x2="100%" y2="120" stroke="#f6ad55" strokeWidth="6" />
                <line x1="0" y1="200" x2="100%" y2="200" stroke="#fefefe" strokeWidth="4" />
                <line x1="80" y1="0" x2="80" y2="100%" stroke="#fefefe" strokeWidth="4" />
                <line x1="220" y1="0" x2="220" y2="100%" stroke="#f6ad55" strokeWidth="6" />
                <line x1="380" y1="0" x2="380" y2="100%" stroke="#fefefe" strokeWidth="4" />
                <line x1="520" y1="0" x2="520" y2="100%" stroke="#fefefe" strokeWidth="4" />
              </svg>

              {/* Center Pin Indicator */}
              <div className="relative z-10 flex flex-col items-center pointer-events-none transform -translate-y-4 animate-bounce">
                <div className="bg-red-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="w-2 h-2 bg-stone-900 rounded-full mt-0.5 opacity-50 blur-xs"></div>
              </div>

              {/* Pin Tooltip */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded shadow border border-stone-200 text-xs">
                <span className="font-semibold text-stone-900">Pin placed at: </span>
                <span className="font-mono text-stone-600">{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Nearest Landmark / Sector Road</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Ivy Hospital, 200ft Airport Road"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Locality &amp; City Name</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Sector 70, Mohali, Punjab"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Coordinates display & Google Maps link */}
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <Navigation className="w-4 h-4 text-amber-600" />
              <span>Google Maps URL: <code className="text-stone-800 font-mono">{mapsUrl}</code></span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-medium underline"
            >
              Open in Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-stone-50 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-xs"
          >
            <Check className="w-4 h-4" />
            Save Google Location
          </button>
        </div>
      </div>
    </div>
  );
};
