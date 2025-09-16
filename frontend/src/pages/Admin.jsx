import { useEffect, useState } from 'react';
import { formatMAD } from '../lib/currency';
import api from '../lib/api';

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [data, setData] = useState({ products: [], users: [], orders: [] });
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name:'', description:'', price:'', category:'fruits', image:'', stock:'', unit:'piece' });
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [products, users, orders] = await Promise.all([
          api.get('/products'),
          api.get('/users'),
          api.get('/orders/all'),
        ]);
        setData({ products: products.data.products || [], users: users.data.users || [], orders: orders.data || [] });
      } catch (e) { setError(e.response?.data?.message || 'Failed to load admin data'); }
    };
    load();
  }, []);

  const importFromFakeStore = async () => {
    setImporting(true);
    setImportMsg('');
    setError(null);
    try {
      const { data } = await api.post('/seed/fakestore');
      // Reload products after import
      const products = await api.get('/products');
      setData(prev => ({ ...prev, products: products.data.products || [] }));
      setImportMsg(`Imported ${data.count} products from FakeStore`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to import from FakeStore');
    } finally {
      setImporting(false);
    }
  };

  const importDummyJsonAll = async () => {
    setImporting(true);
    setImportMsg('');
    setError(null);
    try {
      const { data } = await api.post('/seed/dummyjson/all');
      const products = await api.get('/products');
      setData(prev => ({ ...prev, products: products.data.products || [] }));
      setImportMsg(`DummyJSON all: created ${data.created}, updated ${data.updated}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to import DummyJSON (all)');
    } finally {
      setImporting(false);
    }
  };

  const importOpenFoodFacts = async () => {
    setImporting(true);
    setImportMsg('');
    setError(null);
    try {
      const { data } = await api.post('/seed/openfoodfacts');
      const products = await api.get('/products');
      setData(prev => ({ ...prev, products: products.data.products || [] }));
      setImportMsg(`OpenFoodFacts: created ${data.created}, updated ${data.updated}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to import OpenFoodFacts');
    } finally {
      setImporting(false);
    }
  };

  const importDummyJson = async () => {
    setImporting(true);
    setImportMsg('');
    setError(null);
    try {
      const { data } = await api.post('/seed/dummyjson');
      const products = await api.get('/products');
      setData(prev => ({ ...prev, products: products.data.products || [] }));
      setImportMsg(`DummyJSON: created ${data.created}, updated ${data.updated}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to import DummyJSON');
    } finally {
      setImporting(false);
    }
  };

  const bulkGenerate = async () => {
    setImporting(true);
    setImportMsg('');
    setError(null);
    try {
      const { data } = await api.post('/seed/bulk', null, { params: { count: 2000 } });
      const products = await api.get('/products');
      setData(prev => ({ ...prev, products: products.data.products || [] }));
      setImportMsg(`Bulk generated ${data.created} products`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to bulk generate');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <div className="flex gap-2 mb-4">
        {['products','users','orders'].map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1.5 rounded border ${tab===t?'bg-blue-600 text-white':'bg-white'}`}>{t}</button>
        ))}
      </div>
      
      {tab==='products' && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <button onClick={()=>setShowAddProduct(!showAddProduct)} className="px-3 py-1.5 bg-green-600 text-white rounded">
            {showAddProduct ? 'Cancel' : 'Add Product'}
          </button>
          <button 
            onClick={importFromFakeStore} 
            disabled={importing}
            className="px-3 py-1.5 bg-purple-600 text-white rounded disabled:opacity-60"
          >
            {importing ? 'Importing...' : 'Import from FakeStore'}
          </button>
          <button 
            onClick={importDummyJson}
            disabled={importing}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded disabled:opacity-60"
          >
            {importing ? 'Importing...' : 'Import DummyJSON'}
          </button>
          <button 
            onClick={importDummyJsonAll}
            disabled={importing}
            className="px-3 py-1.5 bg-blue-700 text-white rounded disabled:opacity-60"
          >
            {importing ? 'Importing...' : 'Import DummyJSON (All Categories)'}
          </button>
          <button 
            onClick={bulkGenerate}
            disabled={importing}
            className="px-3 py-1.5 bg-gray-800 text-white rounded disabled:opacity-60"
          >
            {importing ? 'Generating...' : 'Bulk Generate (2k)'}
          </button>
          <button 
            onClick={importOpenFoodFacts}
            disabled={importing}
            className="px-3 py-1.5 bg-green-700 text-white rounded disabled:opacity-60"
          >
            {importing ? 'Importing...' : 'Import OpenFoodFacts (Food)'}
          </button>
          {!!importMsg && <span className="text-sm text-gray-600">{importMsg}</span>}
        </div>
      )}
      
      {tab==='products' && showAddProduct && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const { data: product } = await api.post('/products', newProduct);
            setData(prev => ({ ...prev, products: [product, ...prev.products] }));
            setNewProduct({ name:'', description:'', price:'', category:'fruits', image:'', stock:'', unit:'piece' });
            setShowAddProduct(false);
          } catch (e) { setError(e.response?.data?.message || 'Failed to create product'); }
        }} className="mb-4 bg-white border rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={newProduct.name} onChange={(e)=>setNewProduct(p=>({...p, name:e.target.value}))} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} value={newProduct.description} onChange={(e)=>setNewProduct(p=>({...p, description:e.target.value}))} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input className="w-full border rounded px-3 py-2" type="number" step="0.01" value={newProduct.price} onChange={(e)=>setNewProduct(p=>({...p, price:Number(e.target.value)}))} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select className="w-full border rounded px-3 py-2" value={newProduct.category} onChange={(e)=>setNewProduct(p=>({...p, category:e.target.value}))}>
              {['fruits','vegetables','dairy','meat','bakery','beverages','other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input className="w-full border rounded px-3 py-2" type="number" value={newProduct.stock} onChange={(e)=>setNewProduct(p=>({...p, stock:Number(e.target.value)}))} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Unit</label>
            <select className="w-full border rounded px-3 py-2" value={newProduct.unit} onChange={(e)=>setNewProduct(p=>({...p, unit:e.target.value}))}>
              {['kg','piece','liter','pack'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Image URL</label>
            <input className="w-full border rounded px-3 py-2" value={newProduct.image} onChange={(e)=>setNewProduct(p=>({...p, image:e.target.value}))} placeholder="https://example.com/image.jpg" />
          </div>
          <button type="submit" className="md:col-span-2 w-full bg-blue-600 text-white rounded py-2">Create Product</button>
        </form>
      )}
      
      {tab==='products' && (
        <div className="grid md:grid-cols-3 gap-3">
          {data.products.map(p => (
            <div key={p._id} className="bg-white border rounded p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm">{formatMAD(p.price)}</div>
              <div className="text-xs text-gray-500 mt-1">Stock: {p.stock} {p.unit}</div>
              <div className="mt-2 flex gap-1">
                <button onClick={async () => {
                  try {
                    await api.delete(`/products/${p._id}`);
                    setData(prev => ({ ...prev, products: prev.products.filter(prod => prod._id !== p._id) }));
                  } catch (e) { setError(e.response?.data?.message || 'Failed to delete'); }
                }} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tab==='users' && (
        <div className="bg-white border rounded">
          <div className="grid grid-cols-4 gap-2 p-3 font-medium border-b">
            <div>Name</div><div>Email</div><div>Role</div><div>Active</div>
          </div>
          {data.users.map(u => (
            <div key={u._id} className="grid grid-cols-4 gap-2 p-3 border-b text-sm">
              <div>{u.name}</div><div>{u.email}</div><div>{u.role}</div><div>{u.isActive ? 'Yes':'No'}</div>
            </div>
          ))}
        </div>
      )}
      
      {tab==='orders' && (
        <div className="space-y-3">
          {data.orders.map(o => (
            <div key={o._id} className="bg-white border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Order #{o._id.slice(-6)}</div>
                <div className="text-sm">{o.user?.name}</div>
              </div>
              <div className="text-sm mt-2">Status: {o.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
