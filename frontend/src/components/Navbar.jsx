import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive 
        ? 'text-gray-900 bg-gray-100 shadow-sm ring-1 ring-gray-200' 
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
    }`;

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-r from-black to-gray-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              GroceryHub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={linkClass}>🏠 Home</NavLink>
            <NavLink to="/products" className={linkClass}>🛍️ Products</NavLink>
            {user && <NavLink to="/orders" className={linkClass}>📦 Orders</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>⚙️ Admin</NavLink>}
            {user?.role === 'delivery' && <NavLink to="/delivery" className={linkClass}>🚚 Delivery</NavLink>}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <span className="text-2xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {!user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-black to-gray-800 text-white font-medium rounded-lg hover:from-gray-900 hover:to-black transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink to="/profile" className={linkClass}>
                  <span className="flex items-center space-x-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-black to-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden lg:block">{user.name}</span>
                  </span>
                </NavLink>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors border border-gray-300 rounded-lg hover:border-red-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
