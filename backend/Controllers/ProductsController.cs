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
    public class ProductsController : ControllerBase
    {
        private readonly IMongoDatabase _database;

        public ProductsController(IMongoDatabase database)
        {
            _database = database;
        }

        [HttpGet]
        public async Task<ActionResult> GetProducts()
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Products");
                var documents = await collection.Find(new BsonDocument()).ToListAsync();
                
                var products = documents.Select(doc => new
                {
                    id = doc["_id"].ToString(),
                    name = doc.Contains("Name") ? doc["Name"].AsString : "",
                    description = doc.Contains("Description") ? doc["Description"].AsString : "",
                    price = GetDoubleValue(doc, "Price"),
                    stock = doc.Contains("Stock") ? doc["Stock"].AsInt32 : 0,
                    category = doc.Contains("Category") ? doc["Category"].AsString : "",
                    createdAt = doc.Contains("CreatedAt") ? doc["CreatedAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("UpdatedAt") ? doc["UpdatedAt"].ToUniversalTime() : DateTime.MinValue
                }).ToList();
                
                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
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

        [HttpGet("{id}")]
        public async Task<ActionResult> GetProduct(string id)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Products");
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                var doc = await collection.Find(filter).FirstOrDefaultAsync();
                
                if (doc == null)
                    return NotFound(new { error = "Product not found" });
                
                var product = new
                {
                    id = doc["_id"].ToString(),
                    name = doc.Contains("Name") ? doc["Name"].AsString : "",
                    description = doc.Contains("Description") ? doc["Description"].AsString : "",
                    price = GetDoubleValue(doc, "Price"),
                    stock = doc.Contains("Stock") ? doc["Stock"].AsInt32 : 0,
                    category = doc.Contains("Category") ? doc["Category"].AsString : "",
                    createdAt = doc.Contains("CreatedAt") ? doc["CreatedAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("UpdatedAt") ? doc["UpdatedAt"].ToUniversalTime() : DateTime.MinValue
                };
                    
                return Ok(product);
            }
            catch (Exception ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] CreateProductRequest productRequest)
        {
            try
            {
                // Validation backend
                if (string.IsNullOrWhiteSpace(productRequest.Name))
                    return BadRequest(new { message = "Le nom du produit est obligatoire" });
                
                if (productRequest.Price <= 0)
                    return BadRequest(new { message = "Le prix doit être supérieur à 0" });

                var collection = _database.GetCollection<BsonDocument>("Products");
                var newId = ObjectId.GenerateNewId();
                var doc = new BsonDocument
                {
                    { "_id", newId },
                    { "Name", productRequest.Name ?? "" },
                    { "Description", productRequest.Description ?? "" },
                    { "Price", productRequest.Price },
                    { "Stock", productRequest.Stock },
                    { "Category", productRequest.Category ?? "" },
                    { "CreatedAt", DateTime.UtcNow },
                    { "UpdatedAt", DateTime.UtcNow }
                };
                
                await collection.InsertOneAsync(doc);
                
                var createdProduct = new
                {
                    id = newId.ToString(),
                    name = productRequest.Name,
                    description = productRequest.Description,
                    price = productRequest.Price,
                    stock = productRequest.Stock,
                    category = productRequest.Category,
                    createdAt = DateTime.UtcNow,
                    updatedAt = DateTime.UtcNow
                };

                return CreatedAtAction(nameof(GetProduct), new { id = newId.ToString() }, createdProduct);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(string id, [FromBody] UpdateProductRequest productRequest)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Products");
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                
                var update = Builders<BsonDocument>.Update
                    .Set("Name", productRequest.Name ?? "")
                    .Set("Description", productRequest.Description ?? "")
                    .Set("Price", productRequest.Price)
                    .Set("Stock", productRequest.Stock)
                    .Set("Category", productRequest.Category ?? "")
                    .Set("UpdatedAt", DateTime.UtcNow);
                
                var result = await collection.UpdateOneAsync(filter, update);
                
                if (result.MatchedCount == 0)
                    return NotFound(new { error = "Product not found" });
                
                return Ok(new { message = "Product updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Products");
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                
                var result = await collection.DeleteOneAsync(filter);
                
                if (result.DeletedCount == 0)
                    return NotFound(new { error = "Product not found" });
                
                return Ok(new { message = "Product deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("categories/list")]
        public async Task<ActionResult> GetCategories()
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Products");
                
                var pipeline = new BsonDocument[]
                {
                    new BsonDocument("$group", new BsonDocument
                    {
                        { "_id", "$Category" },
                        { "count", new BsonDocument("$sum", 1) }
                    }),
                    new BsonDocument("$sort", new BsonDocument("_id", 1))
                };
                
                var categories = await collection.Aggregate<BsonDocument>(pipeline).ToListAsync();
                
                var result = categories.Select(c => new
                {
                    category = c.Contains("_id") ? c["_id"].AsString : "Uncategorized",
                    count = c.Contains("count") ? c["count"].AsInt32 : 0
                }).ToList();
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("by-category")]
        public async Task<ActionResult> GetProductsByCategory()
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Products");
                
                var pipeline = new BsonDocument[]
                {
                    new BsonDocument("$sort", new BsonDocument("Category", 1).Add("Name", 1)),
                    new BsonDocument("$group", new BsonDocument
                    {
                        { "_id", "$Category" },
                        { "products", new BsonDocument("$push", new BsonDocument
                        {
                            { "id", "$_id" },
                            { "name", "$Name" },
                            { "description", "$Description" },
                            { "price", "$Price" },
                            { "stock", "$Stock" }
                        })},
                        { "count", new BsonDocument("$sum", 1) }
                    }),
                    new BsonDocument("$sort", new BsonDocument("_id", 1))
                };
                
                var groupedData = await collection.Aggregate<BsonDocument>(pipeline).ToListAsync();
                
                var result = groupedData.Select(g => new
                {
                    category = g.Contains("_id") ? g["_id"].AsString : "Uncategorized",
                    count = g.Contains("count") ? g["count"].AsInt32 : 0,
                    products = (object)(g.Contains("products") ? g["products"].AsBsonArray.Select(p =>
                    {
                        var doc = p.AsBsonDocument;
                        return new {
                            id = doc.Contains("id") ? doc["id"].ToString() : "",
                            name = doc.Contains("name") ? doc["name"].AsString : "",
                            description = doc.Contains("description") ? doc["description"].AsString : "",
                            price = GetDoubleValue(doc, "price"),
                            stock = doc.Contains("stock") ? doc["stock"].AsInt32 : 0
                        };
                    }).ToList() : new List<object>())
                }).ToList();
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("filter-by-category/{category}")]
        public async Task<ActionResult> FilterByCategory(string category)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>("Products");
                var filter = Builders<BsonDocument>.Filter.Eq("Category", category);
                var documents = await collection.Find(filter).SortBy(d => d["Name"]).ToListAsync();
                
                var products = documents.Select(doc => new
                {
                    id = doc["_id"].ToString(),
                    name = doc.Contains("Name") ? doc["Name"].AsString : "",
                    description = doc.Contains("Description") ? doc["Description"].AsString : "",
                    price = GetDoubleValue(doc, "Price"),
                    stock = doc.Contains("Stock") ? doc["Stock"].AsInt32 : 0,
                    category = doc.Contains("Category") ? doc["Category"].AsString : "",
                    createdAt = doc.Contains("CreatedAt") ? doc["CreatedAt"].ToUniversalTime() : DateTime.MinValue,
                    updatedAt = doc.Contains("UpdatedAt") ? doc["UpdatedAt"].ToUniversalTime() : DateTime.MinValue
                }).ToList();
                
                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
