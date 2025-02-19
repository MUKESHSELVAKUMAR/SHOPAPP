using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace dotnetapp.Data
{

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {
            
        }
        public DbSet<Shop> Shops { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) { 
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Shop>() .Property(e => e.productId) .ValueGeneratedOnAdd();

            }
    }
}