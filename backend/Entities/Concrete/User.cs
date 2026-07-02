using Entities.Abstract;
namespace Entities.Concrete
{
    public class User : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        
        public ICollection<UserAddress> Addresses { get; set; } = new List<UserAddress>();
    }
}
