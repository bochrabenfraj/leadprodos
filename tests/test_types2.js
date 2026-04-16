const { MongoClient, BSON } = require('mongodb');

async function test() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('LeadProdosDb');
        
        // Get first client as raw BsonDocument using bson library
        const first = await db.collection('Clients').findOne();
        console.log('First client keys:', Object.keys(first));
        console.log('CreatedAt type:', first.CreatedAt?.constructor?.name);
        console.log('CreatedAt ISO:', first.CreatedAt?.toISOString?.());
        console.log('ISOString:', first.CreatedAt);
    } finally {
        await client.close();
    }
}

test();
