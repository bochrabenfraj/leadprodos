# 🤖 Microservice IA - LeadProdos.ia

## Vue d'ensemble

Microservice Flask spécialisé dans l'identification et la classification des prospects via :
- **KMeans** : Regroupement des prospects par similarité
- **KNN** : Prédiction du produit adapté
- **Scoring** : Calcul du score de pertinence

### Fonctionnalités

✅ **Clustering KMeans**
- Regroupe les prospects par profil similaire
- 5 clusters par défaut (configurable)

✅ **Prédiction KNN**
- Recommande le produit adapté basé sur les k-voisins
- 3 voisins par défaut (configurable)

✅ **Scoring Pertinence**
- Score 0-1 combinant confiance KNN et proximité au centroid
- Pondération : 60% KNN, 40% Distance

✅ **API REST**
- Route POST `/predict` pour prédictions uniques
- Route POST `/batch-predict` pour prédictions massives
- Routes `/train`, `/health`, `/stats` pour gestion

---

## Installation

### 1. Prérequis
- Python 3.8+
- pip ou conda

### 2. Créer un environnement virtuel
```bash
cd ai-service

# Option 1: avec venv
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Option 2: avec conda
conda create -n lead-ai python=3.8
conda activate lead-ai
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 4. Configuration
```bash
cp .env.example .env
# Modifier .env selon vos besoins
```

---

## Démarrage du service

### Mode développement
```bash
export FLASK_ENV=development  # Linux/Mac
set FLASK_ENV=development     # Windows

python app.py
# Service disponible sur http://localhost:5001
```

### Mode production
```bash
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

---

## Architecture

```
ai-service/
├── app.py                 # Application Flask principale
├── config.py              # Configuration (KMeans, KNN, scoring)
├── models.py              # Modèles de données (Prospect, Product, etc.)
├── clustering.py          # Service KMeans
├── prediction.py          # Service KNN
├── scoring.py             # Service de scoring
├── training_data.py       # Données d'entraînement de démo
├── test_service.py        # Script de test
├── requirements.txt       # Dépendances Python
├── .env.example           # Template configuration
└── README.md              # Cette documentation
```

---

## API Endpoints

### 1. Health Check
```bash
GET /health
```
**Réponse:**
```json
{
  "status": "healthy",
  "service": "AI Service - KMeans & KNN",
  "clustering_trained": true,
  "prediction_trained": true
}
```

### 2. Entraîner les modèles
```bash
POST /train
```
**Body:**
```json
{
  "prospects": [
    {
      "id": "p1",
      "name": "Prospect A",
      "features": [0.5, 0.3, 0.8, 0.4, 0.6]
    }
  ],
  "products": [
    {
      "id": "prod1",
      "name": "Product A",
      "features": [0.4, 0.2, 0.7, 0.3, 0.5],
      "category": "SaaS",
      "price": 99.99
    }
  ],
  "product_assignments": [0, 0, 1, 1, 0]
}
```

**Réponse (200):**
```json
{
  "status": "success",
  "message": "Models trained successfully",
  "clusters": 5,
  "prospects_trained": 18,
  "products_loaded": 5,
  "knn_accuracy": 0.9444
}
```

### 3. Prédiction unique
```bash
POST /predict
```
**Body:**
```json
{
  "prospect_id": "new_p1",
  "prospect_name": "New Company XYZ",
  "features": [0.55, 0.65, 0.6, 0.5, 0.65],
  "return_similar": true
}
```

**Réponse (200):**
```json
{
  "prospect_id": "new_p1",
  "prospect_name": "New Company XYZ",
  "cluster": 1,
  "suggested_product": {
    "id": "prod_pro",
    "name": "Pro Plan"
  },
  "relevance_score": 0.782,
  "confidence": 0.856,
  "similar_prospects": [
    {"id": "p5", "name": "Medium Corp A"},
    {"id": "p6", "name": "Medium Corp B"}
  ]
}
```

### 4. Prédictions batch
```bash
POST /batch-predict
```
**Body:**
```json
{
  "prospects": [
    {
      "prospect_id": "batch_p1",
      "prospect_name": "Batch 1",
      "features": [0.3, 0.35, 0.4, 0.45, 0.35]
    },
    {
      "prospect_id": "batch_p2",
      "prospect_name": "Batch 2",
      "features": [0.85, 0.9, 0.88, 0.6, 0.9]
    }
  ]
}
```

**Réponse (200):**
```json
{
  "status": "success",
  "predictions": [
    {
      "prospect_id": "batch_p1",
      "prospect_name": "Batch 1",
      "cluster": 0,
      "suggested_product": {"id": "prod_basic", "name": "Basic Plan"},
      "relevance_score": 0.65,
      "confidence": 0.74
    },
    {
      "prospect_id": "batch_p2",
      "prospect_name": "Batch 2",
      "cluster": 2,
      "suggested_product": {"id": "prod_enterprise", "name": "Enterprise Plan"},
      "relevance_score": 0.92,
      "confidence": 0.95
    }
  ],
  "count": 2
}
```

### 5. Informations clusters
```bash
GET /cluster-info
```

**Réponse (200):**
```json
{
  "n_clusters": 5,
  "inertia": 8.456,
  "cluster_centers_shape": [5, 5],
  "models_trained": true
}
```

### 6. Statistiques
```bash
GET /stats
```

**Réponse (200):**
```json
{
  "n_clusters": 5,
  "n_neighbors": 3,
  "weights": "distance",
  "min_similarity": 0.5,
  "prospects_cached": 18,
  "products_loaded": 5,
  "clustering_trained": true,
  "prediction_trained": true
}
```

