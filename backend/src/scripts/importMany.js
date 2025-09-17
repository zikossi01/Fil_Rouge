const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env') });

const connectDB = require('../config/db');
const { importFromDummyJson, importFromOpenFoodFacts } = require('../controllers/seedController');


const run = async () => {
  await connectDB();

  const makeRes = (label) => ({
    status(code) { this.code = code; return this; },
    json(payload) { console.log(label, JSON.stringify(payload, null, 2)); }
  });

 
  await importFromDummyJson({ query: { limit: 100, pages: 10 } }, makeRes('DummyJSON:'));
  await importFromOpenFoodFacts({ query: { limit: 300 } }, makeRes('OpenFoodFacts:'));
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });



