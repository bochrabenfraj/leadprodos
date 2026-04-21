# 🤖 Module IA - Guide Complet

## Vue d'ensemble

Le module IA analyse les clients potentiels pour chaque produit en utilisant :
- **KMeans** : Clustering des clients par profil
- **KNN** : Prédiction de similarité et compatibilité
- **TF-IDF** : Extraction de mots-clés des réseaux sociaux

## Architecture

```
Frontend (React)
    ↓
.NET API (AIAnalysisController)
    ↓
Flask Service (app.py)
    ├── clustering.py (KMeans)
    ├── prediction.py (KNN)
    ├── tfidf_service.py (TF-IDF)
    └── scoring.py (Scoring)
```

## Composants

### 1. **Service Flask** (`ai-service/`)

#### Modules IA

- **`clustering.py`** : Clustering KMeans
  - Normalisation des données avec StandardScaler
  - Entraînement sur les features des clients
  - Prédiction du cluster pour nouveaux clients

- **`prediction.py`** : Prédiction KNN
  - K-Nearest Neighbors avec poids de distance
  - Prédiction du produit recommandé
  - Score de confiance

- **`tfidf_service.py`** : Extraction de mots-clés
  - TF-IDF Vectorizer avec n-grammes (1,2)
  - Extraction des mots-clés pertinents
  - Similarité textuelle entre documents

- **`scoring.py`** : Calcul du score final
  - Combinaison KNN confidence (60%) + Centroid proximity (40%)
  - Score de pertinence normalisé (0-1)

#### Endpoints Flask

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Vérifier la santé du service |
| `/train` | POST | Entraîner les modèles |
| `/predict` | POST | Prédire pour un prospect |
| `/batch-predict` | POST | Prédire pour plusieurs prospects |
| `/analyze-clients-for-product` | POST | **Analyse complète pour un produit** |
| `/stats` | GET | Statistiques du service |

### 2. **API .NET** (`backend/Controllers/AIAnalysisController.cs`)

```csharp
POST /api/AIAnalysis/analyze-product-clients
```

**Authentification** : Commercial uniquement  
**Requête** : ProductId, ProductName, Clients[]  
**Réponse** : Clients analysés avec scores et mots-clés

### 3. **Interface React** (`frontend/src/pages/AIAnalysisPage.jsx`)

**Fonctionnalités** :
- ✅ Sélection du produit
- ✅ Affichage des clients analysés en cartes
- ✅ Score coloré (rouge/orange/vert)
- ✅ Mots-clés extraits
- ✅ Boutons : Contacter, Voir profil, Créer lead

**Route** : `/ai-analysis` (Commercial uniquement)

## Configuration

### 1. **appsettings.json**
```json
"AIService": {
  "Url": "http://localhost:5001"
}
```

### 2. **Variables d'environnement Flask**

```bash
# .env
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_PORT=5001
```

### 3. **config.py (Flask)**
```python
class Config:
    N_CLUSTERS = 5              # Nombre de clusters KMeans
    N_NEIGHBORS = 3             # K pour KNN
    KNN_WEIGHTS = 'distance'    # Poids KNN
    MIN_SIMILARITY_SCORE = 0.0
    MAX_SIMILARITY_SCORE = 1.0
    MODEL_PATH = 'models/'
```

## Démarrage et Entraînement

### Démarrer le service Flask

```bash
cd ai-service
python -m flask run --port 5001
```

### Vérifier la santé
```bash
curl http://localhost:5001/health
```

### Entraîner les modèles

Les modèles doivent être entraînés avant d'utiliser `/analyze-clients-for-product`.

**Exemple de requête** (à exécuter une fois) :

```bash
curl -X POST http://localhost:5001/train \
  -H "Content-Type: application/json" \
  -d '{
    "prospects": [
      {
        "id": "p1",
        "name": "Prospect 1",
        "features": [100.0, 0.8, 0.7, 2.0, 0.9]
      },
      ...
    ],
    "products": [
      {
        "id": "prod1",
        "name": "Product 1",
        "features": [80.0, 0.75, 0.65, 1.8, 0.85],
        "category": "SaaS",
        "price": 999.99
      },
      ...
    ],
    "product_assignments": [0, 1, 0, 1, ...]
  }'
```

