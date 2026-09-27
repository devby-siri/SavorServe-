import React from 'react';
import { ShoppingBag, MessageSquare, UtensilsCrossed, Clock, ShieldCheck } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, cartCount, openCart }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: UtensilsCrossed },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'chat', label: 'Chat Assistant', icon: MessageSquare },
    { id: 'history', label: 'My Orders', icon: Clock },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#D4A24C]/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#6B1E2B] flex items-center justify-center text-[#FFF8F0] shadow-md group-hover:bg-[#521620] transition-colors">
              <span className="text-xl font-bold">S</span>
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-[#6B1E2B] tracking-tight block">SavorServe</span>
              <span className="text-[10px] text-[#756B63] font-sans tracking-widest uppercase block -mt-1">Restaurant Chatbot</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#6B1E2B] text-white shadow-sm'
                      : 'text-[#2B2118] hover:bg-[#6B1E2B]/10 hover:text-[#6B1E2B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Cart Icon Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={openCart}
              className="relative bg-white border border-[#D4A24C]/50 hover:border-[#6B1E2B] text-[#6B1E2B] p-2.5 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#A63D40] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Navigation Row */}
      <div className="md:hidden border-t border-[#D4A24C]/20 bg-white px-2 py-2 flex justify-around items-center text-xs font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg ${
                isActive ? 'text-[#6B1E2B] font-bold' : 'text-[#756B63]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}