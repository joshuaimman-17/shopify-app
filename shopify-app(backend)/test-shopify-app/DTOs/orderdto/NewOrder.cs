namespace test_shopify_app.DTOs.orderdto
{
    public class NewOrder
    {
        public int CustomerId { get; set; }  // Fixed from string
        public string Phone { get; set; }
        public string Address { get; set; }

        public List<ProductOrderDto> Products { get; set; } = new();
    }

    public class ProductOrderDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
