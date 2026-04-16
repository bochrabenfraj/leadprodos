using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LeadProdos.Backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;

namespace LeadProdos.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly IMongoDatabase _database;

        public CategoriesController(IMongoDatabase database)
        {
            _database = database;
        }

        [HttpGet]
        public async Task<ActionResult> GetCategories()
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Categories");
                var documents = await collection.Find(new BsonDocument()).ToListAsync();
                
                var categories = documents.Select(doc => new
                {
                    id = doc["_id"].ToString(),
                    name = doc.Contains("Name") ? doc["Name"].AsString : "",
                    description = doc.Contains("Description") ? doc["Description"].AsString : "",
                    color = doc.Contains("Color") ? doc["Color"].AsString : "#667eea",
                    icon = doc.Contains("Icon") ? doc["Icon"].AsString : "📦",
                    productCount = 0,
                    createdAt = doc.Contains("CreatedAt") ? doc["CreatedAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("UpdatedAt") ? doc["UpdatedAt"].ToUniversalTime() : DateTime.MinValue
                }).ToList();
                
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetCategory(string id)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Categories");
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                var doc = await collection.Find(filter).FirstOrDefaultAsync();
                
                if (doc == null)
                    return NotFound();
                    
                return Ok(new
                {
                    id = doc["_id"].ToString(),
                    name = doc.Contains("Name") ? doc["Name"].AsString : "",
                    description = doc.Contains("Description") ? doc["Description"].AsString : "",
                    color = doc.Contains("Color") ? doc["Color"].AsString : "#667eea",
                    icon = doc.Contains("Icon") ? doc["Icon"].AsString : "📦",
                    createdAt = doc.Contains("CreatedAt") ? doc["CreatedAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("UpdatedAt") ? doc["UpdatedAt"].ToUniversalTime() : DateTime.MinValue
                });
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateCategory([FromBody] CreateCategoryRequest categoryRequest)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Categories");
                var newId = ObjectId.GenerateNewId();
                var doc = new BsonDocument
                {
                    { "_id", newId },
                    { "Name", categoryRequest.Name ?? "" },
                    { "Description", categoryRequest.Description ?? "" },
                    { "Color", categoryRequest.Color ?? "#667eea" },
                    { "Icon", categoryRequest.Icon ?? "📦" },
                    { "CreatedAt", DateTime.UtcNow },
                    { "UpdatedAt", DateTime.UtcNow }
                };
                
                await collection.InsertOneAsync(doc);
                
                return Ok(new
                {
                    id = newId.ToString(),
                    name = categoryRequest.Name,
                    description = categoryRequest.Description,
                    color = categoryRequest.Color ?? "#667eea",
                    icon = categoryRequest.Icon ?? "📦",
                    createdAt = DateTime.UtcNow,
                    updatedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(string id, [FromBody] UpdateCategoryRequest categoryRequest)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Categories");
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                
                var update = Builders<BsonDocument>.Update
                    .Set("Name", categoryRequest.Name ?? "")
                    .Set("Description", categoryRequest.Description ?? "")
                    .Set("Color", categoryRequest.Color ?? "#667eea")
                    .Set("Icon", categoryRequest.Icon ?? "📦")
                    .Set("UpdatedAt", DateTime.UtcNow);
                
                var result = await collection.UpdateOneAsync(filter, update);
                
                if (result.MatchedCount == 0)
                    return NotFound(new { error = "Category not found" });
                
                return Ok(new { message = "Category updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Categories");
                var categoryFilter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                
                // Vérifier si la catégorie existe
                var category = await collection.Find(categoryFilter).FirstOrDefaultAsync();
                if (category == null)
                    return NotFound(new { message = "Catégorie non trouvée" });
                
                // Récupérer le nom de la catégorie
                var categoryName = category.Contains("Name") ? category["Name"].AsString : "";
                
                // Vérifier si des produits sont liés à cette catégorie (par le nom)
                var productsCollection = _database.GetCollection<BsonDocument>("Products");
                var productsFilter = Builders<BsonDocument>.Filter.Eq("Category", categoryName);
                var linkedProducts = await productsCollection.Find(productsFilter).ToListAsync();
                
                if (linkedProducts.Count > 0)
                    return StatusCode(409, new { message = "Impossible de supprimer cette catégorie. Elle contient " + linkedProducts.Count + " produit(s)." });
                
                // Supprimer la catégorie
                var result = await collection.DeleteOneAsync(categoryFilter);
                
                if (result.DeletedCount == 0)
                    return NotFound(new { message = "Catégorie non trouvée" });
                
                return Ok(new { message = "Catégorie supprimée avec succès" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur: " + ex.Message });
            }
        }
    }
}
