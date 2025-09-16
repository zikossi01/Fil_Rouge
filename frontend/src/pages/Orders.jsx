import { useEffect, useState } from 'react';
import { formatMAD } from '../lib/currency';
import api from '../lib/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load orders');
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o._id} className="bg-white border rounded p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Order #{o._id.slice(-6)}</div>
              <div className="text-sm">Status: <span className="font-medium capitalize">{o.status}</span></div>
            </div>
            <div className="mt-2 grid gap-2">
              {o.products.map((i) => (
                <div key={i._id} className="flex items-center justify-between text-sm">
                  <div>{i.product.name}</div>
                  <div>x{i.quantity}</div>
                  <div>{formatMAD(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right font-semibold">Total: {formatMAD(o.totalAmount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



