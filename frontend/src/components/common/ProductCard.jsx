import React from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useCart from '../../hooks/useCart.js';

const Header = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('products')}>
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">FreshMart</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('products')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'products' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setCurrentView('orders')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'orders' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              My Orders
            </button>
            {user?.role === 'delivery' && (
              <button
                onClick={() => setCurrentView('deliveries')}
                className={`text-sm font-medium transition-colors ${
                  currentView === 'deliveries' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Deliveries
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`text-sm font-medium transition-colors ${
                  currentView === 'admin' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Admin
              </button>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;