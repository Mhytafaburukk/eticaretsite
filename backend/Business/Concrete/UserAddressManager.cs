using Business.Abstract;
using DataAccess.Abstract;
using Entities.Concrete;

namespace Business.Concrete
{
    public class UserAddressManager : IUserAddressService
    {
        private readonly IUserAddressDal _dal;

        public UserAddressManager(IUserAddressDal dal)
        {
            _dal = dal;
        }

        public void Add(UserAddress entity)
        {
            _dal.Add(entity);
        }

        public void Delete(UserAddress entity)
        {
            _dal.Delete(entity);
        }

        public List<UserAddress> GetAll()
        {
            return _dal.GetAll();
        }

        public UserAddress GetById(int id)
        {
            return _dal.Get(e => e.Id == id);
        }

        public void Update(UserAddress entity)
        {
            _dal.Update(entity);
        }
    }
}
