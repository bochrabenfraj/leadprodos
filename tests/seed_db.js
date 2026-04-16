const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');

// Hash password with PBKDF2 (same as C# implementation)
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 20, 'sha256');
  const hashWithSalt = Buffer.concat([salt, hash]);
  return hashWithSalt.toString('base64');
}

async function seedDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('LeadProdosDb');
    
    // Seed Admin User
    const usersCollection = db.collection('Users');
    const adminExists = await usersCollection.findOne({ Email: 'admin@leadprodos.com' });
    
    if (!adminExists) {
      const adminUser = {
        _id: new ObjectId(),
        Username: 'admin',
        Email: 'admin@leadprodos.com',
        PasswordHash: hashPassword('Admin@123'),
        Role: 'Admin',
        IsActive: true,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      };
      
      await usersCollection.insertOne(adminUser);
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@leadprodos.com');
      console.log('🔑 Password: Admin@123\n');
    } else {
      console.log('✅ Admin user already exists, skipping creation.\n');
    }
    
    // Seed Products
    const productsCollection = db.collection('Products');
    const productsCount = await productsCollection.countDocuments();
    
    if (productsCount === 0) {
      const products = [
        { _id: new ObjectId(), Name: "Laptop Dell XPS 13", Description: "Ultra-portable laptop with premium specifications", Price: 1299.99, Stock: 15, Category: "Électronique", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "iPhone 15 Pro", Description: "Latest Apple smartphone with advanced camera", Price: 999.99, Stock: 25, Category: "Smartphones", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Samsung 65\" 4K TV", Description: "4K Smart TV with HDR support", Price: 799.99, Stock: 8, Category: "Téléviseurs", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Sony WH-1000XM5 Headphones", Description: "Premium noise-cancelling wireless headphones", Price: 399.99, Stock: 30, Category: "Audio", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "iPad Air 11\"", Description: "High-performance tablet for professionals", Price: 599.99, Stock: 12, Category: "Tablettes", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "MacBook Pro 16\" M3", Description: "Powerful laptop for content creators and developers", Price: 2499.99, Stock: 10, Category: "Ordinateurs", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Google Pixel 8 Pro", Description: "Advanced smartphone with AI features", Price: 899.99, Stock: 20, Category: "Smartphones", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Apple Watch Series 9", Description: "Premium smartwatch with health monitoring", Price: 399.99, Stock: 35, Category: "Wearables", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "DJI Air 3S Drone", Description: "Professional drone for aerial photography", Price: 1099.99, Stock: 5, Category: "Drones", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "GoPro Hero 12", Description: "4K action camera with advanced stabilization", Price: 499.99, Stock: 18, Category: "Caméras", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Samsung Galaxy Tab S9", Description: "Premium Android tablet with stylus", Price: 799.99, Stock: 14, Category: "Tablettes", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Bose QuietComfort Ultra", Description: "Top-tier noise cancelling headphones", Price: 429.99, Stock: 22, Category: "Audio", CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "LG OLED 55\" TV", Description: "Ultra-thin 4K OLED display with perfect blacks", Price: 1499.99, Stock: 6, Category: "Téléviseurs", CreatedAt: new Date(), UpdatedAt: new Date() }
      ];
      
      await productsCollection.insertMany(products);
      console.log(`✅ ${products.length} products seeded successfully!`);
    } else {
      console.log(`✅ Products already exist (${productsCount}), skipping seed.`);
    }
    
    // Seed Clients
    const clientsCollection = db.collection('Clients');
    const clientsCount = await clientsCollection.countDocuments();
    
    if (clientsCount === 0) {
      const clients = [
        { _id: new ObjectId(), Name: "Ahmed Ben Ali", Email: "ahmed.benali@example.com", Phone: "+216 20 123 456", Company: "Tech Solutions Tunisia", SocialMediaProfiles: "LinkedIn: /in/ahmedbenali | Twitter: @ahmed_tech", InterestScore: 85, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Fatima Hammami", Email: "fatima.hammami@example.com", Phone: "+216 50 234 567", Company: "Digital Consulting Group", SocialMediaProfiles: "LinkedIn: /in/fatimahammami", InterestScore: 72, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Mohamed Chaouech", Email: "mohamed.chaouech@example.com", Phone: "+216 22 345 678", Company: "Business Innovations Ltd", SocialMediaProfiles: "LinkedIn: /in/mohamedchaouech", InterestScore: 65, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Leila Ghorbel", Email: "leila.ghorbel@example.com", Phone: "+216 95 456 789", Company: "Marketing Pro Agency", SocialMediaProfiles: "Facebook: /leilaghorbel | Instagram: @leila_pro", InterestScore: 88, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Karim Salah", Email: "karim.salah@example.com", Phone: "+216 28 567 890", Company: "E-Commerce Ventures", SocialMediaProfiles: "LinkedIn: /in/karimsalah", InterestScore: 55, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Hana Boudriga", Email: "hana.boudriga@example.com", Phone: "+216 52 678 901", Company: "Creative Studio North", SocialMediaProfiles: "Instagram: @hana_creative | Portfolio: www.hanacreative.com", InterestScore: 92, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Samir Mansouri", Email: "samir.mansouri@example.com", Phone: "+216 55 789 012", Company: "NextGen Software Inc", SocialMediaProfiles: "LinkedIn: /in/samirmansouri | GitHub: @samirdev", InterestScore: 78, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Nadia El Amri", Email: "nadia.elamri@example.com", Phone: "+216 25 890 123", Company: "Global Solutions Corp", SocialMediaProfiles: "LinkedIn: /in/nadiaelamri", InterestScore: 68, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Rania Jendoubi", Email: "rania.jendoubi@example.com", Phone: "+216 98 901 234", Company: "Future Tech Startups", SocialMediaProfiles: "Twitter: @rania_future | LinkedIn: /in/raniajendoubi", InterestScore: 89, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Adel Karray", Email: "adel.karray@example.com", Phone: "+216 30 012 345", Company: "Enterprise Solutions SARL", SocialMediaProfiles: "LinkedIn: /in/adelkarray", InterestScore: 60, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Layla Skhiri", Email: "layla.skhiri@example.com", Phone: "+216 92 123 456", Company: "Innovation Labs Tunisia", SocialMediaProfiles: "Instagram: @layla_innovation | LinkedIn: /in/laylaskhiri", InterestScore: 95, CreatedAt: new Date(), UpdatedAt: new Date() },
        { _id: new ObjectId(), Name: "Walid Belkhiria", Email: "walid.belkhiria@example.com", Phone: "+216 35 234 567", Company: "Digital Transformation Hub", SocialMediaProfiles: "LinkedIn: /in/walidbelkhiria", InterestScore: 72, CreatedAt: new Date(), UpdatedAt: new Date() }
      ];
      
      await clientsCollection.insertMany(clients);
      console.log(`✅ ${clients.length} clients seeded successfully!`);
    } else {
      console.log(`✅ Clients already exist (${clientsCount}), skipping seed.`);
    }
    
    console.log('\n✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
  } finally {
    await client.close();
  }
}

seedDatabase();
