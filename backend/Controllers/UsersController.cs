using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LeadProdos.Backend.DTOs;
using LeadProdos.Backend.Services;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/admin/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                    return NotFound(new { message = "Utilisateur non trouvé" });
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                var user = await _userService.CreateUserAsync(request);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, request);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                // Vérifier que l'utilisateur existe avant suppression
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                    return NotFound(new { message = "Utilisateur non trouvé" });

                var result = await _userService.DeleteUserAsync(id);
                return Ok(new { success = result, message = "Utilisateur supprimé avec succès" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(string id)
        {
            try
            {
                var newStatus = await _userService.ToggleUserStatusAsync(id);
                return Ok(new { success = true, isActive = newStatus, message = newStatus ? "Utilisateur activé" : "Utilisateur désactivé" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                // Extraire l'ID de l'utilisateur du token JWT
                var userId = User.FindFirst("id")?.Value ?? User.FindFirst("sub")?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Impossible de récupérer l'ID utilisateur" });
                }

                // Créer une UpdateUserRequest à partir de UpdateProfileRequest
                var updateRequest = new UpdateUserRequest
                {
                    Username = request.Username,
                    Email = request.Email
                };

                var user = await _userService.UpdateUserAsync(userId, updateRequest);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
