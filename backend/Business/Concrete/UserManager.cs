using Business.Abstract;
using DataAccess.Abstract;
using Entities.Concrete;

namespace Business.Concrete
{
    public class UserManager : IUserService
    {
        private readonly IUserDal _dal;

        public UserManager(IUserDal dal)
        {
            _dal = dal;
        }

        public void Add(User entity)
        {
            _dal.Add(entity);
        }

        public void Delete(User entity)
        {
            _dal.Delete(entity);
        }

        public List<User> GetAll()
        {
            return _dal.GetAll();
        }

        public User GetById(int id)
        {
            return _dal.Get(e => e.Id == id);
        }

        public void Update(User entity)
        {
            _dal.Update(entity);
        }
    }
}
