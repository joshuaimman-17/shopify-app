using System.ComponentModel.DataAnnotations;
namespace test_shopify_app.Entities;


public class Customers
{
    [Key]
    public int CustomerId { get; set; }

    [Required]
    public string CustomerName { get; set; }

    [Required]
    public string CustomerUsername { get; set; }

    [Required, MaxLength(8)]
    public string CustomerPassword { get; set; }

    [Required, EmailAddress]
    public string CustomerEmail { get; set; }

    [MaxLength(15)]
    public long CustomerPhone { get; set; }

    public string Role { get; set; } = "Customer";

    public ICollection<Orders> Orders { get; set; } = new List<Orders>();
}
