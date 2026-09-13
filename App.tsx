import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { CartView } from './views/CartView';
import { OrderView } from './views/OrderView';
import { ProfileView } from './views/ProfileView';
import { UserRole, AppUser, InventoryItem } from './types';
import { MOCK_INVENTORY, MOCK_USERS } from './mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<AppUser>(MOCK_USERS[0]); // Default to Client
  const [cart, setCart] = useState<InventoryItem[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Simple hash router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentView(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToCart = (item: InventoryItem) => {
    setCart([...cart, item]);
    setNotifications(prev => [...prev, `Added ${item.name} to cart`]);
    setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
  };

  const clearCart = () => setCart([]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={(view) => window.location.hash = view} />;
      case 'search':
        return <SearchView onAddToCart={addToCart} />;
      case 'cart':
        return <CartView cart={cart} user={currentUser} onClearCart={clearCart} />;
      case 'orders':
        return <OrderView user={currentUser} />;
      case 'profile':
        return <ProfileView user={currentUser} onSwitchUser={setCurrentUser} />;
      default:
        return <HomeView onNavigate={(view) => window.location.hash = view} />;
    }
  };

  return (
    <Layout currentView={currentView} notification={notifications[0]}>
      {renderView()}
    </Layout>
  );
};

export default App;