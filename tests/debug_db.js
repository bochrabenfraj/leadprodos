const { MongoClient } = require('mongodb');

async function debugDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    console.log('\n====== DATABASE DEBUG ======\n');
    
    // Check Products
    const productsCollection = db.collection('Products');
    const productCount = await productsCollection.countDocuments();
    console.log(`📦 Products count: ${productCount}`);
    
    const sampleProduct = await productsCollection.findOne();
    if (sampleProduct) {
      console.log('Sample Product:');
      console.log(JSON.stringify(sampleProduct, null, 2).substring(0, 300));
    }
    
    // Check Clients
    const clientsCollection = db.collection('Clients');
    const clientCount = await clientsCollection.countDocuments();
    console.log(`\n👥 Clients count: ${clientCount}`);
    
    const sampleClient = await clientsCollection.findOne();
    if (sampleClient) {
      console.log('Sample Client:');
      console.log(JSON.stringify(sampleClient, null, 2).substring(0, 300));
    }
    
    // Check Users
    const usersCollection = db.collection('Users');
    const userCount = await usersCollection.countDocuments();
    console.log(`\n👤 Users count: ${userCount}`);
    
    const sampleUser = await usersCollection.findOne();
    if (sampleUser) {
      console.log('Sample User:');
      console.log(JSON.stringify(sampleUser, null, 2).substring(0, 300));
    }
    
    console.log('\n====== END DEBUG ======\n');
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await client.close();
  }
}

debugDatabase();
