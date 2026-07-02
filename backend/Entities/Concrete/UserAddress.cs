using Entities.Abstract;
namespace Entities.Concrete
{
    public class UserAddress : IEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        
        public User? User { get; set; }
    }
}
