import React, { useState } from 'react';
import { calculateCartTotals } from '../services/cartService';
import { storageService } from '../services/storageService';

export default function CheckoutPage({ cart, onOrderPlaced }) {
  const { subtotal, discount, tax, total } = calculateCartTotals(cart);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    orderType: 'Delivery',
    address: '',
    city: 'Bengaluru',
    pincode: '',
    tableNumber: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = "Valid phone is required";
    if (formData.orderType === 'Delivery') {
      if (!formData.address.trim()) errs.address = "Address is required for delivery";
      if (!formData.pincode.trim()) errs.pincode = "Pincode is required";
    }
    if (formData.orderType === 'Dine-in') {
      if (!formData.tableNumber.trim()) errs.tableNumber = "Table number required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate SS1025 style ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SS${randomNum}`;

    const newOrder = {
      orderId,
      items: cart,
      customer: formData,
      subtotal,
      discount,
      tax,
      total,
      status: 'Order Placed',
      createdAt: new Date().toLocaleString()
    };

    storageService.saveOrder(newOrder);
    storageService.saveUser(formData);
    onOrderPlaced(newOrder);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-[#6B1E2B]">Complete Your Order</h1>
        <p className="text-xs text-[#756B63]">Provide contact and fulfillment details to finalize.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white p-6 rounded-2xl border border-[#D4A24C]/30 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#2B2118] font-serif border-b pb-2">Customer Information</h2>

          <div>
            <label className="block text-xs font-bold text-[#2B2118] mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#FFF8F0] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6B1E2B]"
              placeholder="John Doe"
            />
            {errors.name && <span className="text-xs text-[#A63D40]">{errors.name}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2118] mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#FFF8F0] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6B1E2B]"
                placeholder="9876543210"
              />
              {errors.phone && <span className="text-xs text-[#A63D40]">{errors.phone}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2118] mb-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FFF8F0] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6B1E2B]"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-[#2B2118] mb-2">Order Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {['Delivery', 'Takeaway', 'Dine-in'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, orderType: type })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.orderType === type
                      ? 'bg-[#6B1E2B] text-white border-[#6B1E2B]'
                      : 'bg-white text-[#2B2118] border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {formData.orderType === 'Delivery' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#2B2118] mb-1">Delivery Address *</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#FFF8F0] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6B1E2B]"
                  placeholder="Street name, apartment, landmark"
                />
                {errors.address && <span className="text-xs text-[#A63D40]">{errors.address}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B2118] mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2118] mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-[#FFF8F0] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6B1E2B]"
                    placeholder="560001"
                  />
                  {errors.pincode && <span className="text-xs text-[#A63D40]">{errors.pincode}</span>}
                </div>
              </div>
            </div>
          )}

          {formData.orderType === 'Dine-in' && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#2B2118] mb-1">Table Number *</label>
              <input
                type="text"
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                className="w-full bg-[#FFF8F0] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6B1E2B]"
                placeholder="Table #5"
              />
              {errors.tableNumber && <span className="text-xs text-[#A63D40]">{errors.tableNumber}</span>}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#6B1E2B] hover:bg-[#521620] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all mt-4"
          >
            Confirm & Place Order (₹{total})
          </button>
        </form>

        {/* Mini Order Summary */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-[#D4A24C]/30 shadow-xs h-max space-y-4">
          <h3 className="font-bold font-serif text-[#2B2118] border-b pb-2">Order Items</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold text-[#2B2118]">{item.name}</span>
                  <span className="text-[#756B63] block">Qty: {item.quantity}</span>
                </div>
                <span className="font-semibold text-[#6B1E2B]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 text-xs space-y-1.5 text-[#756B63]">
            <div className="flex justify-between"><span>Subtotal:</span> <span>₹{subtotal}</span></div>
            <div className="flex justify-between text-[#3F7D58]"><span>Discount:</span> <span>-₹{discount}</span></div>
            <div className="flex justify-between"><span>Tax (5%):</span> <span>₹{tax}</span></div>
            <div className="flex justify-between text-sm font-bold text-[#2B2118] pt-2 border-t">
              <span>Final Total:</span>
              <span className="text-[#6B1E2B]">₹{total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}