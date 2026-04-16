import numpy as np
from typing import Tuple

class ScoringService:
    """Service de calcul des scores de pertinence"""
    
    @staticmethod
    def calculate_relevance_score(
        knn_confidence: float,
        distance_to_centroid: float,
        max_distance: float = None,
        min_similarity: float = 0.0,
        max_similarity: float = 1.0
    ) -> float:
        """
        Calculer le score de pertinence combinant plusieurs facteurs
        
        Args:
            knn_confidence: Score de confiance du KNN (0-1)
            distance_to_centroid: Distance au centroid du cluster
            max_distance: Distance maximale pour normalisation
            min_similarity: Score minimum acceptable
            max_similarity: Score maximum possible
        
        Returns:
            Score de pertinence normalisé (0-1)
        """
        # Normaliser la distance au centroid
        if max_distance is not None and max_distance > 0:
            centroid_score = 1.0 - (distance_to_centroid / max_distance)
            centroid_score = max(0, min(1, centroid_score))
        else:
            centroid_score = 1.0 / (1.0 + distance_to_centroid)
        
        # Combiner KNN confidence et centroid score
        # KNN confidence: 60%, Centroid proximity: 40%
        combined_score = (knn_confidence * 0.6) + (centroid_score * 0.4)
        
        # Normaliser dans la plage [min_similarity, max_similarity]
        final_score = min_similarity + (combined_score * (max_similarity - min_similarity))
        
        return float(np.clip(final_score, 0, 1))
    
    @staticmethod
    def calculate_cluster_cohesion(distances: np.ndarray) -> float:
        """
        Calculer la cohésion d'un cluster
        Score élevé = cluster cohérent
        
        Args:
            distances: Distances entre prospects dans le cluster
        
        Returns:
            Score de cohésion (0-1)
        """
        if len(distances) == 0:
            return 0.0
        
        # Inversion normalisée de la distance moyenne
        mean_distance = np.mean(distances)
        cohesion = 1.0 / (1.0 + mean_distance)
        
        return float(cohesion)
    
    @staticmethod
    def calculate_isolation_score(
        distance_to_centroid: float,
        distances_to_others: np.ndarray
    ) -> float:
        """
        Calculer le score d'isolement d'un prospect
        Score élevé = prospect isolé dans son cluster
        
        Args:
            distance_to_centroid: Distance au centroid
            distances_to_others: Distances aux autres prospects du cluster
        
        Returns:
            Score d'isolement (0-1)
        """
        if len(distances_to_others) == 0:
            return 0.5
        
        avg_distance_to_others = np.mean(distances_to_others)
        
        # Ratio isolation
        if avg_distance_to_others > 0:
            isolation_ratio = distance_to_centroid / avg_distance_to_others
        else:
            isolation_ratio = 1.0
        
        # Transformer en score (score élevé = isolé)
        isolation_score = 1.0 / (1.0 + isolation_ratio)
        
        return float(isolation_score)
    
    @staticmethod
    def calculate_prospect_ranking(
        relevance_scores: np.ndarray,
        confidences: np.ndarray = None,
        weights: dict = None
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Classer les prospects par score
        
        Args:
            relevance_scores: Array de scores de pertinence
            confidences: Array de scores de confiance (optionnel)
            weights: Poids pour combiner scores et confidences
        
        Returns:
            Tuple (sorted_indices, sorted_scores)
        """
        if weights is None:
            weights = {'relevance': 0.7, 'confidence': 0.3}
        
        if confidences is not None and len(confidences) == len(relevance_scores):
            # Combiner relevance et confidence
            final_scores = (
                weights['relevance'] * relevance_scores +
                weights['confidence'] * confidences
            )
        else:
            final_scores = relevance_scores
        
        # Obtenir les indices triés (descendants)
        sorted_indices = np.argsort(-final_scores)
        sorted_scores = final_scores[sorted_indices]
        
        return sorted_indices, sorted_scores
    
    @staticmethod
    def categorize_score(score: float) -> str:
        """
        Catégoriser un score de pertinence
        
        Args:
            score: Score (0-1)
        
        Returns:
            Catégorie ('excellent', 'bon', 'moyen', 'faible')
        """
        if score >= 0.8:
            return 'excellent'
        elif score >= 0.6:
            return 'bon'
        elif score >= 0.4:
            return 'moyen'
        else:
            return 'faible'
    
    @staticmethod
    def calculate_batch_stats(scores: np.ndarray) -> dict:
        """
        Calculer les statistiques d'un batch de scores
        
        Args:
            scores: Array de scores
        
        Returns:
            Dictionnaire de statistiques
        """
        return {
            'mean': float(np.mean(scores)),
            'median': float(np.median(scores)),
            'std': float(np.std(scores)),
            'min': float(np.min(scores)),
            'max': float(np.max(scores)),
            'count': len(scores)
        }
