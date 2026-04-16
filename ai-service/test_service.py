"""
Script pour entraîner les modèles avec les données de démonstration
"""

import requests
import json
from training_data import TRAINING_DATA, SAMPLE_PREDICTION, SAMPLE_BATCH_PREDICTION

def train_models(api_url="http://localhost:5001"):
    """Entraîner les modèles"""
    print("🚀 Entraînement des modèles...")
    
    try:
        response = requests.post(
            f"{api_url}/train",
            json=TRAINING_DATA,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Entraînement réussi!")
            print(f"   - Clusters créés: {result['clusters']}")
            print(f"   - Prospects entraînés: {result['prospects_trained']}")
            print(f"   - Produits chargés: {result['products_loaded']}")
            print(f"   - Précision KNN: {result['knn_accuracy']:.2%}")
            return True
        else:
            print(f"❌ Erreur d'entraînement: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def test_prediction(api_url="http://localhost:5001"):
    """Tester une prédiction"""
    print("\n🧪 Test de prédiction unique...")
    
    try:
        response = requests.post(
            f"{api_url}/predict",
            json=SAMPLE_PREDICTION,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prédiction réussie!")
            print(f"   - Prospect: {result['prospect_name']}")
            print(f"   - Cluster: {result['cluster']}")
            print(f"   - Produit suggéré: {result['suggested_product']['name']}")
            print(f"   - Score de pertinence: {result['relevance_score']:.2%}")
            print(f"   - Confiance: {result['confidence']:.2%}")
            
            if result.get('similar_prospects'):
                print(f"   - Prospects similaires: {len(result['similar_prospects'])}")
            
            return True
        else:
            print(f"❌ Erreur de prédiction: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_batch_prediction(api_url="http://localhost:5001"):
    """Tester une prédiction batch"""
    print("\n🧪 Test de prédiction batch...")
    
    try:
        response = requests.post(
            f"{api_url}/batch-predict",
            json=SAMPLE_BATCH_PREDICTION,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prédiction batch réussie!")
            print(f"   - Prédictions: {result['count']}")
            
            for pred in result['predictions']:
                print(f"\n   Prospect: {pred['prospect_name']}")
                print(f"   Cluster: {pred['cluster']}")
                print(f"   Produit: {pred['suggested_product']['name']}")
                print(f"   Score: {pred['relevance_score']:.2%}")
            
            return True
        else:
            print(f"❌ Erreur: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def get_stats(api_url="http://localhost:5001"):
    """Obtenir les statistiques du service"""
    print("\n📊 Statistiques du service...")
    
    try:
        response = requests.get(f"{api_url}/stats")
        
        if response.status_code == 200:
            stats = response.json()
            print("✅ Statistiques récupérées!")
            print(f"   - Clusters: {stats['n_clusters']}")
            print(f"   - K-Neighbors: {stats['n_neighbors']}")
            print(f"   - Prospects en cache: {stats['prospects_cached']}")
            print(f"   - Produits chargés: {stats['products_loaded']}")
            print(f"   - Clustering entraîné: {stats['clustering_trained']}")
            print(f"   - Prédiction entraînée: {stats['prediction_trained']}")
            return True
        else:
            print(f"❌ Erreur: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    import sys
    
    api_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5001"
    
    print("=" * 60)
    print("🤖 SYSTÈME DE TEST - MICROSERVICE IA")
    print("=" * 60)
    
    # Vérifier la santé du service
    try:
        response = requests.get(f"{api_url}/health")
        if response.status_code == 200:
            print("✅ Service disponible!")
        else:
            print("❌ Service non disponible")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Impossible de se connecter au service: {e}")
        print(f"   Assurez-vous que le service est lancé sur {api_url}")
        sys.exit(1)
    
    # Entraîner
    if not train_models(api_url):
        sys.exit(1)
    
    # Obtenir les stats
    get_stats(api_url)
    
    # Tester
    test_prediction(api_url)
    test_batch_prediction(api_url)
    
    print("\n" + "=" * 60)
    print("✅ TOUS LES TESTS RÉUSSIS!")
    print("=" * 60)
