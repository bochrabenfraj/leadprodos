# ⚡ Guide de Démarrage Rapide - LeadProdos.ia

## 🎯 Étape 1: Préparer l'environnement

### Backend .NET

1. **Ouvrir un terminal PowerShell**
   ```powershell
   cd C:\Users\bochr\Desktop\leadprodospfe\backend
   ```

2. **Installer les dépendances .NET**
   ```powershell
   dotnet restore
   ```

3. **Configurer la base de données SQL Server**
   - Modifiez `appsettings.json` avec votre connection string:
   ```json
   "DefaultConnection": "Server=YOUR_SERVER;Database=LeadProdosDb;Trusted_Connection=true;TrustServerCertificate=true;"
   ```

4. **Créer la base de données (migrations EF Core)**
   ```powershell
   dotnet ef database update
   ```

5. **Lancer le backend**
   ```powershell
   dotnet run
   ```
   ✅ API disponible à `http://localhost:5000`
   ✅ Documentation Swagger à `http://localhost:5000/swagger`

---

### Frontend React

1. **Ouvrir un DEUXIÈME terminal PowerShell**
   ```powershell
   cd C:\Users\bochr\Desktop\leadprodospfe\frontend
   ```

2. **Installer les dépendances npm**
   ```powershell
   npm install
   ```

3. **Lancer le serveur de développement**
   ```powershell
   npm run dev
   ```
   ✅ Application disponible à `http://localhost:3000`

---

## 🛠️ Architecture

### Backend (.NET Core)
- **Port:** 5000 (HTTPS), 5001 (HTTP)
- **Endpoints:** `/api/products`, `/api/clients`, `/api/leads`
- **Framework:** ASP.NET Core 8.0
- **ORM:** Entity Framework Core
- **BD:** SQL Server

### Frontend (React + Vite)
- **Port:** 3000
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Build Tool:** Vite

---

## 📊 Fonctionnalités Disponibles

### 1️⃣ Tableau de Bord
- Statistiques en temps réel
- Nombre de produits, clients et leads

### 2️⃣ Gestion des Produits
| Action | Endpoint | Description |
|--------|----------|-------------|
| Lister | `GET /api/products` | Récupérer tous les produits |
| Détails | `GET /api/products/{id}` | Détails d'un produit |
| Créer | `POST /api/products` | Ajouter un nouveau produit |
| Modifier | `PUT /api/products/{id}` | Mettre à jour un produit |
| Supprimer | `DELETE /api/products/{id}` | Supprimer un produit |

### 3️⃣ Gestion des Clients
| Action | Endpoint | Description |
|--------|----------|-------------|
| Lister | `GET /api/clients` | Récupérer tous les clients |
| Détails | `GET /api/clients/{id}` | Détails d'un client |
| Créer | `POST /api/clients` | Ajouter un nouveau client |
| Modifier | `PUT /api/clients/{id}` | Mettre à jour un client |
| Supprimer | `DELETE /api/clients/{id}` | Supprimer un client |

### 4️⃣ Gestion des Leads & IA
| Action | Endpoint | Description |
|--------|----------|-------------|
| Lister | `GET /api/leads` | Récupérer tous les leads |
| Analyser | `POST /api/leads/analyze` | Lancer l'analyse IA |
| Créer | `POST /api/leads` | Créer un lead manuellement |
| Modifier | `PUT /api/leads/{id}` | Mettre à jour un lead |

---

## 🧪 Test rapide de l'API

### Avec Swagger (Backend)
1. Ouvrez `http://localhost:5000/swagger`
2. Testez les endpoints directement

### Avec cURL
```powershell
# Récupérer les produits
curl -X GET "http://localhost:5000/api/products"

# Créer un produit
curl -X POST "http://localhost:5000/api/products" `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Laptop Pro",
    "description": "Ordinateur portable haute performance",
    "price": 1500,
    "category": "Informatique"
  }'
```

---

## 📝 Exemple de données de test

### Créer un produit
```json
POST /api/products
{
  "name": "Logiciel CRM Cloud",
  "description": "Plateforme de gestion client complète",
  "price": 299.99,
  "category": "Logiciels"
}
```

### Créer un client
```json
POST /api/clients
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+33612345678",
  "company": "TechCorp Inc"
}
```

### Analyser les leads pour un produit
```json
POST /api/leads/analyze
{
  "productId": 1
}
```

---

## 🔍 Troubleshooting

### Le backend ne démarre pas
```
❌ Error: Cannot connect to database
✅ Solution: Vérifiez la connection string dans appsettings.json
```

### Le frontend ne se connecte pas à l'API
```
❌ CORS Error
✅ Solution: Le backend a CORS activé (AllowAll en développement)
```

### Ports déjà utilisés
```
❌ Already in use
✅ Solution: Changez dans vite.config.js (frontend) ou Program.cs (backend)
```

---

## 📚 Documentation complète

Voir `README.md` pour la documentation détaillée.

---

## 🚀 Prochaines étapes

1. ✅ Backend & Frontend setup
2. 📌 Ajouter l'authentification JWT
3. 📌 Intégrer l'IA/ML pour l'analyse avancée
4. 📌 Créer des rapports PDF/Excel
5. 📌 Ajouter les WebSockets pour notifications temps réel

---

**Bonne chance! 🎉**
