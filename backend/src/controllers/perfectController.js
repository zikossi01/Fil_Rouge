const Product = require('../models/Product');


const perfectProducts = [
  
  { name: "McDonald's Big Mac", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80", price: 45.99, description: "Classic Big Mac with special sauce, lettuce, cheese, pickles, onions on a sesame seed bun." },
  { name: "KFC Original Recipe Chicken", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop&auto=format&q=80", price: 38.50, description: "Crispy fried chicken with KFC's secret blend of herbs and spices." },
  { name: "Pizza Hut Margherita Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&auto=format&q=80", price: 65.00, description: "Fresh tomato sauce, mozzarella cheese, and basil on our signature crust." },
  { name: "Subway Club Sandwich", image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop&auto=format&q=80", price: 32.75, description: "Turkey, ham, and roast beef with fresh vegetables on your choice of bread." },
  { name: "Burger King French Fries", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&h=400&fit=crop&auto=format&q=80", price: 18.25, description: "Golden crispy french fries, perfectly salted and served hot." },
  { name: "Domino's Pepperoni Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop&auto=format&q=80", price: 58.99, description: "Classic pepperoni pizza with melted mozzarella cheese on our signature crust." },
  { name: "Taco Bell Beef Tacos", image: "https://images.unsplash.com/photo-1565299585323-38174c4aab9e?w=600&h=400&fit=crop&auto=format&q=80", price: 25.50, description: "Seasoned beef, lettuce, and cheese in crispy taco shells." },
  { name: "Starbucks Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format&q=80", price: 22.00, description: "Premium arabica coffee beans, freshly brewed to perfection." },
  
 
  { name: "Apple iPhone 15 Pro", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format&q=80", price: 8999.99, description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system." },
  { name: "Samsung Galaxy S24 Ultra", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format&q=80", price: 7999.99, description: "Premium Android smartphone with S Pen, 200MP camera, and AI features." },
  { name: "MacBook Pro 16-inch", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&auto=format&q=80", price: 12999.99, description: "Powerful laptop with M3 Pro chip, Liquid Retina XDR display, and all-day battery." },
  { name: "Dell XPS 13 Laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&auto=format&q=80", price: 8999.99, description: "Ultra-thin laptop with 13.4-inch InfinityEdge display and premium build quality." },
  { name: "iPad Pro 12.9-inch", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop&auto=format&q=80", price: 6999.99, description: "Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support." },
  { name: "AirPods Pro 2nd Gen", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&auto=format&q=80", price: 1999.99, description: "Wireless earbuds with active noise cancellation and spatial audio." },
  { name: "Sony WH-1000XM5 Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&auto=format&q=80", price: 2499.99, description: "Premium noise-canceling headphones with industry-leading sound quality." },
  { name: "JBL Charge 5 Speaker", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop&auto=format&q=80", price: 899.99, description: "Portable Bluetooth speaker with powerful bass and 20-hour battery life." },
  { name: "Apple Watch Series 9", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&auto=format&q=80", price: 2999.99, description: "Smartwatch with health monitoring, GPS, and cellular connectivity." },
  { name: "Canon EOS R5 Camera", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop&auto=format&q=80", price: 15999.99, description: "Professional mirrorless camera with 45MP sensor and 8K video recording." },
  { name: "PlayStation 5 Console", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop&auto=format&q=80", price: 4999.99, description: "Next-generation gaming console with ultra-fast SSD and ray tracing." },
  { name: "Xbox Series X Console", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop&auto=format&q=80", price: 4999.99, description: "Most powerful Xbox console with 4K gaming and quick resume." },
  { name: "Samsung 55-inch QLED TV", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop&auto=format&q=80", price: 6999.99, description: "4K QLED smart TV with quantum dot technology and HDR10+ support." },
  
 
  { name: "Nike Air Force 1 Sneakers", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&auto=format&q=80", price: 899.99, description: "Classic white sneakers with premium leather construction and Air-Sole unit." },
  { name: "Adidas Ultraboost 22 Running Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&auto=format&q=80", price: 1299.99, description: "High-performance running shoes with Boost midsole and Primeknit upper." },
  { name: "Levi's 501 Original Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop&auto=format&q=80", price: 699.99, description: "Classic straight-fit jeans in authentic denim with button fly." },
  { name: "Zara Cotton T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Soft cotton t-shirt with modern fit and comfortable wear." },
  { name: "H&M Summer Dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop&auto=format&q=80", price: 399.99, description: "Lightweight summer dress perfect for warm weather occasions." },
  { name: "Uniqlo Denim Jacket", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop&auto=format&q=80", price: 599.99, description: "Classic denim jacket with timeless style and durable construction." },
  { name: "Champion Hoodie", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop&auto=format&q=80", price: 499.99, description: "Comfortable pullover hoodie with fleece lining and kangaroo pocket." },
  { name: "Calvin Klein Polo Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&auto=format&q=80", price: 299.99, description: "Classic polo shirt with premium cotton blend and modern fit." },
  
  // Home & Living
  { name: "IKEA Desk Lamp", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Modern adjustable desk lamp with LED lighting and sleek design." },
  { name: "Yankee Candle Vanilla Scent", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 149.99, description: "Premium scented candle with long-lasting vanilla fragrance." },
  { name: "West Elm Ceramic Vase", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80", price: 299.99, description: "Handcrafted ceramic vase perfect for flowers or home decoration." },
  { name: "Target Wall Mirror", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format&q=80", price: 399.99, description: "Large wall mirror with modern frame, perfect for any room." },
  { name: "Wayfair Area Rug", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 599.99, description: "Soft area rug with geometric pattern, adds warmth to any space." },
  { name: "Pottery Barn Throw Pillow", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 249.99, description: "Decorative throw pillow with premium fabric and elegant design." },
  { name: "Crate & Barrel Blanket", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Cozy throw blanket perfect for snuggling on the couch." },
  { name: "Home Depot Plant Pot", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop&auto=format&q=80", price: 99.99, description: "Terracotta plant pot with drainage hole, ideal for indoor plants." },
  
  
  { name: "Clinique Lipstick", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Long-lasting lipstick with rich color and moisturizing formula." },
  { name: "Maybelline Mascara", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 149.99, description: "Volumizing mascara that adds length and thickness to lashes." },
  { name: "L'Oreal Foundation", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 179.99, description: "Full coverage foundation with natural finish and long-lasting wear." },
  { name: "Revlon Nail Polish", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format&q=80", price: 99.99, description: "High-shine nail polish with chip-resistant formula and vibrant colors." },
  { name: "Neutrogena Face Wash", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format&q=80", price: 129.99, description: "Gentle facial cleanser that removes dirt and oil without over-drying." },
  { name: "Olay Anti-Aging Cream", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format&q=80", price: 299.99, description: "Anti-aging moisturizer with retinol and hyaluronic acid for younger-looking skin." },
  { name: "Centrum Multivitamin", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format&q=80", price: 249.99, description: "Complete multivitamin with essential vitamins and minerals for daily health." },
  
 
  { name: "Nike Yoga Mat", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format&q=80", price: 399.99, description: "Premium yoga mat with excellent grip and cushioning for all yoga practices." },
  { name: "Bowflex Dumbbells", image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&auto=format&q=80", price: 1299.99, description: "Adjustable dumbbells that replace multiple sets, perfect for home gym." },
  { name: "Wilson Tennis Racket", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format&q=80", price: 899.99, description: "Professional tennis racket with advanced technology for power and control." },
  { name: "Spalding Basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&auto=format&q=80", price: 299.99, description: "Official size basketball with composite leather cover for indoor/outdoor play." },
  { name: "Adidas Soccer Ball", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop&auto=format&q=80", price: 199.99, description: "Professional soccer ball with FIFA approved construction and design." },
  { name: "Callaway Golf Set", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop&auto=format&q=80", price: 1999.99, description: "Complete golf set with driver, irons, putter, and golf bag." },
  { name: "Trek Mountain Bike", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80", price: 2999.99, description: "Durable mountain bike with suspension fork and 21-speed drivetrain." },
  { name: "Rossignol Ski Set", image: "https://images.unsplash.com/photo-1551524164-6cf2ac531d64?w=600&h=400&fit=crop&auto=format&q=80", price: 3999.99, description: "Professional ski set with skis, bindings, and poles for all-mountain skiing." }
];

function createPerfectProduct(index) {
  
  const product = perfectProducts[index % perfectProducts.length];
  
  
  const variations = [
    'Premium', 'Deluxe', 'Pro', 'Elite', 'Classic', 'Modern', 'Eco', 'Smart', 
    'Advanced', 'Professional', 'Luxury', 'Essential', 'Compact', 'Portable'
  ];
  
  const colors = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 
    'Pink', 'Brown', 'Grey', 'Silver', 'Gold', 'Navy', 'Maroon'
  ];
  
  const sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL', 'Compact', 'Standard', 'Oversized'];
  
  
  if (index >= perfectProducts.length) {
    const variationIndex = Math.floor(index / perfectProducts.length);
    const variation = variations[variationIndex % variations.length];
    const color = colors[variationIndex % colors.length];
    const size = sizes[variationIndex % sizes.length];
    
    const uniqueName = `${variation} ${color} ${product.name}`;
    const uniqueDescription = `${variation} ${color} version of ${product.description.toLowerCase()}`;
    const uniquePrice = product.price * (1 + (variationIndex * 0.1)); 
    
    return {
      name: uniqueName,
      description: uniqueDescription,
      price: Number(uniquePrice.toFixed(2)),
      image: product.image,
      stock: Number.MAX_SAFE_INTEGER,
      unit: 'piece',
      isAvailable: true,
      averageRating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 10
    };
  }
  
 
  return {
    name: product.name,
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


const clearAndRegeneratePerfectProducts = async () => {
  try {
    
    await Product.deleteMany({});
    console.log('Cleared all existing products');
    
    
    const products = [];
    for (let i = 0; i < perfectProducts.length; i++) {
      products.push(createPerfectProduct(i));
    }
    
    
    await Product.insertMany(products);
    console.log(`Generated ${products.length} unique perfect products`);
    
    return products.length;
  } catch (error) {
    console.error('Error clearing and regenerating perfect products:', error);
    return 0;
  }
};


const autoGeneratePerfectProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count < perfectProducts.length) {
      const needed = perfectProducts.length - count;
      const products = [];

      for (let i = 0; i < needed; i++) {
        products.push(createPerfectProduct(i));
      }

      await Product.insertMany(products);
      console.log(`Auto-generated ${needed} unique perfect products on startup`);
    }
  } catch (error) {
    console.error('Error auto-generating perfect products:', error);
  }
};


const generateUnlimitedPerfectProducts = async (req, res) => {
  try {
    const { count = 100 } = req.body;
    const products = [];

    for (let i = 0; i < count; i++) {
      products.push(createPerfectProduct(i));
    }

   
    const batchSize = 50;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
    }

    res.json({
      success: true,
      message: `Generated ${count} perfect products`,
      count: products.length
    });
  } catch (error) {
    console.error('Error generating perfect products:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating perfect products',
      error: error.message
    });
  }
};


const getPerfectProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const sort = req.query.sort || 'name';

    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    const sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'name':
      default:
        sortOptions.name = 1;
        break;
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching perfect products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

module.exports = {
  autoGeneratePerfectProducts,
  generateUnlimitedPerfectProducts,
  getPerfectProducts,
  clearAndRegeneratePerfectProducts
};

