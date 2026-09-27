export const INITIAL_MENU = [
  // Pizza
  {
    id: "p1",
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Classic mozzarella, fresh basil, and tomato sauce on a crisp crust.",
    price: 199,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },
  {
    id: "p2",
    name: "Farmhouse Pizza",
    category: "Pizza",
    description: "Loaded with crunchy capsicum, sweet corn, juicy tomatoes & crisp onions.",
    price: 249,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },
  {
    id: "p3",
    name: "Paneer Tikka Pizza",
    category: "Pizza",
    description: "Spicy marinated paneer cubes, capsicum, red paprika & makhani sauce.",
    price: 269,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: false
  },
  
  // Burgers
  {
    id: "b1",
    name: "Veg Burger",
    category: "Burgers",
    description: "Golden crispy veggie patty with lettuce, tomatoes, and tangy mayo.",
    price: 149,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: false
  },
  {
    id: "b2",
    name: "Cheese Burger",
    category: "Burgers",
    description: "Melted cheddar cheese over a savory veggie patty with herb sauce.",
    price: 179,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },
  {
    id: "b3",
    name: "Paneer Burger",
    category: "Burgers",
    description: "Thick grilled paneer slab layered with spicy mint chutney & onions.",
    price: 189,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: false
  },

  // Pasta
  {
    id: "pa1",
    name: "White Sauce Pasta",
    category: "Pasta",
    description: "Penne cooked in rich, velvety garlic parmesan cream sauce.",
    price: 179,
    image: "/images/white_sauce_pasta.jpg",
    available: true,
    isPopular: true
  },
  {
    id: "pa2",
    name: "Red Sauce Pasta",
    category: "Pasta",
    description: "Penne pasta tossed in tangy Italian arrabbiata tomato basil sauce.",
    price: 169,
    image: "/images/red_sauce_pasta.jpg",
    available: true,
    isPopular: false
  },
  {
    id: "pa3",
    name: "Alfredo Pasta",
    category: "Pasta",
    description: "Rich butter cream Alfredo sauce with bell peppers & Italian herbs.",
    price: 199,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: false
  },

  // Sides
  {
    id: "s1",
    name: "French Fries",
    category: "Sides",
    description: "Crispy salted potato fries served piping hot with tomato ketchup.",
    price: 99,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },
  {
    id: "s2",
    name: "Peri Peri Fries",
    category: "Sides",
    description: "Golden fries dusted with zesty African Peri-Peri spice blend.",
    price: 119,
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },
  {
    id: "s3",
    name: "Garlic Bread",
    category: "Sides",
    description: "Oven-baked baguette brushed with garlic butter and parsley.",
    price: 129,
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: false
  },

  // Beverages
  {
    id: "bev1",
    name: "Coke",
    category: "Beverages",
    description: "Chilled 330ml Coca-Cola glass bottle or can.",
    price: 49,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },
  {
    id: "bev2",
    name: "Fresh Lime Soda",
    category: "Beverages",
    description: "Refreshing sparkling lime drink with mint and rock salt.",
    price: 69,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: false
  },
  {
    id: "bev3",
    name: "Cold Coffee",
    category: "Beverages",
    description: "Creamy whipped espresso cold coffee topped with cocoa powder.",
    price: 99,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },

  // Desserts
  {
    id: "d1",
    name: "Chocolate Brownie",
    category: "Desserts",
    description: "Warm fudgy chocolate brownie drizzled with hot fudge sauce.",
    price: 119,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: true
  },
  {
    id: "d2",
    name: "Ice Cream",
    category: "Desserts",
    description: "Two rich scoops of gourmet Madagascar vanilla ice cream.",
    price: 89,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80",
    available: true,
    isPopular: false
  }
];