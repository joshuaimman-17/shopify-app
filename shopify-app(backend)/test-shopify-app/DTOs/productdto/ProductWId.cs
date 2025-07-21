using System.ComponentModel.DataAnnotations;

namespace test_shopify_app.DTOs.productdto
{
    public class ProductWId
    {
        public int ProductId { get; set; }


        public string ProductName { get; set; }


        public string ProductimageURL { get; set; }


        public string ProductDescription { get; set; }

        public decimal ProductPrice { get; set; }

    }


}
