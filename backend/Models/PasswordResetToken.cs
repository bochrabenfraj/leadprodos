using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace LeadProdos.Backend.Models
{
    public class PasswordResetToken
    {
        [BsonElement("_id")]
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [BsonElement("UserId")]
        [JsonPropertyName("userId")]
        public string UserId { get; set; }

        [BsonElement("Email")]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [BsonElement("Token")]
        [JsonPropertyName("token")]
        public string Token { get; set; }

        [BsonElement("ExpiresAt")]
        [JsonPropertyName("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("CreatedAt")]
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("IsUsed")]
        [JsonPropertyName("isUsed")]
        public bool IsUsed { get; set; } = false;
    }
}
