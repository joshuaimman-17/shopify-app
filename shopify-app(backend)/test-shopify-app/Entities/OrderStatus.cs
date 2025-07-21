namespace test_shopify_app.Entities;
using System.ComponentModel.DataAnnotations;

public class OrderStatus
{
    [Key]
    public int Id { get; set; }

    public string Status { get; set; }
}
