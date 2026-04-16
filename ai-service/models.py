from dataclasses import dataclass
from typing import List, Dict, Any
import numpy as np

@dataclass
class Prospect:
    """Modèle représentant un prospect"""
    id: str
    name: str
    features: List[float]  # Caractéristiques numériques (budget, engagement, etc.)
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'features': self.features,
            'metadata': self.metadata
        }

@dataclass
class Product:
    """Modèle représentant un produit"""
    id: str
    name: str
    features: List[float]  # Caractéristiques du produit
    category: str
    price: float = 0.0
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'features': self.features,
            'category': self.category,
            'price': self.price
        }

@dataclass
class PredictionResult:
    """Résultat de prédiction pour un prospect"""
    prospect_id: str
    prospect_name: str
    cluster: int  # Cluster KMeans
    suggested_product_id: str  # Produit suggéré via KNN
    suggested_product_name: str
    relevance_score: float  # Score de pertinence (0-1)
    confidence: float  # Confiance de la prédiction
    similar_prospects: List[Dict] = None  # Prospects similaires dans le cluster
    
    def __post_init__(self):
        if self.similar_prospects is None:
            self.similar_prospects = []
    
    def to_dict(self):
        return {
            'prospect_id': self.prospect_id,
            'prospect_name': self.prospect_name,
            'cluster': int(self.cluster),
            'suggested_product': {
                'id': self.suggested_product_id,
                'name': self.suggested_product_name
            },
            'relevance_score': float(self.relevance_score),
            'confidence': float(self.confidence),
            'similar_prospects': self.similar_prospects
        }

@dataclass
class TrainingData:
    """Données d'entraînement"""
    prospects: List[Prospect]
    products: List[Product]
    product_labels: np.ndarray  # Labels produits pour KNN
    
    def to_features(self):
        """Convertir les prospects en matrice de features"""
        return np.array([p.features for p in self.prospects])
