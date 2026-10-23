export type PropertyType = 
  | 'house' 
  | 'bedsitter' 
  | 'self_contained' 
  | 'shop' 
  | 'office' 
  | 'warehouse' 
  | 'other';

export type PropertyStatus = 
  | 'available' 
  | 'rented' 
  | 'pending_approval' 
  | 'rejected';

export type UserRole = 'visitor' | 'landlord' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isSuspended?: boolean;
  registeredAt: string;
}

export interface Property {
  id: string;
  title: string;
  propertyType: PropertyType;
  monthlyRentZmw: number;
  location: string;
  addressOrLandmark: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  photographs: string[];
  landlordId: string;
  landlordName: string;
  phone: string;
  whatsapp?: string;
  dateAvailable: string;
  status: PropertyStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
  viewsCount: number;
  isFeatured?: boolean;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterName: string;
  reporterContact: string;
  reason: 'fraud_scam' | 'incorrect_price' | 'already_rented' | 'fake_photos' | 'wrong_location' | 'other';
  details: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface FilterOptions {
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number | 'any';
  status?: string;
  searchQuery?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}
