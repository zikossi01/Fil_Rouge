import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import Loading from '../components/common/Loading.jsx';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock admin data
    setTimeout(() => {
      setProducts([
        { _id: '1', name: 'Fresh Apples', price: 3.99, category: 'fruits', stock: 50, isAvailable: true },
        { _id: '2', name: 'Organic Bananas', price: 2.49, category: 'fruits', stock: 30, isAvailable: true },
        { _id: '3', name: 'Fresh Spinach', price: 1.99, category: 'vegetables', stock: 25, isAvailable: true }
      ]);
      
      setOrders([
        {
          _id: 'order-1',
          user: { name: 'Alice Johnson', email: 'alice@example.com' },
          totalAmount: 25.97,
          status: 'pending',
          createdAt: '2025-08-18T09:00:00Z'
        },
        {
          _id: 'order-2',
          user: { name: 'Bob Smith', email: 'bob@example.com' },
          totalAmount: 45.50,
          status: 'confirmed',
          createdAt: '2025-08-18T08:30:00Z'
        }
      ]);
      
      setDeliveries([
        {
          _id: 'delivery-1',
          order: { _id: 'order-1', totalAmount: 25.97 },
          deliveryPerson: { name: 'John Driver', phone: '+1234567892' },
          status: 'assigned',
          createdAt: '2025-08-18T09:00:00Z'
        }
      ]);
      
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      on_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-orange-100 text-orange-800',
      on_way: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['products', 'orders', 'deliveries'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Management</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Add Product
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Name</th>
                      <th className="text-left py-3">Category</th>
                      <th className="text-left py-3">Price</th>
                      <th className="text-left py-3">Stock</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{product.name}</td>
                        <td className="py-3">{product.category}</td>
                        <td className="py-3">${product.price}</td>
                        <td className="py-3">{product.stock}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="text-blue-600 hover:text-blue-700 mr-2">
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Order Management</h2>
              
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order._id}</h3>
                        <p className="text-sm text-gray-600">{order.user.name} - {order.user.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'deliveries' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Delivery Management</h2>
              
              <div className="space-y-4">
                {deliveries.map(delivery => (
                  <div key={delivery._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">Delivery #{delivery._id}</h3>
                        <p className="text-sm text-gray-600">Driver: {delivery.deliveryPerson.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Order Value: ${delivery.order.totalAmount.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(delivery.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;