import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import Tuple, List

class PredictionService:
    """Service de prédiction avec KNN (K-Nearest Neighbors)"""
    
    def __init__(self, n_neighbors: int = 3, weights: str = 'distance'):
        self.n_neighbors = n_neighbors
        self.weights = weights  # 'uniform' ou 'distance'
        self.knn = KNeighborsClassifier(
            n_neighbors=n_neighbors,
            weights=weights,
            metric='euclidean'
        )
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.classes_ = None  # Produits
    
    def train(self, X: np.ndarray, y: np.ndarray) -> None:
        """
        Entraîner le modèle KNN
        
        Args:
            X: Matrice de features (n_samples, n_features)
            y: Array de labels (produit_id pour chaque prospect)
        """
        # Normaliser les données
        X_scaled = self.scaler.fit_transform(X)
        
        # Entraîner KNN
        self.knn.fit(X_scaled, y)
        self.is_fitted = True
        self.classes_ = self.knn.classes_
    
    def predict(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prédire le produit pour de nouvelles données
        
        Args:
            X: Matrice de features
        
        Returns:
            Tuple (product_predictions, probabilities)
        """
        if not self.is_fitted:
            raise ValueError("Model non entraîné. Appelez train() d'abord.")
        
        X_scaled = self.scaler.transform(X)
        
        # Prédictions
        predictions = self.knn.predict(X_scaled)
        
        # Probabilités (distance-weighted)
        distances, indices = self.knn.kneighbors(X_scaled)
        
        # Calculer les scores de confiance
        # Inverse de la distance moyenne
        confidences = 1.0 / (1.0 + np.mean(distances, axis=1))
        
        return predictions, confidences
    
    def predict_with_details(self, X: np.ndarray) -> List[dict]:
        """
        Prédiction avec détails des k-voisins
        
        Args:
            X: Matrice de features
        
        Returns:
            Liste de dictionnaires avec prédictions et détails
        """
        if not self.is_fitted:
            raise ValueError("Model non entraîné. Appelez train() d'abord.")
        
        X_scaled = self.scaler.transform(X)
        
        predictions = self.knn.predict(X_scaled)
        distances, indices = self.knn.kneighbors(X_scaled)
        
        results = []
        for i in range(len(X)):
            result = {
                'predicted_product': predictions[i],
                'confidence': 1.0 / (1.0 + np.mean(distances[i])),
                'k_neighbors': {
                    'indices': indices[i].tolist(),
                    'distances': distances[i].tolist(),
                    'products': self.knn.predict(X_scaled[indices[i]]).tolist()
                }
            }
            results.append(result)
        
        return results
    
    def get_k_neighbors(self, X: np.ndarray, idx: int) -> Tuple[np.ndarray, np.ndarray]:
        """
        Obtenir les k-voisins d'un prospect
        
        Args:
            X: Matrice de features
            idx: Indice du prospect (dans les données normalisées)
        
        Returns:
            Tuple (indices, distances)
        """
        if not self.is_fitted:
            raise ValueError("Model non entraîné.")
        
        X_scaled = self.scaler.transform(X)
        distances, indices = self.knn.kneighbors(X_scaled[idx:idx+1])
        
        return indices[0], distances[0]
    
    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        """
        Évaluer la précision du modèle
        
        Args:
            X: Matrice de features
            y: Labels réels
        
        Returns:
            Score de précision (0-1)
        """
        if not self.is_fitted:
            raise ValueError("Model non entraîné.")
        
        X_scaled = self.scaler.transform(X)
        return self.knn.score(X_scaled, y)
    
    def save_model(self, path: str):
        """Sauvegarder le modèle"""
        os.makedirs(path, exist_ok=True)
        joblib.dump(self.knn, os.path.join(path, 'knn_model.pkl'))
        joblib.dump(self.scaler, os.path.join(path, 'knn_scaler_model.pkl'))
    
    def load_model(self, path: str):
        """Charger le modèle"""
        self.knn = joblib.load(os.path.join(path, 'knn_model.pkl'))
        self.scaler = joblib.load(os.path.join(path, 'knn_scaler_model.pkl'))
        self.is_fitted = True
        self.classes_ = self.knn.classes_
