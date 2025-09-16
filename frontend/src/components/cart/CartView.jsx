import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import useCart from '../../hooks/useCart.js';
import CartItem from './CartItem.jsx';
import CheckoutModal from './CheckoutModal.jsx';

const CartView = ({ setCurrentView }) => {
  const { cart, clearCart, getTotalAmount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={() => setCurrentView('products')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 transition-colors font-medium"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${getTotalAmount().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>$10.00</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${(getTotalAmount() + 10).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} setCurrentView={setCurrentView} />}
    </div>
  );
};

export default CartView;