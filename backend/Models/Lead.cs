using System.Text.Json.Serialization;

namespace LeadProdos.Backend.Models
{
    public class Lead
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("clientId")]
        public string ClientId { get; set; }

        [JsonPropertyName("productId")]
        public string ProductId { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } // Prospect, Contact, Qualified, Converted

        [JsonPropertyName("matchScore")]
        public decimal MatchScore { get; set; }

        [JsonPropertyName("analysisDetails")]
        public string AnalysisDetails { get; set; } // AI Analysis results

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
