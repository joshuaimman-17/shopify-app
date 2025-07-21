using Microsoft.AspNetCore.Mvc;
using test_shopify_app.DTOs.admindto;
using test_shopify_app.DTOs.Agentdto;
using test_shopify_app.DTOs.authdto;
using test_shopify_app.DTOs.customerdto;
using test_shopify_app.Entities;
using test_shopify_app.Services;
using test_shopify_app.Token;

namespace test_shopify_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtHelper _jwtHelper;
        private readonly AdminService _adminService;
        private readonly CustomerService _customerService;
        private readonly AgentService _agentService;

        public AuthController(JwtHelper jwtHelper, AdminService adminService, CustomerService customerService, AgentService agentService)
        {
            _jwtHelper = jwtHelper;
            _adminService = adminService;
            _customerService = customerService;
            _agentService = agentService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Username and password are required.");

            // Try Admin login
            var admin = _adminService.ValidateAdmin(request.Username, request.Password);
            if (admin != null)
                return Ok(new { token = _jwtHelper.GenerateToken(admin), role = admin.Role , Id = admin.AdminId });

            // Try Customer login
            var customer = _customerService.ValidateCustomer(request.Username, request.Password);
            if (customer != null)
                return Ok(new { token = _jwtHelper.GenerateToken(customer), role = customer.Role ,Id = customer.CustomerId});

            // Try Agent login
            var agent = _agentService.ValidateAgent(request.Username, request.Password);
            if (agent != null)
                return Ok(new { token = _jwtHelper.GenerateToken(agent), role = agent.Role , Id = agent.AgentId });

            return Unauthorized("Invalid credentials.");
        }

        // ✅ Register a new customer
        [HttpPost("register-customer")]
        public IActionResult RegisterCustomer([FromBody] NewCustomer newCustomer)
        {
            if (newCustomer == null)
                return BadRequest("Customer data is required.");

            try
            {
                var result = _customerService.RegisterCustomer(newCustomer);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("Register-agent")]
        public IActionResult RegisterAgent([FromBody] NewAgent newAgent)
        {
            if (newAgent == null)
                return BadRequest("New agent data cannot be null.");

            try
            {
                var result = _agentService.Register(newAgent);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


     
       
        [HttpPost("register-admin")]
        public IActionResult RegisterAdmin([FromBody] NewAdmin newAdmin)
        {
            if (newAdmin == null)
                return BadRequest("Customer data is required.");

            try
            {
                var result = _adminService.RegisterAdmin(newAdmin);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
