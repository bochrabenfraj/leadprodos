#!/bin/bash

# Script d'initialisation du microservice IA pour Linux/Mac

echo ""
echo "====================================================="
echo "Initialisation du Microservice IA LeadProdos"
echo "====================================================="
echo ""

# Créer le répertoire models
if [ ! -d "models" ]; then
    mkdir models
    echo "[+] Repertoire 'models' cree"
else
    echo "[*] Repertoire 'models' deja existe"
fi

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "[!] ERROR: Python 3 n'est pas installe"
    exit 1
fi
echo "[+] Python 3 trouve: $(python3 --version)"

# Créer l'environnement virtuel
if [ ! -d "venv" ]; then
    echo "[*] Creation de l'environnement virtuel..."
    python3 -m venv venv
    echo "[+] Environnement virtuel cree"
else
    echo "[*] Environnement virtuel existe deja"
fi

# Activer l'environnement virtuel
echo "[*] Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances
echo "[*] Installation des dependances..."
pip install -r requirements.txt

# Créer .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo "[*] Creation du fichier .env..."
    cp .env.example .env
    echo "[+] Fichier .env cree (a configurer)"
else
    echo "[*] Fichier .env existe deja"
fi

# Rendre le script executable
chmod +x setup.sh

echo ""
echo "====================================================="
echo "Initialisation terminee!"
echo "====================================================="
echo ""
echo "Commandes utiles:"
echo "  - Activer venv: source venv/bin/activate"
echo "  - Lancer le service: python app.py"
echo "  - Tester le service: python test_service.py"
echo ""
