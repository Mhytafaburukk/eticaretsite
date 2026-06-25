using ECommerce.API.Data;
using ECommerce.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        public class RegisterDto
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class AddAddressDto
        {
            public string Title { get; set; } = string.Empty;
            public string FullAddress { get; set; } = string.Empty;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("Bu email adresi zaten kullanılıyor.");
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password 
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Kayıt başarılı", UserId = user.Id, Name = user.Name, Email = user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);
            if (user == null)
            {
                return Unauthorized("Email veya şifre hatalı.");
            }

            return Ok(new { Message = "Giriş başarılı", UserId = user.Id, Name = user.Name, Email = user.Email });
        }

        [HttpGet("{id}/addresses")]
        public async Task<IActionResult> GetAddresses(int id)
        {
            var addresses = await _context.UserAddresses.Where(a => a.UserId == id).ToListAsync();
            return Ok(addresses);
        }

        [HttpPost("{id}/addresses")]
        public async Task<IActionResult> AddAddress(int id, [FromBody] AddAddressDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            var newAddress = new UserAddress
            {
                UserId = id,
                Title = dto.Title,
                FullAddress = dto.FullAddress
            };

            _context.UserAddresses.Add(newAddress);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Adres eklendi", Address = newAddress });
        }

        [HttpDelete("addresses/{addressId}")]
        public async Task<IActionResult> DeleteAddress(int addressId)
        {
            var address = await _context.UserAddresses.FindAsync(addressId);
            if (address == null) return NotFound("Adres bulunamadı.");

            _context.UserAddresses.Remove(address);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Adres silindi" });
        }
    }
}
