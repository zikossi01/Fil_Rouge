import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Profile() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:{ street:'', city:'', postalCode:'' } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setForm(data);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (['street','city','postalCode'].includes(name)) {
      setForm((f)=> ({...f, address: { ...f.address, [name]: value }}));
    } else {
      setForm((f)=> ({...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    try {
      await api.put('/auth/profile', form);
      setMessage('Profile updated');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      {message && <div className="mb-4 text-sm text-green-700">{message}</div>}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded p-4">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" name="name" value={form.name || ''} onChange={onChange} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" name="email" value={form.email || ''} onChange={onChange} />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input className="w-full border rounded px-3 py-2" name="phone" value={form.phone || ''} onChange={onChange} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Street</label>
          <input className="w-full border rounded px-3 py-2" name="street" value={form.address?.street || ''} onChange={onChange} />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input className="w-full border rounded px-3 py-2" name="city" value={form.address?.city || ''} onChange={onChange} />
        </div>
        <div>
          <label className="block text-sm mb-1">Postal Code</label>
          <input className="w-full border rounded px-3 py-2" name="postalCode" value={form.address?.postalCode || ''} onChange={onChange} />
        </div>
        <button disabled={saving} className="md:col-span-2 w-full bg-blue-600 text-white rounded py-2">{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}







