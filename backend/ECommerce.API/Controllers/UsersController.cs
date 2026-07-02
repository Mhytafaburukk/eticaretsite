using Business.Abstract;
using Entities.Concrete;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login(User loginUser)
        {
            var users = _userService.GetAll();
            var user = users.FirstOrDefault(u => u.Email == loginUser.Email && u.Password == loginUser.Password);
            
            if (user == null)
                return Unauthorized(new { message = "Geçersiz email veya şifre" });
                
            return Ok(user);
        }

        [HttpPost("register")]
        public IActionResult Register(User registerUser)
        {
            var users = _userService.GetAll();
            if (users.Any(u => u.Email == registerUser.Email))
                return BadRequest(new { message = "Bu email adresi zaten kullanılıyor" });
                
            _userService.Add(registerUser);
            return Ok(new { message = "Kayıt başarılı", user = registerUser });
        }
    }
}
