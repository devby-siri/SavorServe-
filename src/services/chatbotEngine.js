import { calculateCartTotals } from './cartService.js';
import { storageService } from './storageService.js';

const NUMBER_WORDS = {
  a: 1, an: 1, one: 1, single: 1,
  two: 2, double: 2, couple: 2, pair: 2,
  three: 3, triple: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
};

// Aliases for accurate entity matching
const ALIASES = [
  // Pizzas
  { id: 'p3', patterns: ['paneer tikka pizzas', 'paneer tikka pizza', 'paneer pizzas', 'paneer pizza', 'paneer tikka'] },
  { id: 'p2', patterns: ['farmhouse pizzas', 'farmhouse pizza', 'farm house pizzas', 'farm house pizza', 'farmhouse', 'farm house'] },
  { id: 'p1', patterns: ['margherita pizzas', 'margherita pizza', 'margarita pizzas', 'margarita pizza', 'margheritas', 'margherita', 'margarita'] },
  
  // Burgers
  { id: 'b2', patterns: ['cheese burgers', 'cheese burger', 'cheeseburgers', 'cheeseburger'] },
  { id: 'b3', patterns: ['paneer burgers', 'paneer burger'] },
  { id: 'b1', patterns: ['veg burgers', 'veg burger', 'veggie burgers', 'veggie burger', 'burgers', 'burger'] },
  
  // Pastas
  { id: 'pa1', patterns: ['white sauce pastas', 'white sauce pasta', 'white pastas', 'white pasta', 'white sauce'] },
  { id: 'pa2', patterns: ['red sauce pastas', 'red sauce pasta', 'red pastas', 'red pasta', 'red sauce', 'arrabbiata', 'arrabiata'] },
  { id: 'pa3', patterns: ['alfredo pastas', 'alfredo pasta', 'alfredo'] },
  
  // Sides
  { id: 's2', patterns: ['peri peri fries', 'peri-peri fries', 'peri peri fry', 'peri peri', 'periperi fries'] },
  { id: 's1', patterns: ['french fries', 'french fry', 'frenchfries', 'fries', 'fry'] },
  { id: 's3', patterns: ['garlic breads', 'garlic bread'] },
  
  // Beverages
  { id: 'bev3', patterns: ['cold coffees', 'cold coffee', 'iced coffees', 'iced coffee'] },
  { id: 'bev2', patterns: ['fresh lime sodas', 'fresh lime soda', 'lime sodas', 'lime soda', 'lemon sodas', 'lemon soda'] },
  { id: 'bev1', patterns: ['coca-colas', 'coca-cola', 'coca colas', 'coca cola', 'cokes', 'coke', 'colas', 'cola'] },
  
  // Desserts
  { id: 'd1', patterns: ['chocolate brownies', 'chocolate brownie', 'choco brownies', 'choco brownie', 'brownies', 'brownie'] },
  { id: 'd2', patterns: ['ice creams', 'ice cream', 'icecreams', 'icecream', 'vanilla ice cream'] }
];

// Accurately extract each individual item and its corresponding quantity
export const extractOrderItems = (text, menuList) => {
  const normalized = text.toLowerCase();
  const candidates = [];

  // 1. Add predefined aliases
  ALIASES.forEach(alias => {
    const item = menuList.find(m => m.id === alias.id || m.name.toLowerCase() === alias.patterns[0]);
    if (item) {
      alias.patterns.forEach(pat => {
        candidates.push({ pattern: pat, item });
      });
    }
  });

  // 2. Add dynamic menu items
  menuList.forEach(item => {
    const nameLower = item.name.toLowerCase();
    candidates.push({ pattern: nameLower, item });
    if (!nameLower.endsWith('s')) {
      candidates.push({ pattern: nameLower + 's', item });
    }
  });

  // Sort by length descending so longer/more specific patterns match first
  candidates.sort((a, b) => b.pattern.length - a.pattern.length);

  // Find non-overlapping occurrences
  const occupiedIndices = new Set();
  const matchedOccurrences = [];

  for (const { pattern, item } of candidates) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match;
    while ((match = regex.exec(normalized)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      
      let overlaps = false;
      for (let i = start; i < end; i++) {
        if (occupiedIndices.has(i)) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        for (let i = start; i < end; i++) {
          occupiedIndices.add(i);
        }
        matchedOccurrences.push({
          item,
          start,
          end,
          matchedText: match[0]
        });
      }
    }
  }

  if (matchedOccurrences.length === 0) {
    return [];
  }

  // Sort matches by position in the text
  matchedOccurrences.sort((a, b) => a.start - b.start);

  const result = [];
  
  for (let idx = 0; idx < matchedOccurrences.length; idx++) {
    const occ = matchedOccurrences[idx];
    const prevEnd = idx === 0 ? 0 : matchedOccurrences[idx - 1].end;
    const nextStart = idx === matchedOccurrences.length - 1 ? normalized.length : matchedOccurrences[idx + 1].start;

    // Window before this item
    const textBefore = normalized.slice(prevEnd, occ.start);
    // Window after this item
    const textAfter = normalized.slice(occ.end, nextStart);

    let quantity = null;

    // Scope textBefore to text AFTER any delimiter ('and', ',', '+', '&', 'with')
    const separatorBeforeMatch = textBefore.match(/(?:^|.*[\s,])(?:and|&|\+|with|,)\s*(.*)$/i);
    const relevantBefore = separatorBeforeMatch ? separatorBeforeMatch[1] : textBefore;

    // Scope textAfter to text BEFORE any delimiter
    const separatorAfterMatch = textAfter.match(/^(.*?)(?:[\s,]*(?:and|&|\+|with|,)|$)/i);
    const relevantAfter = separatorAfterMatch ? separatorAfterMatch[1] : textAfter;

    // 1. Check for quantity before item (e.g. "i want 2 cheese burgers" -> "2")
    const numberTokensRegex = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a|an|single|double)\b/gi;
    const matchesBefore = [...relevantBefore.matchAll(numberTokensRegex)];

    if (matchesBefore.length > 0) {
      const lastMatch = matchesBefore[matchesBefore.length - 1][0].toLowerCase();
      if (NUMBER_WORDS[lastMatch] !== undefined) {
        quantity = NUMBER_WORDS[lastMatch];
      } else {
        const parsed = parseInt(lastMatch, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
          quantity = parsed;
        }
      }
    }

    // 2. Check for quantity after item (e.g. "cheese burger x 2")
    if (quantity === null) {
      const matchAfter = relevantAfter.match(/^\s*(?:x|\*|of|qty|quantity)?\s*(\b\d+\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\b)/i);
      if (matchAfter) {
        const val = matchAfter[1].toLowerCase();
        if (NUMBER_WORDS[val] !== undefined) {
          quantity = NUMBER_WORDS[val];
        } else {
          const parsed = parseInt(val, 10);
          if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
            quantity = parsed;
          }
        }
      }
    }

    // Default to 1
    if (quantity === null || quantity <= 0) {
      quantity = 1;
    }

    const existing = result.find(r => r.item.id === occ.item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      result.push({
        item: occ.item,
        quantity
      });
    }
  }

  return result;
};

