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

        public class UpdateAddressDto
        {
            public string Address { get; set; } = string.Empty;
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
                // Güvenlik: Gerçek bir projede bu şifre mutlaka 'Hash'lenerek kaydedilmeli.
                Password = dto.Password 
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Kayıt başarılı", UserId = user.Id, Name = user.Name, Email = user.Email, Address = user.Address });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);
            if (user == null)
            {
                return Unauthorized("Email veya şifre hatalı.");
            }

            return Ok(new { Message = "Giriş başarılı", UserId = user.Id, Name = user.Name, Email = user.Email, Address = user.Address });
        }

        [HttpPut("{id}/address")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] UpdateAddressDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            user.Address = dto.Address;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Adres güncellendi", Address = user.Address });
        }
    }
}
