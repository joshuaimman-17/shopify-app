using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using test_shopify_app.DTOs.productdto;
using test_shopify_app.Services;

namespace test_shopify_app.Controllers
{
   // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _service;

        public ProductController(ProductService service)
        {
            _service = service;
        }
       // [Authorize(Roles = "Admin")]
        // POST: api/Product/add
        [HttpPost("add")]
        public IActionResult AddProduct([FromBody] NewProduct newProduct)
        {
            if (newProduct == null)
                return BadRequest("Product data is required.");

            var createdProduct = _service.AddProduct(newProduct);
            return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.ProductId }, createdProduct);
        }
       // [Authorize(Roles = "Admin,Customer")]
        // GET: api/Product/all
        [HttpGet("all")]
        public IActionResult GetAllProducts()
        {
            var products = _service.GetAllProducts();
            if (products == null || !products.Any())
                return NotFound("No products found.");

            return Ok(products);
        }
       // [Authorize(Roles = "Admin,Customer,DeliveryAgent")]
        // GET: api/Product/get/{id}
        [HttpGet("get/{id:int}")]
        public IActionResult GetProductById(int id)
        {
            var product = _service.GetProductById(id);
            if (product == null)
                return NotFound($"Product with ID {id} not found.");

            return Ok(product);
        }
       // [Authorize(Roles = "Admin")]
        // PUT: api/Product/update
        [HttpPut("update")]
        public IActionResult UpdateProduct([FromBody] ProductWId productDto)
        {
            if (productDto == null)
                return BadRequest("Product data is required.");

            var updatedProduct = _service.UpdateProduct(productDto);
            if (updatedProduct == null)
                return NotFound($"Product with ID {productDto.ProductId} not found.");

            return Ok(updatedProduct);
        }
       // [Authorize(Roles = "Admin")]
        // DELETE: api/Product/delete/{id}
        [HttpDelete("delete/{id:int}")]
        public IActionResult DeleteProduct(int id)
        {
            var deleted = _service.DeleteProduct(id);
            if (!deleted)
                return NotFound($"Product with ID {id} not found.");

            return Ok($"Product with ID {id} deleted successfully.");
        }
    }
}
