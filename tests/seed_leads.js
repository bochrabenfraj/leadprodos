const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'leadprodos';

async function seedLeads() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DATABASE_NAME);
    const leadsCollection = db.collection('Leads');

    // Clear existing leads
    await leadsCollection.deleteMany({});
    console.log('🗑️  Collection Leads vidée');

    // Create sample leads with IDs (proper casing for BSON mapping)
    const leads = [
      {
        clientId: new ObjectId().toString(),
        productId: new ObjectId().toString(),
        status: 'Prospect',
        matchScore: 85,
        analysisDetails: 'Client très intéressé par les solutions technologiques',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: new ObjectId().toString(),
        productId: new ObjectId().toString(),
        status: 'Contact',
        matchScore: 65,
        analysisDetails: 'Première prise de contact établie',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: new ObjectId().toString(),
        productId: new ObjectId().toString(),
        status: 'Qualified',
        matchScore: 95,
        analysisDetails: 'Lead qualifié, budget confirmé',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: new ObjectId().toString(),
        productId: new ObjectId().toString(),
        status: 'Converted',
        matchScore: 92,
        analysisDetails: 'Contrat signé avec succès',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: new ObjectId().toString(),
        productId: new ObjectId().toString(),
        status: 'Prospect',
        matchScore: 35,
        analysisDetails: 'Intérêt faible pour le moment',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: new ObjectId().toString(),
        productId: new ObjectId().toString(),
        status: 'Contact',
        matchScore: 75,
        analysisDetails: 'Réunion de présentation programmée',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: new ObjectId().toString(),
        productId: new ObjectId().toString(),
        status: 'Qualified',
        matchScore: 78,
        analysisDetails: 'Devis envoyé en attente de réponse',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    const result = await leadsCollection.insertMany(leads);
    console.log(`\n✅ ${result.insertedCount} leads créés:\n`);
    
    Object.entries(result.insertedIds).forEach(([index, id]) => {
      const statusEmoji = {
        'prospect': '🔍',
        'contact': '📞',
        'qualified': '✅',
        'converted': '🎉'
      };
      console.log(`${statusEmoji[leads[index].status.toLowerCase()]} ${leads[index].status.toUpperCase().padEnd(12)} - Score: ${leads[index].matchScore}% - ${leads[index].analysisDetails}`);
    });

    console.log('\n✅ Leads créés avec succès!');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('✅ Déconnecté de MongoDB');
  }
}

seedLeads();
