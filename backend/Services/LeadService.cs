using LeadProdos.Backend.Models;
using LeadProdos.Backend.Data;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public class LeadService : ILeadService
    {
        private readonly ApplicationDbContext _context;

        public LeadService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Lead>> GetAllLeadsAsync()
        {
            return await _context.Leads.ToListAsync();
        }

        public async Task<Lead> GetLeadByIdAsync(string id)
        {
            return await _context.Leads.FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Lead> CreateLeadAsync(Lead lead)
        {
            if (string.IsNullOrEmpty(lead.Id))
            {
                lead.Id = ObjectId.GenerateNewId().ToString();
            }
            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();
            return lead;
        }

        public async Task UpdateLeadAsync(string id, Lead lead)
        {
            var existingLead = await _context.Leads.FirstOrDefaultAsync(l => l.Id == id);
            if (existingLead != null)
            {
                existingLead.Status = lead.Status;
                existingLead.MatchScore = lead.MatchScore;
                existingLead.AnalysisDetails = lead.AnalysisDetails;
                existingLead.UpdatedAt = System.DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Lead>> GetLeadsByProductIdAsync(string productId)
        {
            return await _context.Leads.Where(l => l.ProductId == productId).ToListAsync();
        }
    }
}
