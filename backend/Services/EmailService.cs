using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LeadProdos.Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string resetToken, string resetUrl)
        {
            try
            {
                // For development, log the reset link instead of sending actual email
                _logger.LogInformation($"Password reset requested for: {email}");
                _logger.LogInformation($"Reset link: {resetUrl}?token={resetToken}");

                // TODO: Configure actual SMTP settings in appsettings.json
                // For now, we'll just return true (simulated email sending)
                // In production, use SendGrid, Gmail SMTP, or similar service

                var smtpServer = _configuration["Email:SmtpServer"];
                var smtpPort = _configuration["Email:SmtpPort"];
                var smtpUser = _configuration["Email:SmtpUser"];
                var smtpPassword = _configuration["Email:SmtpPassword"];

                if (string.IsNullOrEmpty(smtpServer))
                {
                    _logger.LogWarning("Email service not configured. Reset link (use for testing): " + resetUrl + "?token=" + resetToken);
                    return await Task.FromResult(true); // Simulate success
                }

                using (var client = new SmtpClient(smtpServer, int.Parse(smtpPort)))
                {
                    client.EnableSsl = true;
                    client.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPassword);

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(smtpUser),
                        Subject = "Réinitialisation de mot de passe - LeadProdos",
                        Body = GetEmailTemplate(resetUrl, resetToken),
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(email);

                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation($"Email sent successfully to: {email}");
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending email: {ex.Message}");
                return false;
            }
        }

        private string GetEmailTemplate(string resetUrl, string token)
        {
            return $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }}
                        .header {{ color: #0f3460; font-size: 24px; font-weight: bold; margin-bottom: 20px; }}
                        .content {{ color: #333; line-height: 1.6; }}
                        .button {{ display: inline-block; background-color: #0f3460; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 20px 0; }}
                        .footer {{ color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>LeadProdos</div>
                        <div class='content'>
                            <p>Bonjour,</p>
                            <p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe:</p>
                            <a href='{resetUrl}?token={token}' class='button'>Réinitialiser le mot de passe</a>
                            <p>Ce lien expirera dans 24 heures.</p>
                            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
                        </div>
                        <div class='footer'>
                            <p>Copyright © 2024 LeadProdos. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>";
        }
    }
}
