const { MongoClient } = require('mongodb');

async function test() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('LeadProdosDb');
        
        // Get first client with all types
        const first = await db.collection('Clients').findOne();
        console.log('First client raw:', JSON.stringify(first, null, 2));
        console.log('\nFie types:');
        for (const [key, value] of Object.entries(first)) {
            console.log(`${key}: ${typeof value} = ${JSON.stringify(value)}`);
        }
    } finally {
        await client.close();
    }
}

test();
