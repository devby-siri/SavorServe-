export const OFFERS = [
  {
    id: "OFFER_PIZZA",
    code: "PIZZAPARTY",
    title: "Pizza Party Discount",
    description: "Order 2 or more pizzas and receive ₹50 OFF automatically!",
    discount: 50,
    badge: "🍕 Party Saver",
    condition: (cart) => {
      const pizzaCount = cart.reduce((count, item) => {
        return item.category === "Pizza" ? count + item.quantity : count;
      }, 0);
      return pizzaCount >= 2;
    }
  },
  {
    id: "OFFER_BURGER_COMBO",
    code: "BURGERCOMBO",
    title: "Burger Combo Deal",
    description: "Order any Burger + Fries + Coke and get ₹30 OFF!",
    discount: 30,
    badge: "🍔 Combo Special",
    condition: (cart) => {
      const hasBurger = cart.some(i => i.category === "Burgers");
      const hasFries = cart.some(i => i.name.toLowerCase().includes("fries"));
      const hasCoke = cart.some(i => i.name.toLowerCase().includes("coke"));
      return hasBurger && hasFries && hasCoke;
    }
  },
  {
    id: "OFFER_FIRST",
    code: "WELCOME50",
    title: "First Order Discount",
    description: "Get ₹50 OFF on orders above ₹399!",
    discount: 50,
    badge: "🎉 First Order",
    condition: (cart, subtotal) => subtotal >= 399
  }
];