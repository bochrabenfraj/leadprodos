@echo off
REM Script d'initialisation du microservice IA pour Windows

echo.
echo ====================================================
echo Initialisation du Microservice IA LeadProdos
echo ====================================================
echo.

REM Créer le répertoire models
if not exist models (
    mkdir models
    echo [+] Repertoire 'models' cree
) else (
    echo [*] Repertoire 'models' deja existe
)

REM Vérifier Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: Python n'est pas installe ou non dans PATH
    pause
    exit /b 1
)
echo [+] Python trouve

REM Créer l'environnement virtuel
if not exist venv (
    echo [*] Creation de l'environnement virtuel...
    python -m venv venv
    echo [+] Environnement virtuel cree
) else (
    echo [*] Environnement virtuel existe deja
)

REM Activer l'environnement virtuel
echo [*] Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

REM Installer les dépendances
echo [*] Installation des dependances...
pip install -r requirements.txt

REM Créer .env s'il n'existe pas
if not exist .env (
    echo [*] Creation du fichier .env...
    copy .env.example .env
    echo [+] Fichier .env cree (a configurer)
) else (
    echo [*] Fichier .env existe deja
)

echo.
echo ====================================================
echo Initialisation terminee!
echo ====================================================
echo.
echo Commandes utiles:
echo   - Lancer le service: python app.py
echo   - Tester le service: python test_service.py
echo   - Activer venv: venv\Scripts\activate.bat
echo.
pause
