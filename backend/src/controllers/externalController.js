const fetch = require('node-fetch');


const categoryMapping = {
  electronics: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'],
  jewelery: ['mens-watches', 'womens-watches', 'womens-jewellery'],
  men: ['mens-shirts', 'mens-shoes', 'mens-watches'],
  women: ['womens-dresses', 'womens-shoes', 'womens-watches', 'womens-bags'],
  clothing: ['mens-shirts', 'womens-dresses', 'tops'],
  home: ['home-decoration', 'furniture', 'lighting', 'kitchen-accessories'],
  automotive: ['automotive', 'motorcycle'],
  pantry: ['groceries']
};


const searchLiveProducts = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let allProducts = [];
    
  
    try {
     
      const dummyProducts = await searchDummyJSON(q, category, pageNum, limitNum);
      allProducts = allProducts.concat(dummyProducts);
    } catch (err) {
      console.log('DummyJSON API failed:', err.message);
    }

    try {
     
      const fakeStoreProducts = await searchFakeStoreAPI(q, category, pageNum, limitNum);
      allProducts = allProducts.concat(fakeStoreProducts);
    } catch (err) {
      console.log('FakeStore API failed:', err.message);
    }

    try {
      
      const platziProducts = await searchPlatziAPI(q, category, pageNum, limitNum);
      allProducts = allProducts.concat(platziProducts);
    } catch (err) {
      console.log('Platzi API failed:', err.message);
    }

  
    allProducts = removeDuplicates(allProducts);

   
    let filteredProducts = allProducts;

  
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    
    if (q && q.trim()) {
      const searchTerm = q.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

   
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      products: paginatedProducts,
      totalPages,
      currentPage: pageNum,
      total,
      hasMore: pageNum < totalPages
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};


