import { create } from 'zustand';

const isAllowedId = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  // Allow Mongo ObjectId or generated IDs from external/unlimited systems
  return (
    /^[0-9a-fA-F]{24}$/.test(value) ||
    /^product_/.test(value) ||
    /^fake_/.test(value) ||
    /^gen_/.test(value) ||
    /^add_/.test(value) ||
    /_v\d+$/.test(value)
  );
};

const loadCart = () => {
  try {
    const raw = localStorage.getItem('cart');
    const parsed = raw ? JSON.parse(raw) : [];
    // filter invalid ids
    const cleaned = Array.isArray(parsed)
      ? parsed.filter((i) => i && i.product && i.product._id && isAllowedId(i.product._id))
      : [];
    if (cleaned.length !== parsed.length) {
      localStorage.setItem('cart', JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (_) {
    localStorage.removeItem('cart');
    return [];
  }
};

export const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (product, quantity = 1) => {
    if (!product || !isAllowedId(product._id)) {
      return; // ignore invalid ids
    }
    set((state) => {
      const existing = state.items.find((i) => i.product._id === product._id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        items = [...state.items, { product, quantity }];
      }
      localStorage.setItem('cart', JSON.stringify(items));
      return { items };
    });
  },

  updateQty: (productId, quantity) => {
    if (!isAllowedId(productId)) return;
    set((state) => {
      const items = state.items.map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      );
      localStorage.setItem('cart', JSON.stringify(items));
      return { items };
    });
  },

  removeItem: (productId) => {
    if (!isAllowedId(productId)) return;
    set((state) => {
      const items = state.items.filter((i) => i.product._id !== productId);
      localStorage.setItem('cart', JSON.stringify(items));
      return { items };
    });
  },

  clear: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },
}));


