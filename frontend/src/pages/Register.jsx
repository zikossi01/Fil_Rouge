import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:{ street:'', city:'', postalCode:'' }, role:'client' });

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
    const ok = await register(form);
    if (ok) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Create account</h1>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select className="w-full border rounded px-3 py-2" name="role" value={form.role} onChange={onChange}>
              <option value="client">Client</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2" type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="w-full border rounded px-3 py-2" type="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input className="w-full border rounded px-3 py-2" name="phone" value={form.phone} onChange={onChange} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Street</label>
            <input className="w-full border rounded px-3 py-2" name="street" value={form.address.street} onChange={onChange} />
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <input className="w-full border rounded px-3 py-2" name="city" value={form.address.city} onChange={onChange} />
          </div>
          <div>
            <label className="block text-sm mb-1">Postal code</label>
            <input className="w-full border rounded px-3 py-2" name="postalCode" value={form.address.postalCode} onChange={onChange} />
          </div>
          <button disabled={loading} className="md:col-span-2 w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="text-sm mt-4">Have an account? <Link to="/login" className="text-blue-600">Sign in</Link></p>
      </div>
    </div>
  );
}