---

## Script de test

### Tester le service
```bash
# Avec l'API par défaut (localhost:5001)
python test_service.py

# Avec une API personnalisée
python test_service.py http://api.example.com:5001
```

Le script teste :
- ✅ Entraînement des modèles
- ✅ Prédiction unique
- ✅ Prédiction batch
- ✅ Statistiques du service

---

## Configuration

### Paramètres clés (.env)

```env
# Flask
FLASK_ENV=development
FLASK_PORT=5001

# KMeans
N_CLUSTERS=5              # Nombre de clusters

# KNN
N_NEIGHBORS=3             # Nombre de voisins

# Scoring
MIN_SIMILARITY_SCORE=0.5  # Score minimum acceptable
```

### Tuning des paramètres

**N_CLUSTERS**: Détermine le nombre de segments de prospects
- 3-5 : Segments larges
- 5-10 : Segments moyens
- 10+ : Segments fins

**N_NEIGHBORS**: Nombre de voisins pour KNN
- 3 : Rapide, sensible aux anomalies
- 5-7 : Équilibré (recommandé)
- 10+ : Lissé, moins sensible

---

## Modèles de données

### Prospect
```python
{
  "id": "p1",
  "name": "Company Name",
  "features": [0.5, 0.3, 0.8, 0.4, 0.6],  # 5+ dimensions numériques
  "metadata": {}  # Données optionnelles
}
```

### Product
```python
{
  "id": "prod1",
  "name": "Product Name",
  "features": [0.4, 0.2, 0.7, 0.3, 0.5],
  "category": "SaaS",
  "price": 99.99
}
```

### Features recommandées
- Budget (0-1)
- Taille de l'entreprise (0-1)
- Engagement (0-1)
- Innovation (0-1)
- Secteur d'activité (0-1)

---

## Algorithmes

### KMeans
- **Objectif** : Grouper prospects par similarité
- **Initialisation** : k-means++ (10 essais)
- **Distance** : Euclidienne (après normalisation StandardScaler)
- **Itérations max** : 300
- **Convergence** : Inertie minimale

### KNN
- **Objectif** : Prédire le produit adapté
- **Distance** : Euclidienne
- **Poids** : Distance (plus proche = plus d'influence)
- **k** : 3 par défaut (configurable)

### Scoring
```
Score = 0.6 * KNN_Confidence + 0.4 * Centroid_Proximity
       où Centroid_Proximity = 1 / (1 + distance_normalisée)
```

---

## Intégration avec le backend

### Exemple C# (.NET)
```csharp
using HttpClient client = new HttpClient();

var requestBody = new
{
    prospect_id = "p1",
    prospect_name = "Company A",
    features = new[] { 0.5, 0.3, 0.8, 0.4, 0.6 },
    return_similar = true
};

var response = await client.PostAsJsonAsync(
    "http://localhost:5001/predict",
    requestBody
);

var result = await response.Content.ReadAsAsync<dynamic>();
Console.WriteLine($"Produit: {result.suggested_product.name}");
Console.WriteLine($"Score: {result.relevance_score:P}");
```

### Exemple JavaScript/React
```javascript
const prediction = await fetch('http://localhost:5001/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prospect_id: 'p1',
    prospect_name: 'Company A',
    features: [0.5, 0.3, 0.8, 0.4, 0.6],
    return_similar: true
  })
});

const result = await prediction.json();
console.log(`Produit: ${result.suggested_product.name}`);
console.log(`Score: ${(result.relevance_score * 100).toFixed(1)}%`);
```

---

## Debugging

### Logs détaillés
```bash
export FLASK_ENV=development
python app.py 2>&1 | tee logs.txt
```

### Vérifier les modèles
```bash
python -c "
import joblib
kmeans = joblib.load('models/kmeans_model.pkl')
print(f'Clusters: {kmeans.n_clusters}')
print(f'Inertia: {kmeans.inertia_}')
"
```

### Tests unitaires
```bash
pytest tests/ -v
```

---

## Performance

### Benchmark (18 prospects, 5 clusters, k=3)
- Entraînement : ~50ms
- Prédiction unique : ~5ms
- Prédiction batch (100) : ~100ms
- Utilisation mémoire : ~50MB

---

## Dépannage

**Erreur: "Models not trained yet"**
→ Appelez POST `/train` d'abord

**Erreur: "Missing features in request"**
→ Vérifiez que le body contient la clé "features"

**Score de pertinence très bas**
→ Vérifier que les features sont normalisées (0-1)
→ Augmenter MIN_SIMILARITY_SCORE dans .env

**Prédictions incohérentes**
→ Réentraîner les modèles avec plus de données
→ Augmenter N_NEIGHBORS
→ Vérifier la qualité des features

---

## Sprint 3 Détails

✅ **3.1** - Identifier clients potentiels par produit via IA
- Route POST `/predict` avec retour du cluster et produit suggéré

✅ **3.2** - Visualiser le score de pertinence par prospect
- Field `relevance_score` (0-1) pour chaque prédiction
- Catégorisation automatique (excellent/bon/moyen/faible)

✅ **3.3** - Analyser les signaux d'intérêt (mots-clés)
- Features incluent l'engagement, l'innovation
- Similar prospects returned pour analyse de patterns

---

## Licence

MIT

## Support

Pour toute question ou problème :
1. Vérifiez le statut du service : `GET /health`
2. Consultez les logs : `docker logs ai-service`
3. Entraînez à nouveau les modèles : `POST /train`

---

**Dernière mise à jour**: Avril 2026
**Version**: 1.0.0
