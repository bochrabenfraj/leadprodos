import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuration de base"""
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Configuration KMeans
    N_CLUSTERS = int(os.getenv('N_CLUSTERS', 5))
    KMEANS_RANDOM_STATE = 42
    KMEANS_N_INIT = 10
    
    # Configuration KNN
    N_NEIGHBORS = int(os.getenv('N_NEIGHBORS', 3))
    KNN_WEIGHTS = 'distance'  # 'uniform' ou 'distance'
    
    # Configuration modèles
    MODEL_PATH = 'models'
    KMEANS_MODEL = 'kmeans_model.pkl'
    KNN_MODEL = 'knn_model.pkl'
    SCALER_MODEL = 'scaler_model.pkl'
    
    # Seuils
    MIN_SIMILARITY_SCORE = float(os.getenv('MIN_SIMILARITY_SCORE', 0.5))
    MAX_SIMILARITY_SCORE = 1.0

class DevelopmentConfig(Config):
    """Configuration de développement"""
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    """Configuration de test"""
    TESTING = True
    DEBUG = True

class ProductionConfig(Config):
    """Configuration de production"""
    DEBUG = False
    TESTING = False

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
