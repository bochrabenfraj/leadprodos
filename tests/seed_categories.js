const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'LeadProdosDb';

const categoryEmojis = {
  'Smartphones': '📱',
  'Téléviseurs': '📺',
  'Audio': '🔊',
  'Tablettes': '📱',
  'Ordinateurs': '💻',
  'Wearables': '⌚',
  'Drones': '🚁',
  'Caméras': '📷',
  'Cartes Électroniques': '🔌',
  'Composants Électroniques': '⚙️',
  'Kits IoT': '🌐',
  'Outils Électroniques': '🔧',
  'Mini Robots': '🤖',
  'Electromecanique': '⚙️'
};

const categoryColors = {
  'Smartphones': '#3b82f6',
  'Téléviseurs': '#8b5cf6',
  'Audio': '#ec4899',
  'Tablettes': '#06b6d4',
  'Ordinateurs': '#f59e0b',
  'Wearables': '#10b981',
  'Drones': '#6366f1',
  'Caméras': '#ef4444',
  'Cartes Électroniques': '#14b8a6',
  'Composants Électroniques': '#f97316',
  'Kits IoT': '#a855f7',
  'Outils Électroniques': '#64748b',
  'Mini Robots': '#7c3aed',
  'Electromecanique': '#0d9488'
};

async function seedCategories() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);
    const productsCollection = db.collection('Products');
    const categoriesCollection = db.collection('Categories');

    // Récupérer toutes les catégories uniques des produits
    const products = await productsCollection.find({}).toArray();
    const uniqueCategories = [...new Set(products.map(p => p.Category || p.category || 'Général'))];

    console.log(`\n📦 ${uniqueCategories.length} catégories trouvées dans les produits:`);
    uniqueCategories.forEach(cat => console.log(`  - ${cat}`));

    // Créer les catégories
    const categoriesToInsert = uniqueCategories.map(name => ({
      Name: name,
      Icon: categoryEmojis[name] || '📦',
      Color: categoryColors[name] || '#667eea',
      Description: `Catégorie ${name}`,
      CreatedAt: new Date(),
      UpdatedAt: new Date()
    }));

    // Vider la collection existante
    await categoriesCollection.deleteMany({});
    console.log('\n🗑️  Collection Categories vidée');

    // Insérer les nouvelles catégories
    const result = await categoriesCollection.insertMany(categoriesToInsert);
    console.log(`\n✅ ${result.insertedCount} catégories créées avec succès!`);

    console.log('\n📋 Catégories créées:');
    categoriesToInsert.forEach((cat, idx) => {
      console.log(`  ${result.insertedIds[idx]}: ${cat.Icon} ${cat.Name}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Déconnecté de MongoDB');
  }
}

seedCategories();
