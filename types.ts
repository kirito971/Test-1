export enum UserRole {
  CLIENT = 'CLIENT',
  APACHEUR = 'APACHEUR',
  WHOLESALER = 'WHOLESALER',
  DRIVER = 'DRIVER'
}

export interface AppUser {
  uid: string;
  name: string;
  role: UserRole;
  promoCode?: string; // For Apacheur
  registerWithCode?: boolean; // For Client
  walletBalance: number;
}

export interface InventoryItem {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  image: string;
  aiTags: {
    item: string;
    color: string;
    brand: string;
    category: string;
  };
  bulkDiscountEligible: boolean;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  lat: number;
  lng: number;
  status: 'FREE' | 'BUSY';
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED', // By Wholesaler
  HANDOFF_CONFIRMED = 'HANDOFF_CONFIRMED', // Wholesaler gave to Driver
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  VIDEO_PROOF_UPLOADED = 'VIDEO_PROOF_UPLOADED', // Driver uploaded video
  PAYMENT_SENT = 'PAYMENT_SENT', // Client sent money
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED', // Wholesaler confirmed
  COMPLETED = 'COMPLETED'
}

export interface Order {
  id: string;
  items: InventoryItem[];
  totalAmount: number;
  status: OrderStatus;
  clientId: string;
  wholesalerId: string;
  driverId?: string;
  videoProofUrl?: string;
  transportFeeAdvanced: boolean;
  paymentConfirmed: boolean;
  timestamp: number;
}