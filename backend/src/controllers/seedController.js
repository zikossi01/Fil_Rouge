const Product = require('../models/Product');
const User = require('../models/User');

const sampleProducts = [
  {
    name: 'Bananas',
    description: 'Fresh ripe bananas, perfect for smoothies and snacks.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800&auto=format&fit=crop',
    stock: 120,
    unit: 'kg'
  },
  {
    name: 'Apples',
    description: 'Crisp red apples sourced from local farms.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800&auto=format&fit=crop',
    stock: 90,
    unit: 'kg'
  },
  {
    name: 'Milk 1L',
    description: 'Pasteurized whole milk, 1 liter bottle.',
    price: 1.49,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
    stock: 200,
    unit: 'liter'
  },
  {
    name: 'Fresh Bread',
    description: 'Daily baked bread loaf with a crispy crust.',
    price: 2.29,
    image: 'https://images.unsplash.com/photo-1549933234-3d5f6b6a868d?q=80&w=800&auto=format&fit=crop',
    stock: 50,
    unit: 'piece'
  },
  {
    name: 'Chicken Breast',
    description: 'Skinless, boneless chicken breast fillets.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1604908176997-4316517b047d?q=80&w=800&auto=format&fit=crop',
    stock: 70,
    unit: 'kg'
  },
  {
    name: 'Orange Juice 1L',
    description: '100% pure squeezed orange juice, no added sugar.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1544126592-5f5b12a3d9b9?q=80&w=800&auto=format&fit=crop',
    stock: 150,
    unit: 'liter'
  },
  {
    name: 'Strawberries',
    description: 'Sweet and juicy strawberries, farm fresh.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop',
    stock: 80,
    unit: 'kg'
  },
  {
    name: 'Eggs (12-pack)',
    description: 'Free-range large eggs, pack of 12.',
    price: 3.29,
    image: 'https://images.unsplash.com/photo-1517959105821-eaf2591984dd?q=80&w=800&auto=format&fit=crop',
    stock: 100,
    unit: 'pack'
  },
  {
    name: 'Cheddar Cheese',
    description: 'Mature cheddar cheese block.',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1546549039-49c06a4b3b46?q=80&w=800&auto=format&fit=crop',
    stock: 60,
    unit: 'piece'
  },
  {
    name: 'Tomatoes',
    description: 'Vine-ripened tomatoes, great for salads and sauces.',
    price: 2.79,
    image: 'https://images.unsplash.com/photo-1514511717321-4c1d4610a3d3?q=80&w=800&auto=format&fit=crop',
    stock: 110,
    unit: 'kg'
  },
  {
    name: 'Olive Oil 1L',
    description: 'Extra virgin olive oil, cold-pressed.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?q=80&w=800&auto=format&fit=crop',
    stock: 90,
    unit: 'liter'
  },
  {
    name: 'Rice 5kg',
    description: 'Premium long-grain white rice, 5kg bag.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1607631396611-9b2b68bd6d2e?q=80&w=800&auto=format&fit=crop',
    stock: 75,
    unit: 'bag'
  },
  {
    name: 'Ground Coffee 500g',
    description: 'Rich arabica ground coffee for all brewing methods.',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    stock: 65,
    unit: 'pack'
  },
  {
    name: 'Yogurt 4x125g',
    description: 'Creamy natural yogurt, 4 cups x 125g.',
    price: 2.59,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
    stock: 120,
    unit: 'pack'
  },
  {
    name: 'Butter 250g',
    description: 'Unsalted butter block, 82% fat.',
    price: 2.19,
    image: 'https://images.unsplash.com/photo-1604908554135-96f5565c8edf?q=80&w=800&auto=format&fit=crop',
    stock: 100,
    unit: 'piece'
  },
  {
    name: 'Spinach',
    description: 'Fresh spinach leaves, great for salads and cooking.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
    stock: 90,
    unit: 'kg'
  },
  {
    name: 'Carrots',
    description: 'Crunchy orange carrots, perfect for snacking and cooking.',
    price: 1.49,
    image: 'https://images.unsplash.com/photo-1566837935707-0b9b1f5f3c0c?q=80&w=800&auto=format&fit=crop',
    stock: 140,
    unit: 'kg'
  },
  {
    name: 'Salmon Fillet',
    description: 'Fresh Atlantic salmon fillet, skin-on.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604908554513-4a6a8f2c2a1e?q=80&w=800&auto=format&fit=crop',
    stock: 50,
    unit: 'kg'
  },
  {
    name: 'Pasta 500g',
    description: 'Italian durum wheat pasta, 500g pack.',
    price: 1.29,
    image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format&fit=crop',
    stock: 160,
    unit: 'pack'
  },
  {
    name: 'Tomato Sauce 700g',
    description: 'Homestyle tomato basil sauce, 700g jar.',
    price: 3.19,
    image: 'https://images.unsplash.com/photo-1589308078058-918dcdfbb07b?q=80&w=800&auto=format&fit=crop',
    stock: 100,
    unit: 'jar'
  },
  {
    name: 'Cereal 375g',
    description: 'Whole grain crunchy cereal.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1585238341627-8603b68f0f0e?q=80&w=800&auto=format&fit=crop',
    stock: 130,
    unit: 'box'
  },
  {
    name: 'Orange',
    description: 'Juicy oranges packed with vitamin C.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=800&auto=format&fit=crop',
    stock: 150,
    unit: 'kg'
  },
  {
    name: 'Banana Chips 200g',
    description: 'Crispy banana chips lightly sweetened.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1625944526597-3b2d3f6e9d39?q=80&w=800&auto=format&fit=crop',
    stock: 90,
    unit: 'pack'
  },
  {
    name: 'Green Tea 20 bags',
    description: 'Refreshing green tea, 20 tea bags.',
    price: 2.79,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=800&auto=format&fit=crop',
    stock: 110,
    unit: 'box'
  }
];

