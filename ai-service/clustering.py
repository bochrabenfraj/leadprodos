import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import List, Tuple
from models import Prospect, TrainingData

class ClusteringService:
    """Service de clustering avec KMeans"""
    
    def __init__(self, n_clusters: int = 5, random_state: int = 42):
        self.n_clusters = n_clusters
        self.random_state = random_state
        self.kmeans = KMeans(
            n_clusters=n_clusters,
            random_state=random_state,
            n_init=10,
            max_iter=300
        )
        self.scaler = StandardScaler()
        self.is_fitted = False
    
    def train(self, X: np.ndarray) -> np.ndarray:
        """
        Entraîner le modèle KMeans
        
        Args:
            X: Matrice de features (n_samples, n_features)
        
        Returns:
            Clusters labels
        """
        # Normaliser les données
        X_scaled = self.scaler.fit_transform(X)
        
        # Entraîner KMeans
        self.kmeans.fit(X_scaled)
        self.is_fitted = True
        
        return self.kmeans.labels_
    
    def predict(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prédire les clusters pour de nouvelles données
        
        Args:
            X: Matrice de features
        
        Returns:
            Tuple (cluster_labels, distances_to_centroids)
        """
        if not self.is_fitted:
            raise ValueError("Model non entraîné. Appelez train() d'abord.")
        
        X_scaled = self.scaler.transform(X)
        clusters = self.kmeans.predict(X_scaled)
        distances = self.kmeans.transform(X_scaled)  # Distance à chaque centroid
        
        return clusters, distances
    
    def get_cluster_members(self, clusters: np.ndarray, target_cluster: int) -> np.ndarray:
        """
        Obtenir les indices des prospects dans un cluster
        
        Args:
            clusters: Array des clusters
            target_cluster: Cluster cible
        
        Returns:
            Indices des prospects dans le cluster
        """
        return np.where(clusters == target_cluster)[0]
    
    def get_cluster_distances(self, X: np.ndarray, clusters: np.ndarray, 
                             prospect_idx: int) -> np.ndarray:
        """
        Calculer les distances entre un prospect et d'autres dans le même cluster
        
        Args:
            X: Matrice de features originales
            clusters: Array des clusters
            prospect_idx: Indice du prospect
        
        Returns:
            Distances euclidiennes
        """
        cluster = clusters[prospect_idx]
        cluster_indices = self.get_cluster_members(clusters, cluster)
        
        # Calculer distance euclidienne
        distances = np.sqrt(np.sum((X[cluster_indices] - X[prospect_idx])**2, axis=1))
        
        return distances, cluster_indices
    
    def save_model(self, path: str):
        """Sauvegarder le modèle"""
        os.makedirs(path, exist_ok=True)
        joblib.dump(self.kmeans, os.path.join(path, 'kmeans_model.pkl'))
        joblib.dump(self.scaler, os.path.join(path, 'scaler_model.pkl'))
    
    def load_model(self, path: str):
        """Charger le modèle"""
        self.kmeans = joblib.load(os.path.join(path, 'kmeans_model.pkl'))
        self.scaler = joblib.load(os.path.join(path, 'scaler_model.pkl'))
        self.is_fitted = True
    
    def get_inertia(self) -> float:
        """Obtenir l'inertie (somme distances min au centroid)"""
        if not self.is_fitted:
            return None
        return self.kmeans.inertia_
    
    def get_cluster_centers(self) -> np.ndarray:
        """Obtenir les centres des clusters (données dénormalisées)"""
        if not self.is_fitted:
            return None
        return self.scaler.inverse_transform(self.kmeans.cluster_centers_)
