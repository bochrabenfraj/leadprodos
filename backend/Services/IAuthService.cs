using LeadProdos.Backend.Models;
using LeadProdos.Backend.DTOs;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<bool> ValidateTokenAsync(string token);
        Task<bool> ChangePasswordAsync(ChangePasswordRequest request);
        Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
        Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request, string resetBaseUrl);
        Task<bool> ResetPasswordWithTokenAsync(ResetPasswordWithTokenRequest request);
    }
}
