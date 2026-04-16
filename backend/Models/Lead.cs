using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace LeadProdos.Backend.Models
{
    public class Lead
    {
        [BsonElement("_id")]
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [BsonElement("ClientId")]
        [JsonPropertyName("clientId")]
        public string ClientId { get; set; }

        [BsonElement("ProductId")]
        [JsonPropertyName("productId")]
        public string ProductId { get; set; }

        [BsonElement("Status")]
        [JsonPropertyName("status")]
        public string Status { get; set; } // Prospect, Contact, Qualified, Converted

        [BsonElement("MatchScore")]
        [JsonPropertyName("matchScore")]
        public decimal MatchScore { get; set; }

        [BsonElement("AnalysisDetails")]
        [JsonPropertyName("analysisDetails")]
        public string AnalysisDetails { get; set; } // AI Analysis results

        [BsonElement("CreatedAt")]
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("UpdatedAt")]
        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
