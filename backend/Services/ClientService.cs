using LeadProdos.Backend.Models;
using LeadProdos.Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace LeadProdos.Backend.Services
{
    public class ClientService : IClientService
    {
        private readonly ApplicationDbContext _context;

        public ClientService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Client>> GetAllClientsAsync()
        {
            return await _context.Clients.ToListAsync();
        }

        public async Task<Client> GetClientByIdAsync(string id)
        {
            return await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Client> CreateClientAsync(Client client)
        {
            if (string.IsNullOrEmpty(client.Id))
            {
                client.Id = ObjectId.GenerateNewId().ToString();
            }
            client.CreatedAt = DateTime.UtcNow;
            client.UpdatedAt = DateTime.UtcNow;
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
            return client;
        }

        public async Task UpdateClientAsync(string id, Client client)
        {
            var existingClient = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
            if (existingClient != null)
            {
                existingClient.Name = client.Name;
                existingClient.Email = client.Email;
                existingClient.Phone = client.Phone;
                existingClient.Company = client.Company;
                existingClient.SocialMediaProfiles = client.SocialMediaProfiles;
                existingClient.InterestScore = client.InterestScore;
                existingClient.UpdatedAt = System.DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteClientAsync(string id)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
            if (client != null)
            {
                _context.Clients.Remove(client);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Client>> SearchClientsAsync(string searchTerm, string company, decimal? minScore, decimal? maxScore)
        {
            var query = _context.Clients.AsQueryable();

            // Filter by search term (name, email, phone)
            if (!string.IsNullOrEmpty(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(lowerSearchTerm) ||
                    c.Email.ToLower().Contains(lowerSearchTerm) ||
                    (c.Phone != null && c.Phone.ToLower().Contains(lowerSearchTerm))
                );
            }

            // Filter by company
            if (!string.IsNullOrEmpty(company) && company != "Non spécifié")
            {
                query = query.Where(c => c.Company == company);
            }

            // Filter by interest score range
            if (minScore.HasValue)
            {
                query = query.Where(c => c.InterestScore >= minScore.Value);
            }

            if (maxScore.HasValue)
            {
                query = query.Where(c => c.InterestScore <= maxScore.Value);
            }

            return await query.ToListAsync();
        }
    }
}
