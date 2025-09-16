const Product = require('../models/Product');

// Curated real-world products with MAD prices (categories removed)
// Images sourced from reputable CDNs (Unsplash) and vendor images where applicable
const curatedProducts = [
  // Food / Pantry
  {
    name: 'Moroccan Extra Virgin Olive Oil 1L',
    description: 'Cold-pressed extra virgin olive oil from Meknes region, premium quality.',
    price: 89.0, // MAD
    
    image: 'https://images.unsplash.com/photo-1615486364039-b85a9b7be2d1?w=1200&q=80&auto=format&fit=crop',
    stock: 150,
    unit: 'liter',
    isAvailable: true
  },
  {
    name: 'Couscous Medium 1kg',
    description: 'Traditional medium-grain couscous made from durum wheat semolina.',
    price: 22.0,
    
    image: 'https://images.unsplash.com/photo-1622629671125-4f45c4b6cf37?w=1200&q=80&auto=format&fit=crop',
    stock: 300,
    unit: 'kg',
    isAvailable: true
  },
  {
    name: 'Fresh Oranges 1kg',
    description: 'Juicy Moroccan oranges, ideal for juice and snacking.',
    price: 12.5,
    
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=1200&q=80&auto=format&fit=crop',
    stock: 200,
    unit: 'kg',
    isAvailable: true
  },
  {
    name: 'Whole Chicken ~1.2kg',
    description: 'Fresh halal whole chicken, average weight 1.2kg.',
    price: 55.0,
    
    image: 'https://images.unsplash.com/photo-1604503468506-0c4975eb6f31?w=1200&q=80&auto=format&fit=crop',
    stock: 80,
    unit: 'kg',
    isAvailable: true
  },
  // Electronics
  {
    name: 'Wireless Earbuds Bluetooth 5.3',
    description: 'Noise-reducing wireless earbuds with charging case, 24h playtime.',
    price: 249.0,
    
    image: 'https://images.unsplash.com/photo-1518443872736-1edb7f5c51dc?w=1200&q=80&auto=format&fit=crop',
    stock: 120,
    unit: 'piece',
    isAvailable: true
  },
  {
    name: 'Smartphone 6.5" 128GB',
    description: 'Modern smartphone with 6.5-inch display, 128GB storage, dual camera.',
    price: 1999.0,
    
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop',
    stock: 40,
    unit: 'piece',
    isAvailable: true
  },
  // Clothing
  {
    name: 'Classic White T-Shirt',
    description: '100% cotton crew neck t-shirt, breathable and comfortable.',
    price: 79.0,
    
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop',
    stock: 250,
    unit: 'piece',
    isAvailable: true
  },
  {
    name: 'Women Handbag Faux Leather',
    description: 'Elegant handbag with adjustable strap and zipped compartments.',
    price: 349.0,
    
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=80&auto=format&fit=crop',
    stock: 60,
    unit: 'piece',
    isAvailable: true
  },
  // Home
  {
    name: 'LED Table Lamp',
    description: 'Warm white LED lamp with minimalist design, energy efficient.',
    price: 129.0,
    
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80&auto=format&fit=crop',
    stock: 100,
    unit: 'piece',
    isAvailable: true
  }
];

