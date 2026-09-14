import React from 'react';
import { Home, Search, ShoppingCart, User, Package } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  notification?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, notification }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart' },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background font-sans text-secondary">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-display font-semibold text-primary">{APP_NAME}</h1>
        <div className="flex space-x-2">
           {/* Placeholder for actions */}
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-4 py-2 rounded-md text-sm z-50 animate-fade-in-down">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-surface border-t border-border flex justify-around py-2 pb-safe z-20">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => window.location.hash = item.id}
              className={`flex flex-col items-center p-2 w-full transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};