// Seed products if none exist
const seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Products already exist' });
    }
    const created = await Product.insertMany(sampleProducts);
    res.json({ message: 'Seeded products', count: created.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upsert the curated sampleProducts without creating duplicates
const seedMoreProducts = async (req, res) => {
  try {
    let created = 0;
    let updated = 0;
    for (const prod of sampleProducts) {
      const existing = await Product.findOne({ name: prod.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: prod });
        updated += 1;
      } else {
        await Product.create(prod);
        created += 1;
      }
    }
    res.json({ message: 'Upserted curated products', created, updated, total: sampleProducts.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Seed an admin user if none exists
const seedAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
    const admin = await User.create({
      name: 'Administrator',
      email,
      password,
      phone: '+0000000000',
      address: { street: 'HQ', city: 'City', postalCode: '00000' },
      role: 'admin'
    });
    res.json({ message: 'Seeded admin', email: admin.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { seedProducts, seedMoreProducts, seedAdmin, sampleProducts };

// Import products from FakeStore API (all or single id)
const importFromFakeStore = async (req, res) => {
  try {
    const { id } = req.params;
    const base = 'https://fakestoreapi.com/products';
    const url = id ? `${base}/${id}` : base;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch FakeStore: ${response.status}`);
    const json = await response.json();

    const records = Array.isArray(json) ? json : [json];
    const payload = records.map((p) => ({
      name: p.title,
      description: p.description,
      price: Math.max(0, Number(p.price) || 0),
      category: mapCategory(p.category),
      image: p.image,
      stock: 100,
      unit: 'piece'
    }));

    
    let created = 0;
    for (const prod of payload) {
      const existing = await Product.findOne({ name: prod.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: prod });
      } else {
        await Product.create(prod);
        created += 1;
      }
    }

    res.json({ message: 'Imported from FakeStore', count: payload.length, created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function mapCategory(cat) {
  const lower = String(cat || '').toLowerCase();
  if (lower.includes('electronics')) return 'electronics';
  if (lower.includes('jewel')) return 'jewelery';
  if (lower.includes('men')) return 'men';
  if (lower.includes('women')) return 'women';
  if (lower.includes('clothing') || lower.includes('apparel')) return 'clothing';
  if (lower.includes('home') || lower.includes('furniture') || lower.includes('lighting')) return 'home';
  if (lower.includes('toy') || lower.includes('game')) return 'toys';
  if (lower.includes('auto') || lower.includes('motor')) return 'automotive';
  if (lower.includes('health') || lower.includes('skin') || lower.includes('fragrance')) return 'health';
  if (lower.includes('baby')) return 'baby';
  if (lower.includes('pet')) return 'pet';
  if (lower.includes('office')) return 'office';
  if (lower.includes('grocery') || lower.includes('food') || lower.includes('pantry')) return 'pantry';
  // Fallback to existing enums
  const allowed = ['fruits','vegetables','dairy','meat','bakery','beverages','electronics','clothing','jewelery','home','toys','automotive','health','baby','pet','office','men','women','pantry','other'];
  return allowed.includes(lower) ? lower : 'other';
}

module.exports.importFromFakeStore = importFromFakeStore;


const importFromDummyJson = async (req, res) => {
  try {
    const pageSize = Math.min(Number(req.query.limit) || 100, 100);
    const maxPages = Math.min(Number(req.query.pages) || 50, 200); // up to 5k
    let created = 0;
    let updated = 0;

    for (let page = 0; page < maxPages; page++) {
      const skip = page * pageSize;
      const url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`;
      const response = await fetch(url);
      if (!response.ok) break;
      const data = await response.json();
      const products = Array.isArray(data.products) ? data.products : [];
      if (products.length === 0) break;

    
      for (const p of products) {
        const doc = {
          name: p.title,
          description: p.description,
          price: Math.max(0, Number(p.price) || 0),
        
          category: 'other',
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.thumbnail,
          stock: Number(p.stock) || 100,
          unit: 'piece',
          isAvailable: true,
          averageRating: Number(p.rating) || 0,
          reviewCount: Math.floor(Math.random() * 300)
        };

        const existing = await Product.findOne({ name: doc.name });
        if (existing) {
          await Product.updateOne({ _id: existing._id }, { $set: doc });
          updated += 1;
        } else {
          await Product.create(doc);
          created += 1;
        }
      }

      const total = Number(data.total || 0);
      if (skip + pageSize >= total) break;
    }

    res.json({ message: 'Imported from DummyJSON', created, updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.importFromDummyJson = importFromDummyJson;


const importAllDummyJsonCategories = async (req, res) => {
  try {
    const pageSize = Math.min(Number(req.query.limit) || 100, 100);
    const categoriesRes = await fetch('https://dummyjson.com/products/categories');
    if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
    let categories = await categoriesRes.json();

    
    const allowedDjCats = new Set([
   
      'smartphones','laptops','tablets','mobile-accessories','audio','lighting',
     
      'mens-shirts','mens-shoes','mens-watches','womens-dresses','womens-shoes','womens-watches','womens-bags','tops','sunglasses',
    
      'home-decoration','furniture','lighting','kitchen-accessories',
  
      'groceries'
    ]);
    categories = categories.filter((c) => allowedDjCats.has(String(c)));

    let created = 0;
    let updated = 0;

    const importCategory = async (djCat) => {
   
      let skip = 0;
      while (true) {
        const url = `https://dummyjson.com/products/category/${encodeURIComponent(djCat)}?limit=${pageSize}&skip=${skip}`;
        const r = await fetch(url);
        if (!r.ok) break;
        const data = await r.json();
        const products = Array.isArray(data.products) ? data.products : [];
        if (products.length === 0) break;

        for (const p of products) {
          const cat = mapCategory(djCat);
         
          if (!['electronics','men','women','clothing','home','pantry','jewelery'].includes(cat)) continue;
          const doc = {
            name: p.title,
            description: p.description,
            price: Math.max(0, Number(p.price) || 0),
            category: cat,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.thumbnail,
            stock: Number(p.stock) || 100,
            unit: 'piece',
            isAvailable: true,
            averageRating: Number(p.rating) || 0,
            reviewCount: Math.floor(Math.random() * 300)
          };

          const existing = await Product.findOne({ name: doc.name });
          if (existing) {
            await Product.updateOne({ _id: existing._id }, { $set: doc });
            updated += 1;
          } else {
            await Product.create(doc);
            created += 1;
          }
        }

        skip += products.length;
        if ((data.total || 0) <= skip) break;
      }
    };

    
    for (const djCat of categories) {
      await importCategory(djCat);
    }

    res.json({ message: 'Imported all DummyJSON categories', created, updated, categories: categories.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.importAllDummyJsonCategories = importAllDummyJsonCategories;


const importFromOpenFoodFacts = async (req, res) => {
  try {
    const pageSize = Math.min(Number(req.query.limit) || 200, 500);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=${pageSize}&fields=product_name,brands,image_url,categories,quantity`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('Failed to fetch OpenFoodFacts');
    const data = await r.json();
    const products = Array.isArray(data.products) ? data.products : [];

    let created = 0;
    let updated = 0;

    const mapFoodCategory = (categoriesStr = '') => {
      const lower = String(categoriesStr).toLowerCase();
      if (lower.includes('fruit')) return 'fruits';
      if (lower.includes('vegetable')) return 'vegetables';
      if (lower.includes('dairy') || lower.includes('milk') || lower.includes('yogurt')) return 'dairy';
      if (lower.includes('meat') || lower.includes('poultry') || lower.includes('fish')) return 'meat';
      if (lower.includes('bread') || lower.includes('bakery')) return 'bakery';
      if (lower.includes('beverage') || lower.includes('drink') || lower.includes('juice')) return 'beverages';
      return 'pantry';
    };

    for (const p of products) {
      const name = p.product_name?.trim();
      const image = p.image_url;
      if (!name || !image) continue;
      const doc = {
        name,
        description: `${name}${p.brands ? ` · ${p.brands}` : ''}${p.quantity ? ` · ${p.quantity}` : ''}`,
        price: Number((Math.random() * 80 + 5).toFixed(2)),
        category: mapFoodCategory(p.categories || ''),
        image,
        stock: Math.floor(Math.random() * 200) + 20,
        unit: 'piece',
        isAvailable: true,
        averageRating: Number((Math.random() * 2 + 3).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 300),
      };

      const existing = await Product.findOne({ name: doc.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: doc });
        updated += 1;
      } else {
        await Product.create(doc);
        created += 1;
      }
    }

    res.json({ message: 'Imported from OpenFoodFacts', created, updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.importFromOpenFoodFacts = importFromOpenFoodFacts;


const bulkGenerateProducts = async (req, res) => {
  try {
    const count = Math.min(Number(req.query.count) || 1000, 20000);
    const allowedCategories = ['fruits','vegetables','dairy','meat','bakery','beverages','other'];

    const docs = Array.from({ length: count }).map((_, i) => {
      const cat = allowedCategories[i % allowedCategories.length];
      const price = Number((Math.random() * 100 + 1).toFixed(2));
      const stock = Math.floor(Math.random() * 500) + 10;
      const unit = ['kg','piece','liter','pack'][i % 4];
      const idx = Date.now() + i;
      return {
        name: `Premium ${cat} item #${idx}`,
        description: `High-quality ${cat} product number ${idx} with excellent value.`,
        price,
        category: cat,
        image: `https://picsum.photos/seed/${cat}-${idx}/600/400`,
        stock,
        unit,
        isAvailable: true,
        averageRating: Number((Math.random() * 2 + 3).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 300)
      };
    });

    const created = await Product.insertMany(docs, { ordered: false });
    res.json({ message: 'Bulk generated products', created: created.length });
  } catch (err) {
    
    if (err?.insertedDocs) {
      return res.json({ message: 'Bulk generated products (partial)', created: err.insertedDocs.length });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports.bulkGenerateProducts = bulkGenerateProducts;


