FROM python:3.8-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

# Variables d'environnement
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLASK_PORT=5001

# Port exposé
EXPOSE 5001

# Commande de démarrage
CMD ["python", "app.py"]
