const { MongoClient } = require('mongodb');

async function addProducts() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('LeadProdosDb');
        const collection = db.collection('Products');

        const newProducts = [
            // Cartes Électroniques
            {
                Name: 'Arduino Uno R3',
                Description: 'Open-source electronics platform based on easy-to-use hardware and software',
                Price: 25.99,
                Stock: 50,
                Category: 'Cartes Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Raspberry Pi 5 (8GB)',
                Description: 'Latest generation Raspberry Pi with enhanced performance',
                Price: 89.99,
                Stock: 30,
                Category: 'Cartes Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'ESP32 Development Board',
                Description: 'WiFi + Bluetooth dual-mode microcontroller with 240MHz processor',
                Price: 12.49,
                Stock: 75,
                Category: 'Cartes Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'STM32 Nucleo Board',
                Description: 'Professional development board based on STM32 microcontroller',
                Price: 15.99,
                Stock: 40,
                Category: 'Cartes Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            
            // Mini Robots
            {
                Name: 'DJI Tello Mini Drone',
                Description: 'Compact quadcopter with intelligent flight features',
                Price: 99.99,
                Stock: 20,
                Category: 'Mini Robots',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'LEGO Mindstorms Robot Kit',
                Description: 'Programmable robot building system with sensors',
                Price: 349.99,
                Stock: 15,
                Category: 'Mini Robots',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Sphero BOLT Robot',
                Description: 'App-enabled LED robot ball for programming and games',
                Price: 149.99,
                Stock: 25,
                Category: 'Mini Robots',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Anki Cozmo Robot',
                Description: 'Small AI-powered robot with expressive personality',
                Price: 179.99,
                Stock: 18,
                Category: 'Mini Robots',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },

            // Composants Électroniques
            {
                Name: 'Pack de 120 LED RGB 5mm',
                Description: 'Assorted RGB LEDs with resistors and diodes',
                Price: 8.99,
                Stock: 100,
                Category: 'Composants Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Capteur Ultrasons HC-SR04',
                Description: 'Distance measurement sensor with 4-pin interface',
                Price: 3.49,
                Stock: 60,
                Category: 'Composants Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Moteur Servo 9g Micro',
                Description: 'Compact servo motor for robotic applications',
                Price: 4.99,
                Stock: 80,
                Category: 'Composants Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Jumper Wire Pack (65 pcs)',
                Description: 'Assorted male-to-male, male-to-female, female-to-female wires',
                Price: 5.99,
                Stock: 120,
                Category: 'Composants Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },

            // Kits IoT & Projets
            {
                Name: 'Kit Maison Intelligente IoT',
                Description: 'Complete smart home starter kit with WiFi modules',
                Price: 79.99,
                Stock: 22,
                Category: 'Kits IoT',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Weather Station Kit',
                Description: 'DIY weather monitoring system with sensors',
                Price: 59.99,
                Stock: 18,
                Category: 'Kits IoT',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Robot Voiture 4WD',
                Description: 'Chassis 4-wheel drive compatible with Arduino/Raspberry',
                Price: 39.99,
                Stock: 35,
                Category: 'Kits IoT',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },

            // Outils et Accessoires
            {
                Name: 'Multimètre Numérique',
                Description: 'Digital multimeter with LCD display for voltage/current measurement',
                Price: 19.99,
                Stock: 45,
                Category: 'Outils Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Fer à Souder 60W',
                Description: 'Adjustable temperature soldering iron with stand',
                Price: 24.99,
                Stock: 30,
                Category: 'Outils Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Name: 'Kit Soudure Éclectronique',
                Description: 'Solder wire, flux, and suction pump bundle',
                Price: 12.99,
                Stock: 50,
                Category: 'Outils Électroniques',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            }
        ];

        const result = await collection.insertMany(newProducts);
        console.log(`✅ Added ${result.insertedIds.length} new products!`);
        
        // Show products by category
        const categories = await collection.aggregate([
            { $group: { _id: '$Category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();
        
        console.log('\n📊 Products by Category:');
        let totalProducts = 0;
        categories.forEach(cat => {
            console.log(`   • ${cat._id}: ${cat.count} products`);
            totalProducts += cat.count;
        });
        
        console.log(`\n📈 Total Products in Database: ${totalProducts}`);
        
    } finally {
        await client.close();
    }
}

addProducts().catch(console.error);
