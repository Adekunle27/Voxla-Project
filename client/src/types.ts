export interface Material {
  id: string;
  name: string;
  spec: string;
  description: string;
  unit: string;
  priceLow: number;
  priceHigh: number;
  trend: "up" | "down" | "flat";
  trendChange: number;
  category: string;
  supplierCount: number;
  imageUrl?: string | null;
  supplierPosted?: boolean;
}

export interface SupplierListing {
  id: string;
  name: string;
  spec: string;
  description: string;
  unit: string;
  imageUrl: string | null;
  active: boolean;
  categoryName: string;
  price: number;
  stock: number;
  deliveryDays: number;
}

export interface SupplierOption {
  priceId: string;
  supplierId: string;
  name: string;
  city: string;
  verified: boolean;
  rating: number;
  deliveryDays: number;
  stock: number;
  price: number;
}

export interface DirectorySupplier {
  id: string;
  name: string;
  city: string;
  verified: boolean;
  rating: number;
  yearsActive: number;
  categories: string | null;
}

export interface AdminSupplier extends DirectorySupplier {
  contactName: string;
  email: string;
  createdAt: string;
  verificationNote?: string | null;
  verificationReviewedAt?: string | null;
}

export interface CartItem {
  materialId: string;
  materialName: string;
  supplierId: string;
  supplierName: string;
  price: number;
  unit: string;
  qty: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface OrderResult {
  id: string;
  reference: string;
  total: number;
  deliveryFee?: number;
  status: string;
  items: CartItem[];
}
