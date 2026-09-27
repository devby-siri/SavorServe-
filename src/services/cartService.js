import { OFFERS } from '../data/offers.js';

export const calculateCartTotals = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate best auto discount
  let maxDiscount = 0;
  let appliedOfferName = null;

  if (cart.length > 0) {
    OFFERS.forEach(offer => {
      if (offer.condition(cart, subtotal)) {
        if (offer.discount > maxDiscount) {
          maxDiscount = offer.discount;
          appliedOfferName = offer.title;
        }
      }
    });
  }

  // Ensure discount doesn't exceed subtotal
  const discount = Math.min(maxDiscount, subtotal);
  
  // Tax calculation (5% GST)
  const tax = Math.round((subtotal - discount) * 0.05);
  
  const total = Math.max(0, subtotal - discount + tax);

  return {
    subtotal,
    discount,
    appliedOfferName,
    tax,
    total,
    itemCount: cart.reduce((sum, i) => sum + i.quantity, 0)
  };
};