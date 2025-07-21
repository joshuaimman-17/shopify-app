using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using test_shopify_app.DTOs.orderdto;
using test_shopify_app.Services;
[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly OrderService _os;

    public OrderController(OrderService os)
    {
        _os = os;
    }
   // [Authorize(Roles = "Customer,Admin,DeliveryAgent")]
    [HttpPost("place")]
    public IActionResult PlaceOrder([FromBody] NewOrder newOrder)
    {
        if (newOrder == null)
            return BadRequest("Empty order cannot be placed.");

        var order = _os.PlaceOrder(newOrder);
        return Ok("successfuly placed");
    }
   // [Authorize(Roles = "Customer,Admin,DeliveryAgent")]
    [HttpDelete("cancel/{id:int}")]
    public IActionResult CancelOrder(int id)
    {
        var order = _os.GetOrderById(id);
        if (order == null)
            return NotFound($"Order with ID {id} not found.");

        var result = _os.CancelOrder(id);
        return result ? Ok("Order deleted successfully.") : BadRequest("Failed to delete the order.");
    }
   // [Authorize(Roles = "Customer,Admin,DeliveryAgent")]
    [HttpGet("all")]
    public IActionResult GetAllOrders()
    {
        var orders = _os.GetAllOrders();
        if (!orders.Any())
            return NotFound("No orders found.");

        return Ok(orders);
    }
  //  [Authorize(Roles = "Customer,Admin,DeliveryAgent")]
    [HttpGet("customer/{customerId:int}")]
    public IActionResult GetOrdersOfCustomer(int customerId)
    {
        var orders = _os.GetOrdersOfCustomer(customerId);
        if (!orders.Any())
            return NotFound($"No orders found for customer with ID {customerId}.");

        return Ok(orders);
    }
   // [Authorize(Roles = "Customer,Admin,DeliveryAgent")]
    [HttpGet("{id:int}")]
    public IActionResult GetOrderById(int id)
    {
        var order = _os.GetOrderById(id);
        return order == null ? NotFound($"Order with ID {id} not found.") : Ok(order);
    }
    //[Authorize(Roles = "Customer,Admin,DeliveryAgent")]
    [HttpPut("update-status")]
    public IActionResult UpdateOrderStatus([FromBody] UpdateOrderstatus updatedOrder)
    {
        if (updatedOrder == null || updatedOrder.OrderId <= 0)
            return BadRequest("Invalid order ID or empty order data.");

        var order = _os.UpdateOrderStatus(updatedOrder);
        return Ok("order canceled");
    }
  //  [Authorize(Roles = "Customer,Admin,DeliveryAgent")]
    [HttpPut("update-delivery")]
    public IActionResult UpdateOrderDelivery([FromBody] UpdateOrderinfo updatedOrder)
    {
        if (updatedOrder == null || updatedOrder.Id <= 0)
            return BadRequest("Invalid order ID or empty order data.");

        var order = _os.UpdateOrderDeliveryInfo(updatedOrder);
        return Ok(order);
    }
 //   [Authorize(Roles = "Admin")]
    [HttpPost("assign-agent")]
    public IActionResult AssignOrderToAgent([FromBody] asignAgent assignAgent)
    {
        if (assignAgent == null || assignAgent.AgentId <= 0 || assignAgent.OrderId <= 0)
            return BadRequest("Invalid agent or order ID.");

        var result = _os.AssignAgent(assignAgent.AgentId, assignAgent.OrderId);
        return Ok(result);
    }
    [HttpGet("all-status")]
    public IActionResult getallStatus()
    {
        var result = _os.getallstatus();
        if (result != null)
         return Ok(result);

        return BadRequest("not found");
    }

    [HttpGet("GET-order-status")]
    public IActionResult getstatus(int id) 
    { 
        var result = _os.getstatus(id);
        if (result.Contains("data not found"))
            return BadRequest("data not found");
        return Ok(result);
    }
}
