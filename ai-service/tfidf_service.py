"""Service TF-IDF pour extraction de mots-clés des réseaux sociaux"""
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class TFIDFService:
    """Service pour extraire les mots-clés pertinents avec TF-IDF"""
    
    def __init__(self, max_features: int = 100, ngram_range: Tuple[int, int] = (1, 2)):
        """
        Initialiser le service TF-IDF
        
        Args:
            max_features: Nombre maximum de features
            ngram_range: Range des n-grammes (unigrammes et bigrammes)
        """
        self.max_features = max_features
        self.ngram_range = ngram_range
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=ngram_range,
            stop_words='french',
            lowercase=True,
            min_df=1,
            max_df=0.95
        )
        self.is_fitted = False
        self.feature_names = None
    
    def fit(self, documents: List[str]) -> None:
        """
        Entraîner le vectorizer TF-IDF
        
        Args:
            documents: Liste des documents (textes des réseaux sociaux)
        """
        if not documents or all(not doc for doc in documents):
            logger.warning("Aucun document pour TF-IDF, initialisation avec données vides")
            return
        
        # Filtrer les documents vides
        documents = [doc for doc in documents if doc and isinstance(doc, str)]
        
        if not documents:
            return
        
        try:
            self.vectorizer.fit(documents)
            self.feature_names = self.vectorizer.get_feature_names_out()
            self.is_fitted = True
            logger.info(f"TF-IDF entraîné avec {len(documents)} documents, "
                       f"{len(self.feature_names)} features")
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement TF-IDF: {e}")
            self.is_fitted = False
    
    def extract_keywords(self, text: str, top_k: int = 5) -> List[Dict[str, float]]:
        """
        Extraire les top K mots-clés d'un texte
        
        Args:
            text: Texte source (réseaux sociaux, description, etc.)
            top_k: Nombre de mots-clés à extraire
        
        Returns:
            Liste de dicts {'keyword': str, 'score': float}
        """
        if not self.is_fitted or not text:
            return []
        
        try:
            # Vectoriser le texte
            tfidf_vector = self.vectorizer.transform([text])
            
            # Obtenir les indices et scores non-nuls
            feature_indices = tfidf_vector.nonzero()[1]
            tfidf_scores = tfidf_vector.data
            
            # Créer les résultats
            results = []
            for idx, score in zip(feature_indices, tfidf_scores):
                keyword = self.feature_names[idx]
                results.append({
                    'keyword': keyword,
                    'score': float(score)
                })
            
            # Trier par score décroissant et retourner top K
            results.sort(key=lambda x: x['score'], reverse=True)
            return results[:top_k]
        
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction de mots-clés: {e}")
            return []
    
    def extract_keywords_batch(self, texts: List[str], top_k: int = 5) -> List[List[Dict[str, float]]]:
        """
        Extraire les mots-clés de plusieurs textes
        
        Args:
            texts: Liste de textes
            top_k: Nombre de mots-clés par texte
        
        Returns:
            Liste de listes de mots-clés
        """
        return [self.extract_keywords(text, top_k) for text in texts]
    
    def get_similarity_score(self, text1: str, text2: str) -> float:
        """
        Calculer la similarité TF-IDF entre deux textes
        
        Args:
            text1, text2: Textes à comparer
        
        Returns:
            Score de similarité cosinus (0-1)
        """
        if not self.is_fitted:
            return 0.0
        
        try:
            vec1 = self.vectorizer.transform([text1]).toarray().flatten()
            vec2 = self.vectorizer.transform([text2]).toarray().flatten()
            
            # Cosine similarity
            dot_product = np.dot(vec1, vec2)
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            return float(dot_product / (norm1 * norm2))
        
        except Exception as e:
            logger.error(f"Erreur lors du calcul de similarité: {e}")
            return 0.0
