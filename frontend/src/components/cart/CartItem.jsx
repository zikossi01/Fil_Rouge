import React from 'react';
import { Plus, Minus, X } from 'lucide-react';
import useCart from '../../hooks/useCart.js';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-gray-600">${item.price} per {item.unit}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;