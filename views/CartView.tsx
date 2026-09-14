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
        <h2 className="text-2xl font-display font-semibold text-secondary">Your Cart</h2>
        <button 
            onClick={onClearCart}
            className="text-red-500 text-sm flex items-center hover:underline"
        >
            <Trash2 size={16} className="mr-1" /> Clear
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
                <Trash2 size={32} />
            </div>
            <p>Your cart is empty</p>
        </div>
      ) : (
        <>
            <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex bg-surface p-3 rounded-md border border-border">
                         <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover bg-background" />
                         <div className="ml-3 flex-1">
                             <h4 className="font-medium text-secondary">{item.name}</h4>
                             <p className="text-gray-500 text-sm">{item.price.toLocaleString()} XAF</p>
                             <span className="text-xs bg-background px-2 py-0.5 rounded text-gray-600 border border-border">Seller: {item.sellerId}</span>
                         </div>
                    </div>
                ))}
            </div>

            {/* Promo Logic UI */}
            <div className="mt-4 bg-surface p-4 rounded-lg border border-border">
                {isEligibleForDiscount ? (
                    <div className="mb-4 bg-background p-3 rounded-md flex items-start border border-primary/20">
                        <CheckCircle2 className="text-primary w-5 h-5 mt-0.5 mr-2" />
                        <div>
                            <p className="text-sm font-semibold text-primary">Volume Discount Applied</p>
                            <p className="text-xs text-secondary mt-1">20% off for purchasing 2+ items from the same seller.</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 p-3 rounded-md border border-border bg-background">
                        <p className="text-xs text-secondary">
                            <strong>Tip:</strong> Buy 2+ items from the same seller to unlock a 20% discount.
                        </p>
                    </div>
                )}

                <div className="space-y-2 text-sm mt-4">
                    <div className="flex justify-between text-secondary">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString()} XAF</span>
                    </div>
                    {isEligibleForDiscount && (
                        <div className="flex justify-between text-primary font-medium">
                            <span>Discount (20%)</span>
                            <span>-{discount.toLocaleString()} XAF</span>
                        </div>
                    )}
                    <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg text-secondary">
                        <span>Total</span>
                        <span>{total.toLocaleString()} XAF</span>
                    </div>
                </div>

                <button 
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-3 rounded-md mt-4 font-medium text-lg hover:opacity-90 transition"
                >
                    Checkout
                </button>
            </div>
        </>
      )}
    </div>
  );
};