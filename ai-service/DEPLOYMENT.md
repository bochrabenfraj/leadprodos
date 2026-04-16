# 🚀 Guide de déploiement - Microservice IA

## Options de déploiement

### 1. Déploiement local (développement)

```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Service disponible: `http://localhost:5001`

---

### 2. Docker (Recommandé pour production)

**Construire l'image:**
```bash
cd ai-service
docker build -t leadprodos-ai:latest .
```

**Lancer le conteneur:**
```bash
docker run -d \
  --name leadprodos-ai \
  -p 5001:5001 \
  -e FLASK_ENV=production \
  -e N_CLUSTERS=5 \
  -v ai_models:/app/models \
  leadprodos-ai:latest
```

**Avec docker-compose (depuis la racine):**
```bash
docker-compose up -d ai-service
```

Vérifier: `curl http://localhost:5001/health`

---

### 3. Docker Compose (Stack complète)

**Démarrer la stack complète:**
```bash
docker-compose up -d
```

**Services disponibles:**
- AI Service: http://localhost:5001
- Backend (.NET): http://localhost:5000

**Arrêter:**
```bash
docker-compose down
```

**Logs:**
```bash
docker-compose logs -f ai-service
```

---

### 4. Gunicorn (Production WSGI)

**Installer gunicorn:**
```bash
pip install gunicorn
```

**Lancer:**
```bash
gunicorn -w 4 -b 0.0.0.0:5001 --timeout 120 app:app
```

Options:
- `-w 4`: 4 workers
- `--timeout 120`: Timeout de 120s pour l'entraînement
- `--access-logfile -`: Logs dans stdout

---

### 5. Nginx (Reverse Proxy)

**Configuration Nginx:**
```nginx
upstream ai_service {
    server localhost:5001;
}

server {
    listen 80;
    server_name ai.leadprodos.local;

    location / {
        proxy_pass http://ai_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout pour entraînement long
        proxy_connect_timeout 120;
        proxy_send_timeout 120;
        proxy_read_timeout 120;
    }
}
```

---

### 6. Systemd (Linux production)

**Créer le service:**
```bash
sudo tee /etc/systemd/system/leadprodos-ai.service << EOF
[Unit]
Description=LeadProdos AI Service
After=network.target

[Service]
Type=simple
User=leadprodos
WorkingDirectory=/opt/leadprodos/ai-service
ExecStart=/opt/leadprodos/ai-service/venv/bin/gunicorn -w 4 -b 0.0.0.0:5001 app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

**Démarrer:**
```bash
sudo systemctl start leadprodos-ai
sudo systemctl enable leadprodos-ai  # Auto-démarrage
sudo systemctl status leadprodos-ai
```

---

## Variables d'environnement

```env
# Flask
FLASK_ENV=production              # development, testing, production
FLASK_PORT=5001
SECRET_KEY=your-secret-key

# KMeans
N_CLUSTERS=5

# KNN  
N_NEIGHBORS=3

# Scoring
MIN_SIMILARITY_SCORE=0.5
```

---

## Fichiers persistants

**Modèles entraînés:**
```
models/
├── kmeans_model.pkl
├── scaler_model.pkl
├── knn_model.pkl
└── knn_scaler_model.pkl
```

**Mount volume dans Docker:**
```bash
-v ai_models:/app/models
```

---

## Health Checks

**URL:**
```
GET /health
```

**Réponse:**
```json
{
  "status": "healthy",
  "clustering_trained": true,
  "prediction_trained": true
}
```

---

## Scalabilité

### Avec Kubernetes

**Déploiement:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: ai-service
        image: leadprodos-ai:latest
        ports:
        - containerPort: 5001
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 5001
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Load Balancing

Avec Nginx upstream ou Kubernetes service

---

## Monitoring

### Prometheus metrics (optionnel)

```bash
pip install prometheus-client
```

```python
from prometheus_client import Counter, Histogram, generate_latest

predict_count = Counter('ai_predictions_total', 'Total predictions')
predict_duration = Histogram('ai_predict_duration_seconds', 'Prediction duration')

@app.route('/metrics')
def metrics():
    return generate_latest()
```

### Logs

```bash
docker logs -f leadprodos-ai
tail -f /var/log/leadprodos-ai.log
```

---

## Sauvegarde des modèles

**Avant mise à jour:**
```bash
cp -r models/ models.backup.$(date +%Y%m%d_%H%M%S)
```

**Restauration:**
```bash
rm -rf models/
cp -r models.backup.20240416_150000 models/
```

---

## Performance Tuning

### Nombre de workers (Gunicorn)
```bash
# Calcul: (2 × CPU cores) + 1
gunicorn -w 9 app:app  # Pour 4 cores
```

### Cache modèles
Les modèles sont chargés en mémoire au démarrage.

### Batch prediction
Utiliser `/batch-predict` plutôt que `/predict` en boucle.

---

## Dépannage

**Port déjà utilisé:**
```bash
# Trouver le processus
lsof -i :5001

# Changer le port
export FLASK_PORT=5002
```

**Memory leak:**
```bash
# Monitorer la mémoire
docker stats leadprodos-ai

# Limiter la mémoire
docker run -m 1g leadprodos-ai
```

**Modèles non entraînés:**
```bash
# POST /train avec données
curl -X POST http://localhost:5001/train \
  -H "Content-Type: application/json" \
  -d @training_data.json
```

---

## Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Dépendances Python installées (`pip install -r requirements.txt`)
- [ ] Modèles entraînés (POST /train)
- [ ] Health check OK (GET /health)
- [ ] Logs configurés
- [ ] Backups modèles en place
- [ ] Firewall ouvert sur port 5001
- [ ] DNS configuré (si nécessaire)
- [ ] SSL/TLS configuré (production)
- [ ] Monitoring actif

---

## Support

Pour des problèmes de déploiement :
```bash
docker-compose logs ai-service
curl http://localhost:5001/health
python test_service.py
```