async function searchDummyJSON(query, category, page, limit) {
  const products = [];
  
  try {
    let apiUrl = 'https://dummyjson.com/products';
    
   
    if (category && categoryMapping[category]) {
      for (const djCategory of categoryMapping[category]) {
        try {
          const categoryUrl = `https://dummyjson.com/products/category/${djCategory}`;
          const response = await fetch(categoryUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
              const mappedProducts = data.products.map(mapDummyJSONProduct);
              products.push(...mappedProducts);
            }
          }
        } catch (err) {
          console.log(`Failed to fetch ${djCategory}:`, err.message);
        }
      }
    }
    
    
    if (products.length === 0) {
      const skip = (page - 1) * limit;
      apiUrl = `${apiUrl}?limit=100&skip=${skip}`;
      
      if (query) {
        apiUrl = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=100`;
      }
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.products) {
          const mappedProducts = data.products.map(mapDummyJSONProduct);
          products.push(...mappedProducts);
        }
      }
    }
  } catch (error) {
    console.error('DummyJSON API error:', error);
  }
  
  return products;
}


async function searchFakeStoreAPI(query, category, page, limit) {
  const products = [];
  
  try {
    let apiUrl = 'https://fakestoreapi.com/products';
    
    
    if (category) {
      const fakeStoreCategories = {
        electronics: 'electronics',
        jewelery: 'jewelery',
        men: "men's clothing",
        women: "women's clothing"
      };
      
      if (fakeStoreCategories[category]) {
        apiUrl = `${apiUrl}/category/${encodeURIComponent(fakeStoreCategories[category])}`;
      }
    }
    
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      const mappedProducts = data.map(mapFakeStoreProduct);
      products.push(...mappedProducts);
    }
  } catch (error) {
    console.error('FakeStore API error:', error);
  }
  
  return products;
}


async function searchPlatziAPI(query, category, page, limit) {
  const products = [];
  
  try {
    let apiUrl = 'https://api.escuelajs.co/api/v1/products';
    const offset = (page - 1) * limit;
    apiUrl = `${apiUrl}?offset=${offset}&limit=${limit * 2}`; 
    
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      const mappedProducts = data.map(mapPlatziProduct).filter(p => p !== null);
      products.push(...mappedProducts);
    }
  } catch (error) {
    console.error('Platzi API error:', error);
  }
  
  return products;
}


function mapDummyJSONProduct(product) {
  return {
    _id: `dj_${product.id}`,
    name: product.title || 'Unknown Product',
    description: product.description || 'No description available',
    price: parseFloat(product.price) || 0,
    category: mapCategoryToPlatform(product.category),
    image: product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/400',
    stock: product.stock || Math.floor(Math.random() * 100) + 10,
    unit: 'piece',
    rating: product.rating || Math.random() * 2 + 3,
    reviewCount: Math.floor(Math.random() * 500) + 10,
    createdAt: new Date().toISOString(),
    source: 'DummyJSON'
  };
}

function mapFakeStoreProduct(product) {
  return {
    _id: `fs_${product.id}`,
    name: product.title || 'Unknown Product',
    description: product.description || 'No description available',
    price: parseFloat(product.price) || 0,
    category: mapCategoryToPlatform(product.category),
    image: product.image || 'https://via.placeholder.com/400',
    stock: Math.floor(Math.random() * 100) + 10,
    unit: 'piece',
    rating: product.rating?.rate || Math.random() * 2 + 3,
    reviewCount: product.rating?.count || Math.floor(Math.random() * 500) + 10,
    createdAt: new Date().toISOString(),
    source: 'FakeStore'
  };
}

function mapPlatziProduct(product) {

  if (!product.images || product.images.length === 0 || 
      product.images[0].includes('placeimg.com') ||
      !product.title || !product.description) {
    return null;
  }
  
  return {
    _id: `pz_${product.id}`,
    name: product.title || 'Unknown Product',
    description: product.description || 'No description available',
    price: parseFloat(product.price) || Math.random() * 100 + 10,
    category: mapCategoryToPlatform(product.category?.name),
    image: product.images[0] || 'https://via.placeholder.com/400',
    stock: Math.floor(Math.random() * 100) + 10,
    unit: 'piece',
    rating: Math.random() * 2 + 3,
    reviewCount: Math.floor(Math.random() * 500) + 10,
    createdAt: new Date().toISOString(),
    source: 'Platzi'
  };
}


function mapCategoryToPlatform(apiCategory) {
  if (!apiCategory) return 'other';
  
  const category = apiCategory.toLowerCase();
  

  if (category.includes('smartphone') || category.includes('laptop') || 
      category.includes('tablet') || category.includes('electronic') ||
      category.includes('mobile') || category.includes('computer')) {
    return 'electronics';
  }
  
  
  if (category.includes('jewel') || category.includes('watch') || 
      category.includes('accessory')) {
    return 'jewelery';
  }
  
 
  if (category.includes("men") || category.includes("man's")) {
    return 'men';
  }
  

  if (category.includes("women") || category.includes("woman's")) {
    return 'women';
  }
  

  if (category.includes('clothing') || category.includes('apparel') ||
      category.includes('shirt') || category.includes('dress') ||
      category.includes('top')) {
    return 'clothing';
  }
  
  
  if (category.includes('home') || category.includes('furniture') || 
      category.includes('decoration') || category.includes('kitchen')) {
    return 'home';
  }
  

  if (category.includes('automotive') || category.includes('car') || 
      category.includes('motorcycle')) {
    return 'automotive';
  }
  

  if (category.includes('food') || category.includes('grocery') || 
      category.includes('snack')) {
    return 'pantry';
  }
  
  return 'other';
}


function removeDuplicates(products) {
  const seen = new Set();
  return products.filter(product => {
    const normalizedName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(normalizedName)) {
      return false;
    }
    seen.add(normalizedName);
    return true;
  });
}


const getProductCategories = async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    if (response.ok) {
      const categories = await response.json();
      
    
      const mappedCategories = categories.map(cat => ({
        id: cat.slug || cat,
        name: cat.name || cat,
        mapped: mapCategoryToPlatform(cat.name || cat)
      }));
      
      res.json(mappedCategories);
    } else {
      throw new Error('Failed to fetch categories');
    }
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};


const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const trendingProducts = [];
    
   
    try {
      const dummyTrending = await fetch('https://dummyjson.com/products?limit=10&skip=0');
      if (dummyTrending.ok) {
        const data = await dummyTrending.json();
        const mapped = data.products.map(mapDummyJSONProduct);
        trendingProducts.push(...mapped);
      }
    } catch (err) {
      console.log('DummyJSON trending failed:', err.message);
    }
    
    try {
      const fakeStoreTrending = await fetch('https://fakestoreapi.com/products?limit=10');
      if (fakeStoreTrending.ok) {
        const data = await fakeStoreTrending.json();
        const mapped = data.map(mapFakeStoreProduct);
        trendingProducts.push(...mapped);
      }
    } catch (err) {
      console.log('FakeStore trending failed:', err.message);
    }
    
   
    const uniqueTrending = removeDuplicates(trendingProducts).slice(0, parseInt(limit));
    
    res.json({
      products: uniqueTrending,
      total: uniqueTrending.length
    });
    
  } catch (error) {
    console.error('Trending products error:', error);
    res.status(500).json({ message: 'Failed to fetch trending products' });
  }
};

module.exports = {
  searchLiveProducts,
  getProductCategories,
  getTrendingProducts
};