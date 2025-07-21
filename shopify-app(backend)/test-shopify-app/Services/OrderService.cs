using AutoMapper;
using Microsoft.EntityFrameworkCore;
using test_shopify_app.appDataBase;
using test_shopify_app.DTOs.orderdto;
using test_shopify_app.Entities;

namespace test_shopify_app.Services
{
    public class OrderService
    {
        private readonly AppDBcontext _db;
        private readonly IMapper _mapper;

        public OrderService(AppDBcontext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        // ✅ Get all orders
        public List<Orders> GetAllOrders()
        {
            return _db.Orders
                      .Include(o => o.OrderItems)
                      .Include(o => o.Customer)
                      .Include(o => o.DeliveryAgent)
                      .ToList();
        }

        // ✅ Get orders of a specific customer
        public List<Orders> GetOrdersOfCustomer(int customerId)
        {
            return _db.Orders
                      .Include(o => o.OrderItems)
                      .Where(o => o.CustomerId == customerId)
                      .ToList();
        }

        // ✅ Get a specific order by ID
        public Orders? GetOrderById(int id)
        {
            return _db.Orders
                      .Include(o => o.OrderItems)
                      .Include(o => o.Customer)
                      .Include(o => o.DeliveryAgent)
                      .FirstOrDefault(o => o.OrderId == id);
        }

        // ✅ Place a new order
        public Orders PlaceOrder(NewOrder newOrder)
        {
            var order = new Orders
            {
                CustomerId = newOrder.CustomerId,
                Address = newOrder.Address,
                Status = 0, // pending
                OrderDate = DateTime.Now,
                OrderItems = new List<OrderItem>()
            };

            decimal totalPrice = 0;

            foreach (var item in newOrder.Products)
            {
                var product = _db.Products.FirstOrDefault(p => p.ProductId == item.ProductId);
                if (product == null) continue;

                var orderItem = new OrderItem
                {
                    ProductId = product.ProductId,
                    Quantity = item.Quantity,
                    Price = product.ProductPrice * item.Quantity
                };

                order.OrderItems.Add(orderItem);
                totalPrice += orderItem.Price;
            }

            order.TotalPrice = totalPrice;
            _db.Orders.Add(order);
            _db.SaveChanges();
            return order;
        }

        // ✅ Update order status and delivery
        public UpdateOrderstatus UpdateOrderStatus(UpdateOrderstatus updatedOrder)
        {
            var order = _db.Orders.Find(updatedOrder.OrderId);
            if (order == null) throw new ArgumentException("Order not found.");

            order.Status = updatedOrder.Status ;
           

           

            _db.SaveChanges();
            return updatedOrder;
        }

        // ✅ Update delivery info
        public UpdateOrderinfo UpdateOrderDeliveryInfo(UpdateOrderinfo updatedOrder)
        {
            var order = _db.Orders.Find(updatedOrder.Id);
            if (order == null) throw new ArgumentException("Order not found.");

            order.Address = updatedOrder.Address;
            _db.SaveChanges();
            return updatedOrder;
        }

        // ✅ Cancel an order
        public bool CancelOrder(int id)
        {
            var order = _db.Orders
                           .Include(o => o.OrderItems)
                           .FirstOrDefault(o => o.OrderId == id);
            if (order == null) return false;

            _db.OrderItems.RemoveRange(order.OrderItems);
            _db.Orders.Remove(order);
            _db.SaveChanges();
            return true;
        }

        public string getstatus(int id)
        {
            if (id == 0)
            {
                var obj = _db.OrderStatus.Find(id);
                var status = obj.Status;
                return status.ToString();
            }
            return "data not found";
        }
        public List<OrderStatus> getallstatus()
        {
           return _db.OrderStatus.ToList();

        }

        // ✅ Assign agent to an order
        public string AssignAgent(int agentId, int orderId)
        {
            var order = _db.Orders.FirstOrDefault(o => o.OrderId == orderId);
            if (order == null) return $"Order {orderId} not found.";

            var agent = _db.DeliveryAgents
                           .Include(a => a.AssignedOrders)
                           .FirstOrDefault(a => a.AgentId == agentId);
            if (agent == null) return $"Agent {agentId} not found.";

            order.DeliveryAgentId = agentId;

            if (!agent.AssignedOrders.Contains(order))
                agent.AssignedOrders.Add(order);

            _db.SaveChanges();
            return $"Agent {agent.AgentName} assigned to order {orderId}.";
        }

        // ✅ Remove product from order
        public void RemoveProductFromOrder(int orderId, int productId)
        {
            var orderItem = _db.OrderItems
                .FirstOrDefault(oi => oi.OrderId == orderId && oi.ProductId == productId);

            if (orderItem == null) throw new ArgumentException("Order item not found.");

            _db.OrderItems.Remove(orderItem);
            _db.SaveChanges();

            // Recalculate total price
            var order = _db.Orders
                           .Include(o => o.OrderItems)
                           .FirstOrDefault(o => o.OrderId == orderId);

            if (order != null)
            {
                order.TotalPrice = order.OrderItems.Sum(oi => oi.Price);
                _db.SaveChanges();
            }
        }
    }
}
