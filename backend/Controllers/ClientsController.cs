using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LeadProdos.Backend.Models;
using LeadProdos.Backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            var clients = await _clientService.GetAllClientsAsync();
            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(string id)
        {
            var client = await _clientService.GetClientByIdAsync(id);
            if (client == null)
                return NotFound();
            return Ok(client);
        }

        [HttpPost]
        public async Task<ActionResult<Client>> CreateClient([FromBody] Client client)
        {
            try
            {
                if (client == null || string.IsNullOrEmpty(client.Name) || string.IsNullOrEmpty(client.Email))
                {
                    return BadRequest(new { message = "Name and Email are required." });
                }
                var createdClient = await _clientService.CreateClientAsync(client);
                return CreatedAtAction(nameof(GetClient), new { id = createdClient.Id }, createdClient);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error creating client: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(string id, [FromBody] Client client)
        {
            try
            {
                if (string.IsNullOrEmpty(id) || client == null)
                {
                    return BadRequest(new { message = "Invalid client data." });
                }
                await _clientService.UpdateClientAsync(id, client);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating client: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new { message = "Invalid client id." });
                }
                await _clientService.DeleteClientAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error deleting client: {ex.Message}" });
            }
        }
    }
}
