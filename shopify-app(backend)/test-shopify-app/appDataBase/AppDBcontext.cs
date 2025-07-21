using Microsoft.EntityFrameworkCore;
using test_shopify_app.Entities;

namespace test_shopify_app.appDataBase
{
    public class AppDBcontext : DbContext
    {
        public AppDBcontext(DbContextOptions<AppDBcontext> options) : base(options)
        {
        }

        public DbSet<Customers> Customers { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<Orders> Orders { get; set; } // ✅ Fixed name
        public DbSet<Admin> Admins { get; set; }
        public DbSet<DeliveryAgent> DeliveryAgents { get; set; } // ✅ PascalCase
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderStatus> OrderStatus { get; set; } // ✅ PascalCase

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Products>()
                .Property(p => p.ProductPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(o => o.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId);

            modelBuilder.Entity<Orders>()
                .HasOne(o => o.DeliveryAgent)
                .WithMany(da => da.AssignedOrders)
                .HasForeignKey(o => o.DeliveryAgentId);
        }

    }

}