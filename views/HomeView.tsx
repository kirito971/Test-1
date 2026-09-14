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
      <div className="bg-surface py-3 border-b border-border">
        <div className="flex overflow-x-auto space-x-4 px-4 pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="whitespace-nowrap px-4 py-1.5 rounded-full bg-background border border-border text-sm font-medium text-secondary hover:bg-primary hover:text-white transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4">
        <div className="bg-primary rounded-lg p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-display font-semibold mb-2">Volume Discount</h2>
            <p className="mb-4 opacity-90 text-sm">Get 20% off when you buy 2+ items from the same seller.</p>
            <button 
              onClick={() => onNavigate('search')}
              className="bg-white text-primary px-5 py-2 rounded-md font-medium text-sm transition"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-display font-semibold text-secondary mb-3">Popular</h3>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_INVENTORY.map((item) => (
            <div key={item.id} className="bg-surface rounded-lg overflow-hidden border border-border">
              <div className="aspect-square relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <span className="text-white text-xs font-semibold">{item.price.toLocaleString()} XAF</span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm text-secondary truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.aiTags.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};