"""
Guide d'intégration du microservice IA avec le backend .NET

Cette classe montre comment intégrer le service IA Python 
dans le backend LeadProdos.
"""

# ============================================================
# EXEMPLE C# - Comment appeler le microservice IA
# ============================================================

CSHARP_EXAMPLE = """
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class AIServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    
    public AIServiceClient(HttpClient httpClient, string aiServiceUrl = "http://localhost:5001")
    {
        _httpClient = httpClient;
        _baseUrl = aiServiceUrl;
    }
    
    /// <summary>
    /// Prédire le cluster et le produit pour un prospect
    /// </summary>
    public async Task<PredictionResult> PredictAsync(ProspectPredictionRequest request)
    {
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync($"{_baseUrl}/predict", content);
        response.EnsureSuccessStatusCode();
        
        var responseJson = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PredictionResult>(responseJson);
        
        return result;
    }
    
    /// <summary>
    /// Prédictions batch pour plusieurs prospects
    /// </summary>
    public async Task<BatchPredictionResult> PredictBatchAsync(ProspectPredictionBatchRequest request)
    {
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync($"{_baseUrl}/batch-predict", content);
        response.EnsureSuccessStatusCode();
        
        var responseJson = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<BatchPredictionResult>(responseJson);
        
        return result;
    }
    
    /// <summary>
    /// Entraîner les modèles
    /// </summary>
    public async Task<TrainingResult> TrainAsync(TrainingRequest request)
    {
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync($"{_baseUrl}/train", content);
        response.EnsureSuccessStatusCode();
        
        var responseJson = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TrainingResult>(responseJson);
        
        return result;
    }
}

// Modèles de requête/réponse
public class ProspectPredictionRequest
{
    public string ProspectId { get; set; }
    public string ProspectName { get; set; }
    public double[] Features { get; set; }
    public bool ReturnSimilar { get; set; } = true;
}

public class PredictionResult
{
    public string ProspectId { get; set; }
    public string ProspectName { get; set; }
    public int Cluster { get; set; }
    public ProductInfo SuggestedProduct { get; set; }
    public double RelevanceScore { get; set; }
    public double Confidence { get; set; }
    public List<ProspectInfo> SimilarProspects { get; set; }
}

public class ProductInfo
{
    public string Id { get; set; }
    public string Name { get; set; }
}

public class ProspectInfo
{
    public string Id { get; set; }
    public string Name { get; set; }
}

// ============================================================
// UTILISATION DANS UN CONTROLLER
// ============================================================

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly AIServiceClient _aiService;
    private readonly ILeadService _leadService;
    
    public LeadsController(AIServiceClient aiService, ILeadService leadService)
    {
        _aiService = aiService;
        _leadService = leadService;
    }
    
    [HttpPost("predict")]
    public async Task<IActionResult> PredictLead([FromBody] LeadPredictionRequest request)
    {
        try
        {
            // Extraire les features du lead depuis la base de données
            var lead = await _leadService.GetLeadByIdAsync(request.LeadId);
            
            var aiRequest = new ProspectPredictionRequest
            {
                ProspectId = lead.Id.ToString(),
                ProspectName = lead.Name,
                Features = ExtractFeatures(lead), // À implémenter
                ReturnSimilar = true
            };
            
            var prediction = await _aiService.PredictAsync(aiRequest);
            
            // Sauvegarder la prédiction
            lead.PredictedCluster = prediction.Cluster;
            lead.SuggestedProductId = prediction.SuggestedProduct.Id;
            lead.RelevanceScore = prediction.RelevanceScore;
            
            await _leadService.UpdateLeadAsync(lead);
            
            return Ok(prediction);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, "AI Service unavailable");
        }
    }
    
    [HttpPost("predict-batch")]
    public async Task<IActionResult> PredictLeadsBatch([FromBody] List<string> leadIds)
    {
        try
        {
            var leads = await _leadService.GetLeadsByIdsAsync(leadIds);
            
            var prospects = leads.Select(lead => new ProspectPredictionRequest
            {
                ProspectId = lead.Id.ToString(),
                ProspectName = lead.Name,
                Features = ExtractFeatures(lead)
            }).ToList();
            
            var request = new ProspectPredictionBatchRequest { Prospects = prospects };
            var results = await _aiService.PredictBatchAsync(request);
            
            // Mettre à jour tous les leads
            foreach (var prediction in results.Predictions)
            {
                var lead = leads.FirstOrDefault(l => l.Id.ToString() == prediction.ProspectId);
                if (lead != null)
                {
                    lead.PredictedCluster = prediction.Cluster;
                    lead.SuggestedProductId = prediction.SuggestedProduct.Id;
                    lead.RelevanceScore = prediction.RelevanceScore;
                    await _leadService.UpdateLeadAsync(lead);
                }
            }
            
            return Ok(results);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, "AI Service unavailable");
        }
    }
    
    /// <summary>
    /// Extraire les features numériques d'un lead
    /// </summary>
    private double[] ExtractFeatures(Lead lead)
    {
        return new[]
        {
            lead.Budget > 0 ? Math.Min(lead.Budget / 100000.0, 1.0) : 0.0, // Budget normalisé
            Math.Min(lead.EngagementScore / 100.0, 1.0), // Engagement
            Math.Min(lead.ConversionProbability / 100.0, 1.0), // Probabilité conversion
            lead.CompanySize > 0 ? Math.Min(lead.CompanySize / 10000.0, 1.0) : 0.0, // Taille
            lead.IsActive ? 1.0 : 0.0 // Actif
        };
    }
}

// ============================================================
// CONFIGURATION DANS STARTUP
// ============================================================

public void ConfigureServices(IServiceCollection services)
{
    services.AddHttpClient<AIServiceClient>(client =>
    {
        var aiServiceUrl = Configuration["AIService:Url"] ?? "http://localhost:5001";
        client.BaseAddress = new Uri(aiServiceUrl);
        client.Timeout = TimeSpan.FromSeconds(30);
    });
    
    services.AddControllers();
}
"""

