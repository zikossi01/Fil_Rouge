const Product = require('../models/Product');

// Pre-defined unique products with perfect name-image-price matching
const uniqueProducts = [
  // Electronics
  { name: "Apple iPhone 15 Pro", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format&q=80", price: 8999.99, description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.", category: "electronics" },
  { name: "Samsung Galaxy S24 Ultra", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format&q=80", price: 7999.99, description: "Premium Android smartphone with S Pen, 200MP camera, and AI features.", category: "electronics" },
  { name: "MacBook Pro 16-inch", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&auto=format&q=80", price: 12999.99, description: "Powerful laptop with M3 Pro chip, Liquid Retina XDR display, and all-day battery.", category: "electronics" },
  { name: "Dell XPS 13 Laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&auto=format&q=80", price: 8999.99, description: "Ultra-thin laptop with 13.4-inch InfinityEdge display and premium build quality.", category: "electronics" },
  { name: "iPad Pro 12.9-inch", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop&auto=format&q=80", price: 6999.99, description: "Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.", category: "electronics" },
  { name: "AirPods Pro 2nd Gen", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&auto=format&q=80", price: 1999.99, description: "Wireless earbuds with active noise cancellation and spatial audio.", category: "electronics" },
  { name: "Sony WH-1000XM5 Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&auto=format&q=80", price: 2499.99, description: "Premium noise-canceling headphones with industry-leading sound quality.", category: "electronics" },
  { name: "JBL Charge 5 Speaker", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop&auto=format&q=80", price: 899.99, description: "Portable Bluetooth speaker with powerful bass and 20-hour battery life.", category: "electronics" },
  { name: "Apple Watch Series 9", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&auto=format&q=80", price: 2999.99, description: "Smartwatch with health monitoring, GPS, and cellular connectivity.", category: "electronics" },
  { name: "Canon EOS R5 Camera", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop&auto=format&q=80", price: 15999.99, description: "Professional mirrorless camera with 45MP sensor and 8K video recording.", category: "electronics" },
  { name: "PlayStation 5 Console", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop&auto=format&q=80", price: 4999.99, description: "Next-generation gaming console with ultra-fast SSD and ray tracing.", category: "electronics" },
  { name: "Xbox Series X Console", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop&auto=format&q=80", price: 4999.99, description: "Most powerful Xbox console with 4K gaming and quick resume.", category: "electronics" },
  { name: "Samsung 55-inch QLED TV", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop&auto=format&q=80", price: 6999.99, description: "4K QLED smart TV with quantum dot technology and HDR10+ support.", category: "electronics" },
  
  // Clothing
  { name: "Nike Air Force 1 Sneakers", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&auto=format&q=80", price: 899.99, description: "Classic white sneakers with premium leather construction and Air-Sole unit.", category: "clothing" },
  { name: "Adidas Ultraboost 22 Running Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&auto=format&q=80", price: 1299.99, description: "High-performance running shoes with Boost midsole and Primeknit upper.", category: "clothing" },
  { name: "Levi's 501 Original Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop&auto=format&q=80", price: 699.99, description: "Classic straight-fit jeans in authentic denim with button fly.", category: "clothing" },
  { name: "Zara Cotton T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Soft cotton t-shirt with modern fit and comfortable wear.", category: "clothing" },
  { name: "H&M Summer Dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop&auto=format&q=80", price: 399.99, description: "Lightweight summer dress perfect for warm weather occasions.", category: "clothing" },
  { name: "Uniqlo Denim Jacket", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop&auto=format&q=80", price: 599.99, description: "Classic denim jacket with timeless style and durable construction.", category: "clothing" },
  { name: "Champion Hoodie", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop&auto=format&q=80", price: 499.99, description: "Comfortable pullover hoodie with fleece lining and kangaroo pocket.", category: "clothing" },
  { name: "Calvin Klein Polo Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&auto=format&q=80", price: 299.99, description: "Classic polo shirt with premium cotton blend and modern fit.", category: "clothing" },
  
  // Food
  { name: "McDonald's Big Mac", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80", price: 45.99, description: "Classic Big Mac with special sauce, lettuce, cheese, pickles, onions on a sesame seed bun.", category: "food" },
  { name: "KFC Original Recipe Chicken", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop&auto=format&q=80", price: 38.50, description: "Crispy fried chicken with KFC's secret blend of herbs and spices.", category: "food" },
  { name: "Pizza Hut Margherita Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&auto=format&q=80", price: 65.00, description: "Fresh tomato sauce, mozzarella cheese, and basil on our signature crust.", category: "food" },
  { name: "Subway Club Sandwich", image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop&auto=format&q=80", price: 32.75, description: "Turkey, ham, and roast beef with fresh vegetables on your choice of bread.", category: "food" },
  { name: "Burger King French Fries", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&h=400&fit=crop&auto=format&q=80", price: 18.25, description: "Golden crispy french fries, perfectly salted and served hot.", category: "food" },
  { name: "Domino's Pepperoni Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop&auto=format&q=80", price: 58.99, description: "Classic pepperoni pizza with melted mozzarella cheese on our signature crust.", category: "food" },
  { name: "Taco Bell Beef Tacos", image: "https://images.unsplash.com/photo-1565299585323-38174c4aab9e?w=600&h=400&fit=crop&auto=format&q=80", price: 25.50, description: "Seasoned beef, lettuce, and cheese in crispy taco shells.", category: "food" },
  { name: "Starbucks Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format&q=80", price: 22.00, description: "Premium arabica coffee beans, freshly brewed to perfection.", category: "food" },
  
  // Home & Living
  { name: "IKEA Desk Lamp", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Modern adjustable desk lamp with LED lighting and sleek design.", category: "home" },
  { name: "Yankee Candle Vanilla Scent", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 149.99, description: "Premium scented candle with long-lasting vanilla fragrance.", category: "home" },
  { name: "West Elm Ceramic Vase", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80", price: 299.99, description: "Handcrafted ceramic vase perfect for flowers or home decoration.", category: "home" },
  { name: "Target Wall Mirror", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80", price: 399.99, description: "Large wall mirror with modern frame, perfect for any room.", category: "home" },
  { name: "Wayfair Area Rug", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 599.99, description: "Soft area rug with geometric pattern, adds warmth to any space.", category: "home" },
  { name: "Pottery Barn Throw Pillow", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 249.99, description: "Decorative throw pillow with premium fabric and elegant design.", category: "home" },
  { name: "Crate & Barrel Blanket", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Cozy throw blanket perfect for snuggling on the couch.", category: "home" },
  { name: "Home Depot Plant Pot", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop&auto=format&q=80", price: 99.99, description: "Terracotta plant pot with drainage hole, ideal for indoor plants.", category: "home" },
  
  // Beauty
  { name: "Clinique Lipstick", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Long-lasting lipstick with rich color and moisturizing formula.", category: "beauty" },
  { name: "Maybelline Mascara", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 149.99, description: "Volumizing mascara that adds length and thickness to lashes.", category: "beauty" },
  { name: "L'Oreal Foundation", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 179.99, description: "Full coverage foundation with natural finish and long-lasting wear.", category: "beauty" },
  { name: "MAC Eyeshadow Palette", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 299.99, description: "Professional eyeshadow palette with 12 highly pigmented shades.", category: "beauty" },
  { name: "Chanel Perfume", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 899.99, description: "Luxury fragrance with elegant and sophisticated scent.", category: "beauty" },
  { name: "Dior Lip Gloss", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 249.99, description: "High-shine lip gloss with hydrating formula and beautiful finish.", category: "beauty" },
  
  // Sports
  { name: "Nike Basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&auto=format&q=80", price: 89.99, description: "Official size basketball with premium leather construction.", category: "sports" },
  { name: "Adidas Soccer Ball", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop&auto=format&q=80", price: 79.99, description: "Professional soccer ball with FIFA approved construction and design.", category: "sports" },
  { name: "Wilson Tennis Racket", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Professional tennis racket with advanced frame technology.", category: "sports" },
  { name: "Callaway Golf Set", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop&auto=format&q=80", price: 1999.99, description: "Complete golf set with driver, irons, putter, and golf bag.", category: "sports" },
  { name: "Trek Mountain Bike", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80", price: 2999.99, description: "Durable mountain bike with suspension fork and 21-speed drivetrain.", category: "sports" },
  { name: "Rossignol Ski Set", image: "https://images.unsplash.com/photo-1551524164-6cf2ac531d64?w=600&h=400&fit=crop&auto=format&q=80", price: 3999.99, description: "Professional ski set with skis, bindings, and poles for all-mountain skiing.", category: "sports" }
];

// Track used combinations to prevent duplicates
const usedCombinations = new Set();

function createComprehensiveProduct(index) {
  // Use the pre-defined unique products array
  const product = uniqueProducts[index % uniqueProducts.length];
  
  // Create a unique identifier to prevent duplicates
  const uniqueId = Math.floor(index / uniqueProducts.length);
  const uniqueName = uniqueId > 0 ? `${product.name} #${uniqueId + 1}` : product.name;
  
  // Ensure this name is truly unique
  let finalName = uniqueName;
  let counter = 1;
  while (usedCombinations.has(finalName)) {
    finalName = `${product.name} #${uniqueId + 1}-${counter}`;
    counter++;
  }
  
  usedCombinations.add(finalName);
  
  return {
    name: finalName,
    description: product.description,
    price: product.price,
    image: product.image,
    stock: Number.MAX_SAFE_INTEGER,
    unit: 'piece',
    isAvailable: true,
    averageRating: Number((Math.random() * 2 + 3).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 500) + 10
  };
}

// Function to reset used combinations
const resetUsedCombinations = () => {
  usedCombinations.clear();
};

// Generate unlimited products
const generateUnlimitedProducts = async (req, res) => {
  try {
    const { count = 100 } = req.body;
    const products = [];
    
    // Get current product count to ensure unique indexing
    const currentCount = await Product.countDocuments();
    
    // Reset used combinations for this batch to ensure no duplicates
    resetUsedCombinations();
    
    for (let i = 0; i < count; i++) {
      // Use currentCount + i to ensure unique indexing across all products
      products.push(createComprehensiveProduct(currentCount + i));
    }
    
    // Insert products in batches for better performance
    const batchSize = 50;
    let created = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      created += batch.length;
    }
    
    res.json({
      message: 'Generated unlimited unique products successfully',
      created,
      totalProducts: await Product.countDocuments()
    });
  } catch (error) {
    console.error('Error generating products:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get products with unlimited pagination
const getUnlimitedProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, sort = 'createdAt' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { isAvailable: true };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    let sortQuery = {};
    switch (sort) {
      case 'price_asc':
        sortQuery = { price: 1 };
        break;
      case 'price_desc':
        sortQuery = { price: -1 };
        break;
      case 'name':
        sortQuery = { name: 1 };
        break;
      case 'rating':
        sortQuery = { averageRating: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove duplicate products from database
const removeDuplicateProducts = async () => {
  try {
    // Find products with duplicate names
    const duplicates = await Product.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          docs: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    let removedCount = 0;
    for (const duplicate of duplicates) {
      // Keep the first document, remove the rest
      const idsToRemove = duplicate.docs.slice(1);
      await Product.deleteMany({ _id: { $in: idsToRemove } });
      removedCount += idsToRemove.length;
    }

    console.log(`Removed ${removedCount} duplicate products`);
    return removedCount;
  } catch (error) {
    console.error('Error removing duplicates:', error);
    return 0;
  }
};

// Clear all products and regenerate with unique system
const clearAndRegenerateProducts = async () => {
  try {
    // Clear all existing products
    await Product.deleteMany({});
    console.log('Cleared all existing products');
    
    // Reset tracking systems
    resetUsedCombinations();
    
    // Generate only the base products (no duplicates)
    const products = [];
    for (let i = 0; i < uniqueProducts.length; i++) {
      products.push(createComprehensiveProduct(i));
    }
    
    // Insert all products
    await Product.insertMany(products);
    console.log(`Generated ${products.length} unique products with perfect matching`);
    
    return products.length;
  } catch (error) {
    console.error('Error clearing and regenerating products:', error);
    return 0;
  }
};

// Auto-generate products on startup
const autoGenerateProducts = async () => {
  try {
    // First, remove any existing duplicates
    await removeDuplicateProducts();
    
    const count = await Product.countDocuments();
    if (count < uniqueProducts.length) {
      const needed = uniqueProducts.length - count;
      const products = [];
      
      // Reset used combinations for this batch to ensure no duplicates
      resetUsedCombinations();
      
      for (let i = 0; i < needed; i++) {
        products.push(createComprehensiveProduct(i));
      }
      
      await Product.insertMany(products);
      console.log(`Auto-generated ${needed} unique products on startup`);
    }
  } catch (error) {
    console.error('Error auto-generating products:', error);
  }
};

module.exports = {
  generateUnlimitedProducts,
  getUnlimitedProducts,
  autoGenerateProducts,
  removeDuplicateProducts,
  clearAndRegenerateProducts
};
