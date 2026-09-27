import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import FoodCard from '../components/FoodCard';

export default function MenuPage({ menu, onAddToCart, cart }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Pizza", "Burgers", "Pasta", "Sides", "Beverages", "Desserts"];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#6B1E2B]">Our Menu</h1>
            <p className="text-xs text-[#756B63]">Freshly prepared meals ready for order.</p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#756B63]" />
            <input
              type="text"
              placeholder="Search pizza, burger, pasta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D4A24C]/40 rounded-xl pl-10 pr-4 py-2 text-sm text-[#2B2118] focus:outline-none focus:border-[#6B1E2B] shadow-2xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#6B1E2B] text-white shadow-xs'
                  : 'bg-white text-[#2B2118] border border-[#D4A24C]/30 hover:border-[#6B1E2B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredMenu.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center text-[#756B63] space-y-2 border border-[#D4A24C]/30">
          <p className="text-base font-bold">No dishes found!</p>
          <p className="text-xs">Try searching for a different keyword or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => {
            const inCart = cart.find(c => c.id === item.id)?.quantity || 0;
            return (
              <FoodCard 
                key={item.id} 
                item={item} 
                onAddToCart={onAddToCart} 
                inCartCount={inCart} 
              />
            );
          })}
        </div>
      )}

    </div>
  );
}