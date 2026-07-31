const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const DEFAULT_APPLICATION_STEPS = [
  { id: 'scan_id', label: 'Scan ID' },
  { id: 'id_details', label: 'ID Details' },
  { id: 'address', label: 'Address Details' },
  { id: 'contact', label: 'Emergency Contact' },
  { id: 'employment', label: 'Employment Details' },
];

// Grouped Products Catalog by specific document category
const CATEGORIZED_PRODUCTS = {
  credit_cards: {
    productId: "prd_credit_cards",
    categoryTitle: "Credit Cards",
    items: [
      {
        productId: "prd_credit_cards",
        cardId: "cc_hdfc_regalia_001",
        imageId: "img_cc_hdfc_regalia_001",
        title: "HDFC Regalia Credit Card",
        shortDescription: "Premium travel rewards credit card with complimentary airport lounge access and reward points.",
        description: "Designed for frequent travelers and high spenders, offering accelerated rewards, lounge access, dining privileges, and milestone benefits.",
        bank: "HDFC Bank",
        category: "Travel Credit Card",
        image: "",
        rating: 4.8,
        annualFee: 2500,
        joiningFee: 2500,
        eligibility: "Minimum monthly income BHD 800 or equivalent. Age 21 to 60 years.",
        features: [
          "4 Complimentary Airport Lounge Visits per quarter",
          "2.5% Reward Points on International Spends",
          "Comprehensive Travel & Air Accident Cover"
        ],
        benefits: [
          "10,000 Welcome Reward Points on activation",
          "1% Fuel Surcharge Waiver across fuel stations",
          "Exclusive 24x7 Concierge Assistance Service"
        ],
        documentsRequired: [
          "Valid CPR ID Card Copy",
          "Latest 3 Months Salary Certificate or Bank Statements"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 1,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      },
      {
        productId: "prd_credit_cards",
        cardId: "cc_imtiaz_gold_002",
        imageId: "img_cc_imtiaz_gold_002",
        title: "Imtiaz Premium Gold Credit Card",
        shortDescription: "Exclusive cashback credit card with zero annual fee and dining discounts.",
        description: "Tailored for daily lifestyle purchases, providing up to 5% instant cashback on supermarket, dining, and utility bill payments.",
        bank: "BCFC Imtiaz",
        category: "Cashback Credit Card",
        image: "",
        rating: 4.7,
        annualFee: 0,
        joiningFee: 0,
        eligibility: "Minimum monthly income BHD 400. Age 21 to 65 years.",
        features: [
          "5% Unlimited Cashback on Supermarkets & Dining",
          "Zero Annual Fee Lifetime Card",
          "Instant Contactless Tap & Pay Technology"
        ],
        benefits: [
          "BHD 50 Welcome Cashback Voucher",
          "Flexible Easy Payment Plans at 0% Interest for 12 Months",
          "Purchase Protection Guarantee"
        ],
        documentsRequired: [
          "Valid Bahrain CPR / National ID",
          "Employment Proof or Salary Slip"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 2,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      },
      {
        productId: "prd_credit_cards",
        cardId: "cc_klysavo_infinite_003",
        imageId: "img_cc_klysavo_infinite_003",
        title: "Klysavo AI Infinite Rewards Card",
        shortDescription: "Ultra-luxury AI smart credit card with unlimited lounge access and zero FX markup fees.",
        description: "The ultimate credit card powered by Klysavo AI financial engine, providing personalized cashbacks, zero FX fees worldwide, and VIP global airport transfer.",
        bank: "Klysavo AI Bank",
        category: "Ultra Luxury Card",
        image: "",
        rating: 4.9,
        annualFee: 5000,
        joiningFee: 5000,
        eligibility: "Minimum monthly income BHD 1,500. Age 21 to 65 years.",
        features: [
          "Unlimited Global Priority Pass Lounge Access + 2 Guests",
          "Zero Foreign Exchange Markup Fees Worldwide",
          "Personalized AI Cash Back Allocation based on spending habits"
        ],
        benefits: [
          "25,000 Milestone Bonus Reward Points",
          "24/7 Dedicated Private AI Wealth Manager",
          "Golf Course Access & Luxury Hotel Upgrades"
        ],
        documentsRequired: [
          "Valid CPR / ID Card",
          "Latest 6 Months Bank Statements",
          "Proof of Income"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 3,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      }
    ]
  },
  loan_cards: {
    productId: "prd_loan_cards",
    categoryTitle: "Loan Cards",
    items: [
      {
        productId: "prd_loan_cards",
        cardId: "loan_personal_express_001",
        imageId: "img_loan_personal_001",
        title: "Klysavo Express Personal Loan",
        shortDescription: "Instant personal loan up to BHD 40,000 with low interest rates and 60-month repayment.",
        description: "Quick, hassle-free personal financing with digital approval in 10 minutes, flexible tenure options up to 5 years, and competitive interest rates.",
        bank: "Klysavo Finance",
        category: "Personal Loan",
        image: "",
        rating: 4.8,
        annualFee: 0,
        joiningFee: 0,
        eligibility: "Minimum monthly income BHD 300. CPR & active bank account required.",
        features: [
          "Instant Digital Approval in under 10 Minutes",
          "Flexible Repayment Tenure from 12 to 60 Months",
          "Attractive Reduced Interest Rates starting from 4.5% p.a."
        ],
        benefits: [
          "No Guarantor or Collateral Required",
          "Zero Processing Fee Promotion",
          "Same-Day Direct Bank Disbursal"
        ],
        documentsRequired: [
          "Valid CPR ID",
          "Latest Salary Transfer Certificate",
          "3 Months Bank Statements"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 1,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      },
      {
        productId: "prd_loan_cards",
        cardId: "loan_home_mortgage_002",
        imageId: "img_loan_home_002",
        title: "Imtiaz Smart Home Mortgage Loan",
        shortDescription: "Finance your dream home with up to BHD 250,000 financing and up to 25 years tenure.",
        description: "Comprehensive home financing for residential villas, apartments, and land purchase with low down-payment options and fixed/variable interest rates.",
        bank: "BCFC Imtiaz",
        category: "Home Loan",
        image: "",
        rating: 4.9,
        annualFee: 0,
        joiningFee: 0,
        eligibility: "Minimum monthly salary BHD 600. Age 21 to 65 years at loan maturity.",
        features: [
          "Up to 85% Property Valuation Financing",
          "Long Repayment Tenure up to 25 Years",
          "Option to Choose Fixed or Variable Interest Rates"
        ],
        benefits: [
          "Complimentary Property Valuation & Legal Guidance",
          "Free Home Insurance Cover for the First Year",
          "Zero Pre-payment Penalty after 3 Years"
        ],
        documentsRequired: [
          "CPR & Passport Copy",
          "Property Title Deed & Purchase Agreement",
          "6 Months Bank Statements & Income Proof"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 2,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      },
      {
        productId: "prd_loan_cards",
        cardId: "loan_car_fasttrack_003",
        imageId: "img_loan_car_003",
        title: "Klysavo Fast Track Car Loan",
        shortDescription: "Finance new or pre-owned vehicles with up to 100% financing and instant approval.",
        description: "Get on the road faster with Klysavo Fast Track Auto Finance. Offers 100% vehicle financing for brand new cars and certified pre-owned vehicles.",
        bank: "Klysavo Auto Finance",
        category: "Car Loan",
        image: "",
        rating: 4.7,
        annualFee: 0,
        joiningFee: 0,
        eligibility: "Minimum monthly salary BHD 350. Age 21 to 60 years.",
        features: [
          "Up to 100% Financing for New Cars & 80% for Used Cars",
          "Flexible Repayment Options up to 7 Years",
          "Competitive Interest Rates starting from 3.99% p.a."
        ],
        benefits: [
          "1st Year Free Comprehensive Car Insurance Voucher",
          "No Salary Transfer Required for Approved Employers",
          "Instant Showroom Disbursal"
        ],
        documentsRequired: [
          "Valid CPR ID & Driving License",
          "Vehicle Quotation from Car Dealership",
          "3 Months Bank Statements"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 3,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      }
    ]
  },
  insurance_cards: {
    productId: "prd_insurance_cards",
    categoryTitle: "Insurance Cards",
    items: [
      {
        productId: "prd_insurance_cards",
        cardId: "ins_health_shield_001",
        imageId: "img_ins_health_001",
        title: "Klysavo Comprehensive Health Insurance",
        shortDescription: "Complete medical insurance with cash-less hospital coverage worldwide.",
        description: "Protect your family's health with extensive coverage for hospitalization, outpatient consultations, prescription medications, and emergency care worldwide.",
        bank: "Klysavo Health Care",
        category: "Health Insurance",
        image: "",
        rating: 4.8,
        annualFee: 150,
        joiningFee: 0,
        eligibility: "Available for Bahrain residents aged 0 to 75 years.",
        features: [
          "Cashless Medical Treatment at 500+ Hospitals & Clinics",
          "In-patient, Daycare, and Outpatient Coverage",
          "Maternity and Newborn Cover Benefits"
        ],
        benefits: [
          "Free Annual Preventive Health Check-up",
          "24/7 Tele-consultation with Certified Doctors",
          "No Pre-policy Medical Test required under 45 years"
        ],
        documentsRequired: [
          "Valid CPR ID for all insured family members",
          "Medical Declaration Form"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 1,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      },
      {
        productId: "prd_insurance_cards",
        cardId: "ins_car_motor_002",
        imageId: "img_ins_car_002",
        title: "Imtiaz Motor & Car Insurance",
        shortDescription: "Full comprehensive motor insurance including roadside breakdown assistance.",
        description: "Complete vehicle protection against accidents, fire, theft, natural disasters, and third-party liability with 24/7 breakdown recovery.",
        bank: "BCFC Insurance",
        category: "Car Insurance",
        image: "",
        rating: 4.7,
        annualFee: 120,
        joiningFee: 0,
        eligibility: "Valid driving license and vehicle registration (Mulkiya).",
        features: [
          "Full Comprehensive Accident & Theft Protection",
          "24/7 Free Roadside Breakdown & Towing Assistance",
          "Agency Repair Coverage for vehicles up to 5 years old"
        ],
        benefits: [
          "Replacement Car Provision during accident repairs",
          "GCC Country Extension Cover Available",
          "No Claims Discount (NCD) up to 25%"
        ],
        documentsRequired: [
          "Valid Driving License",
          "Vehicle Registration Card (Mulkiya)",
          "CPR ID Copy"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 2,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      },
      {
        productId: "prd_insurance_cards",
        cardId: "ins_travel_global_003",
        imageId: "img_ins_travel_003",
        title: "Klysavo Global Travel Protection",
        shortDescription: "International travel insurance covering medical emergencies, flight delays, and lost baggage.",
        description: "Travel with peace of mind worldwide. Meets Schengen visa requirements and covers flight cancellations, lost luggage, and emergency medical evacuation.",
        bank: "Klysavo Travel Care",
        category: "Travel Insurance",
        image: "",
        rating: 4.9,
        annualFee: 25,
        joiningFee: 0,
        eligibility: "Open to all international travelers of any age.",
        features: [
          "Schengen Visa Approved Medical Coverage up to $100,000",
          "Flight Delay & Baggage Loss Compensation",
          "24/7 Global Emergency Assistance Hotline"
        ],
        benefits: [
          "Instant Online Policy Issuance in 2 minutes",
          "Trip Cancellation & Interruption Protection",
          "Coverage for Adventure Sports & Winter Activities"
        ],
        documentsRequired: [
          "Passport Copy",
          "Travel Itinerary / Flight Booking Details",
          "CPR ID"
        ],
        applyUrl: "/(main)/apply-card",
        status: "active",
        displayOrder: 3,
        isFeatured: true,
        steps: DEFAULT_APPLICATION_STEPS
      }
    ]
  }
};

async function uploadCategorizedCatalog() {
  const adminEmail = 'admin_catalog@klysavo.ai';
  const adminPass = 'AdminCatalog123!';

  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPass);
  } catch (err) {
    try {
      await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
    } catch (createErr) {
      console.warn('Auth note:', createErr.message);
    }
  }

  console.log('Current Auth User:', auth.currentUser ? auth.currentUser.uid : 'UNAUTHENTICATED');
  console.log('Uploading products catalog under specific document paths in Firestore...\n');

  const categories = ['credit_cards', 'loan_cards', 'insurance_cards'];

  for (const catKey of categories) {
    const categoryData = CATEGORIZED_PRODUCTS[catKey];

    // 1. Parent Document Path: products/{catKey} (e.g. products/credit_cards)
    const parentDocRef = doc(db, 'products', catKey);
    await setDoc(parentDocRef, {
      productId: categoryData.productId,
      categoryTitle: categoryData.categoryTitle,
      updatedAt: new Date().toISOString(),
      items: categoryData.items,
    }, { merge: true });

    console.log(`📁 Uploaded Parent Document: products/${catKey} (${categoryData.categoryTitle})`);

    // 2. Sub-Collection Documents: products/{catKey}/items/{cardId}
    for (const cardItem of categoryData.items) {
      const subDocRef = doc(db, 'products', catKey, 'items', cardItem.cardId);
      await setDoc(subDocRef, cardItem, { merge: true });

      // Also set in root products collection for direct lookup
      const rootDocRef = doc(db, 'products', cardItem.cardId);
      await setDoc(rootDocRef, cardItem, { merge: true });

      console.log(`   └─ 📄 Item: products/${catKey}/items/${cardItem.cardId} (${cardItem.title})`);
    }
  }

  console.log('\n🎉 Successfully uploaded all product cards under their specific parent category documents in Firestore!');
  process.exit(0);
}

uploadCategorizedCatalog();
