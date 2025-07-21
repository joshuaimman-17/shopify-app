namespace test_shopify_app.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Orders
{
    [Key]
    public int OrderId { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public decimal TotalPrice { get; set; }

    public int CustomerId { get; set; }
    [ForeignKey("CustomerId")]
    [JsonIgnore]
    public Customers Customer { get; set; }

    public int? DeliveryAgentId { get; set; }

    [ForeignKey("DeliveryAgentId")]
    [JsonIgnore]
    public DeliveryAgent DeliveryAgent { get; set; }

    public string Address { get; set; }

    public int Status { get; set; }

    public DateTime OrderDate { get; set; }

    public DateTime? DeliveryDate { get; set; }
}
