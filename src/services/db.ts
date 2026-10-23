import { FilterOptions, Property, PropertyReport, PropertyStatus, User } from '../types';
import { INITIAL_PROPERTIES } from './sampleData';

const STORAGE_KEY_PROPERTIES = 'kwahae_estates_properties_v1';
const STORAGE_KEY_FAVOURITES = 'kwahae_estates_favourites_v1';
const STORAGE_KEY_REPORTS = 'kwahae_estates_reports_v1';
const STORAGE_KEY_USERS = 'kwahae_estates_users_v1';

// Seed default users if not present
const DEFAULT_USERS: User[] = [
  {
    id: 'admin-01',
    fullName: 'District Administrator',
    email: 'admin@kwahae.zm',
    phone: '+260977000111',
    role: 'admin',
    registeredAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'landlord-mubita-01',
    fullName: 'Mr. Mubita Silishebo',
    email: 'mubita.silishebo@gmail.com',
    phone: '+260977451290',
    role: 'landlord',
    registeredAt: '2026-09-12T10:00:00.000Z'
  },
  {
    id: 'landlord-namakau-02',
    fullName: 'Mrs. Namakau Sitwala',
    email: 'namakau.sitwala@yahoo.com',
    phone: '+260966812345',
    role: 'landlord',
    registeredAt: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'landlord-inonge-03',
    fullName: 'Bwana Inonge Akapelwa',
    email: 'inonge.akapelwa@gmail.com',
    phone: '+260978901234',
    role: 'landlord',
    registeredAt: '2026-10-02T15:00:00.000Z'
  }
];

// Helper to safely load JSON
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

