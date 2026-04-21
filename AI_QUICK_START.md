# 🤖 Module IA LeadProdos - Démarrage Rapide

## 📋 Prérequis

- Python 3.8+
- Node.js 14+
- .NET 8.0+
- MongoDB

## 🚀 Démarrage en 5 minutes

### 1️⃣ Démarrer le service Flask

```bash
# Aller dans le dossier ai-service
cd ai-service

# Installer les dépendances (si première fois)
pip install -r requirements.txt

# Démarrer le service
python -m flask run --port 5001
```

**Vérifier** : http://localhost:5001/health

### 2️⃣ Initialiser les modèles IA

```bash
# Dans le même dossier ai-service
python init_models.py
```

Cela va :
- ✅ Générer 50 prospects synthétiques
- ✅ Créer 5 produits test
- ✅ Entraîner les modèles KMeans et KNN
- ✅ Tester l'analyse IA

### 3️⃣ Démarrer le backend .NET

```bash
cd backend

# Compiler
dotnet build

# Démarrer
dotnet run
```

**URL** : http://localhost:5000

### 4️⃣ Démarrer le frontend React

```bash
cd frontend

# Installer les dépendances (si première fois)
npm install

# Démarrer
npm run dev
```

**URL** : http://localhost:3000

## 📊 Accès à l'Analyse IA

1. **Connectez-vous** avec un compte Commercial
   - Email: `commercial1@leadprodos.com`
   - Password: `Password@123` (ou celui que vous avez défini)

2. **Cliquez** sur **Paramètres** (⚙️) → **🤖 Analyse IA**

3. **Sélectionnez** un produit et cliquez sur **🚀 Analyser les clients**

4. **Découvrez** les clients potentiels avec leurs scores et mots-clés !

## 📁 Structure du module IA

```
ai-service/
├── app.py                 ← Application Flask principale
├── tfidf_service.py       ← Module TF-IDF (extraction mots-clés)
├── clustering.py          ← Module KMeans
├── prediction.py          ← Module KNN
├── scoring.py             ← Calcul des scores
├── models.py              ← Modèles de données
├── config.py              ← Configuration
├── init_models.py         ← Script d'initialisation ⭐
├── requirements.txt       ← Dépendances Python
└── models/                ← Modèles sauvegardés
    ├── kmeans_model.pkl
    └── knn_model.pkl
```

## 🔌 Endpoints IA

### Flask (Port 5001)

| Route | Méthode | Description |
|-------|---------|-------------|
| `/health` | GET | Santé du service |
| `/train` | POST | Entraîner les modèles |
| `/predict` | POST | Prédire pour un prospect |
| `/analyze-clients-for-product` | POST | **Analyse complète pour un produit** |
| `/stats` | GET | Statistiques |

### .NET (Port 5000)

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/AIAnalysis/analyze-product-clients` | POST | Analyser les clients |
| `/api/AIAnalysis/health` | GET | Vérifier la connexion IA |

## 📝 Exemple d'utilisation

### Requête d'analyse

```bash
curl -X POST http://localhost:5000/api/AIAnalysis/analyze-product-clients \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod123",
    "product_name": "SaaS Premium",
    "clients": [
      {
        "id": "client1",
        "name": "Acme Corp",
        "email": "contact@acme.com",
        "features": [500, 0.8, 0.7, 3, 0.9],
        "social_media_text": "Cloud solutions for enterprises"
      }
    ]
  }'
```

### Réponse

```json
{
  "product_id": "prod123",
  "product_name": "SaaS Premium",
  "analyzed_clients": [
    {
      "id": "client1",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "score": 0.87,
      "cluster": 2,
      "keywords": [
        {"keyword": "cloud", "score": 0.92},
        {"keyword": "enterprise", "score": 0.85}
      ],
      "confidence": 0.91,
      "metadata": {}
    }
  ],
  "total_analyzed": 1
}
```

## 🎨 Interface React

### Sélection du produit
- Grille de produits à sélectionner
- Affiche nom, catégorie, prix

### Résultats d'analyse
- Cartes par client
- Score coloré : 🟢 (≥80%) 🟡 (60-79%) 🔴 (<60%)
- Cluster et confiance
- Mots-clés extraits (TF-IDF)
- 3 boutons d'action : 📞 Contacter, 👤 Profil, ✨ Créer Lead

## 🔧 Configuration

### Flask (ai-service/config.py)

```python
class DevelopmentConfig(Config):
    DEBUG = True
    N_CLUSTERS = 5              # Nombre de clusters KMeans
    N_NEIGHBORS = 3             # K pour KNN
    KNN_WEIGHTS = 'distance'    # Poids des voisins
```

### .NET (backend/appsettings.json)

```json
"AIService": {
  "Url": "http://localhost:5001"
}
```

## 📊 Types d'analyses

Le module analyse les clients selon :

1. **Clustering (KMeans)**
   - Regroupe les clients par profil similaire
   - 5 clusters par défaut
   - Normalisation StandardScaler

2. **Similarité (KNN)**
   - Finds 3 clients les plus similaires
   - Score de confiance basé sur la distance
   - Poids inverse de la distance

3. **Extraction de mots-clés (TF-IDF)**
   - Extrait les intérêts des clients
   - Top 5 mots-clés par score
   - N-grammes 1-2 mots

4. **Score final**
   - 60% : Confiance KNN
   - 40% : Proximité au centroid
   - Normalisé entre 0-1

## ⚠️ Troubleshooting

### "Service IA indisponible"
```bash
# Vérifier Flask
curl http://localhost:5001/health

# Redémarrer Flask
cd ai-service && python -m flask run --port 5001
```

### "Models not trained yet"
```bash
# Relancer l'initialisation
python init_models.py
```

### Erreur de connexion MongoDB
```bash
# Vérifier MongoDB
mongosh

# Vérifier la chaîne de connexion dans appsettings.json
```

### Port déjà en utilisation
```bash
# Flask sur 5001
python -m flask run --port 5002  # changer le port

# .NET sur 5000
dotnet run --urls "http://localhost:5010"  # changer le port

# React sur 3000
npm run dev -- --port 3001  # changer le port
```

## 🚀 Prochaines étapes

1. **Intégrer les vrais données** : Connecter les features des clients depuis MongoDB
2. **Modèles persistants** : Sauvegarder les modèles entraînés
3. **Dashboard ML** : Statistiques de clustering et performances
4. **Fine-tuning** : Ajuster N_CLUSTERS, N_NEIGHBORS selon les résultats
5. **API d'entraînement** : Permettre le réentraînement depuis le backend

## 📚 Documentation complète

Voir [IA_MODULE_GUIDE.md](../IA_MODULE_GUIDE.md) pour la documentation détaillée.

## 🤝 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs Flask et .NET
3. Testez les endpoints avec curl ou Postman

---

**Version** : 1.0  
**Date** : Avril 2024  
**Status** : ✅ Production Ready
