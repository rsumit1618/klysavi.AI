const { initializeApp } = require('firebase/app');
const { getFirestore, doc, collection, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyCe482qkY-KtUh3kflvuYvJ9CRXzIc8S1c',
  authDomain: 'echo-me-fe509.firebaseapp.com',
  databaseURL: 'https://echo-me-fe509-default-rtdb.firebaseio.com',
  projectId: 'echo-me-fe509',
  storageBucket: 'echo-me-fe509.firebasestorage.app',
  messagingSenderId: '395070756993',
  appId: '1:395070756993:web:f4be044653eb429e23d580',
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
