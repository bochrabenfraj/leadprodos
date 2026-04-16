using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace LeadProdos.Backend.Models
{
    public class User
    {
        [BsonElement("_id")]
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [BsonElement("Username")]
        [JsonPropertyName("username")]
        public string Username { get; set; }

        [BsonElement("Email")]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [BsonElement("PasswordHash")]
        [JsonPropertyName("passwordHash")]
        public string PasswordHash { get; set; }

        [BsonElement("Role")]
        [JsonPropertyName("role")]
        public string Role { get; set; } // Admin, User

        [BsonElement("CreatedAt")]
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("IsActive")]
        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; } = true;
    }
}
