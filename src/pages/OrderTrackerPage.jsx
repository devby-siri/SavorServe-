import React from 'react';
import { CheckCircle2, Clock, ChefHat, Package, Truck, Home } from 'lucide-react';

export default function OrderTrackerPage({ order, onNavigate }) {
  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#6B1E2B]">No active order to track</h2>
        <p className="text-xs text-[#756B63]">Place an order via Chatbot or Menu to track status.</p>
        <button
          onClick={() => onNavigate('menu')}
          className="bg-[#6B1E2B] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const steps = [
    { title: "Order Placed", icon: CheckCircle2 },
    { title: "Order Accepted", icon: Clock },
    { title: "Preparing", icon: ChefHat },
    { title: "Ready", icon: Package },
    { title: order.customer.orderType === 'Delivery' ? "Out for Delivery" : "Completed", icon: Truck }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Order Accepted': return 1;
      case 'Preparing': return 2;
      case 'Ready': return 3;
      case 'Out for Delivery': return 4;
      case 'Completed': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-[#D4A24C]/40 shadow-lg space-y-8 my-8">
      
      {/* Banner */}
      <div className="text-center space-y-2 border-b pb-6">
        <span className="text-4xl">🎉</span>
        <h1 className="text-2xl font-serif font-bold text-[#6B1E2B]">Order Confirmed!</h1>
        <p className="text-sm font-semibold text-[#2B2118]">Order ID: <span className="text-[#6B1E2B] font-mono">{order.orderId}</span></p>
        <p className="text-xs text-[#756B63]">Estimated preparation time: 20–25 minutes</p>
      </div>

      {/* Visual Timeline */}
      <div className="space-y-6">
        <h3 className="font-serif font-bold text-[#2B2118] text-sm">Live Progress Tracker</h3>

        <div className="relative flex justify-between items-center">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#3F7D58] -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = idx <= currentIndex;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isDone ? 'bg-[#3F7D58] text-white shadow-md' : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] mt-2 font-bold text-center max-w-[65px] ${
                  isDone ? 'text-[#3F7D58]' : 'text-gray-400'
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-[#FFF8F0] p-5 rounded-xl border border-[#D4A24C]/30 text-xs space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span>Customer: <strong>{order.customer.name}</strong></span>
          <span>Type: <strong>{order.customer.orderType}</strong></span>
        </div>

        <div className="space-y-1.5">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-2 flex justify-between font-bold text-sm text-[#6B1E2B]">
          <span>Total Amount Paid:</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      <button
        onClick={() => onNavigate('home')}
        className="w-full bg-[#6B1E2B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#521620] transition-colors"
      >
        Return to Home
      </button>

    </div>
  );
}