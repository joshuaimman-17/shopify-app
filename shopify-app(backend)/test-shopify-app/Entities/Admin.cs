using System.ComponentModel.DataAnnotations;
namespace test_shopify_app.Entities;


public class Admin
{
    [Key]
    public int AdminId { get; set; }

    [Required]
    public string AdminName { get; set; }

    [Required]
    public string AdminUsername { get; set; }

    [Required, MaxLength(8)]
    public string AdminPassword { get; set; }

    [Required, EmailAddress]
    public string AdminEmail { get; set; }

    [MaxLength(15)]
    public long AdminPhone { get; set; }

    public string Role { get; set; } = "Admin";
}
