import React from 'react';
import { Plus, Check } from 'lucide-react';

export default function FoodCard({ item, onAddToCart, inCartCount }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#D4A24C]/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden bg-cream-darker">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {item.isPopular && (
          <span className="absolute top-3 left-3 bg-[#D4A24C] text-[#2B2118] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            ⭐ Popular
          </span>
        )}
        <span className="absolute top-3 right-3 bg-[#6B1E2B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          ₹{item.price}
        </span>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-lg font-bold text-[#2B2118] font-serif">{item.name}</h3>
            <span className="text-[11px] font-semibold text-[#A63D40] uppercase tracking-wider">{item.category}</span>
          </div>
          <p className="text-xs text-[#756B63] line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all ${
            !item.available 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : inCartCount > 0
              ? 'bg-[#3F7D58] text-white hover:bg-[#356849]'
              : 'bg-[#6B1E2B] text-white hover:bg-[#521620] shadow-sm'
          }`}
        >
          {inCartCount > 0 ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added ({inCartCount})</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}