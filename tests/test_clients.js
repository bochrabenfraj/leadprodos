const { MongoClient } = require('mongodb');

async function test() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('LeadProdosDb');
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        // Count clients
        const clientsCollection = db.collection('Clients');
        const count = await clientsCollection.countDocuments();
        console.log(`Found ${count} clients`);
        
        // Get first client
        const first = await clientsCollection.findOne();
        console.log('First client:', JSON.stringify(first, null, 2));
    } finally {
        await client.close();
    }
}

test();
