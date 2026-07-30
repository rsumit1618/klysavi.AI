export const STATUS_PRODUCT_IMAGES = {
  APPLY: require('../../../assets/images/card_apply_view.jpg'),
  PENDING: require('../../../assets/images/card_pending_view.jpg'),
  APPROVED: require('../../../assets/images/card_approved_view.jpg'),
  TAB: require('../../../assets/images/card_tab_view.jpg'),
};

export interface CardStatusImages {
  APPLY: any;
  PENDING: any;
  APPROVED: any;
  TAB: any;
}

export const CARD_STATUS_IMAGE_MAP: Record<string, CardStatusImages> = {
  // 1. Regalia Credit Card
  'cc_hdfc_regalia_001': {
    APPLY: require('../../../assets/images/credit_cards_banner.jpg'),
    PENDING: require('../../../assets/images/regalia_pending.jpg'),
    APPROVED: require('../../../assets/images/regalia_approved.jpg'),
    TAB: require('../../../assets/images/regalia_tab.jpg'),
  },
  'img_cc_hdfc_regalia_001': {
    APPLY: require('../../../assets/images/credit_cards_banner.jpg'),
    PENDING: require('../../../assets/images/regalia_pending.jpg'),
    APPROVED: require('../../../assets/images/regalia_approved.jpg'),
    TAB: require('../../../assets/images/regalia_tab.jpg'),
  },

  // 2. Imtiaz Premium Gold Credit Card
  'cc_imtiaz_gold_002': {
    APPLY: require('../../../assets/images/gold_apply.jpg'),
    PENDING: require('../../../assets/images/gold_pending.jpg'),
    APPROVED: require('../../../assets/images/gold_approved.jpg'),
    TAB: require('../../../assets/images/gold_tab.jpg'),
  },
  'img_cc_imtiaz_gold_002': {
    APPLY: require('../../../assets/images/gold_apply.jpg'),
    PENDING: require('../../../assets/images/gold_pending.jpg'),
    APPROVED: require('../../../assets/images/gold_approved.jpg'),
    TAB: require('../../../assets/images/gold_tab.jpg'),
  },

  // 3. Klysavo AI Infinite Card
  'cc_klysavo_infinite_003': {
    APPLY: require('../../../assets/images/cc_klysavo_infinite.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
  'img_cc_klysavo_infinite_003': {
    APPLY: require('../../../assets/images/cc_klysavo_infinite.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },

  // 4. Personal Loan
  'loan_personal_express_001': {
    APPLY: require('../../../assets/images/loan_personal.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
  'img_loan_personal_001': {
    APPLY: require('../../../assets/images/loan_personal.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },

  // 5. Home Loan
  'loan_home_mortgage_002': {
    APPLY: require('../../../assets/images/loan_home.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
  'img_loan_home_002': {
    APPLY: require('../../../assets/images/loan_home.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },

  // 6. Car Loan
  'loan_car_fasttrack_003': {
    APPLY: require('../../../assets/images/loan_car_fasttrack.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
  'img_loan_car_003': {
    APPLY: require('../../../assets/images/loan_car_fasttrack.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },

  // 7. Health Insurance
  'ins_health_shield_001': {
    APPLY: require('../../../assets/images/ins_health.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
  'img_ins_health_001': {
    APPLY: require('../../../assets/images/ins_health.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },

  // 8. Car Insurance
  'ins_car_protect_002': {
    APPLY: require('../../../assets/images/ins_car.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
  'img_ins_car_002': {
    APPLY: require('../../../assets/images/ins_car.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },

  // 9. Travel Insurance
  'ins_travel_globetrotter_003': {
    APPLY: require('../../../assets/images/ins_travel.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
  'img_ins_travel_003': {
    APPLY: require('../../../assets/images/ins_travel.jpg'),
    PENDING: require('../../../assets/images/card_pending_view.jpg'),
    APPROVED: require('../../../assets/images/card_approved_view.jpg'),
    TAB: require('../../../assets/images/card_tab_view.jpg'),
  },
};

export const LOCAL_PRODUCT_IMAGES: Record<string, any> = {
  // 1. Credit Cards
  'img_cc_hdfc_regalia_001': require('../../../assets/images/cc_hdfc_regalia.jpg'),
  'img_cc_imtiaz_gold_002': require('../../../assets/images/cc_imtiaz_gold.jpg'),
  'img_cc_klysavo_infinite_003': require('../../../assets/images/cc_klysavo_infinite.jpg'),

  // 2. Loans
  'img_loan_personal_001': require('../../../assets/images/loan_personal.jpg'),
  'img_loan_home_002': require('../../../assets/images/loan_home.jpg'),
  'img_loan_car_003': require('../../../assets/images/loan_car_fasttrack.jpg'),

  // 3. Insurance
  'img_ins_health_001': require('../../../assets/images/ins_health.jpg'),
  'img_ins_car_002': require('../../../assets/images/ins_car.jpg'),
  'img_ins_travel_003': require('../../../assets/images/ins_travel.jpg'),
};

export const DEFAULT_CREDIT_IMAGE = require('../../../assets/images/cc_hdfc_regalia.jpg');
export const DEFAULT_LOAN_IMAGE = require('../../../assets/images/loan_personal.jpg');
export const DEFAULT_INSURANCE_IMAGE = require('../../../assets/images/ins_health.jpg');

export function getLocalProductImage(imageId?: string, productId?: string): any {
  if (imageId && LOCAL_PRODUCT_IMAGES[imageId]) {
    return LOCAL_PRODUCT_IMAGES[imageId];
  }

  if (productId === 'prd_loan_cards') return DEFAULT_LOAN_IMAGE;
  if (productId === 'prd_insurance_cards') return DEFAULT_INSURANCE_IMAGE;
  return DEFAULT_CREDIT_IMAGE;
}

/**
 * Returns the status-specific high-resolution image for cards
 * Checks CARD_STATUS_IMAGE_MAP for per-card status mapping, with global fallback.
 * @param status 'APPLY' | 'PENDING' | 'APPROVED' | 'TAB'
 */
export function getCardStatusImage(
  status: 'APPLY' | 'PENDING' | 'APPROVED' | 'TAB',
  fallbackImageId?: string,
  fallbackProductId?: string
): any {
  const key = fallbackImageId || fallbackProductId;
  if (key && CARD_STATUS_IMAGE_MAP[key]) {
    const cardSet = CARD_STATUS_IMAGE_MAP[key];
    if (cardSet && cardSet[status]) {
      return cardSet[status];
    }
  }

  if (STATUS_PRODUCT_IMAGES[status]) {
    return STATUS_PRODUCT_IMAGES[status];
  }

  return getLocalProductImage(fallbackImageId, fallbackProductId);
}
