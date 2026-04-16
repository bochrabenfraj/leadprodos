using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LeadProdos.Backend.Models;
using LeadProdos.Backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;

namespace LeadProdos.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeadsController : ControllerBase
    {
        private readonly ILeadService _leadService;
        private readonly IAIService _aiService;
        private readonly IMongoDatabase _database;

        public LeadsController(ILeadService leadService, IAIService aiService, IMongoDatabase database)
        {
            _leadService = leadService;
            _aiService = aiService;
            _database = database;
        }

        [HttpGet]
        public async Task<ActionResult> GetLeads()
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Leads");
                var documents = await collection.Find(new BsonDocument()).ToListAsync();
                
                var leads = documents.Select(doc => new
                {
                    id = doc["_id"].ToString(),
                    clientId = doc.Contains("clientId") ? doc["clientId"].AsString : "",
                    productId = doc.Contains("productId") ? doc["productId"].AsString : "",
                    status = doc.Contains("status") ? doc["status"].AsString : "",
                    matchScore = GetDoubleValue(doc, "matchScore"),
                    analysisDetails = doc.Contains("analysisDetails") ? doc["analysisDetails"].AsString : "",
                    createdAt = doc.Contains("createdAt") ? doc["createdAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("updatedAt") ? doc["updatedAt"].ToUniversalTime() : DateTime.MinValue
                }).ToList();
                
                System.Console.WriteLine($"✅ GetLeads retourne {leads.Count} leads");
                return Ok(leads);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"❌ GetLeads erreur: {ex.Message}");
                return StatusCode(500, new { message = "Erreur serveur lors de la récupération des leads", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Lead>> GetLead(string id)
        {
            var lead = await _leadService.GetLeadByIdAsync(id);
            if (lead == null)
                return NotFound();
            return Ok(lead);
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeLeads([FromBody] AnalyzeLeadsRequest request)
        {
            if (string.IsNullOrEmpty(request.ProductId))
            {
                return BadRequest(new { message = "ProductId est requis" });
            }
            
            var results = await _aiService.AnalyzeAndIdentifyLeadsAsync(request.ProductId);
            return Ok(results);
        }

        [HttpPost]
        public async Task<ActionResult<Lead>> CreateLead([FromBody] Lead lead)
        {
            var createdLead = await _leadService.CreateLeadAsync(lead);
            return CreatedAtAction(nameof(GetLead), new { id = createdLead.Id }, createdLead);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLead(string id, [FromBody] Lead lead)
        {
            await _leadService.UpdateLeadAsync(id, lead);
            return NoContent();
        }

        private double GetDoubleValue(BsonDocument doc, string fieldName)
        {
            if (!doc.Contains(fieldName)) return 0;
            
            var value = doc[fieldName];
            if (value.IsDouble) return value.AsDouble;
            if (value.IsInt32) return value.AsInt32;
            if (value.IsInt64) return value.AsInt64;
            if (value.IsDecimal128) return (double)value.AsDecimal128;
            if (value.IsString && double.TryParse(value.AsString, out var d)) return d;
            
            return 0;
        }
    }

    public class AnalyzeLeadsRequest
    {
        public string? ProductId { get; set; }
    }
}
