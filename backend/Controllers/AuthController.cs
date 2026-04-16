using Microsoft.AspNetCore.Mvc;
using LeadProdos.Backend.DTOs;
using LeadProdos.Backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace LeadProdos.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validation des champs (400 Bad Request)
                if (string.IsNullOrEmpty(request?.Email) || string.IsNullOrEmpty(request?.Password))
                {
                    return BadRequest(new { message = "Email et mot de passe sont requis" });
                }

                var response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                // Erreur d'authentification (email not found ou password incorrect) → 401
                return Unauthorized(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var result = await _authService.ChangePasswordAsync(request);
                return Ok(new { success = result, message = "Mot de passe modifié avec succès" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var result = await _authService.ResetPasswordAsync(request);
                return Ok(new { success = result, message = "Mot de passe réinitialisé avec succès" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                // Get the reset URL from request header or configuration
                var resetBaseUrl = $"{Request.Scheme}://{Request.Host}/reset-password";
                var result = await _authService.ForgotPasswordAsync(request, resetBaseUrl);
                return Ok(new { success = result, message = "Si l'email existe, un lien de réinitialisation a été envoyé" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reset-password-with-token")]
        public async Task<IActionResult> ResetPasswordWithToken([FromBody] ResetPasswordWithTokenRequest request)
        {
            try
            {
                var result = await _authService.ResetPasswordWithTokenAsync(request);
                return Ok(new { success = result, message = "Mot de passe réinitialisé avec succès. Connectez-vous avec votre nouveau mot de passe" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
