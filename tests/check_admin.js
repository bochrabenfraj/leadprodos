const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    const admin = await db.collection('Users').findOne({ Email: 'admin@leadprodos.com' });
    console.log('Admin User:');
    console.log(JSON.stringify(admin, null, 2));
  } finally {
    await client.close();
  }
})();