export const processUserMessage = (userInput, currentCart, menuList, navigateTo) => {
  const text = userInput.trim().toLowerCase();
  const effectiveCart = (currentCart && currentCart.length > 0) ? currentCart : storageService.getCart();
  
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
    if (effectiveCart.length === 0) {
      return {
        text: "🛒 Your cart is currently empty!\n\nWould you like to check out our menu and add something delicious?",
        quickButtons: [
          { label: "View Menu", query: "Show me the menu" },
          { label: "Popular Items", query: "Show popular items" }
        ]
      };
    }

    const { subtotal, discount, tax, total } = calculateCartTotals(effectiveCart);
    let summaryText = "🛒 **Your Current Cart Summary:**\n\n";
    effectiveCart.forEach(i => {
      summaryText += `• ${i.name} × ${i.quantity} = ₹${i.price * i.quantity}\n`;
    });
    summaryText += `\nSubtotal: ₹${subtotal}\nDiscount: -₹${discount}\nTax (5% GST): ₹${tax}\n**Final Total: ₹${total}**`;

    return {
      text: summaryText,
      quickButtons: [
        { label: "Proceed to Checkout 🚀", action: () => navigateTo('checkout') },
        { label: "Add More Food", query: "Show menu" },
        { label: "Clear Cart", query: "Clear my cart" }
      ]
    };
  }

  // 4. CHECKOUT / PLACE ORDER INTENT
  if (text.includes("checkout") || text.includes("place order") || text.includes("pay") || text.includes("confirm order")) {
    if (effectiveCart.length === 0) {
      return {
        text: "⚠️ Your cart is empty! Please add some items before checking out.",
        quickButtons: [{ label: "View Menu", query: "Show menu" }]
      };
    }

    const { subtotal, discount, tax, total } = calculateCartTotals(effectiveCart);
    let checkoutSummary = "📋 **Order Summary Before Checkout:**\n\n";
    effectiveCart.forEach(i => {
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

  // 7. PRICE INQUIRY (Check before Add to Cart)
  if (text.includes("how much") || text.includes("price") || text.includes("cost")) {
    const matched = menuList.find(i => text.includes(i.name.toLowerCase()));
    if (matched) {
      return {
        text: `💰 **${matched.name}** costs **₹${matched.price}**.\n\nDescription: ${matched.description}`,
        quickButtons: [{ label: `Add ${matched.name}`, query: `I want 1 ${matched.name}` }]
      };
    }
  }

  // 8. ADD TO CART INTENT (Multi-item individual quantity extraction)
  const itemsToAdd = extractOrderItems(text, menuList);

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
        { label: "Proceed to Checkout 🚀", action: () => navigateTo('checkout') },
        { label: "View Cart 🛒", query: "Show my cart" },
        { label: "Add Drinks 🥤", query: "Show beverages" }
      ]
    };
  }

  // 9. MENU / CATEGORY REQUEST
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
            "What would you like to order? You can type e.g., *'I want 2 Cheese Burgers and 1 Chocolate Brownie'*",
      quickButtons: [
        { label: "Show Pizzas", query: "Show me pizzas" },
        { label: "Show Burgers", query: "Show me burgers" },
        { label: "Show Beverages", query: "Show beverages" }
      ]
    };
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
          "• *I want 2 cheese burgers and 1 chocolate brownie*\n" +
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