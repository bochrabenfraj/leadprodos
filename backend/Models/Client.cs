using System.Text.Json.Serialization;

namespace LeadProdos.Backend.Models
{
    public class Client
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }
        
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        
        [JsonPropertyName("email")]
        public string? Email { get; set; }
        
        [JsonPropertyName("phone")]
        public string? Phone { get; set; }
        
        [JsonPropertyName("company")]
        public string? Company { get; set; }
        
        [JsonPropertyName("socialMediaProfiles")]
        public string? SocialMediaProfiles { get; set; }
        
        [JsonPropertyName("recommendedProductId")]
        public string? RecommendedProductId { get; set; }
        
        [JsonPropertyName("interestScore")]
        public decimal InterestScore { get; set; } = 0;
        
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
