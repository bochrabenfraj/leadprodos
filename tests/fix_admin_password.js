const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// Same hash function as C# backend
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 20, 'sha256');
  const hashWithSalt = Buffer.concat([salt, hash]);
  return hashWithSalt.toString('base64');
}

(async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    const newPassword = 'Admin@123';
    const hashedPassword = hashPassword(newPassword);
    
    const result = await db.collection('Users').updateOne(
      { Email: 'admin@leadprodos.com' },
      { $set: { PasswordHash: hashedPassword, UpdatedAt: new Date() } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Mot de passe admin réinitialisé avec succès!');
      console.log('   Email: admin@leadprodos.com');
      console.log('   Password: Admin@123');
    } else {
      console.log('⚠️  Aucun utilisateur trouvé');
    }
  } finally {
    await client.close();
  }
})();
