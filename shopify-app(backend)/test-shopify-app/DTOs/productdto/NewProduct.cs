using System.ComponentModel.DataAnnotations;

namespace test_shopify_app.DTOs.productdto
{
    public class NewProduct
    {

        public string ProductName { get; set; }
        public string ProductimageUrl { get; set; }
        public string ProductDescription { get; set; }
        public decimal ProductPrice { get; set; }
    }
}
