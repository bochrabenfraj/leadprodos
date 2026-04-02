using LeadProdos.Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public interface ILeadService
    {
        Task<IEnumerable<Lead>> GetAllLeadsAsync();
        Task<Lead> GetLeadByIdAsync(string id);
        Task<Lead> CreateLeadAsync(Lead lead);
        Task UpdateLeadAsync(string id, Lead lead);
        Task<IEnumerable<Lead>> GetLeadsByProductIdAsync(string productId);
    }
}
