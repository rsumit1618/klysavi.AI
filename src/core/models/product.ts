export type ProductType = 'CREDIT_CARD' | 'LOAN' | 'INSURANCE';

export interface ProductStep {
  id: string;
  label: string;
}

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  title: string;
  description: string;
  subDescription?: string;
  criteria?: string;
  imageBannerId?: string;
  image?: any;
  bannerType?: 'MINT' | 'CREAM';
  categoryLabel?: string;
  steps?: ProductStep[];
}
