const { MongoClient } = require('mongodb');

async function cleanupDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    const collections = ['Users', 'Products', 'Clients', 'Leads'];
    
    for (const collection of collections) {
      try {
        await db.collection(collection).deleteMany({});
        console.log(`✓ Collection '${collection}' cleaned`);
      } catch (e) {
        console.log(`⚠ Collection '${collection}' might not exist or error: ${e.message}`);
      }
    }
    
    console.log('\n✅ Database cleanup completed!');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
  } finally {
    await client.close();
  }
}

cleanupDatabase();
