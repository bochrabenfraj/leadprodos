using Microsoft.EntityFrameworkCore;
using LeadProdos.Backend.Models;

namespace LeadProdos.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Lead> Leads { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure MongoDB _id mapping for all entities
            modelBuilder.Entity<Product>()
                .Property(p => p.Id)
                .HasConversion(v => v, v => v);
            
            modelBuilder.Entity<Client>()
                .Property(c => c.Id)
                .HasConversion(v => v, v => v);
            
            modelBuilder.Entity<User>()
                .Property(u => u.Id)
                .HasConversion(v => v, v => v);
            
            modelBuilder.Entity<Lead>()
                .Property(l => l.Id)
                .HasConversion(v => v, v => v);
        }
    }
}