// GET /api/curated -> return curated products (without touching DB)
const getCuratedProducts = async (req, res) => {
  try {
    res.json({ products: curatedProducts, currency: 'MAD' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/curated/seed -> insert curated products into DB (idempotent by name)
const seedCuratedProducts = async (req, res) => {
  try {
    let created = 0;
    let updated = 0;
    for (const item of curatedProducts) {
      const existing = await Product.findOne({ name: item.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: item });
        updated += 1;
      } else {
        await Product.create(item);
        created += 1;
      }
    }
    res.json({ message: 'Curated products synced', created, updated, currency: 'MAD' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCuratedProducts, seedCuratedProducts };

// Utility: generate diverse products across many types (food, tech, clothes, home, sports, beauty, toys, office, auto, pet, baby, books)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const productBanks = [
  { key: 'food', nouns: ['Olive Oil','Basmati Rice','Organic Honey','Dark Chocolate','Pasta','Green Tea','Ground Coffee','Tomato Sauce','Granola','Almonds'], unit: 'piece', price: [12, 120] },
  { key: 'electronics', nouns: ['Wireless Earbuds','Bluetooth Speaker','Smartphone 128GB','Power Bank 20,000mAh','Gaming Mouse','Mechanical Keyboard','4K Action Camera','LED Monitor 27"','SSD 1TB','WiFi Router'], unit: 'piece', price: [99, 2999] },
  { key: 'clothing', nouns: ['Classic T-Shirt','Hoodie','Denim Jacket','Running Shoes','Slim Fit Jeans','Puffer Jacket','Cotton Socks (5-Pack)','Baseball Cap','Sweatpants','Polo Shirt'], unit: 'piece', price: [39, 699] },
  { key: 'home', nouns: ['Table Lamp','Aroma Diffuser','Memory Foam Pillow','Cookware Set','Vacuum Cleaner','Electric Kettle','Air Fryer','Nonstick Pan','Laundry Basket','Bath Towel Set'], unit: 'piece', price: [49, 1499] },
  { key: 'beauty', nouns: ['Face Moisturizer','Vitamin C Serum','Sunscreen SPF50','Shampoo','Conditioner','Body Lotion','Beard Oil','Hair Dryer','Makeup Brush Set','Lip Balm'], unit: 'piece', price: [29, 399] },
  { key: 'sports', nouns: ['Yoga Mat','Dumbbell 10kg','Skipping Rope','Football','Basketball','Resistance Bands Set','Cycling Helmet','Running Backpack','Water Bottle 1L','Fitness Tracker'], unit: 'piece', price: [49, 899] },
  { key: 'toys', nouns: ['Building Blocks Set','RC Car','Puzzle 1000pcs','Dollhouse','Board Game','Yo-Yo','Kite','Plush Bear','Magic Kit','Art Set'], unit: 'piece', price: [29, 499] },
  { key: 'office', nouns: ['Office Chair','Desk Organizer','Notebook A5','Gel Pens (10-Pack)','Wireless Mouse','Laptop Stand','Desk Lamp','File Folders (20)','Stapler','Whiteboard'], unit: 'piece', price: [19, 999] },
  { key: 'auto', nouns: ['Car Vacuum','Phone Mount','Tire Inflator','Seat Covers','Dash Cam','Glass Cleaner','Steering Wheel Cover','LED Headlights','Car Shampoo','Microfiber Cloths'], unit: 'piece', price: [29, 1499] },
  { key: 'pet', nouns: ['Dog Leash','Cat Litter 10kg','Pet Bed','Chew Toys','Grooming Brush','Automatic Feeder','Cat Scratcher','Fish Food','Bird Cage','Pet Shampoo'], unit: 'piece', price: [19, 699] },
  { key: 'baby', nouns: ['Diapers Pack','Baby Wipes','Stroller','Baby Bottle','Pacifier (2-Pack)','Play Mat','High Chair','Baby Monitor','Onesies (3-Pack)','Soft Blanket'], unit: 'piece', price: [19, 1999] },
  { key: 'books', nouns: ['Novel Hardcover','Cookbook','Travel Guide','Self-Help Book','Mystery Thriller','Fantasy Saga Vol.1','Photography Guide','Programming 101','Language Phrasebook','Kids Picture Book'], unit: 'piece', price: [39, 399] },
];

const adjectives = ['Premium','Classic','Eco','Smart','Ultra','Portable','Compact','Deluxe','Essential','Pro'];
const brands = ['Atlas','Sahara','Casablanca','Maghreb','Zenith','Nexus','Orion','Nova','Vertex','Lumina'];

const imageQueries = {
  food: 'food,grocery,packaged',
  electronics: 'electronics,gadgets,device',
  clothing: 'clothes,apparel,fashion',
  home: 'home,appliance,furniture',
  beauty: 'cosmetics,beauty,skincare',
  sports: 'sports,fitness,gear',
  toys: 'toys,game,kids',
  office: 'office,stationery,desk',
  auto: 'car,auto,accessories',
  pet: 'pet,pet%20products',
  baby: 'baby,infant,products',
  books: 'book,books,cover'
};

// Better approach: use curated product images with specific IDs
const productImages = {
  food: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1518443872736-1edb7f5c51dc?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  clothing: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  home: [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  toys: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  office: [
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  auto: [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  pet: [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  baby: [
    'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  books: [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80'
  ]
};

function getProductImage(productName) {
  const name = productName.toLowerCase();
  
  // More comprehensive product-image mappings with better keywords
  const productImageMap = {
    // Food items
    'olive oil': 'https://images.unsplash.com/photo-1615486364039-b85a9b7be2d1?w=600&h=400&fit=crop&auto=format&q=80',
    'rice': 'https://images.unsplash.com/photo-1622629671125-4f45c4b6cf37?w=600&h=400&fit=crop&auto=format&q=80',
    'honey': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop&auto=format&q=80',
    'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&h=400&fit=crop&auto=format&q=80',
    'pasta': 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&h=400&fit=crop&auto=format&q=80',
    'tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop&auto=format&q=80',
    'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format&q=80',
    'almonds': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=600&h=400&fit=crop&auto=format&q=80',
    'granola': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Electronics
    'earbuds': 'https://images.unsplash.com/photo-1518443872736-1edb7f5c51dc?w=600&h=400&fit=crop&auto=format&q=80',
    'speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop&auto=format&q=80',
    'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format&q=80',
    'power bank': 'https://images.unsplash.com/photo-1609592807902-2b1a0b0b0b0b?w=600&h=400&fit=crop&auto=format&q=80',
    'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop&auto=format&q=80',
    'keyboard': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=400&fit=crop&auto=format&q=80',
    'camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop&auto=format&q=80',
    'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop&auto=format&q=80',
    'router': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'wifi': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Clothing
    't-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&auto=format&q=80',
    'hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop&auto=format&q=80',
    'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop&auto=format&q=80',
    'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&auto=format&q=80',
    'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop&auto=format&q=80',
    'denim': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop&auto=format&q=80',
    'socks': 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=400&fit=crop&auto=format&q=80',
    'cap': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=400&fit=crop&auto=format&q=80',
    'pants': 'https://images.unsplash.com/photo-1506629905607-1b1a1b1b1b1b?w=600&h=400&fit=crop&auto=format&q=80',
    'polo': 'https://images.unsplash.com/photo-1506629905607-1b1a1b1b1b1b?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Home
    'lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop&auto=format&q=80',
    'diffuser': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80',
    'pillow': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    'cookware': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    'vacuum': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    'kettle': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    'air fryer': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    'pan': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    'basket': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    'towel': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Beauty
    'moisturizer': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80',
    'serum': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=400&fit=crop&auto=format&q=80',
    'sunscreen': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'shampoo': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'conditioner': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'lotion': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'oil': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'dryer': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'brush': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'balm': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    'lip': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Sports
    'mat': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format&q=80',
    'dumbbell': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'rope': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'skipping': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'football': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'basketball': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'bands': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'helmet': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'backpack': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'bottle': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    'tracker': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Toys
    'blocks': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'car': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'puzzle': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'dollhouse': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'game': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'yo-yo': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'kite': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'bear': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'kit': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    'art': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Office
    'chair': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&auto=format&q=80',
    'organizer': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    'notebook': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    'pens': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    'stand': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    'folders': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    'stapler': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    'whiteboard': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Auto
    'mount': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'inflator': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'covers': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'cam': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'cleaner': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'wheel': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'headlights': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    'steering': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Pet
    'leash': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'litter': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'bed': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'toys': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'feeder': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'scratcher': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'food': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    'cage': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Baby
    'diapers': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'wipes': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'stroller': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'bottle': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'pacifier': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'chair': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'monitor': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'onesies': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    'blanket': 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=600&h=400&fit=crop&auto=format&q=80',
    
    // Books
    'novel': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'cookbook': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'guide': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'book': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'thriller': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'fantasy': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'photography': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'programming': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'phrasebook': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'picture': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
    'travel': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80'
  };
  
  // Check for exact matches first, then partial matches
  for (const [keyword, imageUrl] of Object.entries(productImageMap)) {
    if (name.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // If no match found, use a unique fallback based on product name hash
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const fallbackImages = [
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format&q=80'
  ];
  return fallbackImages[Math.abs(hash) % fallbackImages.length];
}

function createRandomProduct(index) {
  const bank = productBanks[index % productBanks.length];
  const adj = randomFrom(adjectives);
  const brand = randomFrom(brands);
  const noun = randomFrom(bank.nouns);
  const name = `${brand} ${adj} ${noun}`;
  const basePrice = randomInt(bank.price[0], bank.price[1]);
  const price = Number(basePrice.toFixed(2));
  const description = `${name} — high quality and great value for daily use.`;
  return {
    name,
    description,
    price,
    image: getProductImage(name),
    stock: Number.MAX_SAFE_INTEGER,
    unit: bank.unit,
    isAvailable: true,
    averageRating: Number((Math.random() * 2 + 3).toFixed(1)),
    reviewCount: randomInt(5, 500)
  };
}

async function ensureMinimumProducts(minCount = 60) {
  const count = await Product.countDocuments();
  if (count >= minCount) return { created: 0 };

  const toCreate = [];
  // Seed curated base once
  for (const item of curatedProducts) {
    const exists = await Product.findOne({ name: item.name });
    if (!exists) toCreate.push(item);
  }

  // Generate diverse products
  let idx = 0;
  while (toCreate.length < minCount) {
    const p = createRandomProduct(idx + Date.now());
    const exists = await Product.findOne({ name: p.name });
    if (!exists) toCreate.push(p);
    idx += 1;
  }

  if (toCreate.length > 0) {
    await Product.insertMany(toCreate, { ordered: false });
  }
  return { created: toCreate.length };
}

// Public endpoint to generate N additional diverse products
const generateProducts = async (req, res) => {
  try {
    const count = Math.min(Number(req.query.count) || 100, 500);
    const createdDocs = [];
    let idx = 0;
    while (createdDocs.length < count) {
      const p = createRandomProduct(Date.now() + idx);
      const exists = await Product.findOne({ name: p.name });
      if (!exists) createdDocs.push(p);
      idx += 1;
    }
    if (createdDocs.length) {
      await Product.insertMany(createdDocs, { ordered: false });
    }
    res.json({ message: 'Generated products', created: createdDocs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.ensureMinimumProducts = ensureMinimumProducts;
module.exports.generateProducts = generateProducts;


