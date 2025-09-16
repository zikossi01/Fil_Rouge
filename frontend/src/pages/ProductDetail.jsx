import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../store/cart';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Handle different product ID formats
        if (id.startsWith('fake_')) {
          // FakeStore products
          const index = parseInt(id.replace('fake_', ''));
          const response = await fetch('https://fakestoreapi.com/products');
          if (!response.ok) throw new Error('Failed to fetch product');
          
          const products = await response.json();
          const fakeProduct = products[index];
          
          if (!fakeProduct) throw new Error('Product not found');
          
          const transformedProduct = {
            _id: `fake_${index}`,
            name: fakeProduct.title,
            description: fakeProduct.description,
            price: Math.max(0, Number(fakeProduct.price) || 0),
            category: mapCategory(fakeProduct.category),
            image: fakeProduct.image,
            stock: Math.floor(Math.random() * 200) + 50,
            unit: 'piece',
            rating: fakeProduct.rating?.rate || 0,
            reviewCount: fakeProduct.rating?.count || 0,
            createdAt: new Date().toISOString()
          };
          
          setProduct(transformedProduct);
        } else if (id.startsWith('product_')) {
          // Unlimited products from external controller
          const productData = getProductFromUnlimitedSystem(id);
          if (productData) {
            setProduct(productData);
          } else {
            setError('Product not found');
          }
        } else if (id.startsWith('gen_') || id.startsWith('add_') || id.includes('_v')) {
          // Generated, additional, or variation products
          const productData = getProductFromCache(id);
          if (productData) {
            setProduct(productData);
          } else {
            setError('Product not found');
          }
        } else {
          // Fetch from backend so IDs remain Mongo ObjectId
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${id}`);
          if (!res.ok) throw new Error('Product not found');
          const p = await res.json();
          setProduct({
            _id: p._id,
            name: p.name,
            description: p.description,
            price: Math.max(0, Number(p.price) || 0),
            category: p.category,
            image: p.image,
            stock: Number(p.stock ?? p.countInStock ?? 0),
            unit: p.unit || 'piece',
            rating: Number(p.rating ?? p.rating?.rate ?? 0),
            reviewCount: Number(p.numReviews ?? p.reviewCount ?? 0),
            createdAt: p.createdAt || new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error('Error loading product:', e);
        setError(e.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Get product from the unlimited products system
  const getProductFromUnlimitedSystem = (productId) => {
    // Parse the unlimited product ID format: product_{globalIndex}_{timestamp}_{randomString}
    const parts = productId.split('_');
    if (parts.length < 3) return null;
    
    const globalIndex = parseInt(parts[1]);
    const baseProducts = [
      { name: 'iPhone 15 Pro', category: 'electronics', price: 999.99, unit: 'piece', rating: 4.8, description: 'Latest iPhone with A17 Pro chip and titanium design', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400' },
      { name: 'Samsung Galaxy S24', category: 'electronics', price: 899.99, unit: 'piece', rating: 4.7, description: 'Flagship Android phone with AI features', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
      { name: 'MacBook Pro 16"', category: 'electronics', price: 2499.99, unit: 'piece', rating: 4.9, description: 'Professional laptop with M3 Pro chip', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
      { name: 'Sony WH-1000XM5', category: 'electronics', price: 399.99, unit: 'piece', rating: 4.8, description: 'Premium noise-canceling headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
      { name: 'Apple Watch Series 9', category: 'electronics', price: 399.99, unit: 'piece', rating: 4.6, description: 'Smartwatch with health monitoring', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400' },
      { name: 'Gaming Laptop', category: 'electronics', price: 1499.99, unit: 'piece', rating: 4.4, description: 'High-performance laptop for gaming and work', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400' },
      { name: 'iPad Air', category: 'electronics', price: 599.99, unit: 'piece', rating: 4.5, description: 'Powerful tablet with M2 chip', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' },
      { name: 'DJI Mini 3 Pro', category: 'electronics', price: 759.99, unit: 'piece', rating: 4.7, description: 'Compact drone with 4K camera', image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400' },
      { name: 'Rolex Datejust Watch', category: 'jewelery', price: 8999.99, unit: 'piece', rating: 4.9, description: 'Luxury timepiece with elegant design', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400' },
      { name: 'Gold Necklace', category: 'jewelery', price: 599.99, unit: 'piece', rating: 4.8, description: 'Elegant 18k gold necklace for special occasions', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' },
      { name: 'Diamond Ring', category: 'jewelery', price: 2999.99, unit: 'piece', rating: 4.9, description: 'Stunning diamond engagement ring', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400' },
      { name: 'Silver Bracelet', category: 'jewelery', price: 199.99, unit: 'piece', rating: 4.6, description: 'Sterling silver bracelet with charm', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400' },
      { name: 'Omega Speedmaster', category: 'jewelery', price: 5999.99, unit: 'piece', rating: 4.8, description: 'Professional chronograph watch', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400' },
      { name: 'Pearl Earrings', category: 'jewelery', price: 299.99, unit: 'pair', rating: 4.5, description: 'Classic pearl drop earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400' },
      { name: 'Nike Air Max Sneakers', category: 'men', price: 129.99, unit: 'pair', rating: 4.6, description: 'Comfortable running shoes with Air Max technology', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
      { name: 'Levi\'s 501 Jeans', category: 'men', price: 89.99, unit: 'pair', rating: 4.4, description: 'Classic straight-leg denim jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
      { name: 'Ralph Lauren Polo', category: 'men', price: 79.99, unit: 'piece', rating: 4.5, description: 'Classic polo shirt with embroidered logo', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
      { name: 'Adidas Ultraboost', category: 'men', price: 189.99, unit: 'pair', rating: 4.7, description: 'Premium running shoes with Boost technology', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
      { name: 'Tommy Hilfiger Jacket', category: 'men', price: 149.99, unit: 'piece', rating: 4.3, description: 'Casual bomber jacket with logo', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
      { name: 'Calvin Klein Boxers', category: 'men', price: 24.99, unit: 'pack', rating: 4.2, description: 'Comfortable cotton boxer briefs', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400' },
      { name: 'Designer Handbag', category: 'women', price: 299.99, unit: 'piece', rating: 4.7, description: 'Elegant leather handbag for women', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
      { name: 'Zara Summer Dress', category: 'women', price: 89.99, unit: 'piece', rating: 4.4, description: 'Floral print summer dress', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400' },
      { name: 'H&M Blouse', category: 'women', price: 49.99, unit: 'piece', rating: 4.3, description: 'Elegant silk blouse for office', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
      { name: 'Forever 21 Jeans', category: 'women', price: 39.99, unit: 'pair', rating: 4.1, description: 'High-waisted skinny jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
      { name: 'ASOS Cardigan', category: 'women', price: 44.99, unit: 'piece', rating: 4.5, description: 'Soft knit cardigan sweater', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
      { name: 'Victoria\'s Secret Bra', category: 'women', price: 54.99, unit: 'piece', rating: 4.6, description: 'Comfortable lace bra set', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400' },
      { name: 'Pizza Margherita', category: 'pantry', price: 15.99, unit: 'piece', rating: 4.5, description: 'Classic Italian pizza with tomato and mozzarella', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' },
      { name: 'Burger Deluxe', category: 'pantry', price: 12.99, unit: 'piece', rating: 4.3, description: 'Juicy beef burger with fresh vegetables and cheese', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
      { name: 'Tacos Al Pastor', category: 'pantry', price: 8.99, unit: 'pack', rating: 4.7, description: 'Authentic Mexican tacos with marinated pork', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
      { name: 'Sushi Roll Set', category: 'pantry', price: 18.99, unit: 'set', rating: 4.8, description: 'Fresh salmon and avocado sushi rolls', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
      { name: 'Pasta Carbonara', category: 'pantry', price: 14.99, unit: 'serving', rating: 4.4, description: 'Creamy pasta with bacon and parmesan', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400' },
      { name: 'Chicken Caesar Salad', category: 'pantry', price: 11.99, unit: 'bowl', rating: 4.2, description: 'Fresh salad with grilled chicken and caesar dressing', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
      { name: 'Chocolate Cake', category: 'pantry', price: 22.99, unit: 'cake', rating: 4.9, description: 'Rich chocolate layer cake with frosting', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
      { name: 'Ice Cream Sundae', category: 'pantry', price: 6.99, unit: 'sundae', rating: 4.6, description: 'Vanilla ice cream with chocolate sauce and sprinkles', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
      { name: 'Modern Sofa', category: 'home', price: 899.99, unit: 'piece', rating: 4.7, description: 'Contemporary 3-seater sofa in gray', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
      { name: 'Dining Table Set', category: 'home', price: 599.99, unit: 'set', rating: 4.5, description: 'Wooden dining table with 6 chairs', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400' },
      { name: 'Queen Size Bed', category: 'home', price: 449.99, unit: 'piece', rating: 4.6, description: 'Elegant bed frame with headboard', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400' },
      { name: 'Table Lamp', category: 'home', price: 79.99, unit: 'piece', rating: 4.3, description: 'Modern LED table lamp with touch control', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
      { name: 'Area Rug', category: 'home', price: 299.99, unit: 'piece', rating: 4.4, description: 'Persian-style area rug 8x10 feet', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
      { name: 'Wall Clock', category: 'home', price: 39.99, unit: 'piece', rating: 4.2, description: 'Minimalist wall clock with silent movement', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400' },
      { name: 'Car Floor Mats', category: 'automotive', price: 49.99, unit: 'set', rating: 4.5, description: 'All-weather car floor mats set', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400' },
      { name: 'Phone Mount', category: 'automotive', price: 19.99, unit: 'piece', rating: 4.3, description: 'Universal car phone holder', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' },
      { name: 'Car Charger', category: 'automotive', price: 14.99, unit: 'piece', rating: 4.4, description: 'Fast charging USB car adapter', image: 'https://images.unsplash.com/photo-1609592806598-04c4c1382c6b?w=400' },
      { name: 'Steering Wheel Cover', category: 'automotive', price: 24.99, unit: 'piece', rating: 4.1, description: 'Leather steering wheel cover', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400' },
      { name: 'Car Air Freshener', category: 'automotive', price: 9.99, unit: 'pack', rating: 4.2, description: 'Long-lasting car air freshener', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' },
      { name: 'Vitamin C Supplements', category: 'health', price: 15.99, unit: 'bottle', rating: 4.6, description: 'High-potency vitamin C tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
      { name: 'Organic Face Cream', category: 'health', price: 22.99, unit: 'jar', rating: 4.7, description: 'Natural anti-aging face cream', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400' },
      { name: 'Electric Toothbrush', category: 'health', price: 49.99, unit: 'piece', rating: 4.8, description: 'Sonic electric toothbrush with timer', image: 'https://images.unsplash.com/photo-1559591935-c6c92c6f2d6c?w=400' },
      { name: 'Yoga Mat', category: 'health', price: 29.99, unit: 'piece', rating: 4.5, description: 'Non-slip exercise yoga mat', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400' },
      { name: 'Essential Oil Set', category: 'health', price: 44.99, unit: 'set', rating: 4.4, description: 'Pure essential oils for aromatherapy', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400' }
    ];
    
    const baseProduct = baseProducts[globalIndex % baseProducts.length];
    if (!baseProduct) return null;
    
    const variation = Math.floor(globalIndex / baseProducts.length);
    
    // Create unique variations with different names, prices, and characteristics
    const variationNames = [
      'Premium', 'Deluxe', 'Pro', 'Ultra', 'Elite', 'Signature', 'Limited Edition',
      'Special', 'Exclusive', 'Professional', 'Advanced', 'Supreme', 'Master',
      'Classic', 'Modern', 'Contemporary', 'Vintage', 'Retro', 'Trendy', 'Stylish'
    ];
    
    const variationSuffixes = [
      'Plus', 'Max', 'X', 'S', 'L', 'XL', 'XXL', 'Mini', 'Compact', 'Portable',
      'Wireless', 'Smart', 'Digital', 'Analog', 'Hybrid', 'Eco', 'Organic',
      'Natural', 'Synthetic', 'Premium', 'Standard', 'Basic', 'Essential'
    ];
    
    const nameVariation = variationNames[globalIndex % variationNames.length];
    const suffixVariation = variationSuffixes[globalIndex % variationSuffixes.length];
    
    // Create unique product name
    let productName = baseProduct.name;
    if (variation > 0) {
      productName = `${nameVariation} ${baseProduct.name} ${suffixVariation}`;
    }
    
    // Vary price based on variation and global index
    const priceVariation = (Math.sin(globalIndex * 0.1) * 100) + (Math.random() * 50 - 25);
    const newPrice = Math.max(1, baseProduct.price + priceVariation);
    
    // Vary rating based on global index
    const ratingVariation = Math.sin(globalIndex * 0.05) * 0.5;
    const newRating = Math.max(3.0, Math.min(5.0, baseProduct.rating + ratingVariation));
    
    // Vary stock based on global index
    const stockVariation = Math.floor(Math.sin(globalIndex * 0.02) * 100) + 50;
    const newStock = Math.max(1, Math.floor(Math.random() * 300) + stockVariation);
    
    // Vary review count
    const reviewVariation = Math.floor(Math.sin(globalIndex * 0.03) * 200) + 100;
    const newReviewCount = Math.max(10, Math.floor(Math.random() * 1000) + reviewVariation);
    
    // Vary description
    const descriptionVariations = [
      `Enhanced ${baseProduct.description.toLowerCase()}`,
      `Upgraded ${baseProduct.description.toLowerCase()}`,
      `Premium ${baseProduct.description.toLowerCase()}`,
      `Professional ${baseProduct.description.toLowerCase()}`,
      `Advanced ${baseProduct.description.toLowerCase()}`,
      `Deluxe ${baseProduct.description.toLowerCase()}`,
      `Exclusive ${baseProduct.description.toLowerCase()}`,
      `Limited edition ${baseProduct.description.toLowerCase()}`,
      `Signature ${baseProduct.description.toLowerCase()}`,
      `Master ${baseProduct.description.toLowerCase()}`
    ];
    
    const descriptionVariation = descriptionVariations[globalIndex % descriptionVariations.length];
    
    return {
      _id: productId,
      name: productName,
      description: descriptionVariation,
      price: Number(newPrice.toFixed(2)),
      category: baseProduct.category,
      image: baseProduct.image,
      stock: newStock,
      unit: baseProduct.unit,
      rating: Number(newRating.toFixed(1)),
      reviewCount: newReviewCount,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  // Get product from the massive product cache
  const getProductFromCache = (productId) => {
    // This would normally fetch from a cache or database
    // For now, we'll generate it based on the ID
    const index = parseInt(productId.replace(/[^\d]/g, ''));
    
    const productMap = {
      // Food & Groceries
      1000: { name: 'Organic Bananas', category: 'fruits', price: 2.99, unit: 'bunch', stock: 45, description: 'Sweet, ripe organic bananas perfect for smoothies, baking, or a healthy snack. Grown without pesticides and harvested at peak ripeness.' },
      1001: { name: 'Fresh Strawberries', category: 'fruits', price: 4.99, unit: 'pack', stock: 38, description: 'Juicy, red strawberries picked at peak ripeness. Perfect for desserts, smoothies, or fresh eating.' },
      1002: { name: 'Organic Apples', category: 'fruits', price: 3.49, unit: 'lb', stock: 52, description: 'Crisp, organic apples with perfect balance of sweet and tart. Great for snacking, baking, or juicing.' },
      1003: { name: 'Fresh Oranges', category: 'fruits', price: 2.49, unit: 'lb', stock: 41, description: 'Sweet, juicy oranges packed with vitamin C. Perfect for fresh juice or healthy snacking.' },
      1004: { name: 'Organic Blueberries', category: 'fruits', price: 5.99, unit: 'pack', stock: 28, description: 'Antioxidant-rich organic blueberries. Sweet and nutritious, great for smoothies or cereal.' },
      1005: { name: 'Fresh Pineapple', category: 'fruits', price: 3.99, unit: 'piece', stock: 15, description: 'Sweet, tropical pineapple with golden flesh. Perfect for fruit salads or tropical dishes.' },
      1006: { name: 'Organic Grapes', category: 'fruits', price: 4.49, unit: 'lb', stock: 33, description: 'Sweet, seedless organic grapes. Perfect for snacking, wine making, or fruit platters.' },
      1007: { name: 'Fresh Mango', category: 'fruits', price: 2.99, unit: 'piece', stock: 22, description: 'Sweet, tropical mango with smooth flesh. Great for smoothies, salsas, or fresh eating.' },
      1008: { name: 'Organic Pears', category: 'fruits', price: 3.99, unit: 'lb', stock: 29, description: 'Juicy, organic pears with smooth texture. Perfect for salads, baking, or fresh snacking.' },
      1009: { name: 'Fresh Watermelon', category: 'fruits', price: 6.99, unit: 'piece', stock: 12, description: 'Sweet, refreshing watermelon perfect for hot summer days. Great for fruit salads or fresh juice.' },
      
      // Vegetables
      1010: { name: 'Organic Spinach', category: 'vegetables', price: 2.49, unit: 'bag', stock: 35, description: 'Fresh organic spinach leaves packed with vitamins and minerals. Perfect for salads, smoothies, or cooking.' },
      1011: { name: 'Fresh Broccoli', category: 'vegetables', price: 2.99, unit: 'head', stock: 27, description: 'Crisp, fresh broccoli with tight florets. Great steamed, roasted, or in stir-fries.' },
      1012: { name: 'Organic Carrots', category: 'vegetables', price: 1.99, unit: 'lb', stock: 44, description: 'Sweet, organic carrots with bright orange color. Perfect for snacking, juicing, or cooking.' },
      1013: { name: 'Fresh Bell Peppers', category: 'vegetables', price: 3.49, unit: 'lb', stock: 31, description: 'Colorful bell peppers with crisp texture. Great for salads, stir-fries, or stuffing.' },
      1014: { name: 'Organic Tomatoes', category: 'vegetables', price: 2.99, unit: 'lb', stock: 38, description: 'Ripe, organic tomatoes with rich flavor. Perfect for salads, sauces, or fresh eating.' },
      1015: { name: 'Fresh Cucumber', category: 'vegetables', price: 1.49, unit: 'piece', stock: 42, description: 'Crisp, refreshing cucumber. Great for salads, pickling, or fresh snacking.' },
      1016: { name: 'Organic Onions', category: 'vegetables', price: 1.99, unit: 'lb', stock: 36, description: 'Fresh organic onions with pungent flavor. Essential for cooking and flavoring dishes.' },
      1017: { name: 'Fresh Garlic', category: 'vegetables', price: 0.99, unit: 'head', stock: 55, description: 'Fresh garlic cloves with intense flavor. Essential ingredient for countless recipes.' },
      1018: { name: 'Organic Potatoes', category: 'vegetables', price: 2.49, unit: 'lb', stock: 41, description: 'Versatile organic potatoes. Great for baking, mashing, frying, or roasting.' },
      1019: { name: 'Fresh Lettuce', category: 'vegetables', price: 1.99, unit: 'head', stock: 33, description: 'Crisp, fresh lettuce perfect for salads and sandwiches.' },
      
      // Meat & Dairy
      1020: { name: 'Premium Ground Beef', category: 'meat', price: 8.99, unit: 'lb', stock: 30, description: 'High-quality ground beef from grass-fed cattle. Perfect for burgers, meatballs, or tacos. 80/20 lean-to-fat ratio for optimal flavor.' },
      1021: { name: 'Organic Chicken Breast', category: 'meat', price: 6.99, unit: 'lb', stock: 25, description: 'Boneless, skinless organic chicken breast. Lean protein perfect for grilling, baking, or stir-frying.' },
      1022: { name: 'Fresh Salmon Fillet', category: 'meat', price: 12.99, unit: 'lb', stock: 18, description: 'Fresh Atlantic salmon fillet rich in omega-3 fatty acids. Great grilled, baked, or pan-seared.' },
      1023: { name: 'Organic Turkey', category: 'meat', price: 7.99, unit: 'lb', stock: 22, description: 'Fresh organic turkey perfect for roasting or ground for burgers and meatballs.' },
      1024: { name: 'Fresh Pork Chops', category: 'meat', price: 5.99, unit: 'lb', stock: 28, description: 'Thick-cut pork chops perfect for grilling, pan-frying, or baking.' },
      1025: { name: 'Greek Yogurt', category: 'dairy', price: 4.99, unit: 'container', stock: 40, description: 'Creamy Greek yogurt with live cultures. High in protein and probiotics, great for breakfast bowls or cooking.' },
      1026: { name: 'Fresh Milk 2%', category: 'dairy', price: 3.99, unit: 'gallon', stock: 30, description: 'Fresh 2% milk from local dairy farms. Rich and creamy, perfect for drinking, cooking, or baking.' },
      1027: { name: 'Organic Cheese', category: 'dairy', price: 5.99, unit: 'block', stock: 35, description: 'Sharp cheddar cheese made from organic milk. Perfect for sandwiches, cooking, or snacking.' },
      1028: { name: 'Fresh Eggs', category: 'dairy', price: 4.49, unit: 'dozen', stock: 45, description: 'Farm-fresh eggs from free-range chickens. Great for breakfast, baking, or cooking.' },
      1029: { name: 'Organic Butter', category: 'dairy', price: 6.99, unit: 'lb', stock: 28, description: 'Rich, creamy organic butter perfect for baking, cooking, or spreading on bread.' },
      
      // Electronics
      1030: { name: 'iPhone 15 Pro', category: 'electronics', price: 999.99, unit: 'piece', stock: 15, description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. 6.1" Super Retina XDR display.' },
      1031: { name: 'Samsung Galaxy S24', category: 'electronics', price: 799.99, unit: 'piece', stock: 18, description: 'Flagship Android phone with Snapdragon 8 Gen 3, 6.2" Dynamic AMOLED display, and AI-powered features.' },
      1032: { name: 'MacBook Pro 16"', category: 'electronics', price: 2499.99, unit: 'piece', stock: 8, description: 'Professional laptop with M3 Pro chip, 16" Liquid Retina XDR display, and up to 22 hours battery life.' },
      1033: { name: 'Dell XPS 13', category: 'electronics', price: 1299.99, unit: 'piece', stock: 12, description: 'Premium Windows laptop with 13.4" InfinityEdge display, Intel Core i7, and sleek aluminum design.' },
      1034: { name: 'Sony WH-1000XM5', category: 'electronics', price: 399.99, unit: 'piece', stock: 22, description: 'Premium noise-canceling headphones with 30-hour battery life and exceptional sound quality.' },
      1035: { name: 'Apple Watch Series 9', category: 'electronics', price: 399.99, unit: 'piece', stock: 25, description: 'Smartwatch with S9 chip, Always-On Retina display, and advanced health monitoring features.' },
      1036: { name: 'PlayStation 5', category: 'electronics', price: 499.99, unit: 'piece', stock: 10, description: 'Next-gen gaming console with lightning-fast loading, haptic feedback, and 4K graphics.' },
      1037: { name: 'Xbox Series X', category: 'electronics', price: 499.99, unit: 'piece', stock: 14, description: 'Most powerful Xbox ever with 4K gaming, ray tracing, and backward compatibility.' },
      1038: { name: 'Nintendo Switch OLED', category: 'electronics', price: 349.99, unit: 'piece', stock: 20, description: 'Hybrid gaming console with 7" OLED screen, enhanced audio, and versatile gaming modes.' },
      1039: { name: 'iPad Air', category: 'electronics', price: 599.99, unit: 'piece', stock: 16, description: 'Powerful tablet with M2 chip, 10.9" Liquid Retina display, and Apple Pencil support.' },
      
      // Home & Kitchen
      1040: { name: 'KitchenAid Stand Mixer', category: 'kitchen', price: 399.99, unit: 'piece', stock: 12, description: 'Professional stand mixer with 10-speed motor, 5-quart bowl, and multiple attachments for all your baking needs.' },
      1041: { name: 'Ninja Foodi 9-in-1', category: 'kitchen', price: 199.99, unit: 'piece', stock: 18, description: 'Multi-cooker with pressure cooking, air frying, slow cooking, and 8 other functions in one appliance.' },
      1042: { name: 'Instant Pot Duo', category: 'kitchen', price: 89.99, unit: 'piece', stock: 25, description: '7-in-1 electric pressure cooker with safety features and multiple cooking modes.' },
      1043: { name: 'Cuisinart Food Processor', category: 'kitchen', price: 79.99, unit: 'piece', stock: 20, description: '11-cup food processor with multiple blades for chopping, slicing, and pureeing.' },
      1044: { name: 'All-Clad Pan Set', category: 'kitchen', price: 299.99, unit: 'set', stock: 8, description: 'Professional cookware set with stainless steel construction and even heat distribution.' },
      1045: { name: 'Le Creuset Dutch Oven', category: 'kitchen', price: 399.99, unit: 'piece', stock: 6, description: 'Enameled cast iron Dutch oven perfect for braising, stewing, and slow cooking.' },
      1046: { name: 'Vitamix Blender', category: 'kitchen', price: 449.99, unit: 'piece', stock: 10, description: 'Professional-grade blender with powerful motor for smoothies, soups, and nut butters.' },
      1047: { name: 'Breville Coffee Maker', category: 'kitchen', price: 299.99, unit: 'piece', stock: 15, description: 'Programmable coffee maker with built-in grinder and thermal carafe.' },
      1048: { name: 'Cuisinart Toaster Oven', category: 'kitchen', price: 129.99, unit: 'piece', stock: 22, description: 'Convection toaster oven with multiple cooking functions and digital controls.' },
      1049: { name: 'KitchenAid Coffee Grinder', category: 'kitchen', price: 89.99, unit: 'piece', stock: 18, description: 'Burr coffee grinder with 15 grind settings for perfect coffee every time.' },
      
      // Clothing & Fashion
      1050: { name: 'Nike Air Max 270', category: 'men', price: 129.99, unit: 'pair', stock: 30, description: 'Comfortable running shoes with Air Max unit for maximum cushioning and style.' },
      1051: { name: 'Adidas Ultraboost 22', category: 'men', price: 189.99, unit: 'pair', stock: 25, description: 'Premium running shoes with responsive Boost midsole and Primeknit upper.' },
      1052: { name: 'Levi\'s 501 Jeans', category: 'men', price: 69.99, unit: 'pair', stock: 35, description: 'Classic straight-leg jeans with button fly and timeless style.' },
      1053: { name: 'Calvin Klein T-Shirt', category: 'men', price: 29.99, unit: 'piece', stock: 40, description: 'Soft cotton t-shirt with classic fit and comfortable feel.' },
      1054: { name: 'Tommy Hilfiger Polo', category: 'men', price: 49.99, unit: 'piece', stock: 28, description: 'Classic polo shirt with embroidered logo and comfortable fit.' },
      1055: { name: 'Ralph Lauren Sweater', category: 'men', price: 89.99, unit: 'piece', stock: 22, description: 'Soft wool sweater with classic design and comfortable fit.' },
      1056: { name: 'Nike Dri-FIT Shirt', category: 'men', price: 34.99, unit: 'piece', stock: 45, description: 'Moisture-wicking athletic shirt perfect for workouts and sports.' },
      1057: { name: 'Adidas Track Jacket', category: 'men', price: 79.99, unit: 'piece', stock: 20, description: 'Lightweight track jacket with zip front and comfortable fit.' },
      1058: { name: 'Levi\'s Denim Jacket', category: 'men', price: 89.99, unit: 'piece', stock: 18, description: 'Classic denim jacket with timeless style and comfortable fit.' },
      1059: { name: 'Calvin Klein Boxers', category: 'men', price: 24.99, unit: 'pack', stock: 50, description: 'Comfortable cotton boxers with elastic waistband.' },
      
      // Health & Beauty
      1060: { name: 'Vitamin C Supplements', category: 'health', price: 15.99, unit: 'bottle', stock: 55, description: 'High-potency vitamin C supplements to support immune health and collagen production.' },
      1061: { name: 'Omega-3 Fish Oil', category: 'health', price: 24.99, unit: 'bottle', stock: 42, description: 'Pure fish oil supplements rich in EPA and DHA for heart and brain health.' },
      1062: { name: 'Probiotic Gummies', category: 'health', price: 19.99, unit: 'bottle', stock: 38, description: 'Delicious probiotic gummies to support digestive health and immune function.' },
      1063: { name: 'Collagen Peptides', category: 'health', price: 29.99, unit: 'bottle', stock: 31, description: 'Hydrolyzed collagen peptides to support skin, hair, and joint health.' },
      1064: { name: 'Multivitamin Tablets', category: 'health', price: 18.99, unit: 'bottle', stock: 48, description: 'Complete multivitamin with essential nutrients for overall health and wellness.' },
      1065: { name: 'Organic Face Cream', category: 'health', price: 22.99, unit: 'jar', stock: 38, description: 'Nourishing organic face cream with natural ingredients for healthy, glowing skin.' },
      1066: { name: 'Retinol Serum', category: 'health', price: 34.99, unit: 'bottle', stock: 25, description: 'Advanced retinol serum to reduce fine lines and improve skin texture.' },
      1067: { name: 'Hyaluronic Acid', category: 'health', price: 19.99, unit: 'bottle', stock: 41, description: 'Hydrating hyaluronic acid serum for plump, moisturized skin.' },
      1068: { name: 'Vitamin E Oil', category: 'health', price: 12.99, unit: 'bottle', stock: 52, description: 'Pure vitamin E oil for skin nourishment and antioxidant protection.' },
      1069: { name: 'Aloe Vera Gel', category: 'health', price: 9.99, unit: 'bottle', stock: 60, description: 'Pure aloe vera gel for soothing skin and natural healing.' },
      
      // Sports & Outdoor
      1070: { name: 'Basketball Official Size', category: 'sports', price: 19.99, unit: 'piece', stock: 30, description: 'Official size basketball with superior grip and bounce for indoor and outdoor play.' },
      1071: { name: 'Tennis Racket Pro', category: 'sports', price: 89.99, unit: 'piece', stock: 12, description: 'Professional tennis racket with lightweight frame and optimal string tension.' },
      1072: { name: 'Soccer Ball', category: 'sports', price: 24.99, unit: 'piece', stock: 28, description: 'Professional soccer ball with perfect roundness and durability.' },
      1073: { name: 'Baseball Glove', category: 'sports', price: 34.99, unit: 'piece', stock: 22, description: 'Quality baseball glove with comfortable fit and durable construction.' },
      1074: { name: 'Golf Club Set', category: 'sports', price: 299.99, unit: 'set', stock: 8, description: 'Complete golf club set with driver, irons, putter, and carrying bag.' },
      1075: { name: 'Camping Tent 4-Person', category: 'sports', price: 149.99, unit: 'piece', stock: 8, description: 'Spacious 4-person camping tent with weather-resistant materials.' },
      1076: { name: 'Sleeping Bag', category: 'sports', price: 79.99, unit: 'piece', stock: 15, description: 'Warm sleeping bag rated for cold weather camping.' },
      1077: { name: 'Hiking Boots', category: 'sports', price: 129.99, unit: 'pair', stock: 18, description: 'Waterproof hiking boots with excellent traction and ankle support.' },
      1078: { name: 'Backpack 65L', category: 'sports', price: 89.99, unit: 'piece', stock: 12, description: 'Large capacity backpack perfect for hiking and outdoor adventures.' },
      1079: { name: 'Water Bottle 32oz', category: 'sports', price: 19.99, unit: 'piece', stock: 35, description: 'Insulated water bottle to keep drinks cold for hours.' }
    };

    const productData = productMap[index];
    if (!productData) return null;

    return {
      _id: productId,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      image: `https://picsum.photos/600/600?random=${index}`,
      stock: productData.stock,
      unit: productData.unit,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date().toISOString()
    };
  };

  const mapCategory = (cat) => {
    const lower = String(cat || '').toLowerCase();
    if (lower.includes('jewel')) return 'jewelery';
    if (lower.includes('electronics')) return 'electronics';
    if (lower.includes('men') || lower.includes('women') || lower.includes('clothing')) return lower;
    if (lower.includes('food') || lower.includes('grocery')) return 'pantry';
    return 'other';
  };

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-600">
        <p className="text-xl mb-2">Oops! Something went wrong</p>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-96 md:h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {product.rating > 0 && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  ⭐ {product.rating} ({product.reviewCount} reviews)
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium capitalize">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="text-4xl font-bold text-blue-600 mb-6">${product.price}</div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.description}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-semibold text-gray-800">{product.stock} {product.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold text-gray-800 capitalize">{product.category}</span>
                </div>
                {product.rating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      ⭐ {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                </button>
                
                {product.stock < 10 && product.stock > 0 && (
                  <div className="text-center text-orange-600 text-sm">
                    ⚠️ Only {product.stock} left in stock!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        {product.rating > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">⭐</div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{product.rating}</div>
                <div className="text-gray-600">Based on {product.reviewCount} reviews</div>
              </div>
            </div>
            <div className="text-gray-600">
              This product has received positive feedback from customers. 
              The rating of {product.rating} stars indicates high customer satisfaction.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
