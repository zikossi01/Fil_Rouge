import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/deliveries/my-deliveries');
        setDeliveries(data);
        const avail = await api.get('/deliveries/available');
        setAvailable(avail.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load');
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const { data } = await api.put(`/deliveries/${id}/status`, { status });
    setDeliveries((list)=> list.map(d => d._id === id ? data : d));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">My Deliveries</h1>
      <div className="space-y-3">
        {deliveries.map(d => (
          <div key={d._id} className="bg-white border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Order #{d.order?._id?.slice(-6)}</div>
              <div className="text-sm">{d.status}</div>
            </div>
            <div className="text-sm mt-2">Client: {d.order?.user?.name} ({d.order?.user?.phone})</div>
            <div className="mt-3 flex gap-2">
              {['picked_up','on_way','delivered'].map(s => (
                <button key={s} onClick={()=>updateStatus(d._id, s)} className="px-3 py-1.5 text-sm rounded border">
                  Mark {s.replace('_',' ')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Available Jobs</h2>
      <div className="space-y-3">
        {available.map(o => (
          <div key={o._id} className="bg-white border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Order #{o._id.slice(-6)}</div>
              <div className="text-sm">{o.user?.name}</div>
            </div>
            <div className="text-sm mt-2">Items: {o.products.reduce((n,i)=>n+i.quantity,0)}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={async ()=>{
                const { data } = await api.post(`/deliveries/claim/${o._id}`);
                setDeliveries(d => [data, ...d]);
                setAvailable(a => a.filter(x => x._id !== o._id));
              }} className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white">Claim</button>
            </div>
          </div>
        ))}
        {available.length === 0 && <div className="text-sm text-gray-600">No available jobs right now.</div>}
      </div>
    </div>
  );
}


