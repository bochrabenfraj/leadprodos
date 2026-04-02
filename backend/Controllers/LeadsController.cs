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
    public class LeadsController : ControllerBase
    {
        private readonly ILeadService _leadService;
        private readonly IAIService _aiService;

        public LeadsController(ILeadService leadService, IAIService aiService)
        {
            _leadService = leadService;
            _aiService = aiService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lead>>> GetLeads()
        {
            var leads = await _leadService.GetAllLeadsAsync();
            return Ok(leads);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Lead>> GetLead(string id)
        {
            var lead = await _leadService.GetLeadByIdAsync(id);
            if (lead == null)
                return NotFound();
            return Ok(lead);
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeLeads([FromBody] AnalyzeLeadsRequest request)
        {
            var results = await _aiService.AnalyzeAndIdentifyLeadsAsync(request.ProductId);
            return Ok(results);
        }

        [HttpPost]
        public async Task<ActionResult<Lead>> CreateLead([FromBody] Lead lead)
        {
            var createdLead = await _leadService.CreateLeadAsync(lead);
            return CreatedAtAction(nameof(GetLead), new { id = createdLead.Id }, createdLead);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLead(string id, [FromBody] Lead lead)
        {
            await _leadService.UpdateLeadAsync(id, lead);
            return NoContent();
        }
    }

    public class AnalyzeLeadsRequest
    {
        public string ProductId { get; set; }
    }
}
