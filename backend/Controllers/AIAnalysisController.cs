using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using LeadProdos.Backend.DTOs;

namespace LeadProdos.Backend.Controllers
{
    /// <summary>
    /// Contrôleur pour l'analyse IA des clients potentiels
    /// Permet aux commerciaux d'analyser les clients pour un produit spécifique
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Commercial")]
    public class AIAnalysisController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AIAnalysisController> _logger;
        private readonly string _aiServiceUrl;

        public AIAnalysisController(HttpClient httpClient, ILogger<AIAnalysisController> logger, IConfiguration config)
        {
            _httpClient = httpClient;
            _logger = logger;
            _aiServiceUrl = config.GetValue<string>("AIService:Url") ?? "http://localhost:5000";
        }

        /// <summary>
        /// Analyser les clients potentiels pour un produit
        /// Retourne une liste classée par score avec clustering et mots-clés extraits
        /// </summary>
        [HttpPost("analyze-product-clients")]
        public async Task<IActionResult> AnalyzeProductClients([FromBody] AnalyzeClientsRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.ProductId))
                {
                    return BadRequest(new { message = "Le ProductId est requis" });
                }

                if (request.Clients == null || request.Clients.Count == 0)
                {
                    return BadRequest(new { message = "Au moins un client est requis" });
                }

                _logger.LogInformation($"Analyse IA lancée pour le produit {request.ProductId} avec {request.Clients.Count} clients");

                // Préparer la requête pour le service IA
                var aiRequest = new
                {
                    product_id = request.ProductId,
                    product_name = request.ProductName,
                    clients = request.Clients.ConvertAll(c => new
                    {
                        id = c.Id,
                        name = c.Name,
                        email = c.Email,
                        features = c.Features,
                        social_media_text = c.SocialMediaText ?? "",
                        metadata = new { }
                    })
                };

                // Sérialiser en JSON
                var jsonContent = new StringContent(
                    JsonSerializer.Serialize(aiRequest),
                    Encoding.UTF8,
                    "application/json"
                );

                // Appeler le service IA Flask
                var response = await _httpClient.PostAsync(
                    $"{_aiServiceUrl}/analyze-clients-for-product",
                    jsonContent
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Erreur du service IA: {response.StatusCode} - {errorContent}");
                    return StatusCode(500, new { message = "Erreur lors de l'analyse IA", error = errorContent });
                }

                // Récupérer et retourner le résultat
                var resultContent = await response.Content.ReadAsStringAsync();
                var analysisResult = JsonSerializer.Deserialize<JsonElement>(resultContent);

                _logger.LogInformation($"Analyse IA complétée pour le produit {request.ProductId}");

                return Ok(analysisResult);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Erreur de connexion au service IA: {ex.Message}");
                return StatusCode(503, new { message = "Service IA indisponible", error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de l'analyse: {ex.Message}");
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        /// <summary>
        /// Vérifier la disponibilité du service IA
        /// </summary>
        [HttpGet("health")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckAIServiceHealth()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_aiServiceUrl}/health");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var health = JsonSerializer.Deserialize<JsonElement>(content);
                    return Ok(new { aiService = "available", details = health });
                }
                
                return StatusCode(503, new { aiService = "unavailable" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de la vérification du service IA: {ex.Message}");
                return StatusCode(503, new { aiService = "unavailable", error = ex.Message });
            }
        }
    }

    /// <summary>
    /// DTO pour la requête d'analyse des clients
    /// </summary>
    public class AnalyzeClientsRequest
    {
        public required string ProductId { get; set; }
        public string? ProductName { get; set; }
        public List<ClientAnalysisData> Clients { get; set; } = new();
    }

    /// <summary>
    /// Données d'un client pour l'analyse IA
    /// </summary>
    public class ClientAnalysisData
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public List<double> Features { get; set; } = new();
        public string? SocialMediaText { get; set; }
    }
}
