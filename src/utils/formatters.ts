import { AreaUnit } from '../types';

export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹ 0';

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹ ${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹ ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹ ${k.toFixed(0)}k`;
  }
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

export function formatIndianNumber(val: number): string {
  return val.toLocaleString('en-IN');
}

/**
 * Standard Punjab & North Indian land conversion table:
 * 1 Karam = 5.5 ft
 * 1 Sarsahi = 1 Karam x 1 Karam = 30.25 sq ft
 * 1 Marla = 9 Sarsahis = 272.25 sq ft (~ 25-30 Gaj depending on revenue circle, commonly 225-272 sq ft)
 * In urban Punjab / GMADA / PUDA:
 * 1 Gaj (Sq Yard) = 9 sq ft
 * 1 Marla = ~25 Gaj (approx 225 sq ft) or 30 Gaj in rural
 * 1 Kanal = 20 Marla = 500 Gaj (in Mohali/Chandigarh master layout) or 605 Gaj (rural)
 * 1 Acre (Killa) = 8 Kanal = 160 Marla = 4840 Gaj / 43,560 sq ft
 * 1 Bigha = ~4 Kanal (standard half acre)
 */
export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  if (from === to) return value;
  
  // Base unit in Gaj (Square Yards)
  const toGajRatio: Record<AreaUnit, number> = {
    'Gaj': 1,
    'Sq.Ft': 1 / 9,
    'Marla': 25, // Urban Punjab standard
    'Kanal': 500, // 20 Marla
    'Acre': 4840, // 8 Kanal
    'Bigha': 2420, // 4 Kanal approx
  };

  const gajVal = value * toGajRatio[from];
  return Number((gajVal / toGajRatio[to]).toFixed(2));
}

export const translations = {
  en: {
    brand: 'ZameenKothi',
    tagline: 'Punjab & North India Property Marketplace',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    buyer: 'Buyer',
    seller: 'Seller',
    mediator: 'Mediator / Agent',
    buyerDesc: 'Looking to purchase Land, Plot, Kothi, SCO, or Flat',
    sellerDesc: 'List and sell your property directly with clear title',
    mediatorDesc: 'Licensed Dealer / Broker bridging buyers and sellers',
    land: 'Land',
    plot: 'Plot',
    kothi: 'Kothi',
    sco: 'SCO',
    flat: 'Flat',
    allProperties: 'All Properties',
    postRequirement: 'Post Requirement',
    listProperty: 'List Property',
    dealDesk: 'Mediator Desk',
    priceExpected: 'Expected Price',
    area: 'Area Size',
    address: 'Address',
    city: 'City',
    location: 'Google Location',
    photos: 'Photos / Videos',
    submit: 'Submit Listing',
    contactSeller: 'Contact Seller',
    negotiate: 'Make Offer',
    scheduleVisit: 'Schedule Visit',
    myRequirements: 'My Requirements',
    matchScore: 'Match Score',
    verified: 'Verified Title',
  },
  pa: {
    brand: 'ਜ਼ਮੀਨ-ਕੋਠੀ',
    tagline: 'ਪੰਜਾਬ ਅਤੇ ਉੱਤਰੀ ਭਾਰਤ ਪ੍ਰਾਪਰਟੀ ਪੋਰਟਲ',
    register: 'ਰਜਿਸਟਰ ਕਰੋ',
    login: 'ਲਾਗਇਨ',
    logout: 'ਲਾਗਆਊਟ',
    buyer: 'ਖਰੀਦਦਾਰ (Buyer)',
    seller: 'ਵੇਚਣ ਵਾਲਾ (Seller)',
    mediator: 'ਵਿਚੋਲਾ / ਡੀਲਰ (Mediator)',
    buyerDesc: 'ਜ਼ਮੀਨ, ਪਲਾਟ, ਕੋਠੀ, ਐਸ.ਸੀ.ਓ ਜਾਂ ਫਲੈਟ ਖਰੀਦਣ ਦੀ ਮੰਗ ਰੱਖੋ',
    sellerDesc: 'ਆਪਣੀ ਜਾਇਦਾਦ ਬਿਨਾਂ ਕਿਸੇ ਮੁਸ਼ਕਿਲ ਦੇ ਵੇਚਣ ਲਈ ਲਿਸਟ ਕਰੋ',
    mediatorDesc: 'ਪ੍ਰਾਪਰਟੀ ਡੀਲਰ / ਏਜੰਟ: ਗਾਹਕਾਂ ਦਾ ਮੇਲ ਕਰਵਾਓ ਅਤੇ ਸੌਦੇ ਪੱਕੇ ਕਰੋ',
    land: 'ਜ਼ਮੀਨ (Land)',
    plot: 'ਪਲਾਟ (Plot)',
    kothi: 'ਕੋਠੀ (Kothi)',
    sco: 'ਐਸ.ਸੀ.ਓ (SCO)',
    flat: 'ਫਲੈਟ (Flat)',
    allProperties: 'ਸਾਰੀਆਂ ਪ੍ਰਾਪਰਟੀਆਂ',
    postRequirement: 'ਸਮੇਂ ਦੀ ਮੰਗ ਦਰਜ ਕਰੋ',
    listProperty: 'ਪ੍ਰਾਪਰਟੀ ਵੇਚਣ ਲਈ ਪਾਓ',
    dealDesk: 'ਵਿਚੋਲਾ ਡੈਸਕ',
    priceExpected: 'ਮੰਗਿਆ ਮੁੱਲ (Expected Price)',
    area: 'ਰਕਬਾ / ਖੇਤਰਫਲ (Area)',
    address: 'ਪਤਾ (Address)',
    city: 'ਸ਼ਹਿਰ (City)',
    location: 'ਗੂਗਲ ਲੋਕੇਸ਼ਨ (Google Pin)',
    photos: 'ਫੋਟੋਆਂ / ਵੀਡੀਓ (Media)',
    submit: 'ਲਿਸਟਿੰਗ ਸਬਮਿਟ ਕਰੋ (Submit)',
    contactSeller: 'ਸੰਪਰਕ ਕਰੋ',
    negotiate: 'ਮੁੱਲ ਲਗਾਓ',
    scheduleVisit: 'ਮੌਕਾ ਦੇਖਣ ਦਾ ਸਮਾਂ ਲਵੋ',
    myRequirements: 'ਮੇਰੀਆਂ ਮੰਗਾਂ',
    matchScore: 'ਮੈਚ ਸਕੋਰ',
    verified: 'ਵੈਰੀਫਾਈਡ ਰਜਿਸਟਰੀ',
  },
};
