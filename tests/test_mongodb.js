const { MongoClient } = require('mongodb');

async function test() {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    console.log('Collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(c => console.log(`  - ${c.name}`));
    
    console.log('\nProducts:');
    const products = await db.collection('Products').find({}).limit(3).toArray();
    const productCount = await db.collection('Products').countDocuments();
    console.log(`  Count: ${productCount}`);
    products.forEach(p => console.log(`    - ${p.Name}`));
    
    console.log('\nClients:');
    const clients = await db.collection('Clients').find({}).limit(3).toArray();
    const clientCount = await db.collection('Clients').countDocuments();
    console.log(`  Count: ${clientCount}`);
    clients.forEach(c => console.log(`    - ${c.Name}`));
  } finally {
    await client.close();
  }
}

test().catch(console.error);
