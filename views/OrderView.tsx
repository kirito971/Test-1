import React, { useState } from 'react';
import { AppUser, Order, OrderStatus, UserRole, Driver } from '../types';
import { MOCK_DRIVERS, MOCK_INVENTORY } from '../mockData';
import { MapPin, Phone, Video, CheckCircle, ShieldCheck, Truck } from 'lucide-react';

// Mock a single active order for demonstration
const MOCK_ORDER: Order = {
  id: 'ord-demo-123',
  items: [MOCK_INVENTORY[0]],
  totalAmount: 45000,
  status: OrderStatus.PENDING,
  clientId: 'u1',
  wholesalerId: 'u2',
  transportFeeAdvanced: false,
  paymentConfirmed: false,
  timestamp: Date.now()
};

interface OrderViewProps {
  user: AppUser;
}

export const OrderView: React.FC<OrderViewProps> = ({ user }) => {
  // We use local state to simulate the order progressing through Firestore updates
  const [order, setOrder] = useState<Order>(MOCK_ORDER);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // --- Actions based on Role and Status ---

  // Wholesaler: Select Driver
  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setOrder({ ...order, driverId: driver.id, status: OrderStatus.ACCEPTED });
  };

  // Wholesaler: Handoff
  const handleHandoff = () => {
    setOrder({ ...order, status: OrderStatus.HANDOFF_CONFIRMED, transportFeeAdvanced: true });
  };

  // Driver: Upload Video
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate upload
      setTimeout(() => {
        setOrder({ ...order, status: OrderStatus.VIDEO_PROOF_UPLOADED, videoProofUrl: 'mock_url' });
      }, 1500);
    }
  };

  // Client: Send Payment
  const handlePaymentSent = () => {
    setOrder({ ...order, status: OrderStatus.PAYMENT_SENT });
  };

  // Wholesaler: Confirm Payment
  const handlePaymentReceived = () => {
    setOrder({ ...order, status: OrderStatus.PAYMENT_RECEIVED, paymentConfirmed: true });
    // Auto complete after payment received in this simplified flow
    setTimeout(() => {
        setOrder(prev => ({ ...prev, status: OrderStatus.COMPLETED }));
    }, 1000);
  };

  // --- UI Sections ---

  const renderStatusBadge = () => {
    const colors: Record<string, string> = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [OrderStatus.DELIVERY_IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    };
    const defaultColor = 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${colors[order.status] || defaultColor}`}>
        {order.status.replace(/_/g, ' ')}
      </span>
    );
  };

  // 1. Wholesaler View Logic
  if (user.role === UserRole.WHOLESALER) {
    return (
      <div className="p-4 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
           <h3 className="font-bold text-lg mb-2">Order #{order.id}</h3>
           {renderStatusBadge()}
           
           {order.status === OrderStatus.PENDING && (
             <div className="mt-4">
               <h4 className="text-sm font-bold text-gray-700 mb-2">Smart Logistics: Select Driver</h4>
               <p className="text-xs text-gray-500 mb-3">Drivers sorted by location & rating</p>
               <div className="space-y-2">
                 {MOCK_DRIVERS.map(driver => (
                   <div key={driver.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <div>
                       <p className="font-bold text-sm">{driver.name}</p>
                       <p className="text-xs text-gray-500">⭐ {driver.rating} • {driver.status}</p>
                     </div>
                     <button 
                       onClick={() => handleSelectDriver(driver)}
                       className="bg-primary text-white text-xs px-3 py-2 rounded font-bold"
                     >
                       Assign
                     </button>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {order.status === OrderStatus.ACCEPTED && (
             <div className="mt-4">
               <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 mb-3">
                 Waiting for driver to arrive...
               </div>
               <button 
                 onClick={handleHandoff}
                 className="w-full bg-secondary text-white py-3 rounded-lg font-bold"
               >
                 Confirm Handoff + Fee Paid
               </button>
             </div>
           )}

           {order.status === OrderStatus.PAYMENT_SENT && (
              <div className="mt-4">
                  <p className="text-sm mb-2">Client says they paid. Check your Mobile Money.</p>
                  <button 
                    onClick={handlePaymentReceived}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold"
                  >
                    Confirm Payment Received
                  </button>
              </div>
           )}
        </div>
      </div>
    );
  }

  // 2. Driver View Logic
  if (user.role === UserRole.DRIVER) {
     // Driver only sees if they are assigned
     if (order.driverId !== user.uid && order.status !== OrderStatus.PENDING) {
         return <div className="p-4 text-center text-gray-500">No active orders assigned to you.</div>;
     }

     return (
        <div className="p-4 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-2">Delivery Task</h3>
                {renderStatusBadge()}

                {order.status === OrderStatus.ACCEPTED && (
                    <p className="mt-4 text-sm text-gray-600">Head to Wholesaler to pick up package.</p>
                )}

                {order.status === OrderStatus.HANDOFF_CONFIRMED && (
                    <div className="mt-4">
                        <h4 className="font-bold text-sm mb-2">Proof of Delivery</h4>
                        <p className="text-xs text-gray-500 mb-3">You MUST record a 5-10s video of the item in Client's hands.</p>
                        
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Video className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Tap to record video</p>
                            </div>
                            <input type="file" accept="video/*" capture="environment" className="hidden" onChange={handleVideoUpload} />
                        </label>
                    </div>
                )}
                
                {order.status === OrderStatus.VIDEO_PROOF_UPLOADED && (
                    <div className="mt-4 bg-green-50 p-3 rounded text-green-800 text-sm flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Video uploaded. Waiting for client payment.
                    </div>
                )}
            </div>
        </div>
     );
  }

  // 3. Client View Logic (Default)
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
         <h3 className="font-bold text-lg mb-2">Order Status</h3>
         {renderStatusBadge()}

         <div className="mt-4 space-y-4">
            <div className="flex items-center text-sm text-gray-600">
                <Truck className="w-4 h-4 mr-2" />
                <span>Driver: {order.driverId ? 'Charlie Driver' : 'Finding driver...'}</span>
            </div>
            
            {order.status === OrderStatus.VIDEO_PROOF_UPLOADED && (
                <div className="animate-fade-in">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-3">
                        <p className="text-sm font-bold text-blue-900 flex items-center">
                            <ShieldCheck className="w-4 h-4 mr-1" />
                            Delivery Verified
                        </p>
                        <p className="text-xs text-blue-700 mt-1">Video proof uploaded by driver. Please release payment.</p>
                    </div>
                    
                    <button 
                        onClick={handlePaymentSent}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg"
                    >
                        I Have Sent Payment
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-2">Only tap after sending Mobile Money.</p>
                </div>
            )}

            {order.status === OrderStatus.COMPLETED && (
                <div className="text-center py-4">
                    <h4 className="font-bold text-primary text-xl">Order Complete!</h4>
                    <p className="text-sm text-gray-500 mb-4">Please rate your experience.</p>
                    <div className="flex justify-center space-x-2">
                        {[1,2,3,4,5].map(star => <span key={star} className="text-2xl text-yellow-400 cursor-pointer">★</span>)}
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};