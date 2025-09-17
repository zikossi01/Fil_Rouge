
const API_BASE = 'http://localhost:5000/api';

const api = {

  login: async (email, password) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 

     
      if (email !== "test@example.com" || password !== "password123") {
        throw new Error("Invalid email or password");
      }

      return {
        _id: "1",
        name: "John Doe",
        email,
        role: "client",
        token: "mock-jwt-token",
      };
    } catch (err) {
      console.error("Login error:", err.message);
      throw err; 
    }
  },

  register: async (userData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        _id: "1",
        name: userData.name,
        email: userData.email,
        role: "client",
        token: "mock-jwt-token",
      };
    } catch (err) {
      console.error("Registration error:", err.message);
      throw err;
    }
  },

  
  getProducts: async (filters = {}) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      
      let products = [
        {
          _id: "1",
          name: "Fresh Apples",
          price: 3.99,
          category: "fruits",
          image:
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
          stock: 50,
          unit: "kg",
          description: "Fresh red apples",
        },
        {
          _id: "2",
          name: "Organic Bananas",
          price: 2.49,
          category: "fruits",
          image:
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
          stock: 30,
          unit: "kg",
          description: "Organic yellow bananas",
        },
        {
          _id: "3",
          name: "Fresh Spinach",
          price: 1.99,
          category: "vegetables",
          image:
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop",
          stock: 25,
          unit: "pack",
          description: "Fresh green spinach",
        },
        {
          _id: "4",
          name: "Whole Milk",
          price: 4.99,
          category: "dairy",
          image:
            "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop",
          stock: 15,
          unit: "liter",
          description: "Fresh whole milk",
        },
        {
          _id: "5",
          name: "Chicken Breast",
          price: 8.99,
          category: "meat",
          image:
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop",
          stock: 20,
          unit: "kg",
          description: "Fresh chicken breast",
        },
        {
          _id: "6",
          name: "Bread Loaf",
          price: 2.99,
          category: "bakery",
          image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
          stock: 40,
          unit: "piece",
          description: "Fresh bread loaf",
        },
      ];

     
      let filteredProducts = products;

     
      if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(
          product => product.category.toLowerCase() === filters.category.toLowerCase()
        );
      }

      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
      }

    
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.price >= parseFloat(filters.minPrice)
        );
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.price <= parseFloat(filters.maxPrice)
        );
      }

     
      if (filters.inStock === true || filters.inStock === 'true') {
        filteredProducts = filteredProducts.filter(
          product => product.stock > 0
        );
      }

    
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name_asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name_desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'stock_asc':
            filteredProducts.sort((a, b) => a.stock - b.stock);
            break;
          case 'stock_desc':
            filteredProducts.sort((a, b) => b.stock - a.stock);
            break;
          default:
           
            break;
        }
      }

      
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredProducts.length / limit);

      return {
        products: paginatedProducts,
        totalPages,
        currentPage: page,
        total: filteredProducts.length,
        filters: filters, 
      };
    } catch (err) {
      console.error("Get products error:", err.message);
      throw err;
    }
  },

 
  createOrder: async (orderData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        _id: "order-1",
        ...orderData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error("Order creation error:", err.message);
      throw err;
    }
  },

  getUserOrders: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          _id: "order-1",
          totalAmount: 25.97,
          status: "delivered",
          createdAt: "2025-08-17T10:00:00Z",
          products: [
            { product: { name: "Fresh Apples", price: 3.99 }, quantity: 2 },
            { product: { name: "Whole Milk", price: 4.99 }, quantity: 1 },
          ],
        },
        {
          _id: "order-2",
          totalAmount: 15.47,
          status: "on_delivery",
          createdAt: "2025-08-18T08:30:00Z",
          products: [
            { product: { name: "Fresh Spinach", price: 1.99 }, quantity: 3 },
          ],
        },
      ];
    } catch (err) {
      console.error("Get user orders error:", err.message);
      throw err;
    }
  },
};

export default api;