using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using test_shopify_app.DTOs.customerdto;
using test_shopify_app.Services;

namespace test_shopify_app.Controllers
{
   // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _cs;

        public CustomerController(CustomerService customerService)
        {
            _cs = customerService;
        }

      
       
      //  [Authorize(Roles = "Customer")]
        // ✅ Update name
        [HttpPut("update-name")]
        public IActionResult UpdateCustomerName([FromBody] Updatecname updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Name data is required.");

            try
            {
                var result = _cs.UpdateCustomerName(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
       // [Authorize(Roles = "Customer")]
        // ✅ Update username
        [HttpPut("update-username")]
        public IActionResult UpdateCustomerUsername([FromBody] Updatecusername updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Username data is required.");

            try
            {
                var result = _cs.UpdateCustomerUsername(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //[Authorize(Roles = "Customer")]
        // ✅ Update password
        [HttpPut("update-password")]
        public IActionResult UpdateCustomerPassword([FromBody] Updatecpassword updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Password data is required.");

            try
            {
                var result = _cs.UpdateCustomerPassword(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
       // [Authorize(Roles = "Customer")]
        // ✅ Update email
        [HttpPut("update-email")]
        public IActionResult UpdateCustomerEmail([FromBody] Updatecmail updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Email data is required.");

            try
            {
                var result = _cs.UpdateCustomerEmail(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
       // [Authorize(Roles = "Customer")]
        // ✅ Update email
        [HttpPut("update-phone")]
        public IActionResult UpdateCustomerPhone([FromBody] Updatecphone updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Phone data is required.");

            try
            {
                var result = _cs.UpdateCustomerPhone(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
      //  [Authorize(Roles = "Customer")]
        // ✅ Get customer by ID
        [HttpGet("user/{id:int}")]
        public IActionResult GetCustomer(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid customer ID.");

            try
            {
                var customer = _cs.GetCustomerById(id);
                return Ok(customer);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
       // [Authorize(Roles = "Admin")]
        // ✅ Get all customers
        [HttpGet("all")]
        public IActionResult GetAll()
        {
            try
            {
                var customers = _cs.GetAllCustomers();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving customers: {ex.Message}");
            }
        }
    }
}
