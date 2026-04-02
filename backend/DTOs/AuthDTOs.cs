using System.Text.Json.Serialization;

namespace LeadProdos.Backend.DTOs
{
    public class LoginRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        [JsonPropertyName("username")]
        public string Username { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }

    public class ChangePasswordRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("oldPassword")]
        public string OldPassword { get; set; }
        
        [JsonPropertyName("newPassword")]
        public string NewPassword { get; set; }
    }

    public class ResetPasswordRequest
    {
        [JsonPropertyName("userId")]
        public string UserId { get; set; }
        
        [JsonPropertyName("newPassword")]
        public string NewPassword { get; set; }
    }

    public class CreateUserRequest
    {
        [JsonPropertyName("username")]
        public string Username { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("password")]
        public string Password { get; set; }
        
        [JsonPropertyName("role")]
        public string Role { get; set; } = "User";
    }

    public class UpdateUserRequest
    {
        [JsonPropertyName("username")]
        public string Username { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("role")]
        public string Role { get; set; }
    }

    public class UpdateProfileRequest
    {
        [JsonPropertyName("username")]
        public string Username { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
