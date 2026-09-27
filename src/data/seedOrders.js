export const INITIAL_ORDERS = [
  {
    orderId: "SS1023",
    time: "04:20 AM",
    createdAt: "Today, 04:20 AM",
    customer: {
      name: "Rahul Verma",
      phone: "9988776655",
      email: "rahul.verma@example.com",
      orderType: "Dine-in",
      tableNumber: "Table 04",
      address: "",
      city: "Bengaluru",
      pincode: ""
    },
    items: [
      { id: "pa1", name: "White Sauce Pasta", price: 179, quantity: 1 },
      { id: "s3", name: "Garlic Bread", price: 129, quantity: 1 },
      { id: "d1", name: "Chocolate Brownie", price: 119, quantity: 1 }
    ],
    subtotal: 427,
    discount: 50,
    tax: 19,
    total: 396,
    status: "Preparing"
  },
  {
    orderId: "SS1022",
    time: "03:10 AM",
    createdAt: "Today, 03:10 AM",
    customer: {
      name: "Priya Patel",
      phone: "9812345678",
      email: "priya.patel@example.com",
      orderType: "Delivery",
      address: "Flat 402, Sunshine Heights, MG Road",
      city: "Bengaluru",
      pincode: "560001"
    },
    items: [
      { id: "b2", name: "Cheese Burger", price: 179, quantity: 2 },
      { id: "s1", name: "French Fries", price: 99, quantity: 1 },
      { id: "bev1", name: "Coke", price: 49, quantity: 1 }
    ],
    subtotal: 506,
    discount: 30,
    tax: 24,
    total: 500,
    status: "Out for Delivery"
  },
  {
    orderId: "SS1021",
    time: "01:45 AM",
    createdAt: "Today, 01:45 AM",
    customer: {
      name: "Aarav Sharma",
      phone: "9876543210",
      email: "aarav.sharma@example.com",
      orderType: "Takeaway",
      address: "",
      city: "Bengaluru",
      pincode: ""
    },
    items: [
      { id: "p1", name: "Margherita Pizza", price: 199, quantity: 2 },
      { id: "bev1", name: "Coke", price: 49, quantity: 1 }
    ],
    subtotal: 447,
    discount: 50,
    tax: 20,
    total: 417,
    status: "Ready"
  },
  {
    orderId: "SS1026",
    time: "12:06 AM",
    createdAt: "Today, 12:06 AM",
    customer: {
      name: "Siri Devadas",
      phone: "7676854223",
      email: "siri.devadas@example.com",
      orderType: "Takeaway",
      address: "",
      city: "Bengaluru",
      pincode: ""
    },
    items: [
      { id: "pa1", name: "White Sauce Pasta", price: 179, quantity: 2 }
    ],
    subtotal: 358,
    discount: 0,
    tax: 18,
    total: 376,
    status: "Order Placed"
  },
  {
    orderId: "SS1025",
    time: "12:00 AM",
    createdAt: "Today, 12:00 AM",
    customer: {
      name: "Test CSE Student",
      phone: "9876543210",
      email: "cse.student@example.com",
      orderType: "Takeaway",
      address: "",
      city: "Bengaluru",
      pincode: ""
    },
    items: [
      { id: "b2", name: "Cheese Burger", price: 179, quantity: 2 },
      { id: "bev1", name: "Coke", price: 49, quantity: 1 }
    ],
    subtotal: 407,
    discount: 50,
    tax: 18,
    total: 375,
    status: "Preparing"
  }
];
