import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { calculateCartTotals } from '../services/cartService';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem, clearCart, onProceedCheckout }) {
  if (!isOpen) return null;

  const { subtotal, discount, appliedOfferName, tax, total } = calculateCartTotals(cart);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8F0] shadow-2xl flex flex-col border-l border-[#D4A24C]/30">
          
          {/* Header */}
          <div className="p-5 bg-[#6B1E2B] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4A24C]" />
              <h2 className="text-lg font-bold font-serif">Your SavorServe Cart</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-[#521620] rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#756B63] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FFF8F0] border border-[#D4A24C]/40 flex items-center justify-center text-3xl">
                  🛒
                </div>
                <p className="font-medium text-sm">Your cart is empty!</p>
                <p className="text-xs">Browse our menu or ask our chatbot assistant to add items.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-[#D4A24C]/30 shadow-xs flex items-center justify-between space-x-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#2B2118] truncate">{item.name}</h4>
                    <p className="text-xs text-[#6B1E2B] font-semibold">₹{item.price} each</p>
                  </div>

                  <div className="flex items-center space-x-2 bg-[#FFF8F0] border border-gray-200 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-0.5 hover:text-[#6B1E2B]">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-0.5 hover:text-[#6B1E2B]">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-[#A63D40] p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#D4A24C]/30 space-y-3">
              {appliedOfferName && (
                <div className="bg-[#D4A24C]/15 border border-[#D4A24C] text-[#2B2118] text-xs px-3 py-1.5 rounded-lg flex justify-between font-medium">
                  <span>🎉 Offer Applied ({appliedOfferName})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="text-xs space-y-1.5 text-[#756B63]">
                <div className="flex justify-between"><span>Subtotal:</span> <span>₹{subtotal}</span></div>
                <div className="flex justify-between text-[#3F7D58]"><span>Discount:</span> <span>-₹{discount}</span></div>
                <div className="flex justify-between"><span>GST Tax (5%):</span> <span>₹{tax}</span></div>
                <div className="flex justify-between text-base font-bold text-[#2B2118] pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-[#6B1E2B]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => { onClose(); onProceedCheckout(); }}
                className="w-full bg-[#6B1E2B] hover:bg-[#521620] text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button onClick={clearCart} className="w-full text-xs text-[#756B63] hover:underline text-center block">
                Clear Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}