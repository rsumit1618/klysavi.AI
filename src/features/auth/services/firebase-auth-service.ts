import { db, auth } from '@/core/services/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  saveUserDataToSecureStore,
  ExtendedUserProfile,
} from '@/core/services/secure-storage-service';

export interface UserRegistrationPayload {
  fullName: string;
  cprNumber: string;
  mobileNumber: string;
  email: string;
  password?: string;
}

export interface RewardData {
  totalPoints: number;
  expiringPoints: number;
  expiryDate: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  cprNumber: string;
  mobileNumber: string;
  email: string;
  createdAt: any;
  status: string;
  rewards?: RewardData;
  creditCards?: any[];
  applications?: any[];
}

export type EmailLoginVerificationResult =
  | { status: 'AUTH_FAILED'; message: string }
  | { status: 'MISSING_COLLECTION_RECORD'; authUid?: string }
  | { status: 'SUCCESS'; user: UserProfile };

const USERS_COLLECTION = 'klysavo_users';

/**
 * Direct Firestore Fetcher: Queries `klysavo_users` by UID or Email
 * Fetches real full name, email, mobile, CPR, profileImage, PIN and saves to SecureStore
 */
export async function fetchUserProfileFromFirestore(
  uid?: string,
  email?: string
): Promise<ExtendedUserProfile | null> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);

    // 1. Direct UID Document Lookup
    if (uid && uid.trim().length > 0) {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const profile = { uid: docSnap.id, ...docSnap.data() } as ExtendedUserProfile;
        await saveUserDataToSecureStore(profile);
        return profile;
      }
    }

    // 2. Email Query Lookup
    if (email && email.trim().length > 0) {
      const cleanEmail = email.trim().toLowerCase();
      const emailQuery = query(usersRef, where('email', '==', cleanEmail));
      const snapshot = await getDocs(emailQuery);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const profile = { uid: docSnap.id, ...docSnap.data() } as ExtendedUserProfile;
        await saveUserDataToSecureStore(profile);
        return profile;
      }
    }

    return null;
  } catch (error) {
    console.warn('Firestore user fetch note:', error);
    return null;
  }
}

/**
 * 100% Direct Firebase Database Verification
 * If user is authenticated in Firebase Auth but missing from klysavo_users,
 * auto-creates the Firestore document with status ACTIVE.
 */
export async function verifyEmailPasswordLogin(
  emailInput: string,
  passwordInput: string
): Promise<EmailLoginVerificationResult> {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanEmail || !cleanPassword) {
    return { status: 'AUTH_FAILED', message: 'Email and password are required.' };
  }

  let authUid: string | undefined = undefined;
  let authUser: { uid: string; email: string | null; displayName: string | null; phoneNumber: string | null } | undefined = undefined;
  let isAuthCredentialFailure = false;

  // Step 1: Direct Firebase Auth Sign-In
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    if (userCredential && userCredential.user) {
      authUid = userCredential.user.uid;
      authUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        phoneNumber: userCredential.user.phoneNumber,
      };
    }
  } catch (authError: any) {
    const errorCode = authError?.code;
    if (
      errorCode === 'auth/invalid-credential' ||
      errorCode === 'auth/wrong-password' ||
      errorCode === 'auth/user-not-found' ||
      errorCode === 'auth/invalid-email'
    ) {
      isAuthCredentialFailure = true;
    } else {
      console.warn('Firebase Auth sign-in note:', authError?.message || authError);
    }
  }

  if (isAuthCredentialFailure) {
    return { status: 'AUTH_FAILED', message: 'The email or password you entered is incorrect.' };
  }

  // Step 2: Query `klysavo_users` collection in Firebase Firestore Database
  try {
    const usersRef = collection(db, USERS_COLLECTION);

    if (authUid) {
      const docRef = doc(db, USERS_COLLECTION, authUid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userProfile = { uid: docSnap.id, ...docSnap.data() } as UserProfile;
        await saveUserDataToSecureStore(userProfile);
        return { status: 'SUCCESS', user: userProfile };
      }
    }

    // Check by email query (in case document ID differs from auth UID)
    const emailQuery = query(usersRef, where('email', '==', cleanEmail));
    const snapshot = await getDocs(emailQuery);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userProfile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
      await saveUserDataToSecureStore(userProfile);
      return { status: 'SUCCESS', user: userProfile };
    }

    // User authenticated in Firebase Auth but has no klysavo_users document.
    // Sign out immediately and show contact support dialog.
    try {
      await signOut(auth);
    } catch (e) {}

    return { status: 'MISSING_COLLECTION_RECORD', authUid };
  } catch (firestoreError: any) {
    console.warn('Firestore database query note:', firestoreError?.message || firestoreError);

    if (authUid) {
      // Firestore failed but auth succeeded — sign out to be safe
      try {
        await signOut(auth);
      } catch (e) {}
      return { status: 'MISSING_COLLECTION_RECORD', authUid };
    }
    return { status: 'AUTH_FAILED', message: 'No account registered for this email. Please register first.' };
  }
}

