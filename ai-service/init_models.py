#!/usr/bin/env python3
"""
Script d'initialisation des modèles IA
Entraîne les modèles KMeans et KNN avec des données synthétiques
À exécuter une fois pour initialiser le service
"""

import requests
import numpy as np
import json
import time
import sys

# Configuration
FLASK_URL = "http://localhost:5001"
PROSPECTS_COUNT = 50  # Nombre de prospects synthétiques
PRODUCTS_COUNT = 5    # Nombre de produits
FEATURES_DIM = 5      # Dimension des features

def generate_synthetic_prospects(count=50):
    """Générer des prospects synthétiques pour l'entraînement"""
    prospects = []
    np.random.seed(42)
    
    for i in range(count):
        prospect = {
            "id": f"prospect_{i+1}",
            "name": f"Prospect {i+1}",
            "features": [
                np.random.uniform(50, 1000),      # Budget
                np.random.uniform(0, 1),          # Taux conversion
                np.random.uniform(0, 1),          # Engagement
                np.random.uniform(0, 5),          # Nb contacts
                np.random.uniform(0, 1)           # Score confiance
            ]
        }
        prospects.append(prospect)
    
    return prospects

def generate_synthetic_products(count=5):
    """Générer des produits synthétiques pour l'entraînement"""
    products = []
    categories = ["SaaS", "Enterprise", "SMB", "Startup", "Growth"]
    
    for i in range(count):
        product = {
            "id": f"product_{i+1}",
            "name": f"Produit {i+1}",
            "category": categories[i % len(categories)],
            "price": 999.99 + (i * 500),
            "features": [
                np.random.uniform(50, 1000),      # Budget cible
                np.random.uniform(0, 1),          # Complexité
                np.random.uniform(0, 1),          # Support level
                np.random.uniform(0, 5),          # Onboarding
                np.random.uniform(0, 1)           # Feature richness
            ]
        }
        products.append(product)
    
    return products

def train_models():
    """Entraîner les modèles via le endpoint /train"""
    print("\n" + "="*60)
    print("🤖 INITIALISATION DES MODÈLES IA")
    print("="*60)
    
    # Générer données synthétiques
    print("\n📊 Génération des données synthétiques...")
    prospects = generate_synthetic_prospects(PROSPECTS_COUNT)
    products = generate_synthetic_products(PRODUCTS_COUNT)
    
    print(f"  ✓ {len(prospects)} prospects générés")
    print(f"  ✓ {len(products)} produits générés")
    
    # Créer les assignments (produit pour chaque prospect)
    product_assignments = np.random.randint(0, PRODUCTS_COUNT, PROSPECTS_COUNT).tolist()
    
    # Préparer la requête
    request_data = {
        "prospects": prospects,
        "products": products,
        "product_assignments": product_assignments
    }
    
    # Appeler le endpoint /train
    print("\n📚 Entraînement des modèles (KMeans + KNN)...")
    
    try:
        response = requests.post(
            f"{FLASK_URL}/train",
            json=request_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"  ✓ Modèles entraînés avec succès!")
            print(f"    - Clusters créés: {result.get('clusters', 'N/A')}")
            print(f"    - Prospects: {result.get('prospects_trained', 'N/A')}")
            print(f"    - Produits: {result.get('products_loaded', 'N/A')}")
            print(f"    - Accuracy KNN: {result.get('knn_accuracy', 0):.2%}")
            return True
        else:
            print(f"  ✗ Erreur d'entraînement: {response.status_code}")
            print(f"    Réponse: {response.text}")
            return False
    
    except requests.exceptions.ConnectionError:
        print(f"  ✗ Impossible de se connecter à {FLASK_URL}")
        print("    Assurez-vous que le service Flask est démarré:")
        print("    cd ai-service && python -m flask run --port 5001")
        return False
    
    except Exception as e:
        print(f"  ✗ Erreur: {str(e)}")
        return False

