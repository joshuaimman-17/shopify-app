using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace test_shopify_app.Entities;


public class OrderItem
{
    [Key]
    public int Id { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public int OrderId { get; set; }
    [ForeignKey("OrderId")]
    [JsonIgnore]
    public Orders Order { get; set; }

    public int ProductId { get; set; }
    [ForeignKey("ProductId")]
    public Products Product { get; set; }
}
