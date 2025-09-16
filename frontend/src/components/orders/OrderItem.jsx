import React from 'react';
import { Truck } from 'lucide-react';

const OrderItem = ({ order }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      on_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{order._id}</h3>
          <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        {order.products.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.product.name} x {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 flex justify-between items-center">
        <span className="text-lg font-bold">Total: ${order.totalAmount.toFixed(2)}</span>
        {order.status === 'on_delivery' && (
          <div className="flex items-center text-orange-600">
            <Truck className="h-4 w-4 mr-1" />
            <span className="text-sm">Out for delivery</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem;