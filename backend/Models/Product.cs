using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace LeadProdos.Backend.Models
{
    public class Product
    {
        [BsonElement("_id")]
        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [BsonElement("Name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [BsonElement("Description")]
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [BsonElement("Price")]
        [JsonPropertyName("price")]
        public decimal Price { get; set; }
        
        [BsonElement("Stock")]
        [JsonPropertyName("stock")]
        public int Stock { get; set; } = 0;
        
        [BsonElement("Category")]
        [JsonPropertyName("category")]
        public string Category { get; set; }
        
        [BsonElement("CreatedAt")]
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("UpdatedAt")]
        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
