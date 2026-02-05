const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// 1. Charger les variables d'environnement en premier lieu
dotenv.config();

// 2. Importer la connexion à la base de données après avoir chargé le .env
const connectDB = require("./config/db");

// 3. Initialiser Express
const app = express();

// 4. Connecter MongoDB
connectDB();

// 5. Middlewares
app.use(cors()); // Autorise les requêtes provenant du frontend
app.use(express.json()); // Indispensable pour lire le JSON envoyé par Postman

// 6. Définir les routes
// Cette ligne lie ton fichier routes/auth.js à l'URL http://localhost:5000/api/auth
app.use("/api/auth", require("./routes/auth"));

// Route de test pour vérifier que le serveur répond
app.get("/", (req, res) => {
  res.send("L'API LeadProdos tourne parfaitement !");
});

// 7. Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur lancé sur le port ${PORT}`);
});
