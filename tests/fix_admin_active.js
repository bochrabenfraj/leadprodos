const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    const result = await db.collection('Users').updateOne(
      { Email: 'admin@leadprodos.com' },
      { $set: { IsActive: true } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Admin compte activé!');
    } else {
      console.log('⚠️  Aucun changement');
    }
  } finally {
    await client.close();
  }
})();
