using LeadProdos.Backend.Models;
using LeadProdos.Backend.Data;
using LeadProdos.Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace LeadProdos.Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            if (string.IsNullOrEmpty(request?.Email) || string.IsNullOrEmpty(request?.Password))
            {
                throw new Exception("Email et mot de passe sont requis");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
            {
                throw new Exception("Aucun utilisateur trouvé avec cet email");
            }

            if (!VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new Exception("Mot de passe incorrect");
            }

            var token = GenerateJwtToken(user);
            
            return new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                }
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Validation de base
            if (string.IsNullOrEmpty(request?.Username) || string.IsNullOrEmpty(request?.Email) || string.IsNullOrEmpty(request?.Password))
            {
                throw new Exception("Tous les champs sont requis");
            }

            if (request.Password.Length < 6)
            {
                throw new Exception("Le mot de passe doit contenir au moins 6 caractères");
            }

            // Vérifier si l'utilisateur existe déjà
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new Exception("Vous avez déjà un compte avec cet email");
            }

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                throw new Exception("Ce nom d'utilisateur est déjà utilisé");
            }

            var user = new User
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                Role = "User",
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                }
            };
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-must-be-at-least-32-characters-long-for-security");

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"] ?? "LeadProdosApi",
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"] ?? "LeadProdosApp",
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-must-be-at-least-32-characters-long-for-security");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new System.Security.Claims.Claim("id", user.Id ?? "unknown"),
                    new System.Security.Claims.Claim("sub", user.Username ?? "unknown"),
                    new System.Security.Claims.Claim("email", user.Email ?? "unknown"),
                    new System.Security.Claims.Claim("role", user.Role ?? "User")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"] ?? "LeadProdosApi",
                Audience = _configuration["Jwt:Audience"] ?? "LeadProdosApp",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var salt = new byte[16];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(salt);
                }

                var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256);
                var hash = pbkdf2.GetBytes(20);

                var hashWithSalt = new byte[36];
                System.Buffer.BlockCopy(salt, 0, hashWithSalt, 0, 16);
                System.Buffer.BlockCopy(hash, 0, hashWithSalt, 16, 20);

                return Convert.ToBase64String(hashWithSalt);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            var hashBytes = Convert.FromBase64String(hash);
            var salt = new byte[16];
            System.Buffer.BlockCopy(hashBytes, 0, salt, 0, 16);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256);
            var hash2 = pbkdf2.GetBytes(20);

            for (int i = 0; i < 20; i++)
            {
                if (hashBytes[i + 16] != hash2[i])
                {
                    return false;
                }
            }

            return true;
        }

        public async Task<bool> ChangePasswordAsync(ChangePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request?.Email) || string.IsNullOrEmpty(request?.OldPassword) || string.IsNullOrEmpty(request?.NewPassword))
            {
                throw new Exception("Tous les champs sont requis");
            }

            if (request.NewPassword.Length < 6)
            {
                throw new Exception("Le nouveau mot de passe doit contenir au moins 6 caractères");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
            {
                throw new Exception("Utilisateur non trouvé");
            }

            if (!VerifyPassword(request.OldPassword, user.PasswordHash))
            {
                throw new Exception("Ancien mot de passe incorrect");
            }

            user.PasswordHash = HashPassword(request.NewPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request?.UserId) || string.IsNullOrEmpty(request?.NewPassword))
            {
                throw new Exception("L'ID utilisateur et le nouveau mot de passe sont requis");
            }

            if (request.NewPassword.Length < 6)
            {
                throw new Exception("Le nouveau mot de passe doit contenir au moins 6 caractères");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);
            
            if (user == null)
            {
                throw new Exception("Utilisateur non trouvé");
            }

            user.PasswordHash = HashPassword(request.NewPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request, string resetBaseUrl)
        {
            if (string.IsNullOrEmpty(request?.Email))
            {
                throw new Exception("L'email est requis");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                // Don't reveal if user exists (security best practice)
                return true;
            }

            // Generate reset token
            var resetToken = GenerateResetToken();
            var tokenExpiry = DateTime.UtcNow.AddHours(24);

            // Save token to database
            var resetTokenRecord = new PasswordResetToken
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserId = user.Id,
                Email = user.Email,
                Token = resetToken,
                ExpiresAt = tokenExpiry,
                IsUsed = false
            };

            _context.PasswordResetTokens.Add(resetTokenRecord);
            await _context.SaveChangesAsync();

            // TODO: Send email with reset link
            // For now, just log the reset link for testing
            Console.WriteLine($"\n🔐 Password Reset Link: {resetBaseUrl}?token={resetToken}");

            return true;
        }

        public async Task<bool> ResetPasswordWithTokenAsync(ResetPasswordWithTokenRequest request)
        {
            if (string.IsNullOrEmpty(request?.Token) || string.IsNullOrEmpty(request?.NewPassword))
            {
                throw new Exception("Token et nouveau mot de passe sont requis");
            }

            if (request.NewPassword.Length < 6)
            {
                throw new Exception("Le nouveau mot de passe doit contenir au moins 6 caractères");
            }

            // Find and validate reset token
            var resetToken = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Token == request.Token && !t.IsUsed);

            if (resetToken == null || resetToken.ExpiresAt < DateTime.UtcNow)
            {
                throw new Exception("Token invalide ou expiré");
            }

            // Get user and update password
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == resetToken.UserId);
            if (user == null)
            {
                throw new Exception("Utilisateur non trouvé");
            }

            user.PasswordHash = HashPassword(request.NewPassword);
            _context.Users.Update(user);

            // Mark token as used
            resetToken.IsUsed = true;
            _context.PasswordResetTokens.Update(resetToken);

            // Clean up expired tokens
            var expiredTokens = await _context.PasswordResetTokens
                .Where(t => t.ExpiresAt < DateTime.UtcNow)
                .ToListAsync();
            
            if (expiredTokens.Any())
            {
                _context.PasswordResetTokens.RemoveRange(expiredTokens);
            }

            await _context.SaveChangesAsync();

            return true;
        }

        private string GenerateResetToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes).Replace("+", "-").Replace("/", "_").TrimEnd('=');
        }
    }
}
