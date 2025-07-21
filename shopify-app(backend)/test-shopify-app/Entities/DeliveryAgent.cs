using System.ComponentModel.DataAnnotations;
namespace test_shopify_app.Entities;


public class DeliveryAgent
{
    [Key]
    public int AgentId { get; set; }

    [Required]
    public string AgentName { get; set; }

    [Required]
    public string AgentUsername { get; set; }

    [Required, MaxLength(8)]
    public string AgentPassword { get; set; }

    [Required, EmailAddress]
    public string AgentEmail { get; set; }

    [MaxLength(15)]
    public long AgentPhone { get; set; }

    public string Role { get; set; } = "DeliveryAgent";

    public ICollection<Orders> AssignedOrders { get; set; } = new List<Orders>();
}
