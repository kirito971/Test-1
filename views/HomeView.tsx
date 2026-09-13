import React from 'react';
import { CATEGORIES } from '../constants';
import { MOCK_INVENTORY } from '../mockData';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Categories Scroll */}
      <div className="bg-white py-3 shadow-sm">
        <div className="flex overflow-x-auto space-x-4 px-4 pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="whitespace-nowrap px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-primary to-green-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Apacheur Discount!</h2>
            <p className="mb-4 text-green-50 opacity-90">Get 20% OFF when you buy 2+ items from the same seller.</p>
            <button 
              onClick={() => onNavigate('search')}
              className="bg-white text-primary px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition"
            >
              Start Shopping
            </button>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-white opacity-20 rounded-full"></div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Trending in Yaoundé</h3>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_INVENTORY.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="aspect-square relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <span className="text-white text-xs font-bold">{item.price.toLocaleString()} XAF</span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.aiTags.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};