const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyCe482qkY-KtUh3kflvuYvJ9CRXzIc8S1c',
  authDomain: 'echo-me-fe509.firebaseapp.com',
  databaseURL: 'https://echo-me-fe509-default-rtdb.firebaseio.com',
  projectId: 'echo-me-fe509',
  storageBucket: 'echo-me-fe509.firebasestorage.app',
  messagingSenderId: '395070756993',
  appId: '1:395070756993:web:f4be044653eb429e23d580',
  measurementId: 'G-JGY93CKSWR',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function authenticateScriptUser() {
  const adminEmail = 'admin_approver@klysavo.com';
  const adminPass = 'Klysavo#2026';
  try {
    const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
    console.log(`🔐 Authenticated as admin: ${cred.user.email} (${cred.user.uid})`);
    return cred.user.uid;
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
        console.log(`🔐 Registered & Authenticated admin user: ${newCred.user.email} (${newCred.user.uid})`);
        return newCred.user.uid;
      } catch (signupErr) {
        console.warn('Admin user signup note:', signupErr.message);
      }
    }
    console.warn('Auth note:', err.message);
    return null;
  }
}

async function approveAllPendingApplications() {
  console.log('\n================================================================');
  console.log('🚀 [BACKEND APPROVAL SCRIPT] Connecting to Firestore database...');
  console.log('================================================================\n');

  await authenticateScriptUser();

  try {
    const usersColl = collection(db, 'klysavo_users');
    const usersSnap = await getDocs(usersColl);

    if (usersSnap.empty) {
      console.log('⚠️ No user documents found in klysavo_users collection.');
    } else {
      let approvedCount = 0;

      for (const userDoc of usersSnap.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const pendingApps = userData.pendingApplications || [];

        console.log(`👤 Checking user: ${userId} (${userData.fullName || 'User'})`);
        console.log(`   Pending applications count: ${pendingApps.length}`);

        // Step A: Update pendingApplications array on user document
        let updatedList = pendingApps.map((appItem) => {
          if (appItem.status === 'SUBMITTED' || appItem.status === 'PENDING') {
            approvedCount++;
            console.log(`   ✅ Approving App ID #${appItem.applicationId} (${appItem.productTitle})`);
            return {
              ...appItem,
              status: 'APPROVED',
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
          return appItem;
        });

        // Update User Document
        await setDoc(doc(db, 'klysavo_users', userId), { pendingApplications: updatedList }, { merge: true });

        // Step B: Update sub-collection applications
        try {
          const appsSubColl = collection(db, 'klysavo_users', userId, 'applications');
          const appsSnap = await getDocs(appsSubColl);

          for (const appDoc of appsSnap.docs) {
            const appData = appDoc.data();
            if (appData.status === 'SUBMITTED' || appData.status === 'PENDING') {
              await updateDoc(doc(db, 'klysavo_users', userId, 'applications', appDoc.id), {
                status: 'APPROVED',
                approvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              console.log(`   └─ Updated sub-collection doc klysavo_users/${userId}/applications/${appDoc.id} -> APPROVED`);
            }
          }
        } catch (subErr) {
          console.warn('   Sub-collection update note:', subErr.message);
        }
      }

      console.log('\n================================================================');
      console.log(`🎉 [SUCCESS] Approved ${approvedCount} card application(s) in Firestore!`);
      console.log('================================================================\n');
    }
  } catch (error) {
    console.error('❌ Error during backend approval:', error.message);
  } finally {
    process.exit(0);
  }
}

approveAllPendingApplications();