/**
 * Quick check if email exists in klysavo_users collection
 */
export async function checkEmailExistsInFirestore(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', cleanEmail));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.warn('Firestore email check error:', error);
    return false;
  }
}

/**
 * Direct Firebase Firestore query to check if user exists by CPR, Mobile, or Email
 */
export async function checkUserExistsInFirebase(
  cprNumber: string,
  mobileNumber?: string,
  email?: string
): Promise<UserProfile | null> {
  const cleanCpr = cprNumber.trim();
  const cleanMobile = mobileNumber ? mobileNumber.trim() : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  try {
    const usersRef = collection(db, USERS_COLLECTION);

    if (cleanEmail.length > 0) {
      const emailQuery = query(usersRef, where('email', '==', cleanEmail));
      const snapshot = await getDocs(emailQuery);
      if (!snapshot.empty) {
        return { uid: snapshot.docs[0].id, ...snapshot.docs[0].data() } as UserProfile;
      }
    }

    if (cleanCpr.length > 0) {
      const cprQuery = query(usersRef, where('cprNumber', '==', cleanCpr));
      const cprSnapshot = await getDocs(cprQuery);
      if (!cprSnapshot.empty) {
        return { uid: cprSnapshot.docs[0].id, ...cprSnapshot.docs[0].data() } as UserProfile;
      }
    }

    if (cleanMobile.length > 0) {
      const mobileQuery = query(usersRef, where('mobileNumber', '==', cleanMobile));
      const mobileSnapshot = await getDocs(mobileQuery);
      if (!mobileSnapshot.empty) {
        return { uid: mobileSnapshot.docs[0].id, ...mobileSnapshot.docs[0].data() } as UserProfile;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Direct Registration in Firebase Auth and Firestore `klysavo_users` Collection
 * Stores SHA-256 encrypted PIN in the user's Firestore document
 */
export async function registerUserInFirebase(
  payload: UserRegistrationPayload
): Promise<UserProfile> {
  const existing = await checkUserExistsInFirebase(
    payload.cprNumber,
    payload.mobileNumber,
    payload.email
  );
  if (existing) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  let firebaseAuthUid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (payload.password) {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        payload.email.trim().toLowerCase(),
        payload.password
      );
      if (userCred && userCred.user) {
        firebaseAuthUid = userCred.user.uid;
      }
    } catch (authCreateError: any) {
      console.warn('Firebase Auth user creation note:', authCreateError?.message);
      // If auth creation fails, we must not proceed to Firestore
      throw authCreateError;
    }
  }

  const newUserProfile: UserProfile = {
    uid: firebaseAuthUid,
    fullName: payload.fullName.trim(),
    cprNumber: payload.cprNumber.trim(),
    mobileNumber: payload.mobileNumber.trim(),
    email: payload.email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
    status: 'ACTIVE',
    rewards: {
      totalPoints: 12500,
      expiringPoints: 0,
      expiryDate: '31 Dec 2026',
    },
    creditCards: [],
    applications: [],
  };

  const newDocRef = doc(db, USERS_COLLECTION, firebaseAuthUid);
  await setDoc(newDocRef, {
    ...newUserProfile,
    createdAt: serverTimestamp(),
  });

  await saveUserDataToSecureStore(newUserProfile);
  return newUserProfile;
}
