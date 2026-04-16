const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'leadprodos';

async function checkLeads() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DATABASE_NAME);
    const leadsCollection = db.collection('Leads');

    const count = await leadsCollection.countDocuments();
    console.log(`\n📊 Nombre de leads en base: ${count}`);

    if (count > 0) {
      const leads = await leadsCollection.find().limit(5).toArray();
      console.log('\n📋 Premiers leads:');
      leads.forEach((lead, i) => {
        console.log(`\n${i+1}. ID: ${lead._id}`);
        console.log(`   ClientId: ${lead.ClientId}`);
        console.log(`   ProductId: ${lead.ProductId}`);
        console.log(`   Status: ${lead.Status}`);
        console.log(`   MatchScore: ${lead.MatchScore}`);
      });
    } else {
      console.log('⚠️ Aucun lead en base! Exécutez seed_leads.js d\'abord.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

checkLeads();
