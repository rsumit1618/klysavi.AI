import { auth, db } from '@/core/api/firebase';
import { APP_CONFIG } from '@/core/constants/app-constants';
import {
  clearSecureStore,
  ExtendedUserProfile,
  getUserDataFromSecureStore,
  saveUserDataToSecureStore,
} from '@/core/services/secure-storage-service';
import { secureStorage } from '@/core/storage/secure-storage';
import { fetchUserProfileFromFirestore } from '@/features/auth/services/firebase-auth-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut as firebaseSignOut, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type AuthSession = {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  cprNumber?: string | null;
  profileImage?: string | null;
};

type Value = {
  isLoading: boolean;
  session: AuthSession | null;
  signIn: (userProfile?: Partial<ExtendedUserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<Value | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        if (firebaseUser) {
          // 1. Firebase Auth says logged in (token is active and valid)
          // 2. Check local storage status
          let storedUser = await getUserDataFromSecureStore();

          // Recovery: If Firebase is authenticated but local profile is missing, try fetching it
          if (!storedUser) {
            storedUser = await fetchUserProfileFromFirestore(firebaseUser.uid);
          }

          const isLocalLoggedIn =
            storedUser &&
            storedUser.uid === firebaseUser.uid &&
            storedUser.isLoggedIn !== false &&
            storedUser.status !== 'logged_out';

          if (isLocalLoggedIn) {
            // BOTH Firebase Auth AND Local Storage confirm user is logged in!
            // storedUser is guaranteed non-null by the isLocalLoggedIn check above.
            let authSession: AuthSession = {
              uid: firebaseUser.uid,
              email: storedUser!.email || firebaseUser.email,
              phoneNumber: storedUser!.mobileNumber || firebaseUser.phoneNumber,
              displayName: storedUser!.fullName || firebaseUser.displayName,
              cprNumber: storedUser!.cprNumber || null,
              profileImage: storedUser!.profileImage || null,
            };

            // Sync with live Firestore user document (if online) to refresh profile
            try {
              const docRef = doc(db, 'klysavo_users', firebaseUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data() as ExtendedUserProfile;
                authSession = {
                  uid: firebaseUser.uid,
                  email: data.email || firebaseUser.email,
                  phoneNumber: data.mobileNumber || firebaseUser.phoneNumber,
                  displayName: data.fullName || firebaseUser.displayName,
                  cprNumber: data.cprNumber || null,
                  profileImage: data.profileImage || null,
                };
                await saveUserDataToSecureStore({
                  ...storedUser!,
                  ...data,
                  uid: firebaseUser.uid,
                  isLoggedIn: true,
                });
              }
            } catch (fsError) {
              console.warn('SessionProvider live Firestore sync note (using valid cached profile):', fsError);
            }

            await secureStorage.setItem(APP_CONFIG.sessionStorageKey, JSON.stringify(authSession));
            setSession(authSession);
          } else {
            // DISCREPANCY: Firebase Auth is true, BUT local storage status is false/missing/logged_out.
            // Action: Sign out from Firebase Auth, clean storage, and route to Login.
            await firebaseSignOut(auth);
            await clearSecureStore();
            await secureStorage.removeItem(APP_CONFIG.sessionStorageKey);
            setSession(null);
          }
        } else {
          // Firebase Auth is null (user is NOT logged in)
          // Action: Clean our specific session storage and set session to null.
          await clearSecureStore();
          await secureStorage.removeItem(APP_CONFIG.sessionStorageKey);
          setSession(null);
        }
      } catch (err) {
        console.warn('SessionProvider startup auth verification error:', err);
        setSession(null);
      } finally {
        // Allow animated splash sequence to complete playing before routing
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1800 - elapsedTime);
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<Value>(
    () => ({
      isLoading,
      session,
      async signIn(userProfile?: Partial<ExtendedUserProfile>) {
        // If this is a profile update (userProfile provided), we don't want to clear the store
        const isUpdate = !!userProfile;

        if (!isUpdate) {
          // Clean slate ONLY for new user login
          await clearSecureStore();
          await secureStorage.removeItem(APP_CONFIG.sessionStorageKey);
        }

        let activeSession: AuthSession;

        if (userProfile && userProfile.uid) {
          activeSession = {
            uid: userProfile.uid,
            email: userProfile.email || null,
            phoneNumber: userProfile.mobileNumber || null,
            displayName: userProfile.fullName || null,
            cprNumber: userProfile.cprNumber || null,
            profileImage: userProfile.profileImage || null,
          };

          // Save to local SecureStore with isLoggedIn: true
          const stored = !isUpdate ? null : await getUserDataFromSecureStore();
          const fullProfile: ExtendedUserProfile = {
            uid: userProfile.uid,
            fullName: userProfile.fullName || stored?.fullName || 'Registered User',
            email: userProfile.email || stored?.email || '',
            mobileNumber: userProfile.mobileNumber || stored?.mobileNumber || '',
            cprNumber: userProfile.cprNumber || stored?.cprNumber || '',
            status: 'active',
            createdAt: stored?.createdAt || new Date().toISOString(),
            isLoggedIn: true,
            ...userProfile,
          };
          await saveUserDataToSecureStore(fullProfile);

          // Mark user logged in on Firestore document
          try {
            const userDocRef = doc(db, 'klysavo_users', userProfile.uid);
            await setDoc(
              userDocRef,
              {
                isLoggedIn: true,
                lastLoginAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (err) {
            console.warn('Firestore mark login note:', err);
          }
        } else {
          const stored = await getUserDataFromSecureStore();
          activeSession = {
            uid: stored?.uid || auth.currentUser?.uid || 'usr_registered_user',
            email: stored?.email || auth.currentUser?.email || null,
            phoneNumber: stored?.mobileNumber || null,
            displayName: stored?.fullName || auth.currentUser?.displayName || null,
            cprNumber: stored?.cprNumber || null,
            profileImage: stored?.profileImage || null,
          };
          if (stored) {
            await saveUserDataToSecureStore({ ...stored, isLoggedIn: true, status: 'active' });
          }
        }

        await secureStorage.setItem(APP_CONFIG.sessionStorageKey, JSON.stringify(activeSession));
        setSession(activeSession);
      },

      /**
       * Complete Logout Process:
       * 1. Call Logout API to invalidate server session (best effort)
       * 2. Mark user logged out in Firebase Firestore (`isLoggedIn: false`, `lastLogoutAt`)
       * 3. Perform Firebase Auth Sign Out (Awaited)
       * 4. Clean up all local storage (SecureStore + AsyncStorage) (Awaited)
       * 5. Set session to null (triggers navigation to /login)
       */
      async signOut() {
        const targetUid = session?.uid || auth.currentUser?.uid;

        // 1. Call Logout API (best-effort — won't block logout if API is unavailable)
        if (APP_CONFIG.apiBaseUrl && targetUid) {
          try {
            await fetch(`${APP_CONFIG.apiBaseUrl}/auth/logout`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ uid: targetUid }),
            });
          } catch {
            // Silently continue
          }
        }

        // 2. Mark Logout in Firebase Firestore Database
        if (targetUid) {
          try {
            const userDocRef = doc(db, 'klysavo_users', targetUid);
            await setDoc(
              userDocRef,
              {
                isLoggedIn: false,
                lastLogoutAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (firestoreLogoutErr) {
            console.warn('Firestore mark logout note:', firestoreLogoutErr);
          }
        }

        // 3. Perform Firebase Auth Sign-Out & wait for completion
        try {
          await firebaseSignOut(auth);
        } catch (authSignOutErr) {
          console.warn('Firebase Auth sign-out note:', authSignOutErr);
        }

        // 4. Clean up specific app local storage (SecureStore + app-specific AsyncStorage keys)
        try {
          await clearSecureStore();
          await secureStorage.removeItem(APP_CONFIG.sessionStorageKey);
        } catch (clearErr) {
          console.warn('Local storage clear note:', clearErr);
        }

        // 5. Only after Firebase Auth sign-out & local storage deletion are 100% complete: update session
        setSession(null);
      },
    }),
    [isLoading, session]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used within SessionProvider.');
  return value;
}
