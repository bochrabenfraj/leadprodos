# LeadProdos.ia - Plateforme Intelligente d'Identification des Clients Potentiels

## 📋 Vue d'ensemble du projet

LeadProdos.ia est une plateforme centralisée qui combine:
- ✅ Gestion complète des **Produits**
- ✅ Gestion des **Utilisateurs** et **Clients**
- ✅ Module d'intelligence artificielle pour l'identification de leads
- ✅ Analyse des données internes et réseaux sociaux

## 🗂️ Structure du Projet

```
leadprodospfe/
├── backend/                          # API .NET Core
│   ├── Models/                       # Modèles de données
│   │   ├── Product.cs
│   │   ├── User.cs
│   │   ├── Client.cs
│   │   └── Lead.cs
│   ├── Controllers/                  # API Endpoints
│   │   ├── ProductsController.cs
│   │   ├── ClientsController.cs
│   │   └── LeadsController.cs
│   ├── Services/                     # Logic métier
│   │   ├── IProductService.cs
│   │   ├── ProductService.cs
│   │   ├── IClientService.cs
│   │   ├── ClientService.cs
│   │   ├── ILeadService.cs
│   │   ├── LeadService.cs
│   │   ├── IAIService.cs
│   │   └── AIService.cs
│   ├── Data/
│   │   └── ApplicationDbContext.cs   # Entity Framework DbContext
│   ├── Program.cs                    # Configuration de base
│   ├── appsettings.json              # Configuration
│   └── LeadProdos.Backend.csproj     # Fichier projet
│
├── frontend/                         # Application React
│   ├── src/
│   │   ├── components/               # Composants réutilisables
│   │   │   ├── Header.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/                    # Pages de l'application
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ClientsPage.jsx
│   │   │   └── LeadsPage.jsx
│   │   ├── services/                 # Services API
│   │   │   └── api.js
│   │   ├── App.jsx                   # Composant principal
│   │   ├── main.jsx                  # Point d'entrée
│   │   └── index.css                 # Styles globaux
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── README.md                         # Documentation
└── .gitignore

```

## 🚀 Installation & Démarrage

### Backend (.NET Core)

#### Prérequis:
- .NET 8.0 ou supérieur
- SQL Server (local ou Azure)

#### Étapes:
1. Accédez au dossier backend:
   ```bash
   cd backend
   ```

2. Restaurez les packages NuGet:
   ```bash
   dotnet restore
   ```

3. Créez la base de données (migrations):
   ```bash
   dotnet ef database update
   ```

4. Démarrez l'application:
   ```bash
   dotnet run
   ```

L'API sera disponible à `http://localhost:5000`

### Frontend (React)

#### Prérequis:
- Node.js 16+ et npm

#### Étapes:
1. Accédez au dossier frontend:
   ```bash
   cd frontend
   ```

2. Installez les dépendances:
   ```bash
   npm install
   ```

3. Démarrez le serveur de développement:
   ```bash
   npm run dev
   ```

L'application sera disponible à `http://localhost:3000`

## 📡 API Endpoints

### Produits
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/{id}` - Récupérer un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Mettre à jour un produit
- `DELETE /api/products/{id}` - Supprimer un produit

### Clients
- `GET /api/clients` - Récupérer tous les clients
- `GET /api/clients/{id}` - Récupérer un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Mettre à jour un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Leads & IA
- `GET /api/leads` - Récupérer tous les leads
- `GET /api/leads/{id}` - Récupérer un lead
- `POST /api/leads` - Créer un lead
- `PUT /api/leads/{id}` - Mettre à jour un lead
- `POST /api/leads/analyze` - Analyser et identifier les leads avec l'IA

## 🔧 Configuration

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=LeadProdosDb;Trusted_Connection=true;"
  }
}
```

Modifiez la connection string selon votre environnement SQL Server.

### Frontend (vite.config.js)
Le proxy API est configuré pour rediriger `/api/*` vers `http://localhost:5000`

## 📦 Technologies Utilisées

### Backend
- **ASP.NET Core 8.0** - Framework web
- **Entity Framework Core** - ORM
- **SQL Server** - Base de données
- **Swagger/OpenAPI** - Documentation API

### Frontend
- **React 18** - UI Framework
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Vite** - Build tool
- **CSS3** - Styling

## 🤖 Module d'IA (En développement)

Le service `AIService` fournit:
- Analyse des profils sociaux des clients
- Calcul du score de correspondance client-produit
- Identification automatique des leads qualifiés

## 📝 Modèles de Données

### Product
```csharp
- Id: int
- Name: string
- Description: string
- Price: decimal
- Category: string
- CreatedAt: DateTime
- UpdatedAt: DateTime
```

### Client
```csharp
- Id: int
- Name: string
- Email: string
- Phone: string
- Company: string
- SocialMediaProfiles: string (JSON)
- RecommendedProductId: int?
- InterestScore: decimal
- CreatedAt: DateTime
- UpdatedAt: DateTime
```

### Lead
```csharp
- Id: int
- ClientId: int
- ProductId: int
- Status: string (Prospect, Contact, Qualified, Converted)
- MatchScore: decimal
- AnalysisDetails: string (JSON)
- CreatedAt: DateTime
- UpdatedAt: DateTime
```

## 🎨 Pages & Fonctionnalités

### 📊 Tableau de Bord
- Affiche les statistiques (nombre de produits, clients, leads)

### 📦 Produits
- Liste, création, suppression de produits
- Gestion des catégories et prix

### 👥 Clients
- Gestion complète des clients
- Stockage des profils sociaux
- Scores d'intérêt

### 🎯 Leads & IA
- Visualisation des leads identifiés
- Lancement d'analyses IA par produit
- Suivi du statut des prospects

## 🔐 Sécurité (À implémenter)

- Authentification JWT
- Autorisation basée sur les rôles (RBAC)
- Validation des données en entrée
- HTTPS en production

## 📈 Prochaines étapes

1. **Authentification & Autorisation**
2. **Module IA avancée** (ML, intégration d'APIs sociales)
3. **Dashboard analytique**
4. **Notifications en temps réel** (WebSockets)
5. **Export de rapports** (PDF, Excel)
6. **Intégration CRM**

## 🤝 Support

Pour des questions ou contributions, contactez l'équipe de développement.

---

**Développé pour optimiser les stratégies de prospection commerciale** 🚀
