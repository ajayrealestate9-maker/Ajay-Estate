export type PropertyType = 'Land' | 'Plot' | 'Kothi' | 'SCO' | 'Flat';

export type AreaUnit = 'Marla' | 'Kanal' | 'Gaj' | 'Sq.Ft' | 'Acre' | 'Bigha';

export type UserRole = 'buyer' | 'seller' | 'mediator';

export type Language = 'en' | 'pa';

export interface UserProfile {
  id: string;
  mobile: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  password?: string;
  activeRole: UserRole;
  agencyName?: string;
  reraNumber?: string;
  commissionRate?: number;
  experienceYears?: number;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface GoogleLocation {
  lat: number;
  lng: number;
  landmark: string;
  locality: string;
  mapsUrl: string;
}

export interface PropertyListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerMobile: string;
  sellerRole: 'seller' | 'mediator';
  propertyType: PropertyType;
  subType: string;
  areaValue: number;
  areaUnit: AreaUnit;
  dimensions?: string;
  expectedPrice: number; // in INR
  isNegotiable: boolean;
  address: string;
  city: string;
  localitySector: string;
  pincode: string;
  googleLocation: GoogleLocation;
  photos: string[];
  videoUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
  facing?: string;
  roadWidthFt?: number;
  registryStatus: string;
  description: string;
  postedAt: string;
  featured?: boolean;
  status: 'available' | 'under_token' | 'sold';
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerMobile: string;
  propertyTypes: PropertyType[];
  city: string;
  preferredLocalities: string[];
  minBudget: number;
  maxBudget: number;
  desiredAreaMin: number;
  desiredAreaMax: number;
  areaUnit: AreaUnit;
  bedroomsNeeded?: number;
  purpose: 'Residence' | 'Commercial' | 'Investment' | 'Agriculture';
  urgency: 'Immediate (15 Days)' | 'Within 1 Month' | 'Within 3 Months';
  notes?: string;
  createdAt: string;
}

export interface InquiryOffer {
  id: string;
  propertyId: string;
  propertyTitle: string;
  senderId: string;
  senderName: string;
  senderMobile: string;
  senderRole: UserRole;
  offeredPrice?: number;
  message: string;
  preferredVisitDate?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

// In-app messaging types
export type DocumentAttachmentType = 'registry' | 'fard' | 'noc' | 'layout' | 'id_proof';

export interface DocumentAttachment {
  id: string;
  name: string;
  fileSize: string;
  documentType: DocumentAttachmentType;
  downloadUrl: string;
  verified?: boolean;
}

export interface PropertyAttachment {
  id: string;
  subType: string;
  propertyType: PropertyType;
  expectedPrice: number;
  city: string;
  localitySector: string;
  photoUrl: string;
  areaText: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  propertyAttachment?: PropertyAttachment;
  documentAttachment?: DocumentAttachment;
  isRead: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: UserRole;
  mobile: string;
  agencyName?: string;
}

export interface ChatConversation {
  id: string;
  participants: ChatParticipant[];
  propertyId?: string;
  propertyTitle?: string;
  propertyPrice?: number;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  createdAt: string;
}

export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'date_desc'
  | 'area_desc'
  | 'area_asc';

export interface SearchFilterState {
  keyword: string;
  propertyTypes: PropertyType[];
  city: string;
  locality: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  areaUnit: AreaUnit;
  facing: string;
  minRoadWidthFt: number;
  negotiableOnly: boolean;
  sortBy: SortOption;
}
