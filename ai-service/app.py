from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
from typing import List, Dict, Any
import logging

from config import Config, config
from models import Prospect, Product, PredictionResult, TrainingData
from clustering import ClusteringService
from prediction import PredictionService
from scoring import ScoringService

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialiser Flask
app = Flask(__name__)
CORS(app)

# Charger la configuration
env = os.getenv('FLASK_ENV', 'development')
app.config.from_object(config[env])

# Services globaux
clustering_service = None
prediction_service = None
products_map = {}  # ID -> Product
prospects_cache = {}  # ID -> Prospect

def initialize_models():
    """Initialiser les modèles"""
    global clustering_service, prediction_service, products_map, prospects_cache
    
    clustering_service = ClusteringService(
        n_clusters=app.config['N_CLUSTERS'],
        random_state=app.config['KMEANS_RANDOM_STATE']
    )
    
    prediction_service = PredictionService(
        n_neighbors=app.config['N_NEIGHBORS'],
        weights=app.config['KNN_WEIGHTS']
    )
    
    logger.info(f"Modèles initialisés - Clusters: {app.config['N_CLUSTERS']}, "
                f"K-Neighbors: {app.config['N_NEIGHBORS']}")

@app.route('/health', methods=['GET'])
def health_check():
    """Vérifier la santé du service"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Service - KMeans & KNN',
        'clustering_trained': clustering_service.is_fitted if clustering_service else False,
        'prediction_trained': prediction_service.is_fitted if prediction_service else False
    }), 200

@app.route('/train', methods=['POST'])
def train_models():
    """
    Entraîner les modèles KMeans et KNN
    
    Expected JSON:
    {
        "prospects": [
            {"id": "p1", "name": "Prospect 1", "features": [0.5, 0.3, 0.8, ...]},
            ...
        ],
        "products": [
            {"id": "prod1", "name": "Product 1", "features": [0.4, 0.2, 0.7, ...]},
            ...
        ],
        "product_assignments": [0, 1, 0, 1, ...]  // product_id pour chaque prospect
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'prospects' not in data or 'products' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Charger les prospects
        prospects = []
        for p in data['prospects']:
            prospect = Prospect(
                id=p['id'],
                name=p['name'],
                features=p['features']
            )
            prospects.append(prospect)
            prospects_cache[p['id']] = prospect
        
        # Charger les produits
        products = []
        for prod in data['products']:
            product = Product(
                id=prod['id'],
                name=prod['name'],
                features=prod['features'],
                category=prod.get('category', ''),
                price=prod.get('price', 0.0)
            )
            products.append(product)
            products_map[prod['id']] = product
        
        # Features pour l'entraînement
        X = np.array([p.features for p in prospects])
        
        # Entraîner KMeans
        clusters = clustering_service.train(X)
        
        # Entraîner KNN
        if 'product_assignments' in data:
            y = np.array(data['product_assignments'])
        else:
            # Par défaut, utiliser les clusters comme labels
            y = clusters
        
        prediction_service.train(X, y)
        
        # Sauvegarder les modèles
        model_path = app.config['MODEL_PATH']
        clustering_service.save_model(model_path)
        prediction_service.save_model(model_path)
        
        logger.info(f"Modèles entraînés avec {len(prospects)} prospects et {len(products)} produits")
        
        return jsonify({
            'status': 'success',
            'message': 'Models trained successfully',
            'clusters': int(np.max(clusters) + 1),
            'prospects_trained': len(prospects),
            'products_loaded': len(products),
            'knn_accuracy': float(prediction_service.score(X, y))
        }), 200
    
    except Exception as e:
        logger.error(f"Erreur lors de l'entraînement: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """
    Prédire le cluster, le produit et le score pour un prospect
    
    Expected JSON:
    {
        "prospect_id": "p1",
        "prospect_name": "Prospect Name",
        "features": [0.5, 0.3, 0.8, ...],
        "return_similar": true  // optionnel, retourner les prospects similaires
    }
    """
    try:
        if not clustering_service or not clustering_service.is_fitted:
            return jsonify({'error': 'Models not trained yet. Please train first.'}), 400
        
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'Missing features in request'}), 400
        
        prospect_id = data.get('prospect_id', 'unknown')
        prospect_name = data.get('prospect_name', 'Unknown')
        features = np.array([data['features']])
        return_similar = data.get('return_similar', False)
        
        # Prédire le cluster
        clusters, distances = clustering_service.predict(features)
        cluster = int(clusters[0])
        distance_to_centroid = float(distances[0][cluster])
        
        # Prédire le produit
        product_pred, confidence = prediction_service.predict(features)
        product_id = product_pred[0]
        knn_confidence = float(confidence[0])
        
        # Obtenir le produit
        product = products_map.get(product_id)
        if not product:
            return jsonify({'error': f'Product {product_id} not found'}), 404
        
        # Calculer le score de pertinence
        max_distance = np.max(distances) if len(distances) > 0 else 1.0
        relevance_score = ScoringService.calculate_relevance_score(
            knn_confidence=knn_confidence,
            distance_to_centroid=distance_to_centroid,
            max_distance=max_distance,
            min_similarity=app.config['MIN_SIMILARITY_SCORE'],
            max_similarity=app.config['MAX_SIMILARITY_SCORE']
        )
        
        # Construire le résultat
        result = PredictionResult(
            prospect_id=prospect_id,
            prospect_name=prospect_name,
            cluster=cluster,
            suggested_product_id=product_id,
            suggested_product_name=product.name,
            relevance_score=relevance_score,
            confidence=knn_confidence
        )
        
        # Optionnel: ajouter les prospects similaires
        if return_similar:
            # Trouver les prospects similaires dans le même cluster
            all_prospects = list(prospects_cache.values())
            if all_prospects:
                all_X = np.array([p.features for p in all_prospects])
                all_clusters, _ = clustering_service.predict(all_X)
                
                similar_indices = np.where(all_clusters == cluster)[0]
                similar = []
                for idx in similar_indices[:5]:  # Top 5
                    similar.append({
                        'id': all_prospects[idx].id,
                        'name': all_prospects[idx].name
                    })
                result.similar_prospects = similar
        
        logger.info(f"Prédiction pour {prospect_name} - Cluster {cluster}, "
                   f"Produit {product.name}, Score {relevance_score:.2f}")
        
        return jsonify(result.to_dict()), 200
    
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Prédire pour plusieurs prospects
    
    Expected JSON:
    {
        "prospects": [
            {"prospect_id": "p1", "prospect_name": "Name 1", "features": [...]},
            ...
        ]
    }
    """
    try:
        if not clustering_service or not clustering_service.is_fitted:
            return jsonify({'error': 'Models not trained yet.'}), 400
        
        data = request.get_json()
        
        if not data or 'prospects' not in data:
            return jsonify({'error': 'Missing prospects array'}), 400
        
        results = []
        
        for prospect_data in data['prospects']:
            # Créer une requête pour /predict
            result = predict()
            
            # Utiliser le service de prédiction directement
            request.json = prospect_data
            
            try:
                features = np.array([prospect_data['features']])
                clusters, distances = clustering_service.predict(features)
                cluster = int(clusters[0])
                
                product_pred, confidence = prediction_service.predict(features)
                product_id = product_pred[0]
                
                product = products_map.get(product_id)
                if product:
                    max_distance = np.max(distances) if len(distances) > 0 else 1.0
                    relevance_score = ScoringService.calculate_relevance_score(
                        knn_confidence=float(confidence[0]),
                        distance_to_centroid=float(distances[0][cluster]),
                        max_distance=max_distance
                    )
                    
                    result_dict = {
                        'prospect_id': prospect_data.get('prospect_id', 'unknown'),
                        'prospect_name': prospect_data.get('prospect_name', 'Unknown'),
                        'cluster': cluster,
                        'suggested_product': {
                            'id': product_id,
                            'name': product.name
                        },
                        'relevance_score': relevance_score,
                        'confidence': float(confidence[0])
                    }
                    results.append(result_dict)
            except Exception as e:
                logger.error(f"Erreur prédiction batch: {str(e)}")
                continue
        
        return jsonify({
            'status': 'success',
            'predictions': results,
            'count': len(results)
        }), 200
    
    except Exception as e:
        logger.error(f"Erreur batch predict: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/cluster-info', methods=['GET'])
def cluster_info():
    """Obtenir les informations sur les clusters"""
    try:
        if not clustering_service or not clustering_service.is_fitted:
            return jsonify({'error': 'Models not trained'}), 400
        
        centers = clustering_service.get_cluster_centers()
        inertia = clustering_service.get_inertia()
        
        return jsonify({
            'n_clusters': clustering_service.n_clusters,
            'inertia': float(inertia) if inertia is not None else None,
            'cluster_centers_shape': [int(s) for s in centers.shape] if centers is not None else None,
            'models_trained': True
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['GET'])
def stats():
    """Obtenir les statistiques du service"""
    return jsonify({
        'n_clusters': app.config['N_CLUSTERS'],
        'n_neighbors': app.config['N_NEIGHBORS'],
        'weights': app.config['KNN_WEIGHTS'],
        'min_similarity': app.config['MIN_SIMILARITY_SCORE'],
        'prospects_cached': len(prospects_cache),
        'products_loaded': len(products_map),
        'clustering_trained': clustering_service.is_fitted if clustering_service else False,
        'prediction_trained': prediction_service.is_fitted if prediction_service else False
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialiser les modèles
    initialize_models()
    
    # Lancer l'app
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('FLASK_PORT', 5001)),
        debug=debug_mode
    )
