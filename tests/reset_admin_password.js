const { MongoClient } = require('mongodb');
const crypto = require('crypto');

(async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    // Réinitialiser le mot de passe admin à Admin@123 (hash PBKDF2)
    const password = 'Admin@123';
    const salt = crypto.randomBytes(32);
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256');
    const passwordHash = salt.toString('hex') + ':' + hash.toString('hex');
    
    const result = await db.collection('Users').updateOne(
      { Email: 'admin@leadprodos.com' },
      { $set: { Password: passwordHash } }
    );
    
    console.log('✅ Mot de passe admin réinitialisé');
    console.log('   Email: admin@leadprodos.com');
    console.log('   Password: Admin@123');
  } finally {
    await client.close();
  }
})();
