import { AppUser, UserRole, InventoryItem, Driver } from './types';

export const MOCK_USERS: AppUser[] = [
  { uid: 'u1', name: 'Alice Client', role: UserRole.CLIENT, registerWithCode: true, walletBalance: 5000 },
  { uid: 'u2', name: 'Bob Wholesaler', role: UserRole.WHOLESALER, walletBalance: 250000 },
  { uid: 'u3', name: 'Charlie Driver', role: UserRole.DRIVER, walletBalance: 1500 },
  { uid: 'u4', name: 'Dave Apacheur', role: UserRole.APACHEUR, promoCode: 'DAVE20', walletBalance: 12000 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'i1',
    sellerId: 'u2',
    name: 'Nike Air Max Red',
    price: 45000,
    image: 'https://picsum.photos/300/300?random=1',
    aiTags: { item: 'Sneakers', color: 'Red', brand: 'Nike', category: 'Fashion' },
    bulkDiscountEligible: true
  },
  {
    id: 'i2',
    sellerId: 'u2',
    name: 'Nike Tee White',
    price: 15000,
    image: 'https://picsum.photos/300/300?random=2',
    aiTags: { item: 'T-Shirt', color: 'White', brand: 'Nike', category: 'Fashion' },
    bulkDiscountEligible: true
  },
  {
    id: 'i3',
    sellerId: 'u5', // Different seller
    name: 'Samsung Galaxy S21',
    price: 350000,
    image: 'https://picsum.photos/300/300?random=3',
    aiTags: { item: 'Smartphone', color: 'Black', brand: 'Samsung', category: 'Electronics' },
    bulkDiscountEligible: false
  },
  {
    id: 'i4',
    sellerId: 'u2',
    name: 'Vintage Red Hat',
    price: 8000,
    image: 'https://picsum.photos/300/300?random=4',
    aiTags: { item: 'Hat', color: 'Red', brand: 'Vintage', category: 'Fashion' },
    bulkDiscountEligible: true
  },
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'u3', name: 'Charlie Driver', rating: 4.8, lat: 4.05, lng: 9.70, status: 'FREE' }, // Near Douala approx
  { id: 'd2', name: 'Eddie Driver', rating: 4.2, lat: 4.06, lng: 9.71, status: 'BUSY' },
];