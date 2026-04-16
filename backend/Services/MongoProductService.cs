using LeadProdos.Backend.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LeadProdos.Backend.Services
{
    public class MongoProductService
    {
        private readonly IMongoDatabase _database;

        public MongoProductService(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task<List<Product>> GetAllProductsAsync()
        {
            var collection = _database.GetCollection<Product>("Products");
            return await collection.Find(_ => true).ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(string id)
        {
            var collection = _database.GetCollection<Product>("Products");
            return await collection.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            if (string.IsNullOrEmpty(product.Id))
            {
                product.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
            }
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;
            
            var collection = _database.GetCollection<Product>("Products");
            await collection.InsertOneAsync(product);
            return product;
        }

        public async Task UpdateProductAsync(string id, Product product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            var collection = _database.GetCollection<Product>("Products");
            var filter = Builders<Product>.Filter.Eq(p => p.Id, id);
            await collection.ReplaceOneAsync(filter, product);
        }

        public async Task DeleteProductAsync(string id)
        {
            var collection = _database.GetCollection<Product>("Products");
            var filter = Builders<Product>.Filter.Eq(p => p.Id, id);
            await collection.DeleteOneAsync(filter);
        }
    }
}
