using LeadProdos.Backend.Models;
using LeadProdos.Backend.Data;
using LeadProdos.Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace LeadProdos.Backend.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(u => MapToUserDto(u)).ToList();
        }

        public async Task<UserDto> GetUserByIdAsync(string id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            
            if (user == null)
            {
                throw new Exception("Utilisateur non trouvé");
            }

            return MapToUserDto(user);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserRequest request)
        {
            if (string.IsNullOrEmpty(request?.Username) || string.IsNullOrEmpty(request?.Email) || string.IsNullOrEmpty(request?.Password))
            {
                throw new Exception("Tous les champs sont requis");
            }

            if (request.Password.Length < 6)
            {
                throw new Exception("Le mot de passe doit contenir au moins 6 caractères");
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new Exception("Cet email est déjà utilisé");
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
                Role = request.Role ?? "User",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return MapToUserDto(user);
        }

        public async Task<UserDto> UpdateUserAsync(string id, UpdateUserRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            
            if (user == null)
            {
                throw new Exception("Utilisateur non trouvé");
            }

            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    throw new Exception("Cet email est déjà utilisé");
                }
                user.Email = request.Email;
            }

            if (!string.IsNullOrEmpty(request.Username) && request.Username != user.Username)
            {
                if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                {
                    throw new Exception("Ce nom d'utilisateur est déjà utilisé");
                }
                user.Username = request.Username;
            }

            if (!string.IsNullOrEmpty(request.Role) && request.Role != user.Role)
            {
                user.Role = request.Role;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return MapToUserDto(user);
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            
            if (user == null)
            {
                throw new Exception("Utilisateur non trouvé");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ToggleUserStatusAsync(string id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            
            if (user == null)
            {
                throw new Exception("Utilisateur non trouvé");
            }

            user.IsActive = !user.IsActive;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return user.IsActive;
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
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
    }
}
