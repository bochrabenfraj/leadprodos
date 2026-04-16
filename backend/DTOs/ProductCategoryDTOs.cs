using System.Text.Json.Serialization;

namespace LeadProdos.Backend.DTOs
{
    public class CreateCategoryRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("color")]
        public string Color { get; set; }
        
        [JsonPropertyName("icon")]
        public string Icon { get; set; }
    }

    public class UpdateCategoryRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("color")]
        public string Color { get; set; }
        
        [JsonPropertyName("icon")]
        public string Icon { get; set; }
    }
}
