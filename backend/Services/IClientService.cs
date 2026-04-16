using LeadProdos.Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public interface IClientService
    {
        Task<IEnumerable<Client>> GetAllClientsAsync();
        Task<Client> GetClientByIdAsync(string id);
        Task<Client> CreateClientAsync(Client client);
        Task UpdateClientAsync(string id, Client client);
        Task DeleteClientAsync(string id);
        Task<IEnumerable<Client>> SearchClientsAsync(string searchTerm, string company, decimal? minScore, decimal? maxScore);
    }
}
