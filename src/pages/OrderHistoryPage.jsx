import React from 'react';
import { storageService } from '../services/storageService';

export default function OrderHistoryPage({ onTrackOrder }) {
  const orders = storageService.getOrders();

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl text-center text-[#756B63] space-y-3 border border-[#D4A24C]/30 max-w-lg mx-auto my-12">
        <p className="text-base font-bold text-[#2B2118]">No order history found!</p>
        <p className="text-xs">Your placed orders will appear here for status updates.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#6B1E2B]">Your Order History</h1>
        <p className="text-xs text-[#756B63]">Track active orders or review past dining history.</p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.orderId} className="bg-white p-6 rounded-2xl border border-[#D4A24C]/30 shadow-xs flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-[#6B1E2B] text-base">{ord.orderId}</span>
                <span className="text-[10px] bg-[#D4A24C]/20 border border-[#D4A24C] text-[#2B2118] px-2.5 py-0.5 rounded-full font-bold uppercase">
                  {ord.customer.orderType}
                </span>
                <span className="text-xs text-[#3F7D58] font-bold bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                  ● {ord.status}
                </span>
              </div>

              <p className="text-xs text-gray-500">{ord.createdAt}</p>

              <p className="text-xs text-[#2B2118] font-medium">
                {ord.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
              </p>
            </div>

            <div className="flex items-center space-x-4 self-end md:self-center">
              <span className="text-lg font-bold text-[#6B1E2B]">₹{ord.total}</span>
              <button
                onClick={() => onTrackOrder(ord)}
                className="bg-[#6B1E2B] hover:bg-[#521620] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs"
              >
                Track Live
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}