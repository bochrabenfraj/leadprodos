const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'LeadProdosDb';

async function seedLeadsWithClients() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB\n');

    const db = client.db(DATABASE_NAME);
    const clientsCollection = db.collection('Clients');
    const leadsCollection = db.collection('Leads');
    const productsCollection = db.collection('Products');

    // Get existing clients
    const clients = await clientsCollection.find({}).toArray();
    console.log(`📊 Clients trouvés: ${clients.length}`);

    // Get existing products
    const products = await productsCollection.find({}).toArray();
    console.log(`📦 Produits trouvés: ${products.length}\n`);

    if (clients.length === 0) {
      console.log('❌ Aucun client trouvé! Appelez seed_db.js ou seed_clients.js d\'abord');
      return;
    }

    if (products.length === 0) {
      console.log('⚠️  Aucun produit trouvé. Les leads seront créés avec des productIds aléatoires');
    }

    // Clear existing leads
    await leadsCollection.deleteMany({});
    console.log('🗑️  Collection Leads vidée\n');

    // Create leads linking clients to products
    const leads = [];
    const statuses = ['Prospect', 'Contact', 'Qualified', 'Converted'];
    const scores = [85, 65, 95, 92, 35, 75, 78];
    const descriptions = [
      'Client très intéressé par les solutions technologiques',
      'Première prise de contact établie',
      'Lead qualifié, budget confirmé',
      'Contrat signé avec succès',
      'Intérêt faible pour le moment',
      'Réunion de présentation programmée',
      'Devis envoyé en attente de réponse'
    ];

    // Create a lead for each client with different products/statuses
    clients.forEach((client, index) => {
      const product = products.length > 0 ? products[index % products.length] : new ObjectId();
      const productId = products.length > 0 ? product._id.toString() : new ObjectId().toString();
      
      leads.push({
        clientId: client._id.toString(),
        productId: productId,
        status: statuses[index % statuses.length],
        matchScore: scores[index % scores.length],
        analysisDetails: descriptions[index % descriptions.length],
        createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
        updatedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000))
      });
    });

    const result = await leadsCollection.insertMany(leads);
    console.log(`✅ ${result.insertedCount} leads créés:\n`);
    
    leads.forEach((lead, index) => {
      const statusEmoji = {
        'prospect': '🔍',
        'contact': '📞',
        'qualified': '✅',
        'converted': '🎉'
      };
      const emoji = statusEmoji[lead.status.toLowerCase()] || '❓';
      console.log(`${emoji} ${lead.status.padEnd(12)} - Score: ${lead.matchScore}% - Client: ${lead.clientId.substring(0, 8)}...`);
    });

    console.log('\n✅ Leads créés avec succès!');
    
    // Verify
    const count = await leadsCollection.countDocuments({});
    console.log(`\n📊 Total leads en BD: ${count}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
    console.log('✅ Déconnecté de MongoDB');
  }
}

seedLeadsWithClients();
