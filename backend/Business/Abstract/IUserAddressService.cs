using Entities.Concrete;

namespace Business.Abstract
{
    public interface IUserAddressService
    {
        List<UserAddress> GetAll();
        UserAddress GetById(int id);
        void Add(UserAddress entity);
        void Update(UserAddress entity);
        void Delete(UserAddress entity);
    }
}
