import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import api from '../lib/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clear } = useCartStore();
  const { token } = useAuthStore();
  const [form, setForm] = useState({ street:'', city:'', postalCode:'', paymentMethod:'cash', notes:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    setLoading(true); setError(null);
    try {
      const payload = {
        products: items.map(i => ({ product: i.product._id, quantity: i.quantity })),
        deliveryAddress: { street: form.street, city: form.city, postalCode: form.postalCode },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };
      const { data } = await api.post('/orders', payload);
      clear();
      navigate(`/orders`);
    } catch (e) {
      setError(e.response?.data?.message || 'Checkout failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded p-4">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Street</label>
          <input className="w-full border rounded px-3 py-2" value={form.street} onChange={(e)=>setForm(f=>({...f, street:e.target.value}))} required />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input className="w-full border rounded px-3 py-2" value={form.city} onChange={(e)=>setForm(f=>({...f, city:e.target.value}))} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Postal Code</label>
          <input className="w-full border rounded px-3 py-2" value={form.postalCode} onChange={(e)=>setForm(f=>({...f, postalCode:e.target.value}))} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Payment Method</label>
          <select className="w-full border rounded px-3 py-2" value={form.paymentMethod} onChange={(e)=>setForm(f=>({...f, paymentMethod:e.target.value}))}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Notes</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.notes} onChange={(e)=>setForm(f=>({...f, notes:e.target.value}))} />
        </div>
        <button disabled={loading} className="md:col-span-2 w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}







