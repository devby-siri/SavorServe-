import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import ChatPage from './pages/ChatPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackerPage from './pages/OrderTrackerPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/AdminDashboard';

import { storageService } from './services/storageService';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'menu' | 'chat' | 'checkout' | 'tracker' | 'history' | 'admin'
  const [menu, setMenu] = useState(() => storageService.getMenu());
  const [cart, setCart] = useState(() => storageService.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);

  useEffect(() => {
    // Keep in sync with storage
    setMenu(storageService.getMenu());
    setCart(storageService.getCart());
  }, []);

  const saveAndSetCart = (newCart) => {
    setCart(newCart);
    storageService.saveCart(newCart);
  };

  const handleAddToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === item.id);
      let updated;
      if (existing) {
        updated = prevCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c);
      } else {
        updated = [...prevCart, { ...item, quantity }];
      }
      storageService.saveCart(updated);
      return updated;
    });
  };

  const handleAddMultipleToCart = (entries) => {
    setCart(prevCart => {
      let updated = [...prevCart];
      entries.forEach(({ item, quantity }) => {
        const existingIndex = updated.findIndex(c => c.id === item.id);
        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity
          };
        } else {
          updated.push({ ...item, quantity });
        }
      });
      storageService.saveCart(updated);
      return updated;
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      setCart(prevCart => {
        const updated = prevCart.map(c => c.id === id ? { ...c, quantity: newQty } : c);
        storageService.saveCart(updated);
        return updated;
      });
    }
  };

  const handleRemoveItem = (id) => {
    setCart(prevCart => {
      const updated = prevCart.filter(c => c.id !== id);
      storageService.saveCart(updated);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    storageService.saveCart([]);
  };

  const handleOrderPlaced = (order) => {
    saveAndSetCart([]);
    setTrackedOrder(order);
    setActivePage('tracker');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-[#2B2118]">
      
      {/* Navigation Header */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        cartCount={cartCount} 
        openCart={() => setIsCartOpen(true)} 
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activePage === 'home' && (
          <Home 
            onNavigate={setActivePage} 
            menu={menu} 
            onAddToCart={handleAddToCart} 
            cart={cart} 
          />
        )}

        {activePage === 'menu' && (
          <MenuPage 
            menu={menu} 
            onAddToCart={handleAddToCart} 
            cart={cart} 
          />
        )}

        {activePage === 'chat' && (
          <ChatPage 
            menu={menu} 
            cart={cart} 
            onAddToCart={handleAddToCart} 
            onAddMultipleToCart={handleAddMultipleToCart}
            onRemoveItem={handleRemoveItem} 
            onClearCart={handleClearCart} 
            onNavigate={setActivePage} 
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage 
            cart={cart} 
            onOrderPlaced={handleOrderPlaced} 
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'tracker' && (
          <OrderTrackerPage 
            order={trackedOrder} 
            onNavigate={setActivePage} 
          />
        )}

        {activePage === 'history' && (
          <OrderHistoryPage 
            onTrackOrder={(ord) => { setTrackedOrder(ord); setActivePage('tracker'); }} 
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard 
            menu={menu} 
            setMenu={setMenu} 
          />
        )}
      </main>

      {/* Cart Drawer Modal */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        updateQuantity={handleUpdateQuantity} 
        removeItem={handleRemoveItem} 
        clearCart={handleClearCart} 
        onProceedCheckout={() => setActivePage('checkout')} 
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}