import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, Sparkles, Clock, Utensils } from 'lucide-react';
import FoodCard from '../components/FoodCard';

export default function Home({ onNavigate, menu, onAddToCart, cart }) {
  const featured = menu.filter(i => i.isPopular).slice(0, 3);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#6B1E2B] via-[#521620] to-[#2B2118] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-[#D4A24C]/30">
        <div className="max-w-2xl space-y-6 relative z-10">
          <span className="inline-flex items-center space-x-2 bg-[#D4A24C]/20 border border-[#D4A24C] text-[#D4A24C] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Restaurant Assistant</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight">
            SavorServe
          </h1>

          <p className="text-xl sm:text-2xl font-light text-[#FFF8F0] italic">
            "Your cravings. Our service. Just chat and order."
          </p>

          <p className="text-sm text-gray-300 leading-relaxed">
            Experience seamless dining with our instant rule-based NLP chatbot assistant. Order fresh pizzas, juicy burgers, sides, and beverages naturally in seconds!
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('chat')}
              className="bg-[#D4A24C] hover:bg-[#e6c17d] text-[#2B2118] px-6 py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center space-x-2 transition-all hover:scale-102"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Chat Order</span>
            </button>

            <button
              onClick={() => onNavigate('menu')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Menu</span>
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="hidden lg:block absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
          <div className="w-96 h-96 rounded-full border-12 border-[#D4A24C]" />
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#6B1E2B]">Popular Chef Specials</h2>
            <p className="text-xs text-[#756B63]">Most loved dishes ordered through our chatbot today.</p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-[#6B1E2B] hover:text-[#A63D40] flex items-center space-x-1"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item) => {
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
      </section>

      {/* Why Choose SavorServe Banner */}
      <section className="bg-white rounded-2xl p-8 border border-[#D4A24C]/30 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="space-y-2 p-4">
          <div className="w-12 h-12 bg-[#FFF8F0] border border-[#D4A24C] text-[#6B1E2B] rounded-full flex items-center justify-center mx-auto text-xl">
            💬
          </div>
          <h3 className="font-bold text-[#2B2118]">Natural Chat Ordering</h3>
          <p className="text-xs text-[#756B63]">Type e.g., "Add 2 burgers and a coke" & the bot handles cart totals automatically.</p>
        </div>

        <div className="space-y-2 p-4 border-y md:border-y-0 md:border-x border-gray-100">
          <div className="w-12 h-12 bg-[#FFF8F0] border border-[#D4A24C] text-[#6B1E2B] rounded-full flex items-center justify-center mx-auto text-xl">
            ⚡
          </div>
          <h3 className="font-bold text-[#2B2118]">Live Order Tracking</h3>
          <p className="text-xs text-[#756B63]">Follow your food from preparation in our kitchen to your doorstep in real time.</p>
        </div>

        <div className="space-y-2 p-4">
          <div className="w-12 h-12 bg-[#FFF8F0] border border-[#D4A24C] text-[#6B1E2B] rounded-full flex items-center justify-center mx-auto text-xl">
            🏷️
          </div>
          <h3 className="font-bold text-[#2B2118]">Automatic Combos</h3>
          <p className="text-xs text-[#756B63]">Auto-apply discounts like Pizza Party & Burger Combo on qualifying items.</p>
        </div>
      </section>

    </div>
  );
}