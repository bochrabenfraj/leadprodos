using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace LeadProdos.Backend.Models
{
    public class Client
    {
        [BsonElement("_id")]
        [JsonPropertyName("id")]
        public string? Id { get; set; }
        
        [BsonElement("Name")]
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        
        [BsonElement("Email")]
        [JsonPropertyName("email")]
        public string? Email { get; set; }
        
        [BsonElement("Phone")]
        [JsonPropertyName("phone")]
        public string? Phone { get; set; }
        
        [BsonElement("Company")]
        [JsonPropertyName("company")]
        public string? Company { get; set; }
        
        [BsonElement("SocialMediaProfiles")]
        [JsonPropertyName("socialMediaProfiles")]
        public string? SocialMediaProfiles { get; set; }
        
        [BsonElement("RecommendedProductId")]
        [JsonPropertyName("recommendedProductId")]
        public string? RecommendedProductId { get; set; }
        
        [BsonElement("InterestScore")]
        [JsonPropertyName("interestScore")]
        public decimal InterestScore { get; set; } = 0;
        
        [BsonElement("CreatedAt")]
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("UpdatedAt")]
        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
