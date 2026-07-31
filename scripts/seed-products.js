const { initializeApp } = require('firebase/app');
const { getFirestore, doc, collection, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const parentDocRef = doc(db, 'klysavo-users', 'klysavo-products');

const products = {
  credit_cards: [
    {
      id: 'cc_imtiaz_gold',
      type: 'CREDIT_CARD',
      name: 'IMTIAZ GOLD',
      title: 'Imtiaz Gold Credit Card',
      description: 'Exclusive benefits and premium rewards for your lifestyle.',
      criteria: 'Minimum salary BHD 500. Age 21-60.',
      imageBannerId: 'imtiaz_gold',
      bannerType: 'MINT',
      categoryLabel: 'CREDIT CARDS'
    },
    {
      id: 'cc_imtiaz_platinum',
      type: 'CREDIT_CARD',
      name: 'IMTIAZ PLATINUM',
      title: 'Imtiaz Platinum Credit Card',
      description: 'Luxury redefined with global lounge access and higher rewards.',
      criteria: 'Minimum salary BHD 1000. Age 21-60.',
      imageBannerId: 'imtiaz_platinum',
      bannerType: 'CREAM'
    }
  ],
  loan_cards: [
    {
      id: 'loan_personal',
      type: 'LOAN',
      name: 'PERSONAL LOAN',
      title: 'Personal Loan',
      description: 'Instant approvals with flexible repayment plans.',
      criteria: 'Minimum salary BHD 300. Employed for 6+ months.',
      imageBannerId: 'personal_loan',
      bannerType: 'MINT',
      categoryLabel: 'LOANS'
    }
  ],
  insurance_cards: [
    {
      id: 'ins_medical',
      type: 'INSURANCE',
      name: 'MEDICAL INSURANCE',
      title: 'Comprehensive Medical Insurance',
      description: 'Full health coverage for you and your family.',
      criteria: 'Bahrain Resident. Valid CPR.',
      imageBannerId: 'medical_insurance',
      bannerType: 'CREAM',
      categoryLabel: 'INSURANCE'
    }
  ]
};

async function seed() {
  console.log('Starting seed...');
  for (const [subcollection, docs] of Object.entries(products)) {
    const subRef = collection(parentDocRef, subcollection);
    for (const data of docs) {
      await setDoc(doc(subRef, data.id), data);
      console.log(`Added ${data.id} to ${subcollection}`);
    }
  }
  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