def check_health():
    """Vérifier la santé du service"""
    print("\n🏥 Vérification du service Flask...")
    
    try:
        response = requests.get(f"{FLASK_URL}/health", timeout=5)
        
        if response.status_code == 200:
            health = response.json()
            print("  ✓ Service actif!")
            print(f"    - KMeans entraîné: {health.get('clustering_trained', False)}")
            print(f"    - KNN entraîné: {health.get('prediction_trained', False)}")
            return health
        else:
            print(f"  ✗ Service non disponible ({response.status_code})")
            return None
    
    except requests.exceptions.ConnectionError:
        print(f"  ✗ Impossible de se connecter à {FLASK_URL}")
        return None
    except Exception as e:
        print(f"  ✗ Erreur: {str(e)}")
        return None

def test_analysis():
    """Tester l'analyse IA avec un produit"""
    print("\n🧪 Test d'analyse IA...")
    
    # Créer des clients de test
    test_clients = [
        {
            "id": "test_client_1",
            "name": "Test Client 1",
            "email": "test1@example.com",
            "features": [500, 0.8, 0.7, 3, 0.9],
            "social_media_text": "Cloud computing machine learning big data"
        },
        {
            "id": "test_client_2",
            "name": "Test Client 2",
            "email": "test2@example.com",
            "features": [800, 0.6, 0.5, 2, 0.7],
            "social_media_text": "SaaS enterprise solutions business growth"
        }
    ]
    
    request_data = {
        "product_id": "product_1",
        "product_name": "Test Product",
        "clients": test_clients
    }
    
    try:
        response = requests.post(
            f"{FLASK_URL}/analyze-clients-for-product",
            json=request_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"  ✓ Analyse réussie!")
            print(f"    - Clients analysés: {result.get('total_analyzed', 0)}")
            
            clients = result.get('analyzed_clients', [])
            if clients:
                best_client = clients[0]
                print(f"    - Meilleur client: {best_client['name']}")
                print(f"      Score: {best_client['score']:.2%}")
                print(f"      Cluster: {best_client['cluster']}")
                print(f"      Mots-clés: {', '.join([k['keyword'] for k in best_client.get('keywords', [])])}")
            
            return True
        else:
            print(f"  ✗ Erreur d'analyse: {response.status_code}")
            print(f"    Réponse: {response.text}")
            return False
    
    except Exception as e:
        print(f"  ✗ Erreur: {str(e)}")
        return False

def main():
    """Flux principal d'initialisation"""
    print("\n" + "🚀 "*20)
    print("INITIALISATION DU SERVICE IA LeadProdos")
    print("🚀 "*20)
    
    # Vérifier la santé du service
    health = check_health()
    
    if not health:
        print("\n❌ Le service Flask n'est pas accessible.")
        print("\nDémarrez le service avec:")
        print("  cd ai-service")
        print("  python -m flask run --port 5001")
        return False
    
    # Si les modèles ne sont pas entraînés, les entraîner
    if not health.get('clustering_trained') or not health.get('prediction_trained'):
        print("\n⚠️  Les modèles ne sont pas entraînés.")
        
        if train_models():
            print("\n✅ Les modèles ont été entraînés avec succès!")
            time.sleep(1)
        else:
            print("\n❌ Échec de l'entraînement des modèles")
            return False
    else:
        print("\n✅ Les modèles sont déjà entraînés!")
    
    # Tester l'analyse
    if test_analysis():
        print("\n" + "="*60)
        print("✅ INITIALISATION COMPLÈTE!")
        print("="*60)
        print("\n✓ Le module IA est prêt à l'utilisation!")
        print("\nAccédez à l'analyse IA:")
        print("  1. Connectez-vous en tant que Commercial")
        print("  2. Cliquez sur Paramètres → 🤖 Analyse IA")
        print("  3. Sélectionnez un produit et analysez les clients")
        print("\n" + "="*60 + "\n")
        return True
    else:
        print("\n⚠️  Initialisation partielle (modèles OK, test échoué)")
        return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Initialisation interrompue par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Erreur inattendue: {str(e)}")
        sys.exit(1)
