using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using test_shopify_app.DTOs.productdto;
using test_shopify_app.Entities;

namespace test_shopify_app.DTOs.orderdto
{
    public class UpdateOrderstatus
    {
      
        public int OrderId { get; set; }
       
        public int Status { get; set; } // e.g., "Pending", "Shipped", "Delivered"
        
    }
}