// Helper to save JSON
function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Initialize database with seed data if empty
export function initDatabase(): void {
  const existingProps = getStored<Property[]>(STORAGE_KEY_PROPERTIES, []);
  if (!existingProps || existingProps.length === 0) {
    setStored(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  } else {
    // Migrate any older location names to user's updated Senanga locations
    let modified = false;
    const migrated = existingProps.map((p) => {
      let loc = p.location;
      if (loc === 'Matafale') { loc = 'Mungule East'; modified = true; }
      else if (loc === 'Litambole') { loc = 'Katuya'; modified = true; }
      else if (loc === 'Silele') { loc = 'Silele - RoadAbout'; modified = true; }
      else if (loc === 'Silumbu') { loc = 'Mungule West'; modified = true; }
      else if (loc === 'Harbour & Zambezi River Front') { loc = 'Airport / Namalangu Area'; modified = true; }
      else if (loc === 'Sioma Road') { loc = 'Nayaya - New Road'; modified = true; }
      return loc !== p.location ? { ...p, location: loc } : p;
    });
    if (modified) {
      setStored(STORAGE_KEY_PROPERTIES, migrated);
    }
  }

  const existingUsers = getStored<User[]>(STORAGE_KEY_USERS, []);
  if (!existingUsers || existingUsers.length === 0) {
    setStored(STORAGE_KEY_USERS, DEFAULT_USERS);
  }
}

// --- PROPERTIES CRUD ---

export function getProperties(filters: FilterOptions = {}, isAdmin: boolean = false): Property[] {
  initDatabase();
  const all = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);

  let filtered = all.filter(p => {
    // Non-admins only see approved listings (both available and rented)
    if (!isAdmin) {
      if (p.status !== 'available' && p.status !== 'rented') {
        return false;
      }
    }

    // Property Type filter
    if (filters.propertyType && filters.propertyType !== 'all') {
      if (p.propertyType !== filters.propertyType) return false;
    }

    // Location filter
    if (filters.location && filters.location !== 'all') {
      if (!p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    }

    // Price range
    if (filters.minPrice !== undefined && p.monthlyRentZmw < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.monthlyRentZmw > filters.maxPrice) return false;

    // Bedrooms
    if (filters.bedrooms !== undefined && filters.bedrooms !== 'any') {
      if (p.bedrooms !== filters.bedrooms) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (p.status !== filters.status) return false;
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchLandmark = p.addressOrLandmark.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchLandmark) return false;
    }

    return true;
  });

  // Sorting
  const sortBy = filters.sortBy || 'newest';
  filtered.sort((a, b) => {
    if (sortBy === 'price_asc') {
      return a.monthlyRentZmw - b.monthlyRentZmw;
    }
    if (sortBy === 'price_desc') {
      return b.monthlyRentZmw - a.monthlyRentZmw;
    }
    // Default newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return filtered;
}

export function getPropertyById(id: string): Property | undefined {
  initDatabase();
  const all = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  const found = all.find(p => p.id === id);
  if (found) {
    // Increment view count subtly
    found.viewsCount = (found.viewsCount || 0) + 1;
    setStored(STORAGE_KEY_PROPERTIES, all);
  }
  return found;
}

export function getLandlordProperties(landlordId: string): Property[] {
  initDatabase();
  const all = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  return all.filter(p => p.landlordId === landlordId);
}

export function createProperty(
  data: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'status'>, 
  autoApproveForDemo: boolean = false
): Property {
  initDatabase();
  const all = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  
  const newProperty: Property = {
    ...data,
    id: 'prop-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4),
    status: autoApproveForDemo ? 'available' : 'pending_approval',
    createdAt: new Date().toISOString(),
    viewsCount: 0,
  };

  all.unshift(newProperty);
  setStored(STORAGE_KEY_PROPERTIES, all);
  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>, userId: string, isAdmin: boolean = false): Property {
  initDatabase();
  const all = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  const index = all.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Property not found');

  const existing = all[index];
  if (!isAdmin && existing.landlordId !== userId) {
    throw new Error('Unauthorized: You can only edit your own listings');
  }

  const updated: Property = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  all[index] = updated;
  setStored(STORAGE_KEY_PROPERTIES, all);
  return updated;
}

export function deleteProperty(id: string, userId: string, isAdmin: boolean = false): boolean {
  initDatabase();
  let all = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  const target = all.find(p => p.id === id);
  if (!target) return false;

  if (!isAdmin && target.landlordId !== userId) {
    throw new Error('Unauthorized: You can only delete your own listings');
  }

  all = all.filter(p => p.id !== id);
  setStored(STORAGE_KEY_PROPERTIES, all);
  return true;
}

export function markPropertyStatus(id: string, status: PropertyStatus, adminNotes?: string): Property {
  initDatabase();
  const all = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  const index = all.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Property not found');

  all[index] = {
    ...all[index],
    status,
    adminNotes: adminNotes ?? all[index].adminNotes,
    updatedAt: new Date().toISOString()
  };

  setStored(STORAGE_KEY_PROPERTIES, all);
  return all[index];
}

// --- FAVOURITES ---

export function getFavourites(): string[] {
  return getStored<string[]>(STORAGE_KEY_FAVOURITES, []);
}

export function isFavourite(propertyId: string): boolean {
  const favs = getFavourites();
  return favs.includes(propertyId);
}

export function toggleFavourite(propertyId: string): boolean {
  let favs = getFavourites();
  const exists = favs.includes(propertyId);
  if (exists) {
    favs = favs.filter(id => id !== propertyId);
  } else {
    favs.push(propertyId);
  }
  setStored(STORAGE_KEY_FAVOURITES, favs);
  return !exists;
}

// --- REPORTS ---

export function createReport(reportData: Omit<PropertyReport, 'id' | 'createdAt' | 'status'>): PropertyReport {
  const reports = getStored<PropertyReport[]>(STORAGE_KEY_REPORTS, []);
  const newReport: PropertyReport = {
    ...reportData,
    id: 'rep-' + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  reports.unshift(newReport);
  setStored(STORAGE_KEY_REPORTS, reports);
  return newReport;
}

export function getReports(): PropertyReport[] {
  return getStored<PropertyReport[]>(STORAGE_KEY_REPORTS, []);
}

export function updateReportStatus(reportId: string, status: 'pending' | 'resolved' | 'dismissed'): void {
  const reports = getStored<PropertyReport[]>(STORAGE_KEY_REPORTS, []);
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports[index].status = status;
    setStored(STORAGE_KEY_REPORTS, reports);
  }
}

// --- USERS & STATS ---

export function getUsers(): User[] {
  return getStored<User[]>(STORAGE_KEY_USERS, DEFAULT_USERS);
}

export function registerUser(user: Omit<User, 'id' | 'registeredAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: 'user-' + Date.now().toString(36),
    registeredAt: new Date().toISOString(),
    isSuspended: false
  };
  users.push(newUser);
  setStored(STORAGE_KEY_USERS, users);
  return newUser;
}

export function toggleUserSuspension(userId: string): boolean {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return false;
  user.isSuspended = !user.isSuspended;
  setStored(STORAGE_KEY_USERS, users);
  return !!user.isSuspended;
}

export function getAdminStats() {
  initDatabase();
  const allProps = getStored<Property[]>(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  const users = getUsers();
  const reports = getReports();

  const totalListings = allProps.length;
  const approvedListings = allProps.filter(p => p.status === 'available' || p.status === 'rented').length;
  const availableListings = allProps.filter(p => p.status === 'available').length;
  const rentedListings = allProps.filter(p => p.status === 'rented').length;
  const pendingApprovals = allProps.filter(p => p.status === 'pending_approval').length;
  const rejectedListings = allProps.filter(p => p.status === 'rejected').length;
  const registeredLandlords = users.filter(u => u.role === 'landlord').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  return {
    totalListings,
    approvedListings,
    availableListings,
    rentedListings,
    pendingApprovals,
    rejectedListings,
    registeredLandlords,
    pendingReports
  };
}

// Reset data to defaults (useful for testing)
export function resetDatabaseToDefaults(): void {
  setStored(STORAGE_KEY_PROPERTIES, INITIAL_PROPERTIES);
  setStored(STORAGE_KEY_USERS, DEFAULT_USERS);
  setStored(STORAGE_KEY_REPORTS, []);
  setStored(STORAGE_KEY_FAVOURITES, []);
}

// Client-side image compression to save mobile data in Senanga
export async function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