## Flux d'utilisation

### 1. Commercial accède à `/ai-analysis`

Le lien est disponible dans **Paramètres → 🤖 Analyse IA** (menu header)

### 2. Sélectionne un produit

Liste des produits chargée depuis `/api/products`

### 3. Clique sur "Analyser les clients"

1. Récupère les clients depuis `/api/clients`
2. Génère les features pour chaque client
3. Appelle `/api/AIAnalysis/analyze-product-clients`
4. Flask traite avec KMeans, KNN, TF-IDF

### 4. Affichage des résultats

Cartes avec :
- **Score de pertinence** (0-100%, coloré)
- **Cluster** d'appartenance
- **Confiance** KNN
- **Mots-clés** extraits
- **Boutons d'action** : Contacter, Profil, Créer lead

## Calcul du score

```python
score = 0.6 * knn_confidence + 0.4 * centroid_proximity
```

**Couleurs** :
- 🟢 **Vert** : Score ≥ 80% (Excellent)
- 🟡 **Orange** : Score 60-79% (Bon)
- 🔴 **Rouge** : Score < 60% (À considérer)

## Mots-clés (TF-IDF)

Extraits du champ `social_media_text` de chaque client :
- Top 5 mots-clés par score TF-IDF
- Filtrage des stop-words français
- N-grammes (1 et 2 mots)

## Avantages

✅ **Prédictions basées sur ML** : Combine clustering et similarité  
✅ **Analyse textuelle** : Extrait les intérêts des clients  
✅ **Scoring intelligent** : Pondération multi-critères  
✅ **Interface intuitive** : Cartes colorées et actions rapides  
✅ **Scalable** : Architecture découplée (Flask + .NET)  

## Limitation et améliorations futures

⚠️ **Limitation actuelle** :
- Les features sont générées aléatoirement (mock data)

🚀 **Amélioration** :
- Intégrer les données réelles depuis MongoDB
- Ajouter des features calculées (budget, engagement, etc.)
- Modèles pré-entraînés sauvegardés
- Dashboard de statistiques ML

## Troubleshooting

### "Service IA indisponible"
```bash
# Vérifier Flask
curl http://localhost:5001/health

# Vérifier la configuration dans appsettings.json
```

### "Models not trained yet"
```bash
# Entraîner les modèles via le endpoint /train
```

### Score toujours à 0
- Vérifier que les features ne sont pas vides
- Vérifier que les clients sont bien fournis

## Architecture détaillée

```
AIAnalysisPage (React)
  ↓ POST /api/AIAnalysis/analyze-product-clients
AIAnalysisController (.NET)
  ↓ HttpClient.PostAsync(Flask Service)
Flask App /analyze-clients-for-product
  ├─ Récupère clients
  ├─ Exécute KMeans.predict()
  ├─ Exécute KNN.predict()
  ├─ Exécute TFIDFService.extract_keywords()
  ├─ Exécute ScoringService.calculate_relevance_score()
  └─ Retourne JSON avec résultats triés par score
  ↓
AIAnalysisController
  ↓ Retourne au Frontend
AIAnalysisPage
  └─ Affiche cartes avec score, cluster, keywords
```

## API Response Example

```json
{
  "product_id": "prod123",
  "product_name": "SaaS Premium",
  "analyzed_clients": [
    {
      "id": "client1",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "score": 0.92,
      "cluster": 2,
      "keywords": [
        {"keyword": "cloud", "score": 0.85},
        {"keyword": "saas", "score": 0.78}
      ],
      "confidence": 0.95,
      "metadata": {}
    },
    ...
  ],
  "total_analyzed": 42,
  "analysis_timestamp": "2024-04-21T10:30:00"
}
```
