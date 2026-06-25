using ECommerce.API.Data;
using ECommerce.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        public class OrderCreateDto
        {
            public decimal TotalAmount { get; set; }
            public List<OrderItemDto> Items { get; set; } = new();
        }

        public class OrderItemDto
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
                return BadRequest("Order must contain at least one item.");

            var order = new Order
            {
                TotalAmount = dto.TotalAmount,
                OrderDate = DateTime.UtcNow,
                OrderItems = dto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Order created successfully", OrderId = order.Id });
        }
    }
}
