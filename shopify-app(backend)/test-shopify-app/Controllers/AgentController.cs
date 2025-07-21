using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using test_shopify_app.DTOs.Agentdto;
using test_shopify_app.Services;

namespace test_shopify_app.Controllers
{
 //   [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly AgentService _agentService;

        public AgentController(AgentService agentService)
        {
            _agentService = agentService;
        }

      

       // [Authorize(Roles = "DeliveryAgent")]
        [HttpPut("UpdateName")]
        public IActionResult UpdateAgentName([FromBody] UpdateAgentName updatedAgent)
        {
            if (updatedAgent == null)
                return BadRequest("Updated agent data cannot be null.");

            try
            {
                var result = _agentService.UpdateAgentName(updatedAgent);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

       // [Authorize(Roles = "DeliveryAgent")]
        [HttpPut("UpdateUsername")]
        public IActionResult UpdateAgentUsername([FromBody] UpdateAgentUsername updatedAgent)
        {
            if (updatedAgent == null)
                return BadRequest("Updated agent data cannot be null.");

            try
            {
                var result = _agentService.UpdateAgentUsername(updatedAgent);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

       // [Authorize(Roles = "DeliveryAgent")]
        [HttpPut("UpdatePassword")]
        public IActionResult UpdateAgentPassword([FromBody] UpdateAgentPassword updatedAgent)
        {
            if (updatedAgent == null)
                return BadRequest("Updated agent data cannot be null.");

            try
            {
                var result = _agentService.UpdateAgentPassword(updatedAgent);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

       // [Authorize(Roles = "DeliveryAgent")]
        [HttpPut("UpdateEmail")]
        public IActionResult UpdateAgentEmail([FromBody] UpdateAgentEmail updatedAgent)
        {
            if (updatedAgent == null)
                return BadRequest("Updated agent data cannot be null.");

            try
            {
                var result = _agentService.UpdateAgentEmail(updatedAgent);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

       // [Authorize(Roles = "DeliveryAgent,Admin")]
        [HttpGet("{id:int}")]
        public IActionResult GetAgent(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid agent ID.");

            try
            {
                var agent = _agentService.GetAgentById(id);
                if (agent == null)
                    return NotFound($"Agent with ID {id} not found.");

                return Ok(agent);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving agent: {ex.Message}");
            }
        }

       // [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public IActionResult GetAllAgents()
        {
            try
            {
                var agents = _agentService.GetAllAgents();
                return Ok(agents);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving agents: {ex.Message}");
            }
        }
    }
}