# ============================================================
# CONFIGURATION APPSETTINGS.JSON
# ============================================================

APPSETTINGS_JSON = """
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "AIService": {
    "Url": "http://localhost:5001"
  },
  "AllowedHosts": "*"
}
"""

# ============================================================
# MODÈLES D'EXTENSION POUR LEAD
# ============================================================

LEAD_EXTENSIONS = """
// Ajouter ces propriétés au modèle Lead existant

public partial class Lead
{
    // Résultats de la prédiction IA
    [Required]
    public int? PredictedCluster { get; set; } // Cluster KMeans
    
    [MaxLength(50)]
    public string SuggestedProductId { get; set; } // Produit suggéré par KNN
    
    [Range(0, 1)]
    public double RelevanceScore { get; set; } // Score de pertinence (0-1)
    
    // Features pour l'entraînement
    public double BudgetFeature { get; set; }
    public double EngagementFeature { get; set; }
    public double ConversionFeature { get; set; }
    public double CompanySizeFeature { get; set; }
    public double ActivityFeature { get; set; }
    
    // Metadata
    public DateTime PredictionDate { get; set; } = DateTime.UtcNow;
    
    [MaxLength(500)]
    public string AIAnalysis { get; set; } // Notes d'analyse IA
    
    // Relation avec Product
    [ForeignKey(nameof(SuggestedProductId))]
    public Product SuggestedProduct { get; set; }
}
"""

# ============================================================
# MIGRATION BASE DE DONNÉES
# ============================================================

MIGRATION_SQL = """
-- Ajouter les colonnes pour les résultats IA
ALTER TABLE Leads ADD
    PredictedCluster INT NULL,
    SuggestedProductId NVARCHAR(50) NULL,
    RelevanceScore FLOAT NOT NULL DEFAULT 0,
    BudgetFeature FLOAT NOT NULL DEFAULT 0,
    EngagementFeature FLOAT NOT NULL DEFAULT 0,
    ConversionFeature FLOAT NOT NULL DEFAULT 0,
    CompanySizeFeature FLOAT NOT NULL DEFAULT 0,
    ActivityFeature FLOAT NOT NULL DEFAULT 0,
    PredictionDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AIAnalysis NVARCHAR(500) NULL;

-- Index pour améliorer les requêtes
CREATE INDEX IX_Leads_PredictedCluster ON Leads(PredictedCluster);
CREATE INDEX IX_Leads_SuggestedProductId ON Leads(SuggestedProductId);
CREATE INDEX IX_Leads_RelevanceScore ON Leads(RelevanceScore DESC);

-- Foreign key vers Products
ALTER TABLE Leads
ADD CONSTRAINT FK_Leads_Products_SuggestedProductId
FOREIGN KEY (SuggestedProductId) REFERENCES Products(Id);
"""

# ============================================================
# ENTRAÎNEMENT DES MODÈLES
# ============================================================

TRAINING_SERVICE = """
public class AITrainingService
{
    private readonly HttpClient _httpClient;
    private readonly ILeadService _leadService;
    private readonly IProductService _productService;
    
    public AITrainingService(HttpClient httpClient, ILeadService leadService, IProductService productService)
    {
        _httpClient = httpClient;
        _leadService = leadService;
        _productService = productService;
    }
    
    public async Task TrainModelsAsync()
    {
        try
        {
            // Récupérer tous les leads et produits
            var leads = await _leadService.GetAllLeadsAsync();
            var products = await _productService.GetAllProductsAsync();
            
            // Préparer les données d'entraînement
            var trainRequest = new
            {
                prospects = leads.Select(l => new
                {
                    id = l.Id.ToString(),
                    name = l.Name,
                    features = ExtractFeatures(l)
                }).ToList(),
                products = products.Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    features = ExtractProductFeatures(p),
                    category = p.Category,
                    price = p.Price
                }).ToList(),
                product_assignments = leads.Select(l => l.SuggestedProductId ?? "prod_default").ToList()
            };
            
            var json = JsonSerializer.Serialize(trainRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync("http://localhost:5001/train", content);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                // Log success
            }
            else
            {
                // Log error
            }
        }
        catch (Exception ex)
        {
            // Log exception
        }
    }
}
"""

print(__doc__)
print("\n" + "="*60)
print("📝 GUIDE D'INTÉGRATION - MICROSERVICE IA")
print("="*60)
print("\nCe guide montre comment intégrer le microservice IA Flask")
print("avec le backend .NET existant.")
print("\n✅ Étapes d'intégration:")
print("1. Copier la classe AIServiceClient dans le backend")
print("2. Configurer appsettings.json avec l'URL du service IA")
print("3. Ajouter les propriétés au modèle Lead")
print("4. Exécuter la migration base de données")
print("5. Appeler le service depuis les controllers")
print("6. Entraîner les modèles via AITrainingService")
print("\n" + "="*60)
