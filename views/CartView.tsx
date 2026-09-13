import React from 'react';
import { InventoryItem, AppUser } from '../types';
import { PROMO_DISCOUNT_PERCENT } from '../constants';
import { Trash2, CheckCircle2 } from 'lucide-react';

interface CartViewProps {
  cart: InventoryItem[];
  user: AppUser;
  onClearCart: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ cart, user, onClearCart }) => {
  // Apacheur Promo Engine Logic
  // Condition: Register_With_Code == TRUE AND Cart_Count >= 2 AND All_From_Same_Seller
  
  const uniqueSellerIds = new Set(cart.map(item => item.sellerId));
  const allSameSeller = uniqueSellerIds.size === 1;
  const isEligibleForDiscount = user.registerWithCode && cart.length >= 2 && allSameSeller;
  
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discount = isEligibleForDiscount ? subtotal * PROMO_DISCOUNT_PERCENT : 0;
  const total = subtotal - discount;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    // In a real app, this would create the order in Firestore
    // For this demo, we'll just push to a mock order list or clear the cart
    const newOrder = {
        id: `ord-${Date.now()}`,
        items: [...cart],
        totalAmount: total,
        status: 'PENDING',
        clientId: user.uid,
        wholesalerId: cart[0]?.sellerId || 'unknown',
        transportFeeAdvanced: false,
        paymentConfirmed: false,
        timestamp: Date.now()
    };
    
    // Simulate order creation by just clearing cart and alerting
    alert(`Order created! ID: ${newOrder.id}`);
    onClearCart();
    window.location.hash = 'orders';
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
        <button 
            onClick={onClearCart}
            className="text-red-500 text-sm flex items-center hover:underline"
        >
            <Trash2 size={16} className="mr-1" /> Clear
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={32} />
            </div>
            <p>Your cart is empty</p>
        </div>
      ) : (
        <>
            <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                         <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-gray-200" />
                         <div className="ml-3 flex-1">
                             <h4 className="font-medium text-gray-900">{item.name}</h4>
                             <p className="text-gray-500 text-sm">{item.price.toLocaleString()} XAF</p>
                             <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Seller: {item.sellerId}</span>
                         </div>
                    </div>
                ))}
            </div>

            {/* Promo Logic UI */}
            <div className="mt-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                {isEligibleForDiscount ? (
                    <div className="mb-4 bg-green-50 p-3 rounded-lg flex items-start">
                        <CheckCircle2 className="text-primary w-5 h-5 mt-0.5 mr-2" />
                        <div>
                            <p className="text-sm font-bold text-primary">Apacheur Discount Applied!</p>
                            <p className="text-xs text-green-700">20% off because you used a code, bought 2+ items, and shopped from one seller.</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 p-3 rounded-lg border border-dashed border-gray-300">
                        <p className="text-xs text-gray-500">
                            <strong>Tip:</strong> Buy 2+ items from the same seller to unlock the Apacheur 20% discount.
                        </p>
                    </div>
                )}

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString()} XAF</span>
                    </div>
                    {isEligibleForDiscount && (
                        <div className="flex justify-between text-primary font-medium">
                            <span>Discount (20%)</span>
                            <span>-{discount.toLocaleString()} XAF</span>
                        </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                        <span>Total</span>
                        <span>{total.toLocaleString()} XAF</span>
                    </div>
                </div>

                <button 
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-3 rounded-lg mt-4 font-bold text-lg shadow hover:bg-green-600 transition"
                >
                    Checkout
                </button>
            </div>
        </>
      )}
    </div>
  );
};