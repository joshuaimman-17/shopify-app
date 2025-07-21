namespace test_shopify_app.Entities;
using System.ComponentModel.DataAnnotations;

public class Products
{
    [Key]
    public int ProductId { get; set; }

    [Required]
    public string ProductName { get; set; }

    [Required]
    public string ProductimageURL { get; set; }

    [Required]
    public string ProductDescription { get; set; }

    public decimal ProductPrice { get; set; }
}
