"""
Données de démonstration pour entraîner les modèles KMeans et KNN
Simule des prospects avec différentes caractéristiques et produits adaptés
"""

TRAINING_DATA = {
    "prospects": [
        # Cluster 0: Petites entreprises, budget limité
        {"id": "p1", "name": "Small Business A", "features": [0.2, 0.3, 0.4, 0.5, 0.3]},
        {"id": "p2", "name": "Small Business B", "features": [0.25, 0.35, 0.45, 0.55, 0.25]},
        {"id": "p3", "name": "Small Business C", "features": [0.3, 0.25, 0.35, 0.45, 0.4]},
        {"id": "p4", "name": "Small Business D", "features": [0.2, 0.4, 0.3, 0.4, 0.35]},
        
        # Cluster 1: Entreprises moyennes, croissance stable
        {"id": "p5", "name": "Medium Corp A", "features": [0.5, 0.6, 0.55, 0.6, 0.65]},
        {"id": "p6", "name": "Medium Corp B", "features": [0.55, 0.65, 0.6, 0.55, 0.7]},
        {"id": "p7", "name": "Medium Corp C", "features": [0.6, 0.55, 0.65, 0.6, 0.6]},
        {"id": "p8", "name": "Medium Corp D", "features": [0.65, 0.6, 0.6, 0.65, 0.55]},
        
        # Cluster 2: Grandes entreprises, haute demande
        {"id": "p9", "name": "Large Enterprise A", "features": [0.85, 0.9, 0.88, 0.87, 0.92]},
        {"id": "p10", "name": "Large Enterprise B", "features": [0.9, 0.85, 0.9, 0.88, 0.9]},
        {"id": "p11", "name": "Large Enterprise C", "features": [0.88, 0.92, 0.85, 0.9, 0.88]},
        {"id": "p12", "name": "Large Enterprise D", "features": [0.92, 0.88, 0.92, 0.89, 0.85]},
        
        # Cluster 3: Startups, haute innovation
        {"id": "p13", "name": "Startup X", "features": [0.7, 0.75, 0.8, 0.3, 0.85]},
        {"id": "p14", "name": "Startup Y", "features": [0.75, 0.7, 0.85, 0.25, 0.8]},
        {"id": "p15", "name": "Startup Z", "features": [0.8, 0.8, 0.75, 0.35, 0.75]},
        
        # Cluster 4: Secteur public, besoins spécifiques
        {"id": "p16", "name": "Gov Dept A", "features": [0.4, 0.5, 0.6, 0.85, 0.5]},
        {"id": "p17", "name": "Gov Dept B", "features": [0.45, 0.55, 0.55, 0.9, 0.45]},
        {"id": "p18", "name": "Gov Dept C", "features": [0.5, 0.45, 0.65, 0.88, 0.55]},
    ],
    "products": [
        {"id": "prod_basic", "name": "Basic Plan", "features": [0.3, 0.4, 0.5, 0.3, 0.4], "category": "SaaS", "price": 99},
        {"id": "prod_pro", "name": "Pro Plan", "features": [0.6, 0.7, 0.65, 0.4, 0.7], "category": "SaaS", "price": 299},
        {"id": "prod_enterprise", "name": "Enterprise Plan", "features": [0.9, 0.9, 0.9, 0.5, 0.9], "category": "SaaS", "price": 999},
        {"id": "prod_innovation", "name": "Innovation Suite", "features": [0.8, 0.75, 0.85, 0.2, 0.8], "category": "Platform", "price": 499},
        {"id": "prod_gov", "name": "Government Solution", "features": [0.5, 0.6, 0.7, 0.9, 0.6], "category": "Public", "price": 1500},
    ],
    # Assignation des produits aux prospects (product_id pour chaque prospect)
    "product_assignments": [
        0, 0, 0, 0,  # Small business -> Basic Plan
        1, 1, 1, 1,  # Medium corp -> Pro Plan
        2, 2, 2, 2,  # Large enterprise -> Enterprise Plan
        3, 3, 3,     # Startups -> Innovation Suite
        4, 4, 4,     # Government -> Government Solution
    ]
}

# Exemple de prospect pour la prédiction
SAMPLE_PREDICTION = {
    "prospect_id": "new_prospect_1",
    "prospect_name": "New Company XYZ",
    "features": [0.55, 0.65, 0.6, 0.5, 0.65],
    "return_similar": True
}

# Exemple de batch prediction
SAMPLE_BATCH_PREDICTION = {
    "prospects": [
        {
            "prospect_id": "batch_p1",
            "prospect_name": "Prospect Batch 1",
            "features": [0.3, 0.35, 0.4, 0.45, 0.35]
        },
        {
            "prospect_id": "batch_p2",
            "prospect_name": "Prospect Batch 2",
            "features": [0.7, 0.75, 0.8, 0.3, 0.8]
        },
        {
            "prospect_id": "batch_p3",
            "prospect_name": "Prospect Batch 3",
            "features": [0.85, 0.9, 0.88, 0.6, 0.9]
        },
    ]
}
