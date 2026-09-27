import { calculateCartTotals } from './cartService';

// Extract numbers from word forms or digits
const parseQuantity = (text) => {
  const numberWords = {
    one: 1, a: 1, an: 1, single: 1,
    two: 2, double: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10
  };

  const match = text.match(/\b\d+\b/);
  if (match) return parseInt(match[0], 10);

  for (const [word, val] of Object.entries(numberWords)) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(text)) return val;
  }

  return 1; // default fallback
};

export const processUserMessage = (userInput, currentCart, menuList, navigateTo) => {
  const text = userInput.trim().toLowerCase();
  
  // 1. GREETING INTENT
  if (/^(hi|hello|hey|greetings|good morning|good evening|namaste|sup)\b/i.test(text)) {
    return {
      text: "👋 Welcome to SavorServe! I am your AI Ordering Assistant.\n\nHow can I satisfy your cravings today?",
      quickButtons: [
        { label: "View Menu", query: "Show me the menu" },
        { label: "Today's Offers", query: "Any offers?" },
        { label: "Popular Items", query: "Show popular items" },
        { label: "My Cart", query: "Show my cart" }
      ]
    };
  }

  // 2. OFFERS INTENT
  if (text.includes("offer") || text.includes("discount") || text.includes("deal") || text.includes("coupon")) {
    return {
      text: "🎉 **Today's Hot SavorServe Offers:**\n\n" +
            "1. 🍕 **Pizza Party**: Order 2+ pizzas and get **₹50 OFF**!\n" +
            "2. 🍔 **Burger Combo**: Order Burger + Fries + Coke for **₹30 OFF**!\n" +
            "3. 🎁 **First Order**: Get **₹50 OFF** on total above ₹399!\n\n" +
            "Discounts apply automatically in your cart at checkout!",
      quickButtons: [
        { label: "Order Pizza", query: "Show pizzas" },
        { label: "Order Burger", query: "I want a cheese burger" },
        { label: "View Cart", query: "Show my cart" }
      ]
    };
  }

  // 3. SHOW CART / TOTAL INTENT
  if (text.includes("cart") || text.includes("total") || text.includes("bill") || text.includes("my order")) {
    if (currentCart.length === 0) {
      return {
        text: "🛒 Your cart is currently empty!\n\nWould you like to check out our menu and add something delicious?",
        quickButtons: [
          { label: "View Menu", query: "Show me the menu" },
          { label: "Popular Items", query: "Show popular items" }
        ]
      };
    }

    const { subtotal, discount, tax, total } = calculateCartTotals(currentCart);
    let summaryText = "🛒 **Your Current Cart Summary:**\n\n";
    currentCart.forEach(i => {
      summaryText += `• ${i.name} × ${i.quantity} = ₹${i.price * i.quantity}\n`;
    });
    summaryText += `\nSubtotal: ₹${subtotal}\nDiscount: -₹${discount}\nTax (5% GST): ₹${tax}\n**Final Total: ₹${total}**`;

    return {
      text: summaryText,
      quickButtons: [
        { label: "Proceed to Checkout", query: "Checkout" },
        { label: "Add More Food", query: "Show menu" },
        { label: "Clear Cart", query: "Clear my cart" }
      ]
    };
  }

  // 4. CHECKOUT / PLACE ORDER INTENT
  if (text.includes("checkout") || text.includes("place order") || text.includes("pay") || text.includes("confirm order")) {
    if (currentCart.length === 0) {
      return {
        text: "⚠️ Your cart is empty! Please add some items before checking out.",
        quickButtons: [{ label: "View Menu", query: "Show menu" }]
      };
    }

    const { subtotal, discount, tax, total } = calculateCartTotals(currentCart);
    let checkoutSummary = "📋 **Order Summary Before Checkout:**\n\n";
    currentCart.forEach(i => {
      checkoutSummary += `• ${i.name} × ${i.quantity} — ₹${i.price * i.quantity}\n`;
    });
    checkoutSummary += `\nSubtotal: ₹${subtotal}\nDiscount: -₹${discount}\nTax: ₹${tax}\n**Total Amount: ₹${total}**\n\nReady to enter delivery details and place order?`;

    return {
      text: checkoutSummary,
      quickButtons: [
        { label: "Proceed to Details 🚀", action: () => navigateTo('checkout') },
        { label: "Add More Food", query: "Show menu" }
      ]
    };
  }

  // 5. CLEAR CART INTENT
  if (text.includes("clear cart") || text.includes("empty cart")) {
    return {
      text: "🗑️ Your cart has been emptied.",
      actionType: "CLEAR_CART",
      quickButtons: [{ label: "View Menu", query: "Show menu" }]
    };
  }

  // 6. REMOVE ITEM INTENT
  if (text.startsWith("remove") || text.includes("delete")) {
    const matchedItem = menuList.find(i => text.includes(i.name.toLowerCase()));
    if (matchedItem) {
      return {
        text: `🗑️ Removed **${matchedItem.name}** from your cart.`,
        actionType: "REMOVE_ITEM",
        item: matchedItem,
        quickButtons: [{ label: "Show Cart", query: "Show my cart" }]
      };
    }
  }

  // 7. MENU / CATEGORY REQUEST
  if (text.includes("menu") || text.includes("categories") || text.includes("what do you have") || text.includes("popular")) {
    if (text.includes("pizza")) {
      const pizzas = menuList.filter(m => m.category === "Pizza");
      return {
        text: "🍕 **Here are our available Pizzas:**\n\n" + pizzas.map(p => `• **${p.name}** — ₹${p.price}\n  _${p.description}_`).join("\n\n"),
        quickButtons: pizzas.map(p => ({ label: `Add ${p.name}`, query: `Add 1 ${p.name}` }))
      };
    }
    if (text.includes("burger")) {
      const burgers = menuList.filter(m => m.category === "Burgers");
      return {
        text: "🍔 **Here are our juicy Burgers:**\n\n" + burgers.map(b => `• **${b.name}** — ₹${b.price}\n  _${b.description}_`).join("\n\n"),
        quickButtons: burgers.map(b => ({ label: `Add ${b.name}`, query: `Add 1 ${b.name}` }))
      };
    }
    if (text.includes("pasta")) {
      const pastas = menuList.filter(m => m.category === "Pasta");
      return {
        text: "🍝 **Delicious Pasta selection:**\n\n" + pastas.map(p => `• **${p.name}** — ₹${p.price}\n  _${p.description}_`).join("\n\n"),
        quickButtons: pastas.map(p => ({ label: `Add ${p.name}`, query: `Add 1 ${p.name}` }))
      };
    }

    // General Menu Summary
    return {
      text: "📖 **SavorServe Menu Categories:**\n\n" +
            "🍕 **Pizza**: Margherita, Farmhouse, Paneer Tikka\n" +
            "🍔 **Burgers**: Veg Burger, Cheese Burger, Paneer Burger\n" +
            "🍝 **Pasta**: White Sauce, Red Sauce, Alfredo Pasta\n" +
            "🍟 **Sides**: French Fries, Peri Peri Fries, Garlic Bread\n" +
            "🥤 **Beverages**: Coke, Fresh Lime Soda, Cold Coffee\n" +
            "🍨 **Desserts**: Chocolate Brownie, Ice Cream\n\n" +
            "What would you like to order? You can type e.g., *'I want 2 Cheese Burgers'*",
      quickButtons: [
        { label: "Show Pizzas", query: "Show me pizzas" },
        { label: "Show Burgers", query: "Show me burgers" },
        { label: "Show Beverages", query: "Show beverages" }
      ]
    };
  }

  // 8. ADD TO CART INTENT (Multi-item or direct item parsing)
  let itemsToAdd = [];
  menuList.forEach(item => {
    const itemNameLower = item.name.toLowerCase();
    // match exact name or key word
    if (text.includes(itemNameLower) || (itemNameLower.includes("coke") && text.includes("coke")) || (itemNameLower.includes("fries") && text.includes("fries"))) {
      const qty = parseQuantity(text);
      itemsToAdd.push({ item, quantity: qty });
    }
  });

  if (itemsToAdd.length > 0) {
    let replyText = "🎉 **Added to your cart:**\n\n";
    itemsToAdd.forEach(entry => {
      replyText += `• **${entry.quantity} × ${entry.item.name}** (₹${entry.item.price * entry.quantity})\n`;
    });
    replyText += "\nWhat would you like to do next?";

    return {
      text: replyText,
      actionType: "ADD_ITEMS",
      itemsToAdd,
      quickButtons: [
        { label: "View Cart", query: "Show my cart" },
        { label: "Add Drinks", query: "Show beverages" },
        { label: "Checkout Now", query: "Checkout" }
      ]
    };
  }

  // 9. PRICE INQUIRY
  if (text.includes("how much") || text.includes("price") || text.includes("cost")) {
    const matched = menuList.find(i => text.includes(i.name.toLowerCase()));
    if (matched) {
      return {
        text: `💰 **${matched.name}** costs **₹${matched.price}**.\n\nDescription: ${matched.description}`,
        quickButtons: [{ label: `Add ${matched.name}`, query: `I want 1 ${matched.name}` }]
      };
    }
  }

  // 10. RECOMMENDATIONS
  if (text.includes("recommend") || text.includes("suggest") || text.includes("go well") || text.includes("pair")) {
    return {
      text: "💡 **Popular SavorServe Pairings:**\n\n" +
            "• **Cheese Burger** + 🍟 **Peri Peri Fries** + 🥤 **Cold Coffee**\n" +
            "• **Farmhouse Pizza** + 🥖 **Garlic Bread** + 🥤 **Coke**\n\n" +
            "Would you like to add any of these to your order?",
      quickButtons: [
        { label: "Add Burger + Fries", query: "I want 1 Cheese Burger and 1 Peri Peri Fries" },
        { label: "Add Cold Coffee", query: "Add 1 Cold Coffee" }
      ]
    };
  }

  // 11. FALLBACK RESPONSE
  return {
    text: "🤔 I'm not sure I understood that request.\n\nYou can ask me things like:\n" +
          "• *Show me the menu*\n" +
          "• *I want 2 cheese burgers and 1 coke*\n" +
          "• *Show my cart*\n" +
          "• *Any offers?*\n" +
          "• *Place my order*",
    quickButtons: [
      { label: "View Menu", query: "Show menu" },
      { label: "Popular Items", query: "Show popular items" },
      { label: "Help", query: "Hi" }
    ]
  };
};