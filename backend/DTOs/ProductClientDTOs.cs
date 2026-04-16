using System.Text.Json.Serialization;

namespace LeadProdos.Backend.DTOs
{
    public class CreateProductRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("price")]
        public decimal Price { get; set; }
        
        [JsonPropertyName("stock")]
        public int Stock { get; set; }
        
        [JsonPropertyName("category")]
        public string Category { get; set; }
    }

    public class UpdateProductRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("price")]
        public decimal Price { get; set; }
        
        [JsonPropertyName("stock")]
        public int Stock { get; set; }
        
        [JsonPropertyName("category")]
        public string Category { get; set; }
    }

    public class CreateClientRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("phone")]
        public string Phone { get; set; }
        
        [JsonPropertyName("company")]
        public string Company { get; set; }
        
        [JsonPropertyName("socialMediaProfiles")]
        public string SocialMediaProfiles { get; set; }
        
        [JsonPropertyName("interestScore")]
        public int InterestScore { get; set; }
    }

    public class UpdateClientRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("phone")]
        public string Phone { get; set; }
        
        [JsonPropertyName("company")]
        public string Company { get; set; }
        
        [JsonPropertyName("socialMediaProfiles")]
        public string SocialMediaProfiles { get; set; }
        
        [JsonPropertyName("interestScore")]
        public int InterestScore { get; set; }
    }
}
