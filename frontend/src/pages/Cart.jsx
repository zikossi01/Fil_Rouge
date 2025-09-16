import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { formatMAD } from '../lib/currency';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clear } = useCartStore();

  const { subtotal, deliveryFee, total } = useMemo(() => {
    const sub = items.reduce((sum, it) => sum + (Number(it.product.price) || 0) * (it.quantity || 0), 0);
    const fee = items.length > 0 ? 20 : 0; // flat delivery fee (MAD)
    return { subtotal: sub, deliveryFee: fee, total: sub + fee };
  }, [items]);

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-blue-600">Browse products</Link>
      </div>
    );
  }

  // Guard against any corrupted entries in localStorage
  const safeItems = Array.isArray(items)
    ? items.filter((it) => it && it.product && it.product._id)
    : [];

  if (safeItems.length !== items.length) {
    try {
      localStorage.setItem('cart', JSON.stringify(safeItems));
    } catch (_) {}
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {safeItems.map(({ product, quantity }) => (
            <div key={product._id} className="bg-white border rounded-xl p-4 flex gap-4">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-600 capitalize">{product.category}</div>
                <div className="mt-1 text-blue-600 font-semibold">{formatMAD(product.price)}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => updateQty(product._id, Math.max(1, quantity - 1))} className="px-2 py-1 border rounded">-</button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button onClick={() => updateQty(product._id, quantity + 1)} className="px-2 py-1 border rounded">+</button>
                  <button onClick={() => removeItem(product._id)} className="ml-4 px-3 py-1.5 bg-red-600 text-white rounded">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white border rounded-xl p-4 h-max">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatMAD(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{formatMAD(deliveryFee)}</span></div>
            <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>{formatMAD(total)}</span></div>
          </div>
          <button onClick={() => navigate('/checkout')} className="mt-4 w-full bg-blue-600 text-white rounded py-2">Checkout</button>
          <button onClick={clear} className="mt-2 w-full border rounded py-2">Clear Cart</button>
        </aside>
      </div>
    </div>
  );
}


