import { INITIAL_MENU } from '../data/seedMenu';
import { INITIAL_ORDERS } from '../data/seedOrders';

const KEYS = {
  MENU: 'savorserve_menu',
  CART: 'savorserve_cart',
  ORDERS: 'savorserve_orders',
  USER: 'savorserve_user',
};

export const storageService = {
  // Menu
  getMenu: () => {
    const data = localStorage.getItem(KEYS.MENU);
    if (!data) {
      localStorage.setItem(KEYS.MENU, JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
    try {
      const menu = JSON.parse(data);
      let updated = false;
      const refreshedMenu = menu.map(item => {
        if (item.name === "Garlic Bread" && (item.image?.includes("1573140247632") || !item.image)) {
          updated = true;
          return { ...item, image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&q=80" };
        }
        if (item.name === "White Sauce Pasta" && (!item.image?.includes("white_sauce_pasta.jpg"))) {
          updated = true;
          return { ...item, image: "/images/white_sauce_pasta.jpg" };
        }
        if (item.name === "Red Sauce Pasta" && (!item.image?.includes("red_sauce_pasta.jpg"))) {
          updated = true;
          return { ...item, image: "/images/red_sauce_pasta.jpg" };
        }
        return item;
      });
      if (updated) {
        localStorage.setItem(KEYS.MENU, JSON.stringify(refreshedMenu));
        return refreshedMenu;
      }
      return menu;
    } catch {
      localStorage.setItem(KEYS.MENU, JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
  },
  saveMenu: (menu) => {
    localStorage.setItem(KEYS.MENU, JSON.stringify(menu));
  },

  // Cart
  getCart: () => {
    const data = localStorage.getItem(KEYS.CART);
    return data ? JSON.parse(data) : [];
  },
  saveCart: (cart) => {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  },

  // Orders
  getOrders: () => {
    const data = localStorage.getItem(KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    } catch {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
  },
  saveOrder: (order) => {
    const orders = storageService.getOrders();
    orders.unshift(order); // latest first
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  },
  resetOrders: () => {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  },
  updateOrderStatus: (orderId, newStatus) => {
    const orders = storageService.getOrders();
    const updated = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
    return updated;
  },

  // User Profile
  getUser: () => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  saveUser: (user) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }
};