import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = 'klysavo_user_profile';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  cprNumber: string;
  status: string;
  createdAt: string;
}

export interface UserAddress {
  building: string;
  roadStreet: string;
  blockArea: string;
  city: string;
}

export interface RewardTransaction {
  id: string;
  type: 'REDEEM_REWARDS' | 'EARN_REWARDS';
  points: number;
  equivalentValue: string;
  title: string;
  status: 'COMPLETED' | 'PENDING';
  createdAt: string;
}

export interface UserRewards {
  totalPoints: number;
  expiringPoints: number;
  expiryDate: string;
  transactions?: RewardTransaction[];
}

export interface CardApplicationDraft {
  applicationId: string;
  productId: string;
  productTitle: string;
  bank?: string;
  category?: string;
  imageId?: string;
  currentStep: number;
  status: 'PENDING' | 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  updatedAt: string;
  createdAt: string;
  capturedImageUri?: string;
  idDetails?: {
    cprNumber?: string;
    fullName?: string;
    dob?: string;
    expiryDate?: string;
    nationality?: string;
  };
  addressDetails?: {
    flat?: string;
    building?: string;
    road?: string;
    block?: string;
    city?: string;
  };
  emergencyContactDetails?: { name?: string; phone?: string; relationship?: string };
  employmentDetails?: { employer?: string; occupation?: string; monthlySalary?: string };
}

export interface ExtendedUserProfile extends UserProfile {
  profileImage?: string;
  address?: UserAddress;
  rewards?: UserRewards;
  pendingApplications?: CardApplicationDraft[];
  availableBalance?: number;
  isFrozen?: boolean;
  cardFreezeMap?: Record<string, boolean>;
  cardBalanceMap?: Record<string, number>;
  isLoggedIn?: boolean;
}

/**
 * Computes a canonical product key to reliably identify products across catalogs and applications
 */
export function getNormalizedProductKey(item?: {
  productId?: string;
  cardId?: string;
  applicationId?: string;
  productTitle?: string;
  title?: string;
  imageId?: string;
}): string {
  if (!item) return '';

  const candidates = [
    item.cardId,
    item.productId,
    item.applicationId,
    item.title,
    item.productTitle,
    item.imageId,
  ].filter(Boolean) as string[];

  for (const c of candidates) {
    const s = c.toLowerCase().trim();
    if (s.includes('regalia') || s.includes('hdfc')) return 'cc_hdfc_regalia_001';
    if (s.includes('gold') || s.includes('imtiaz_gold')) return 'cc_imtiaz_gold_002';
    if (s.includes('infinite') || s.includes('klysavo_infinite')) return 'cc_klysavo_infinite_003';
    if (s.includes('express') || s.includes('loan_personal')) return 'loan_personal_express_001';
    if (s.includes('mortgage') || s.includes('loan_home') || (s.includes('home') && s.includes('loan'))) return 'loan_home_mortgage_002';
    if (s.includes('fasttrack') || s.includes('loan_car') || (s.includes('car') && s.includes('loan'))) return 'loan_car_fasttrack_003';
    if (s.includes('shield') || s.includes('ins_health') || (s.includes('health') && s.includes('insurance'))) return 'ins_health_shield_001';
    if (s.includes('protect') || s.includes('ins_car') || (s.includes('car') && s.includes('insurance'))) return 'ins_car_protect_002';
    if (s.includes('globetrotter') || s.includes('ins_travel') || (s.includes('travel') && s.includes('insurance'))) return 'ins_travel_globetrotter_003';
  }

  for (const c of candidates) {
    const s = c.toLowerCase().trim().replace(/\s+/g, '_');
    if (s && s !== 'prd_credit_cards' && s !== 'prd_loan_cards' && s !== 'prd_insurance_cards') {
      return s;
    }
  }

  return (item.cardId || item.productId || item.applicationId || '').toLowerCase().trim();
}

/**
 * Helper to deduplicate applications and keep only the latest/highest status application per product
 */
export function cleanAndDeduplicateApplications(apps?: CardApplicationDraft[]): CardApplicationDraft[] {
  if (!apps || !Array.isArray(apps)) return [];

  const statusPriority: Record<string, number> = {
    APPROVED: 4,
    SUBMITTED: 3,
    PENDING: 2,
    DRAFT: 1,
  };

  const productGroups = new Map<string, CardApplicationDraft[]>();

  apps.forEach((app) => {
    if (!app) return;
    const key = getNormalizedProductKey(app);
    if (!key) return;

    const group = productGroups.get(key) || [];
    group.push(app);
    productGroups.set(key, group);
  });

  const deduplicated: CardApplicationDraft[] = [];

  productGroups.forEach((group) => {
    group.sort((a, b) => {
      const scoreA = statusPriority[a.status] || 0;
      const scoreB = statusPriority[b.status] || 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher status wins (APPROVED > SUBMITTED > PENDING)
      }
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA; // Newer wins
    });

    if (group.length > 0) {
      deduplicated.push(group[0]);
    }
  });

  return deduplicated;
}

/**
 * Checks if a given product (catalog card) has already been applied for or active in applications
 */
export function isProductApplied(
  product: { cardId?: string; productId?: string; title?: string; imageId?: string },
  apps?: CardApplicationDraft[]
): boolean {
  if (!product || !apps || !Array.isArray(apps) || apps.length === 0) return false;
  const productKey = getNormalizedProductKey(product);
  if (!productKey) return false;

  return apps.some((app) => {
    if (!app) return false;
    const appKey = getNormalizedProductKey(app);
    return appKey === productKey;
  });
}

export async function saveUserDataToSecureStore(data: ExtendedUserProfile): Promise<void> {
  try {
    const cleaned = {
      ...data,
      pendingApplications: cleanAndDeduplicateApplications(data.pendingApplications),
    };
    const jsonStr = JSON.stringify(cleaned);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonStr);
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

/**
 * Get user profile data from local AsyncStorage
 */
export async function getUserDataFromSecureStore(): Promise<ExtendedUserProfile | null> {
  try {
    const jsonStr = await AsyncStorage.getItem(USER_DATA_KEY);
    if (!jsonStr) return null;
    const parsed = JSON.parse(jsonStr) as ExtendedUserProfile;
    return {
      ...parsed,
      pendingApplications: cleanAndDeduplicateApplications(parsed.pendingApplications),
    };
  } catch (error) {
    console.error('Error reading user profile:', error);
    return null;
  }
}

/**
 * Clear all user session data and local cache without wiping entire AsyncStorage
 * (to preserve Firebase Auth persistence and theme settings)
 */
export async function clearUserDataFromSecureStore(): Promise<void> {
  try {
    // 1. Clear specific app user keys from AsyncStorage
    await AsyncStorage.removeItem(USER_DATA_KEY);

    // 2. Clear sensitive SecureStore keys
    await Promise.all([
      SecureStore.deleteItemAsync('klysavo_user_pin'),
      SecureStore.deleteItemAsync('klysavo.session'),
      SecureStore.deleteItemAsync('klysavo_user_profile'),
    ]);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

export const clearSecureStore = clearUserDataFromSecureStore;

/**
 * Helper to get initials from full name (strictly 2 characters)
 */
export function getInitials(name?: string): string {
  if (!name || !name.trim() || name === 'Registered User' || name === 'Valued User') return 'KU';

  const cleanName = name.trim();
  const parts = cleanName.split(/\s+/).filter(p => p.length > 0);

  if (parts.length === 0) return 'KU';

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Take first letter of first name and first letter of last name
  const first = parts[0][0].toUpperCase();
  const last = parts[parts.length - 1][0].toUpperCase();

  return first + last;
}
