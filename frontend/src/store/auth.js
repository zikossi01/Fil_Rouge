import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: (() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  })(),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  setSession: (data) => {
    const user = { _id: data._id, name: data.name, email: data.email, role: data.role };
    const token = data.token;
    localStorage.setItem('user', JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
    set({ user, token, error: null });
  },

  clearSession: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      get().setSession(data);
      return true;
    } catch (e) {
      const msg = e?.response?.data?.message || 'Login failed';
      set({ error: msg });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', payload);
      get().setSession(data);
      return true;
    } catch (e) {
      const msg = e?.response?.data?.message || 'Registration failed';
      set({ error: msg });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    get().clearSession();
  }
}));

export default useAuthStore;






