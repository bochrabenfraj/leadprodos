using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LeadProdos.Backend.Models;
using LeadProdos.Backend.DTOs;
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
    public class ClientsController : ControllerBase
    {
        private readonly IMongoDatabase _database;

        public ClientsController(IMongoDatabase database)
        {
            _database = database;
        }

        [HttpGet]
        public async Task<ActionResult> GetClients()
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Clients");
                var documents = await collection.Find(new BsonDocument()).ToListAsync();
                
                var clients = documents.Select(doc => new
                {
                    id = doc["_id"].ToString(),
                    name = doc.Contains("Name") ? doc["Name"].AsString : "",
                    email = doc.Contains("Email") ? doc["Email"].AsString : "",
                    phone = doc.Contains("Phone") ? doc["Phone"].AsString : "",
                    company = doc.Contains("Company") ? doc["Company"].AsString : "",
                    socialMediaProfiles = doc.Contains("SocialMediaProfiles") ? doc["SocialMediaProfiles"].AsString : "",
                    interestScore = doc.Contains("InterestScore") ? 
                        (doc["InterestScore"].IsDouble ? doc["InterestScore"].AsDouble : 
                         doc["InterestScore"].IsInt32 ? doc["InterestScore"].AsInt32 : 
                         doc["InterestScore"].IsInt64 ? doc["InterestScore"].AsInt64 : 0.0) : 0,
                    createdAt = doc.Contains("CreatedAt") ? doc["CreatedAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("UpdatedAt") ? doc["UpdatedAt"].ToUniversalTime() : DateTime.MinValue
                }).ToList();
                
                return Ok(clients);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Erreur serveur lors de la récupération des clients" });
            }
        }

        [HttpGet("search")]
        [Authorize]
        public async Task<ActionResult> SearchClients([FromQuery] string searchTerm = "", [FromQuery] string company = "", [FromQuery] double? minScore = null, [FromQuery] double? maxScore = null)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Clients");
                var filters = new List<FilterDefinition<BsonDocument>>();

                // Text search filter
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    var textFilters = new BsonDocument
                    {
                        {
                            "$or", new BsonArray
                            {
                                new BsonDocument { { "Name", new BsonDocument { { "$regex", searchTerm }, { "$options", "i" } } } },
                                new BsonDocument { { "Email", new BsonDocument { { "$regex", searchTerm }, { "$options", "i" } } } },
                                new BsonDocument { { "Phone", new BsonDocument { { "$regex", searchTerm }, { "$options", "i" } } } }
                            }
                        }
                    };
                    filters.Add(new BsonDocumentFilterDefinition<BsonDocument>(textFilters));
                }

                // Company filter
                if (!string.IsNullOrEmpty(company) && company != "Non spécifié")
                {
                    filters.Add(Builders<BsonDocument>.Filter.Eq("Company", company));
                }

                // Interest score range filter
                if (minScore.HasValue)
                {
                    filters.Add(Builders<BsonDocument>.Filter.Gte("InterestScore", minScore.Value));
                }

                if (maxScore.HasValue)
                {
                    filters.Add(Builders<BsonDocument>.Filter.Lte("InterestScore", maxScore.Value));
                }

                // Combine all filters
                var combinedFilter = filters.Count > 0 
                    ? Builders<BsonDocument>.Filter.And(filters) 
                    : new BsonDocument();

                var documents = await collection.Find(combinedFilter).ToListAsync();
                
                var clients = documents.Select(doc => new
                {
                    id = doc["_id"].ToString(),
                    name = doc.Contains("Name") ? doc["Name"].AsString : "",
                    email = doc.Contains("Email") ? doc["Email"].AsString : "",
                    phone = doc.Contains("Phone") ? doc["Phone"].AsString : "",
                    company = doc.Contains("Company") ? doc["Company"].AsString : "",
                    socialMediaProfiles = doc.Contains("SocialMediaProfiles") ? doc["SocialMediaProfiles"].AsString : "",
                    interestScore = doc.Contains("InterestScore") ? 
                        (doc["InterestScore"].IsDouble ? doc["InterestScore"].AsDouble : 
                         doc["InterestScore"].IsInt32 ? doc["InterestScore"].AsInt32 : 
                         doc["InterestScore"].IsInt64 ? doc["InterestScore"].AsInt64 : 0.0) : 0,
                    createdAt = doc.Contains("CreatedAt") ? doc["CreatedAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("UpdatedAt") ? doc["UpdatedAt"].ToUniversalTime() : DateTime.MinValue
                }).ToList();
                
                return Ok(clients);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erreur SearchClients: {ex.Message}");
                return BadRequest(new { message = "Erreur lors de la recherche des clients: " + ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(string id)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Clients");
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                var doc = await collection.Find(filter).FirstOrDefaultAsync();
                
                if (doc == null)
                    return NotFound();
                    
                return Ok(doc);
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Client>> CreateClient([FromBody] CreateClientRequest clientRequest)
        {
            try
            {
                // Validation des champs requis
                if (string.IsNullOrWhiteSpace(clientRequest.Name))
                    return BadRequest(new { message = "Le nom du client est obligatoire" });
                
                if (string.IsNullOrWhiteSpace(clientRequest.Email))
                    return BadRequest(new { message = "L'email est obligatoire" });
                
                if (string.IsNullOrWhiteSpace(clientRequest.Company))
                    return BadRequest(new { message = "L'entreprise est obligatoire" });
                
                var collection = _database.GetCollection<BsonDocument>("Clients");
                
                // Vérifier que l'email n'existe pas déjà
                var existingClient = await collection.Find(
                    Builders<BsonDocument>.Filter.Eq("Email", clientRequest.Email)
                ).FirstOrDefaultAsync();
                
                if (existingClient != null)
                    return Conflict(new { message = "Email déjà utilisé par un autre client" });
                
                var newId = ObjectId.GenerateNewId();
                var doc = new BsonDocument
                {
                    { "_id", newId },
                    { "Name", clientRequest.Name },
                    { "Email", clientRequest.Email },
                    { "Phone", clientRequest.Phone ?? "" },
                    { "Company", clientRequest.Company },
                    { "SocialMediaProfiles", clientRequest.SocialMediaProfiles ?? "" },
                    { "InterestScore", 0 }, // Par défaut = 0
                    { "CreatedAt", DateTime.UtcNow },
                    { "UpdatedAt", DateTime.UtcNow }
                };
                
                await collection.InsertOneAsync(doc);
                
                return CreatedAtAction(nameof(GetClient), new { id = newId.ToString() }, new
                {
                    id = newId.ToString(),
                    name = clientRequest.Name,
                    email = clientRequest.Email,
                    phone = clientRequest.Phone,
                    company = clientRequest.Company,
                    socialMediaProfiles = clientRequest.SocialMediaProfiles,
                    interestScore = 0,
                    createdAt = DateTime.UtcNow,
                    updatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateClient(string id, [FromBody] UpdateClientRequest clientRequest)
        {
            try
            {
                // Validation des champs requis
                if (string.IsNullOrWhiteSpace(clientRequest.Name))
                    return BadRequest(new { message = "Le nom du client est obligatoire" });
                
                if (string.IsNullOrWhiteSpace(clientRequest.Email))
                    return BadRequest(new { message = "L'email est obligatoire" });
                
                if (string.IsNullOrWhiteSpace(clientRequest.Company))
                    return BadRequest(new { message = "L'entreprise est obligatoire" });

                var collection = _database.GetCollection<BsonDocument>("Clients");
                
                // Vérifier que l'objectId est valide
                if (!ObjectId.TryParse(id, out ObjectId objectId))
                    return BadRequest(new { message = "ID invalide" });

                // Vérifier que le client existe
                var existingClient = await collection.Find(
                    Builders<BsonDocument>.Filter.Eq("_id", objectId)
                ).FirstOrDefaultAsync();
                
                if (existingClient == null)
                    return NotFound(new { message = "Client non trouvé" });

                // Vérifier si un autre client n'utilise pas potentiellement le même email (optionnel en cas de uniqueness)
                var emailFilter = Builders<BsonDocument>.Filter.And(
                    Builders<BsonDocument>.Filter.Eq("Email", clientRequest.Email),
                    Builders<BsonDocument>.Filter.Ne("_id", objectId)
                );
                
                var duplicateEmail = await collection.Find(emailFilter).FirstOrDefaultAsync();
                if (duplicateEmail != null)
                    return Conflict(new { message = "Email déjà utilisé par un autre client" });
                
                var update = Builders<BsonDocument>.Update
                    .Set("Name", clientRequest.Name)
                    .Set("Email", clientRequest.Email)
                    .Set("Phone", clientRequest.Phone ?? "")
                    .Set("Company", clientRequest.Company)
                    .Set("SocialMediaProfiles", clientRequest.SocialMediaProfiles ?? "")
                    .Set("InterestScore", clientRequest.InterestScore)
                    .Set("UpdatedAt", DateTime.UtcNow);
                
                var result = await collection.UpdateOneAsync(
                    Builders<BsonDocument>.Filter.Eq("_id", objectId),
                    update
                );
                
                if (result.ModifiedCount == 0)
                    return BadRequest(new { message = "La mise à jour n'a pas pu être effectuée" });
                
                return Ok(new { message = "Client mis à jour avec succès" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erreur lors de la mise à jour: " + ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(string id)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Clients");
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                
                var result = await collection.DeleteOneAsync(filter);
                
                if (result.DeletedCount == 0)
                    return NotFound(new { error = "Client not found" });
                
                return Ok(new { message = "Client deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
