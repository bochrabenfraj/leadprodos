using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public interface IEmailService
    {
        Task<bool> SendPasswordResetEmailAsync(string email, string resetToken, string resetUrl);
    }
}
