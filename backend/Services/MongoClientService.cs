using LeadProdos.Backend.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public class MongoClientService
    {
        private readonly IMongoDatabase _database;

        public MongoClientService(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task<List<Client>> GetAllClientsAsync()
        {
            var collection = _database.GetCollection<Client>("Clients");
            return await collection.Find(_ => true).ToListAsync();
        }

        public async Task<Client> GetClientByIdAsync(string id)
        {
            var collection = _database.GetCollection<Client>("Clients");
            return await collection.Find(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Client> CreateClientAsync(Client client)
        {
            if (string.IsNullOrEmpty(client.Id))
            {
                client.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
            }
            client.CreatedAt = DateTime.UtcNow;
            client.UpdatedAt = DateTime.UtcNow;
            
            var collection = _database.GetCollection<Client>("Clients");
            await collection.InsertOneAsync(client);
            return client;
        }

        public async Task UpdateClientAsync(string id, Client client)
        {
            client.UpdatedAt = DateTime.UtcNow;
            var collection = _database.GetCollection<Client>("Clients");
            var filter = Builders<Client>.Filter.Eq(c => c.Id, id);
            await collection.ReplaceOneAsync(filter, client);
        }

        public async Task DeleteClientAsync(string id)
        {
            var collection = _database.GetCollection<Client>("Clients");
            var filter = Builders<Client>.Filter.Eq(c => c.Id, id);
            await collection.DeleteOneAsync(filter);
        }
    }
}
