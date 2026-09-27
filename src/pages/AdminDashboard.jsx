import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { ShoppingBag, DollarSign, Clock, Utensils, CheckCircle, Edit, Trash, Plus, RotateCcw, TrendingUp } from 'lucide-react';

export default function AdminDashboard({ menu, setMenu }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  
  const [orders, setOrders] = useState(storageService.getOrders());

  // Menu Form Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState({ name: '', price: '', category: 'Pizza', description: '', image: '', available: true });

  const handleLogin = (e) => {
    e.preventDefault();
    if (passInput === 'admin' || passInput === '1234') {
      setAuthenticated(true);
    } else {
      alert("Invalid password! (Use 'admin')");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updated = storageService.updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };

  const handleSaveMenuItem = (e) => {
    e.preventDefault();
    if (!editItem.name || !editItem.price) return;

    let updatedMenu;
    if (editItem.id) {
      updatedMenu = menu.map(m => m.id === editItem.id ? { ...editItem, price: Number(editItem.price) } : m);
    } else {
      const newItem = { ...editItem, id: Date.now().toString(), price: Number(editItem.price) };
      updatedMenu = [newItem, ...menu];
    }

    setMenu(updatedMenu);
    storageService.saveMenu(updatedMenu);
    setIsEditing(false);
  };

  const handleDeleteItem = (id) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      const updatedMenu = menu.filter(m => m.id !== id);
      setMenu(updatedMenu);
      storageService.saveMenu(updatedMenu);
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#D4A24C]/40 shadow-lg my-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#6B1E2B] text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            🔒
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#6B1E2B]">Admin Portal</h2>
          <p className="text-xs text-[#756B63]">Restaurant Staff Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2118] mb-1">Enter Admin Password</label>
            <input
              type="password"
              placeholder="Default: admin"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6B1E2B]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6B1E2B] hover:bg-[#521620] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all"
          >
            Authenticate Admin
          </button>
        </form>
      </div>
    );
  }

  // Calculate Metrics
  const totalOrders = orders.length;
  const todaysOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status !== 'Completed').length;

  const handleResetSampleOrders = () => {
    const reset = storageService.resetOrders();
    setOrders(reset);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#6B1E2B]">Admin Control Panel</h1>
          <p className="text-xs text-[#756B63]">Manage live customer orders & restaurant menu database.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'orders' ? 'bg-[#6B1E2B] text-white border-[#6B1E2B]' : 'bg-white text-[#2B2118]'
            }`}
          >
            Live Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'menu' ? 'bg-[#6B1E2B] text-white border-[#6B1E2B]' : 'bg-white text-[#2B2118]'
            }`}
          >
            Menu Management ({menu.length})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D4A24C]/30 shadow-xs flex items-center space-x-4">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#756B63]">Total Orders</p>
            <p className="text-2xl font-bold text-[#2B2118]">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D4A24C]/30 shadow-xs flex items-center space-x-4">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#756B63]">Today's Orders</p>
            <p className="text-2xl font-bold text-[#2B2118]">{todaysOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D4A24C]/30 shadow-xs flex items-center space-x-4">
          <div className="w-11 h-11 bg-green-50 text-[#3F7D58] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#756B63]">Total Revenue</p>
            <p className="text-2xl font-bold text-[#2B2118]">₹{totalRevenue}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D4A24C]/30 shadow-xs flex items-center space-x-4">
          <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#756B63]">Pending Orders</p>
            <p className="text-2xl font-bold text-[#2B2118]">{pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-[#D4A24C]/30 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#2B2118]">Recent Kitchen Orders</h3>
              <p className="text-xs text-[#756B63]">Change status dropdown to trigger live customer tracking updates.</p>
            </div>
            <button
              onClick={handleResetSampleOrders}
              className="text-xs text-[#6B1E2B] hover:text-white hover:bg-[#6B1E2B] bg-[#FFF8F0] border border-[#D4A24C]/40 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Orders</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2B2118]">
              <thead className="bg-[#FFF8F0] border-b text-gray-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Order Type</th>
                  <th className="p-4">Items Ordered</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#D96B27] block text-sm">{ord.orderId}</span>
                      <span className="text-gray-400 text-[10px] block mt-0.5">
                        {ord.time || (ord.createdAt ? ord.createdAt.split(',')[1]?.trim() : '')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold block text-sm text-[#2B2118]">{ord.customer?.name}</span>
                      <span className="text-gray-400 text-[11px] block mt-0.5">{ord.customer?.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-xs block text-[#2B2118]">{ord.customer?.orderType}</span>
                      {ord.customer?.orderType === 'Dine-in' && ord.customer?.tableNumber && (
                        <span className="text-[#D96B27] text-[11px] font-semibold block mt-0.5">
                          {ord.customer.tableNumber}
                        </span>
                      )}
                      {ord.customer?.orderType === 'Delivery' && ord.customer?.address && (
                        <span className="text-gray-400 text-[10px] block truncate max-w-[140px] mt-0.5" title={ord.customer.address}>
                          {ord.customer.address}
                        </span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs text-xs text-[#2B2118] leading-relaxed">
                      {ord.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-sm text-[#2B2118] block">₹{ord.total}</span>
                      {ord.discount > 0 && (
                        <span className="text-[#3F7D58] font-semibold text-[10px] block mt-0.5">
                          -₹{ord.discount}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {ord.status === 'Preparing' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FEEDDE] text-[#C05621]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C05621] mr-1.5"></span>
                          Preparing
                        </span>
                      )}
                      {ord.status === 'Out for Delivery' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FCE8ED] text-[#D0486D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D0486D] mr-1.5"></span>
                          Out for Delivery
                        </span>
                      )}
                      {ord.status === 'Ready' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F1FC] text-[#2970C6]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2970C6] mr-1.5"></span>
                          Ready
                        </span>
                      )}
                      {ord.status === 'Order Placed' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FEF5E5] text-[#B7791F]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F] mr-1.5"></span>
                          Order Placed
                        </span>
                      )}
                      {ord.status === 'Order Accepted' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F1FC] text-[#2970C6]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2970C6] mr-1.5"></span>
                          Order Accepted
                        </span>
                      )}
                      {ord.status === 'Completed' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EBF7EE] text-[#3F7D58]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D58] mr-1.5"></span>
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:border-[#6B1E2B] shadow-2xs text-[#2B2118] cursor-pointer"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Order Accepted">Order Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MENU MANAGEMENT TAB */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-[#2B2118]">Restaurant Dishes Catalog</h2>
            <button
              onClick={() => {
                setEditItem({ name: '', price: '', category: 'Pizza', description: '', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', available: true });
                setIsEditing(true);
              }}
              className="bg-[#6B1E2B] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-[#D4A24C]/30 shadow-2xs flex justify-between space-x-3 items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-[#2B2118] truncate">{item.name}</h4>
                  <p className="text-xs text-[#6B1E2B] font-semibold">₹{item.price} • <span className="text-gray-500">{item.category}</span></p>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => { setEditItem(item); setIsEditing(true); }}
                    className="p-1.5 text-gray-500 hover:text-[#6B1E2B]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-gray-500 hover:text-[#A63D40]"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-4 border border-[#D4A24C]">
            <h3 className="font-serif font-bold text-lg text-[#6B1E2B]">
              {editItem.id ? 'Edit Dish Details' : 'Add New Dish'}
            </h3>

            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full bg-[#FFF8F0] border border-gray-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editItem.price}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    className="w-full bg-[#FFF8F0] border border-gray-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="w-full bg-[#FFF8F0] border border-gray-200 rounded-lg p-2"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Sides">Sides</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full bg-[#FFF8F0] border border-gray-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editItem.image}
                  onChange={(e) => setEditItem({ ...editItem, image: e.target.value })}
                  className="w-full bg-[#FFF8F0] border border-gray-200 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#6B1E2B] text-white font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}