using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using test_shopify_app.DTOs.admindto;
using test_shopify_app.Entities;
using test_shopify_app.Services;

namespace test_shopify_app.Controllers
{
   // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {


        private readonly AdminService _as;
        public AdminController(AdminService aservice)
        {
            _as = aservice;
        }


        // ✅ Update name
       // [Authorize(Roles = "Admin")]
        [HttpPut("update-name")]
        public IActionResult UpdateCustomerName([FromBody] Updateaname updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Name data is required.");

            try
            {
                var result = _as.UpdateAdminName(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ✅ Update username
       // [Authorize(Roles = "Admin")]
        [HttpPut("update-username")]
        public IActionResult UpdateAdminUsername([FromBody] Updateausername updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Username data is required.");

            try
            {
                var result = _as.UpdateAdminUsername(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ✅ Update password
       // [Authorize(Roles = "Admin")]
        [HttpPut("update-password")]
        public IActionResult UpdateAdminPassword([FromBody] Updateapassword updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Password data is required.");

            try
            {
                var result = _as.UpdateAdminPassword(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ✅ Update email
       // [Authorize(Roles = "Admin")]
        [HttpPut("update-email")]
        public IActionResult UpdateAdminEmail([FromBody] Updateamail updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Email data is required.");

            try
            {
                var result = _as.UpdateAdminEmail(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ✅ Update email
       // [Authorize(Roles = "Admin")]
        [HttpPut("update-phone")]
        public IActionResult UpdateAdminPhone([FromBody] Updateaphone updatedCustomer)
        {
            if (updatedCustomer == null)
                return BadRequest("Phone data is required.");

            try
            {
                var result = _as.UpdateAdminPhone(updatedCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ✅ Get customer by ID
       // [Authorize(Roles = "Admin")]
        [HttpGet("admin/{id:int}")]
        public IActionResult GetAdmin(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid customer ID.");

            try
            {
                var customer = _as.GetAdminById(id);
                return Ok(customer);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
