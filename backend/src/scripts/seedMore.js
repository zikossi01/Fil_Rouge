const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env') });

const connectDB = require('../config/db');
const Product = require('../models/Product');
const { sampleProducts } = require('../controllers/seedController');

(async () => {
  try {
    await connectDB();
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
    console.log(JSON.stringify({ message: 'Upserted curated products', created, updated, total: sampleProducts.length }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
})();


