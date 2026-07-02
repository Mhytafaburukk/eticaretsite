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
        private readonly IUserAddressService _userAddressService;

        public UsersController(IUserService userService, IUserAddressService userAddressService)
        {
            _userService = userService;
            _userAddressService = userAddressService;
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

        [HttpGet("{userId}/addresses")]
        public IActionResult GetAddresses(int userId)
        {
            var addresses = _userAddressService.GetAll().Where(a => a.UserId == userId).ToList();
            return Ok(addresses);
        }

        [HttpPost("{userId}/addresses")]
        public IActionResult AddAddress(int userId, UserAddress address)
        {
            address.UserId = userId;
            _userAddressService.Add(address);
            return Ok(new { message = "Adres eklendi", address = address });
        }

        [HttpDelete("addresses/{addressId}")]
        public IActionResult DeleteAddress(int addressId)
        {
            var address = _userAddressService.GetById(addressId);
            if (address == null) return NotFound(new { message = "Adres bulunamadı" });
            
            _userAddressService.Delete(address);
            return Ok(new { message = "Adres silindi" });
        }
    }
}
